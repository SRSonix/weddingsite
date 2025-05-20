<?php
namespace AuthController;

require_once "services/auth.php";
require_once "controllers/request.php";
require_once "services/auth.php";

function login(\Request $request){	
	$user_id = $request->body["user_id"];
	$token = $request->body["token"];

	$token_valid = \AuthService\validate_user_token($user_id, $token);

	if(!$token_valid){
		_log("token is invalid");
		http_response_code(response_code: 403);
		return [];
	}

	_log("token is valid. generating session.");

	$session_token = \AuthService\generate_session_token($user_id);
	setcookie("session_token", $session_token, secure: true, httponly:true, path:"/");

	_log("successful login");
	return [];
}