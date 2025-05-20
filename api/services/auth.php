<?php
namespace AuthService;

require_once "helper.php";
require_once "repositories/user.php";

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

function decode_jwt_token($token): null|array{
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
        return NULL;
    }

    if ($header["typ"] != "JWT") {
        _log("invalid jwt token: type header invalid");
        return NULL;
    }
    if ($header["alg"] != "HS256") {
        _log("jwt alg not supported: ". $header["alg"]);
        return NULL;
    }

    if ($signature_verify != $signature) {
        _log("invalid jwt token: signature verification failed");
        return NULL;
    }

    return $payload;
}

function generate_session_token($user_id, $timeout_s = 3600){
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

    if ($payload === NULL or !array_key_exists("exp", $payload) or !array_key_exists("sub", $payload)) {
        _log(msg: "session token invalid.");
        return NULL;
    }

    if ($payload["exp"] <= $now){
        _log("session token expired.");
        return NULL;
    }

    return $payload;
}

function generate_user_token() {
    $token = bin2hex(random_bytes(length: 36));
    $token_hash = password_hash($token, PASSWORD_DEFAULT);

    return [$token, $token_hash];
}

function validate_user_token($user_id, $token) {
    $database_token = \UserRepository\get_user_token_by_id($user_id);

    if (!$database_token) {
        _log("no user with id $user_id");
        return false;
    }

    return password_verify($token, $database_token);
}