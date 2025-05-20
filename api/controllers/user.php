<?php
namespace UserController;

require_once "services/user.php";
require_once "controllers/request.php";


function create_user(\Request $request){
    $user_name = $request->body["user_name"];

    _log("creating: user $user_name");

    [$id, $token] = \UserService\create_user($user_name);

	return ["id"=>$id, "token"=>$token];
}

function get_user(\Request $request){
    $user_id = $request->user_id;
    if ($user_id === NULL){
		http_response_code(response_code: 403);
        return [];
    }

    $user = \UserService\get_user($user_id);

    if ($user === NULL){
		http_response_code(response_code: 401);
        return [];
    }

    return $user;
}