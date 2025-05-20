<?php
namespace AuthController;

require_once "services/auth_service.php";

function generate_session_token($user, ...$args){
	return ["token" => \AuthService\generate_session_token(["user"=>$user])];
}

function validate($token, ...$args){
	return ["payload" => \AuthService\validate_session($token)];
}
