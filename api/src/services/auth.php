<?php
namespace AuthService;

require_once "helper.php";
require_once "repositories/user.php";
require_once "exceptions.php";

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
    $secret = file_get_contents(__DIR__."/../secrets/secret.txt");

    if (!$secret) {
        _log("failed to load secret");
        throw new \InternalServerError("");
    }

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
	
	return $header_enc . "." . $payload_enc  . "." . $signature_enc;
}

function decode_jwt_token($token): null|array{
    $secret_key = get_secret();
	
	$parts = is_string($token) ? explode(".", $token) : [];

	if (count($parts) != 3) {
		_log("invalid jwt token: expected 3 segments");
		return NULL;
	}

	[$header_enc, $payload_enc, $signature_enc] = $parts;

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

    if (!is_array($header) or !is_array($payload)) {
        _log("invalid jwt token: header or payload is not an object");
        return NULL;
    }

    if (($header["typ"] ?? NULL) != "JWT") {
        _log("invalid jwt token: type header invalid");
        return NULL;
    }
    if (($header["alg"] ?? NULL) != "HS256") {
        _log("jwt alg not supported: ". ($header["alg"] ?? "none"));
        return NULL;
    }

    if ($signature_verify != $signature) {
        _log("invalid jwt token: signature verification failed");
        return NULL;
    }

    return $payload;
}

function generate_session_token($user_id, $timeout_s = 60*60*24*7){
    $now = time();
    $exp = $now + $timeout_s;

    $user = \UserRepository\get_user_by_id($user_id);

    $payload = [
        "sub" => $user_id,
        "exp" => $exp,
        "iat" => $now,
        "role"=> $user->role,
    ];
    return generate_jwt_token($payload);
}

function validate_session($session_token) {
    $payload = decode_jwt_token($session_token);
    $now = time();

    if ($payload === NULL or !array_key_exists("exp", $payload) or !array_key_exists("sub", $payload) or !array_key_exists("role", $payload)) {
        _log(msg: "session token invalid.");
        return NULL;
    }

    if ($payload["exp"] <= $now){
        _log("session token expired.");
        return NULL;
    }

    return $payload;
}

function generate_jti(){
    return bin2hex(random_bytes(length: 20));
}

function generate_user_token(int $user_id, $jti) {
    if ($jti == NULL)
    {
        return NULL;
    }

    return generate_jwt_token(["sub"=> $user_id, "jti"=> $jti]);
}

function validate_user_token($token): int | null {
    $payload = decode_jwt_token($token);
    if ($payload === NULL or !array_key_exists("jti", $payload) or !array_key_exists("sub", $payload)) {
        _log(msg: "user token invalid.");
        return NULL;
    }

    $jti = $payload["jti"];
    $user_id = $payload["sub"];

    $user_jti = \UserRepository\get_user_token_jti($user_id);

    if ($user_jti === NULL) {
        _log("no user with id $user_id");
        return NULL;
    }

    if ($jti != $user_jti){
        return NULL;
    }

    return $user_id;
}

const BRUNCH_PURPOSE = "brunch_rsvp";
const BRUNCH_ANSWERS = ["will_join", "will_not_join"];

function jti_reference($jti){
    return hash("sha256", $jti);
}

function generate_brunch_token(int $user_id, $jti, $answer, $timeout_s = 60*60*24*90) {
    if ($jti === NULL or !in_array($answer, BRUNCH_ANSWERS)) {
        return NULL;
    }

    $now = time();

    return generate_jwt_token([
        "sub" => $user_id,
        "purpose" => BRUNCH_PURPOSE,
        "answer" => $answer,
        "jti_ref" => jti_reference($jti),
        "iat" => $now,
        "exp" => $now + $timeout_s,
    ]);
}

function reject_brunch_token($reason){
    _log("brunch token rejected: $reason");
    throw new \UnauthorizedException("unauthorized");
}

function validate_brunch_token($token): array {
    $payload = decode_jwt_token($token);

    if ($payload === NULL) {
        reject_brunch_token("does not decode");
    }

    foreach (["sub", "purpose", "answer", "jti_ref", "exp"] as $claim) {
        if (!array_key_exists($claim, $payload)) {
            reject_brunch_token("missing $claim claim");
        }
    }

    if ($payload["purpose"] !== BRUNCH_PURPOSE) {
        reject_brunch_token("wrong purpose");
    }

    if ($payload["exp"] <= time()) {
        reject_brunch_token("expired");
    }

    if (!in_array($payload["answer"], BRUNCH_ANSWERS)) {
        reject_brunch_token("unknown answer");
    }

    $user_id = $payload["sub"];
    $user_jti = \UserRepository\get_user_token_jti($user_id);

    if ($user_jti === NULL) {
        reject_brunch_token("no user with id $user_id");
    }

    if (!hash_equals(jti_reference($user_jti), $payload["jti_ref"])) {
        reject_brunch_token("jti reference no longer matches");
    }

    return ["user_id" => $user_id, "answer" => $payload["answer"]];
}