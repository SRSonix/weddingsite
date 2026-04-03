<?php
namespace UserController;

require_once "services/user.php";
require_once 'controllers/base/request.php';
require_once "controllers/base/response.php";


function create_user(\Request $request){
    $request->validateAdminAccess();
    $request->validateBodyContainsKeys(["name", "role", "language", "invited_by"], TRUE);
    $request->validateAcceptableValues(["role"=> ["ADMIN", "USER"], "language"=>["de", "fr"], "invited_by"=>["groom", "bride", "both"]]);

    $name = $request->body["name"];
    $role = $request->body["role"];
    $language = $request->body["language"];
    $invited_by = $request->body["invited_by"];

    _log("creating: user $name / $role / $language / $invited_by");

    $token = \UserService\create_user($name, $role, $language, $invited_by);

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
    $request->validateBodyContainsKeys(["mail", "attendance", "language"]);
    $request->validateAcceptableValues(["attendance"=> ['will_join', 'will_not_join', 'undecided'], "language"=>["de", "fr"]]);

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
    $request->validateBodyContainsKeys(["name", "role", "invited_by"], TRUE);
    $request->validateAcceptableValues(["role"=> ["ADMIN", "USER"], "invited_by"=>["groom", "bride", "both"]]);

    $user_id = $request->path_params["user_id"];

    if ($user_id == $request->user_id) {
        throw new \ForbiddenException("you are not allowed to update your own core info. ask another admin!");
    }
    $name = $request->body["name"];
    $role = $request->body["role"];
    $invited_by = $request->body["invited_by"];

    return new \Response(
        body: \UserService\update_user_core_info(
            $user_id,
            $name,
            $role,
            $invited_by,
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

    \UserService\delete_user($user_id);

    return new \Response(status:204);
}


const VALID_MEMBER_TYPES = ["adult", "child", "infant"];

function add_family_member(\Request $request){
    $request->validatePathUserIsAuthorized();
    $request->validateBodyContainsKeys(["name", "diet", "type"]);
    $request->validateBodyContainsKeys(["name", "type"], TRUE);
    $request->validateAcceptableValues(["type"=>VALID_MEMBER_TYPES]);

    $user_id = $request->path_params["user_id"];

    $name = $request->body["name"];
    $diet = $request->body["diet"];
    $type = $request->body["type"];

    return new \Response(
        status: 201,
        body:\UserService\add_family_member(
            $user_id,
            $name,
            $diet,
            $type,
        )
    );
}


function update_family_member(\Request $request){
    $request->validatePathUserIsAuthorized();
    $request->validateBodyContainsKeys(["name", "diet", "type"]);
    $request->validateBodyContainsKeys(["name", "type"], TRUE);
    $request->validateAcceptableValues(["type"=>VALID_MEMBER_TYPES]);

    $user_id = $request->path_params["user_id"];
    $family_member_id = $request->path_params["family_member_id"];

    $name = $request->body["name"];
    $diet = $request->body["diet"];
    $type = $request->body["type"];

    return new \Response(
        body:\UserService\update_family_member(
            $user_id,
            $family_member_id,
            $name,
            $diet,
            $type,
        )
    );
}

function delete_family_member(\Request $request){
    $request->validatePathUserIsAuthorized();

    $user_id = $request->path_params["user_id"];
    $family_member_id = $request->path_params["family_member_id"];

    \UserService\remove_family_member(
        $user_id, 
        $family_member_id,
    );

    return new \Response(
        status: 204
    );
}
