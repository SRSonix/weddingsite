<?php
namespace AuthService;

require_once "helper.php";

function base64url_encode($data)
{
  $b64 = base64_encode($data);
  $url = strtr($b64, '+/', '-_');

  return rtrim($url, '=');
}

function base64url_decode($data, $strict = false)
{
  $b64 = strtr($data, '-_', '+/');
  return base64_decode($b64, $strict);
}

function get_secret(): string{
    $secret = file_get_contents("secret.txt");

    if (!$secret) throw new \ErrorException("failed to load secret");

    return $secret;
}

function generate_jwt_token($payload){
	$secret_key = get_secret();
	
	$header = json_encode([
            "alg" => "HS256",
            "typ" => "JWT"
        ]);
    $payload = json_encode($payload);

	$header_enc = base64url_encode($header);
	$payload_enc = base64url_encode($payload);

	$signature = hash_hmac("sha256", $header_enc . "." . $payload_enc, $secret_key, true);
	$signature_enc = base64url_encode($signature);
	
	http_response_code(200);
	return $header_enc . "." . $payload_enc  . "." . $signature_enc;
}

function decode_jwt_token($token): bool|array{
    $secret_key = get_secret();
	
	[$header_enc, $payload_enc, $signature_enc] = explode(".", $token);

    $signature_verify = hash_hmac("sha256", $header_enc . "." . $payload_enc, $secret_key, true);
	
    try {
        $header = json_decode(base64url_decode($header_enc), true);
        $payload = json_decode(base64url_decode($payload_enc), true);
        $signature = base64url_decode($signature_enc);
    }
    catch (\Exception $e) {
        _log("invalid jwt token: ". $e->getMessage());
        return false;
    }

    if ($header["typ"] != "JWT") {
        _log("invalid jwt token: type header invalid");
        return false;
    }
    if ($header["alg"] != "HS256") {
        _log("jwt alg not supported: ". $header["alg"]);
        return false;
    }

    if ($signature_verify != $signature) {
        _log("invalid jwt token: signature verification failed");
        return false;
    }

    return $payload;
}

function generate_session_token($user_id, $timeout_s = 15){
    $now = time();
    $exp = $now + $timeout_s;

    $payload = [
        "sub" => $user_id,
        "exp" => $exp,
        "iat" => $now,
    ];
    return generate_jwt_token($payload);
}

function validate_session($session_token) {
    $payload = decode_jwt_token($session_token);
    $now = time();

    if (!$payload or !array_key_exists("exp", $payload) or !array_key_exists("sub", $payload)) {
        _log("session token invalid.");
        return false;
    }

    if ($payload["exp"] <= $now){
        _log("session token expired.");
        return false;
    }

    return true;
}