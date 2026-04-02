<?php
namespace AuthController;

require_once "services/auth.php";
require_once "controllers/base/request.php";
require_once "controllers/base/response.php";
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
	
	_log("successful login");

	return new \Response(
		cookies: [
			["session_token", $session_token, ["expires"=> time()+$timeout_s, "secure" => true, "httponly"=>true, "path"=>"/", "samesite"=> "Strict"]],
		]
    );
}


function logout(\Request $request){
	return new \Response(
		cookies: [
			["session_token", "", ["expires"=> time()-3600, "secure" => true, "httponly"=>true, "path"=>"/", "samesite"=> "None"]],
		]
    );
}

function login_as(\Request $request){
    $request->validateAdminAccess();

    $user_id = (int) $request->path_params["user_id"];

    $user = \UserRepository\get_user_by_id($user_id);
    if ($user === NULL) {
        throw new \NotFoundException("user not found");
    }

    $timeout_s = 60*60*24*7;
    $session_token = \AuthService\generate_session_token($user_id, $timeout_s);

    _log("admin logged in as user $user_id");

    return new \Response(
        cookies: [
            ["session_token", $session_token, ["expires"=> time()+$timeout_s, "secure" => true, "httponly"=>true, "path"=>"/", "samesite"=> "Strict"]],
        ]
    );
}