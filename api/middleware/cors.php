<?php

require_once "controllers/request.php";

function add_cors(Request $request): Request {
    if (in_array($request->origin, ALLOWED_ORIGINS)){
        header('Access-Control-Allow-Credentials: true');
        header("Access-Control-Allow-Origin: $request->origin");
        _log("known origin... setting CORS");
    }

    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
        header('Access-Control-Max-Age: 86400');
        header('Content-Length: 0');
        header('Content-Type: text/plain');
        exit;
    }

    return $request;
}