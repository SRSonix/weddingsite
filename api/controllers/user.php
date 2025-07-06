<?php
namespace UserController;

require_once "services/user.php";
require_once "controllers/request.php";


function create_user(\Request $request){
    if ($request->user_role != "ADMIN") {
        http_response_code(403);
        return [];
    }

    $first_name = $request->body["first_name"] ?? NULL;
    $last_name = $request->body["last_name"] ?? NULL;
    $role = $request->body["role"] ?? NULL;

    if ($role === NULL or $first_name === NULL or $last_name === NULL){
        _log("role, first_name or last_name was missing");
        http_response_code(422);
        return ["missing"=> "role or user_name"];
    }

    _log("creating: user $first_name / $last_name / $role");

    $token = \UserService\create_user($first_name, $last_name, $role);

    if ($token === NULL) {        
        http_response_code(422);
        return [];
    }

	return ["token"=>$token];
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

function get_all_users(\Request $request){
    if ($request->user_role != "ADMIN") {
        http_response_code(403);
        return [];
    }

    return \UserService\get_all_users();
}


function update_user(\Request $request){
    $user_id = $request->path_params["user_id"];
    _log("trying to update user ".$user_id);

    if ($request->user_id != $user_id) {
        http_response_code(403);
        return [];
    }

    $mail = $request->body["mail"] ?? null;
    $diet = $request->body["diet"] ?? null;
    $attendance = $request->body["attendance"] ?? null;

    return \UserService\update_user($user_id, $mail, $diet, $attendance);
}