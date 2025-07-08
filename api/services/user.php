<?php

namespace UserService;

require_once "repositories/user.php";
require_once "services/auth.php";

function create_user($first_name, $last_name, $role, $language) {
	[$password, $password_hash] = \AuthService\generate_user_password();

    $user_id = \UserRepository\create_user($first_name, $last_name, $role, $password_hash, $language);

    if ($user_id === NULL) {
        _log("unable to create user.");
        return NULL;
    }

    return \AuthService\generate_user_token($user_id, $password);
}

function get_user($user_id) {
    return \UserRepository\get_user_by_id($user_id);
}

function get_all_users(){
    return \UserRepository\get_all_users();
}

function update_user(
    $user_id, 
    $mail,
    $diet, 
    $attendance,
    $language, 
    $arrival_date, 
    $departure_date,
    $guests){

    return \UserRepository\update_user(
        $user_id, 
        $mail, 
        $diet, 
        $attendance,
        $language, 
        $arrival_date, 
        $departure_date,
        $guests
    );
}