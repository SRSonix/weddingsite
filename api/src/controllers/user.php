<?php
namespace UserController;

require_once "services/user.php";
require_once 'controllers/base/request.php';
require_once "controllers/base/response.php";


function create_user(\Request $request){
    $request->validateAdminAccess();
    $request->validateBodyContainsKeys(["name", "role", "language"], TRUE);

    $name = $request->body["name"];
    $role = $request->body["role"];
    $language = $request->body["language"];

    _log("creating: user $name / $role / $language");

    $token = \UserService\create_user($name, $role, $language);

    if ($token === NULL) {        
        throw new \InternalServerError("error creating user");
    }

    return new \Response(
        body: ["token"=>$token], 
        status: 201
    );
}

function get_user(\Request $request){
    $user_id = $request->getUserIdOrRaise();

    $user = \UserService\get_user($user_id);

    if ($user === NULL){
        throw new \NotFoundException("user not found");
    }

    return new \Response(
        body: $user
    );
}

function get_all_users(\Request $request){
    $request->validateAdminAccess();
    
    return new \Response(
        body: ["data"=> \UserService\get_all_users()]
    );
}


function update_user_rsvp(\Request $request){
    $request->validatePathUserIsAuthorized();
    $request->validateBodyContainsKeys(["mail", "attendance", "language"], TRUE);

    $user_id = $request->path_params["user_id"];

    $mail = $request->body["mail"];
    $attendance = $request->body["attendance"];
    $language = $request->body["language"];
   
    return new \Response(
        body: \UserService\update_user_rsvp(
            $user_id, 
            $mail, 
            $attendance, 
            $language,
        )
    );
}


function update_user_core_info(\Request $request){
    $request->validateAdminAccess();
    $request->validateBodyContainsKeys(["name", "role"], TRUE);

    $user_id = $request->path_params["user_id"];
    $name = $request->body["name"];
    $role = $request->body["role"];

    return new \Response(
        body: \UserService\update_user_core_info(
            $user_id, 
            $name, 
            $role,
        )
    );
}

function update_user_token(\Request $request){
    $user_id = $request->path_params["user_id"];
    $request->validatePathUserIsAuthorized();

    return new \Response(
        body: ["token" => \UserService\update_user_token($user_id)]
    );
}

function delete_user(\Request $request){
    $request->validateAdminAccess();

    $user_id = $request->path_params["user_id"];

    if ($user_id == $request->user_id) {
        throw new \ForbiddenException("you are not allowed to delete yourself. ask another admin!");
    }

    return new \Response(body:["success" => \UserService\delete_user($user_id)]);
}


function add_family_member(\Request $request){  
    $request->validatePathUserIsAuthorized();
    $request->validateBodyContainsKeys(["name", "diet", "is_child"]);
    $request->validateBodyContainsKeys(["name", "is_child"], TRUE);

    $user_id = $request->path_params["user_id"];
    
    $name = $request->body["name"];
    $diet = $request->body["diet"];
    $is_child = $request->body["is_child"];
   
    return \UserService\add_family_member(
        $user_id, 
        $name, 
        $diet, 
        $is_child,
    );
}


function update_family_member(\Request $request){
    $request->validatePathUserIsAuthorized();
    $request->validateBodyContainsKeys(["name", "diet", "is_child"]);
    $request->validateBodyContainsKeys(["name", "is_child"], TRUE);

    _log($request->body["name"]);
    _log($request->body["name"]==NULl);

    $user_id = $request->path_params["user_id"];
    $family_member_id = $request->path_params["family_member_id"];
    
    $name = $request->body["name"];
    $diet = $request->body["diet"];
    $is_child = $request->body["is_child"];
   
    return \UserService\update_family_member(
        $user_id, 
        $family_member_id,
        $name, 
        $diet, 
        $is_child,
    );
}

function delete_family_member(\Request $request){
    $request->validatePathUserIsAuthorized();

    $user_id = $request->path_params["user_id"];
    $family_member_id = $request->path_params["family_member_id"];

    return \UserService\remove_family_member(
        $user_id, 
        $family_member_id,
    );
}
