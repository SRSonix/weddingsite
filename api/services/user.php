<?php

namespace UserService;

require_once "repositories/user.php";
require_once "services/auth.php";

function create_user($user_name, $role) {
	[$password, $password_hash] = \AuthService\generate_user_password();

    $user_id = \UserRepository\create_user($user_name, $role, $password_hash);

    if ($user_id === NULL) {
        _log("unable to create user.");
        return NULL;
    }

    return \AuthService\generate_user_token($user_id, $password);
}

function get_user($user_id) {
    return \UserRepository\get_user_by_id($user_id);
}
