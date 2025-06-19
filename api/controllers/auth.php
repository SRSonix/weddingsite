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
		http_response_code(response_code: 403);
		return [];
	}

	_log("token is valid. generating session.");

	$session_token = \AuthService\generate_session_token($user_id);

	setcookie("session_token", $session_token, ["secure" => true, "httponly"=>true, "path"=>"/", "samesite"=> "None"]);

	_log("successful login");
	return [];
}


function logout(\Request $request){	
	setcookie("session_token", "", ["expires"=> time()-3600, "secure" => true, "httponly"=>true, "path"=>"/", "samesite"=> "None"]);

	return [];
}