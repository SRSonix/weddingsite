<?php

namespace UserService;

require_once "repositories/user.php";
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
    return \UserRepository\get_user_by_id($user_id);
}

function get_all_users(){
    return \UserRepository\get_all_users();
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


function update_user_name(
    $user_id, 
    $first_name,
    $last_name
    ){

    return \UserRepository\update_user_name(
        $user_id, 
        $first_name, 
        $last_name, 
    );
}