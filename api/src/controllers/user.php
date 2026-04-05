<?php
namespace UserController;

require_once "services/user.php";
require_once 'controllers/base/request.php';
require_once "controllers/base/response.php";


function create_user(\Request $request){
    $request->validateAdminAccess();
    $request->validateBodyContainsKeys(["name", "role", "language", "invited_by"]);
    $request->validateBodyContainsKeys(["name"], TRUE);
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


function update_user_contact(\Request $request){
    $request->validatePathUserIsAuthorized();
    $request->validateBodyContainsKeys(["mail", "language"]);
    $request->validateAcceptableValues(["language"=>["de", "fr"]]);

    $user_id = $request->path_params["user_id"];

    $mail = $request->body["mail"];
    $language = $request->body["language"];

    return new \Response(
        body: \UserService\update_user_contact(
            $user_id,
            $mail,
            $language,
        )
    );
}


function update_user(\Request $request){
    $request->validateAdminAccess();
    $request->validateBodyContainsKeys(["name", "role", "invited_by", "mail", "language"]);
    $request->validateBodyContainsKeys(["name"], TRUE);
    $request->validateAcceptableValues(["role"=> ["ADMIN", "USER"], "invited_by"=>["groom", "bride", "both"], "language"=>["de", "fr"]]);

    $user_id = $request->path_params["user_id"];

    $request->validateAdminIsNotPathUser();

    $name = $request->body["name"];
    $role = $request->body["role"];
    $invited_by = $request->body["invited_by"];
    $mail = $request->body["mail"];
    $language = $request->body["language"];

    return new \Response(
        body: \UserService\update_user(
            $user_id,
            $name,
            $role,
            $invited_by,
            $mail,
            $language,
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

    $request->validateAdminIsNotPathUser();

    \UserService\delete_user($user_id);

    return new \Response(status:204);
}


const VALID_MEMBER_TYPES = ["adult", "child", "infant"];
const VALID_ATTENDANCE = ['will_join', 'will_not_join', 'undecided'];

function add_family_member(\Request $request){
    $request->validateAdminAccess();
    $request->validateBodyContainsKeys(["name", "diet", "type"]);
    $request->validateBodyContainsKeys(["name"], TRUE);
    $request->validateAcceptableValues(["type"=>VALID_MEMBER_TYPES]);

    $user_id = $request->path_params["user_id"];

    $request->validateAdminIsNotPathUser();

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
            NULL,
        )
    );
}


function update_family_member(\Request $request){
    $request->validatePathUserIsAuthorized();
    $request->validateBodyContainsKeys(["name", "diet", "type", "attendance"]);
    $request->validateBodyContainsKeys(["name"], TRUE);
    $request->validateAcceptableValues(["type"=>VALID_MEMBER_TYPES, "attendance"=>VALID_ATTENDANCE]);

    $user_id = $request->path_params["user_id"];
    $family_member_id = $request->path_params["family_member_id"];

    $name = $request->body["name"];
    $diet = $request->body["diet"];
    $type = $request->body["type"];
    $attendance = $request->body["attendance"];

    return new \Response(
        body:\UserService\update_family_member(
            $user_id,
            $family_member_id,
            $name,
            $diet,
            $type,
            $attendance,
        )
    );
}

function delete_family_member(\Request $request){
    $request->validateAdminAccess();

    $user_id = $request->path_params["user_id"];

    $request->validateAdminIsNotPathUser();
    $family_member_id = $request->path_params["family_member_id"];

    \UserService\remove_family_member(
        $user_id,
        $family_member_id,
    );

    return new \Response(
        status: 204
    );
}
