<?php

namespace UserService;

require_once "repositories/user.php";
require_once "repositories/gift.php";
require_once "services/auth.php";

function create_user($first_name, $last_name, $role, $language) {
	$jti = \AuthService\generate_jti();

    $user_id = \UserRepository\create_user($first_name, $last_name, $role, $jti, $language);

    if ($user_id === NULL) {
        _log("unable to create user.");
        return NULL;
    }

    return \AuthService\generate_user_token($user_id, $jti);
}

function update_user_token($user_id) {
    $jti = \AuthService\generate_jti();

    $result = \UserRepository\update_user_token_jti($user_id, $jti);

    if ($result === NULL) {
        _log("unable to update user jit.");
        return NULL;
    }
    
    return \AuthService\generate_user_token($user_id, $jti);
}

function get_user_token($user_id) {
    $jti = \UserRepository\get_user_token_jti($user_id);

    if ($jti === NULL) {
        _log("unable to get user jit.");
        return NULL;
    }
    
    return \AuthService\generate_user_token($user_id, $jti);
}

function get_user($user_id) {
    \UserRepository\update_last_visited($user_id);

    $user = \UserRepository\get_user_by_id($user_id);
    $user->gift_claims = \GiftRepository\get_gift_claims($user_id);

    return $user;
}

function get_all_users(){
    $users = \UserRepository\get_all_users();

    foreach ($users as $user) {
        $user->gift_claims = \GiftRepository\get_gift_claims($user->id);
    }

    return $users;
}

function update_user_rsvp(
    $user_id, 
    $mail,
    $diet, 
    $drinks,
    $attendance,
    $language, 
    $arrival_date, 
    $departure_date,
    $seating_preference,
    ){

    return \UserRepository\update_user_rsvp(
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


function update_user_core_info(
    $user_id, 
    $first_name,
    $last_name,
    $role,
    ){

    return \UserRepository\update_user_core_info(
        $user_id, 
        $first_name, 
        $last_name, 
        $role,
    );
}

function delete_user($user_id) {
    return \UserRepository\delete_user($user_id);
}

function remove_gift_claim($user_id, $gift_id){
    $success = \GiftRepository\remove_gift_claim($user_id, $gift_id);

    if ($success){
        http_response_code(204);
        return ["message" => "success"];
    }

    http_response_code(500);
    return ["message" => "error deleting gift_claim"];
}

function add_gift_claim(\GiftClaim $gift_claim){
    $gift_claim->amount += \GiftRepository\get_gift_claim_amount($gift_claim->user_id, $gift_claim->gift_id);
    $success = \GiftRepository\upsert_gift_claim($gift_claim);

    if ($success){
        http_response_code(response_code: 204);
        return ["message" => "success"];
    }

    http_response_code(409);
    return ["message" => "could not set the requested amount for gift."];
}