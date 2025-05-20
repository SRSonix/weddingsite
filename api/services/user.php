<?php

namespace UserService;

require_once "repositories/user.php";
require_once "services/auth.php";

function create_user($user_name) {

	[$token, $token_hash] = \AuthService\generate_user_token();

    $id = \UserRepository\create_user($user_name, $token_hash);

    return [$id, $token];
}

function get_user($user_id) {
    return \UserRepository\get_user_by_id($user_id);
}
