<?php

namespace UserService;

require_once "repositories/user.php";
require_once "repositories/family_member.php";
require_once "services/auth.php";
require_once "exceptions.php";

function create_user($name, $role, $language) {
	$jti = \AuthService\generate_jti();

    $user_id = \UserRepository\create_user($name, $role, $language, $jti);

    if ($user_id === NULL) {
        throw new \InternalServerError("unable to create user.");
    }

    return \AuthService\generate_user_token($user_id, $jti);
}

function update_user_token($user_id) {
    $jti = \AuthService\generate_jti();

    $result = \UserRepository\update_user_token_jti($user_id, $jti);

    if ($result === NULL) {
        throw new \InternalServerError("unable to update user token.");
    }
    
    return \AuthService\generate_user_token($user_id, $jti);
}

function get_user($user_id) {
    \UserRepository\update_last_visited($user_id);

    $user = \UserRepository\get_user_by_id($user_id);
    $user->family_members = \FamilyMemberRepository\get_family_members($user_id);

    return $user;
}

function get_all_users(){
    $users = \UserRepository\get_all_users();

    foreach ($users as $user) {
        $user->family_members = \FamilyMemberRepository\get_family_members($user->id);
    }

    return $users;
}

function update_user_rsvp(
    $user_id, 
    $mail,
    $attendance,
    $language, 
    ){

    $success = \UserRepository\update_user_rsvp(
        $user_id, 
        $mail, 
        $attendance,
        $language,
    );

    if (!$success){
        throw new \InternalServerError("unable to update user RSVP.");
    }

    return get_user($user_id);
}


function update_user_core_info(
    $user_id, 
    $name,
    $role,
    ){

    $success = \UserRepository\update_user_core_info(
        $user_id, 
        $name, 
        $role,
    );

    if (!$success){
        throw new \InternalServerError("unable to update user core.");
    }

    return get_user($user_id);
}

function delete_user($user_id) {
    $affectedRowCount = \UserRepository\delete_user($user_id);

    if ($affectedRowCount == 0) throw new \NotFoundException("");
}

function add_family_member($user_id, $name, $diet, $is_child){
    $lastInsertId = \FamilyMemberRepository\create_family_member($user_id, $name, $diet, $is_child);

    if (!$lastInsertId){
        throw new \InternalServerError("unable to add family member.");
    }

    http_response_code(response_code: 201);
    return \FamilyMemberRepository\get_family_member($user_id, $lastInsertId);
}

function update_family_member(        
        $user_id, 
        $family_member_id,
        $name, 
        $diet, 
        $is_child,
    ){
    $affectedRowCount = \FamilyMemberRepository\update_family_member($user_id, $family_member_id, $name, $diet, $is_child);
    # TODO: fix that a no-update gives 404
    if ($affectedRowCount == 0) throw new \NotFoundException("");
    
    http_response_code(response_code: 200);
    return \FamilyMemberRepository\get_family_member($user_id, $family_member_id);
   
}

function remove_family_member($user_id, $family_member_id){
    $affectedRowCount = \FamilyMemberRepository\delete_family_member($user_id, $family_member_id);

    if ($affectedRowCount == 0) throw new \NotFoundException("");
}
