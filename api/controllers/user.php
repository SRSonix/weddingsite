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
    $language = $request->body["language"] ?? NULL;

    if ($role === NULL or $first_name === NULL or $last_name === NULL){
        _log("role, first_name or last_name or language was missing");
        http_response_code(422);
        return ["missing"=> "role, first_name, last_name or language"];
    }

    _log("creating: user $first_name / $last_name / $role / $language");

    $token = \UserService\create_user($first_name, $last_name, $role, $language);

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


function update_user_rsvp(\Request $request){
    $user_id = $request->path_params["user_id"];
    _log("trying to update user ".$user_id);

    if ($request->user_id != $user_id) {
        http_response_code(403);
        return [];
    }

    $mail = $request->body["mail"] ?? null;
    $diet = $request->body["diet"] ?? null;
    $drinks = $request->body["drinks"] ?? null;
    $attendance = $request->body["attendance"] ?? null;
    $language = $request->body["language"] ?? null;
    $arrival_date = $request->body["arrival_date"] ?? null;
    $departure_date = $request->body["departure_date"] ?? null;
    $seating_preference = $request->body["seating_preference"] ?? null;

    return \UserService\update_user_rsvp(
        $user_id, 
        $mail, 
        $diet, 
        $drinks,
        $attendance, 
        $language, 
        $arrival_date, 
        $departure_date,
        $seating_preference,
    );
}


function update_user_core_info(\Request $request){
    $user_id = $request->path_params["user_id"];

    if (!($request->user_role == "ADMIN")) {
        http_response_code(403);
        return [];
    }

    $first_name = $request->body["first_name"] ?? null;
    $last_name = $request->body["last_name"] ?? null;
    $role = $request->body["role"] ?? null;

    if ($first_name === NULL or $last_name === NULL or $role === NULL){
        _log(" first_name or last_name or language was missing");
        http_response_code(422);
        return ["missing"=> "role, first_name, last_name or language"];
    }

    return \UserService\update_user_core_info(
        $user_id, 
        $first_name, 
        $last_name, 
        $role,
    );
}

function update_user_token(\Request $request){
    $user_id = $request->path_params["user_id"] ?? NULL;

    if (!($request->user_role == "ADMIN" or $user_id == $request->user_id)) {
        http_response_code(403);
        return [];
    }

    if ($user_id === NULL)
    {
        http_response_code(422);
        return [];
    }

    return ["token" => \UserService\update_user_token($user_id)];
}

function get_user_token(\Request $request){
    $user_id = $request->path_params["user_id"] ?? NULL;

    if (!($request->user_role == "ADMIN" or $user_id == $request->user_id)) {
        http_response_code(403);
        return [];
    }

    if ($user_id === NULL)
    {
        http_response_code(404);
        return [];
    }

    return ["token" => \UserService\get_user_token($user_id)];
}

function delete_user(\Request $request){
    $user_id = $request->path_params["user_id"] ?? NULL;

    if (!($request->user_role == "ADMIN")) {
        http_response_code(403);
        return [];
    }

    if ($user_id == $request->user_id) {
        http_response_code(403);
        return ["error" => "you are not allowed to delete yourself. ask another admin!"];
    }

    if ($user_id === NULL)
    {
        http_response_code(404);
        return [];
    }

    return ["success" => \UserService\delete_user($user_id)];
}

function get_gifts(\Request $request){
    $user_id = $request->path_params["user_id"];

    if ($request->user_id != $user_id) {
        http_response_code(403);
        return [];
    }

    return [
        [
            "id" => 1,
            "amount" => 2,
        ],
        [
            "id" => 2,
            "amount" => 200,
        ]
    ];
}

function add_gift(\Request $request){
    $user_id = $request->path_params["user_id"];
    $gift_id = $request->path_params["gift_id"] ?? null;

    if ($request->user_id != $user_id) {
        http_response_code(403);
        return [];
    }

    $amount = $request->body["amount"] ?? null;

    return  [
        [
            "id" => $gift_id,
            "amount" => $amount,
        ]
    ];
}

function delete_gift(\Request $request){
    $user_id = $request->path_params["user_id"];
    $gift_id = $request->path_params["id"] ?? null;

    if ($request->user_id != $user_id) {
        http_response_code(403);
        return [];
    }

    return  [
        []
    ];
}
