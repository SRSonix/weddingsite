<?php
namespace AuthController;

require_once "services/auth_service.php";

function generate_session_token($user){
	return ["token" => \AuthService\generate_session_token(["user"=>$user])];
}

function validate($token){
	return ["payload" => \AuthService\validate_session($token)];
}
