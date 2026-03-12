<?php

require_once "controllers/base/request.php";
require_once "services/auth.php";

function resolve_user(Request $request): Request {
    $session_token = $request->cookies["session_token"] ?? NULL;

    if ($session_token === NULL) {
        _log("no session token provided;");
        return $request;
    }

    $payload = AuthService\validate_session($session_token);

    if ($payload === NULL) {
        _log("session not valid!");
        return $request;
    }

    $request->user_id = $payload["sub"];
    $request->user_role = $payload["role"];

    _log("set user to $request->user_id");

    return $request;
}