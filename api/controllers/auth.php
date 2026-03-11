<?php
namespace AuthController;

require_once "services/auth.php";
require_once "controllers/request.php";
require_once "services/auth.php";

function login(\Request $request){	
	$token = $request->body["token"];

	$user_id = \AuthService\validate_user_token($token);

	if($user_id === NULL){
		_log("token is invalid");

		throw new \UnauthorizedException("unauthorized");
	}

	_log("token is valid. generating session.");

	$timeout_s =  60*60*24*7;

	$session_token = \AuthService\generate_session_token($user_id, $timeout_s);
	
	http_response_code(200);
	setcookie("session_token", $session_token, ["expires"=> time()+$timeout_s, "secure" => true, "httponly"=>true, "path"=>"/", "samesite"=> "Strict"]);

	_log("successful login");
	return [];
}


function logout(\Request $request){	
	setcookie("session_token", "", ["expires"=> time()-3600, "secure" => true, "httponly"=>true, "path"=>"/", "samesite"=> "None"]);

	return [];
}