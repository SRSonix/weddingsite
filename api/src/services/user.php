<?php

namespace UserService;

require_once "repositories/user.php";
require_once "repositories/family_member.php";
require_once "services/auth.php";
require_once "exceptions.php";

function create_user($name, $role, $language, $invited_by = NULL) {
	$jti = \AuthService\generate_jti();

    $user_id = \UserRepository\create_user($name, $role, $language, $jti, $invited_by);

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

function fetch_user($user_id) {
    $user = \UserRepository\get_user_by_id($user_id);
    $user->family_members = \FamilyMemberRepository\get_family_members($user_id);
    return $user;
}

function get_user($user_id) {
    \UserRepository\update_last_visited($user_id);
    return fetch_user($user_id);
}

function get_all_users(){
    $users = \UserRepository\get_all_users();

    foreach ($users as $user) {
        $user->family_members = \FamilyMemberRepository\get_family_members($user->id);
    }

    return $users;
}

function update_user(
    $user_id,
    $name,
    $role,
    $invited_by,
    $mail,
    $language,
    ){

    $success = \UserRepository\update_user(
        $user_id,
        $name,
        $role,
        $invited_by,
        $mail,
        $language,
    );

    if (!$success){
        throw new \InternalServerError("unable to update user.");
    }

    return fetch_user($user_id);
}

function update_user_contact(
    $user_id,
    $mail,
    $language,
    ){

    $success = \UserRepository\update_user_contact(
        $user_id,
        $mail,
        $language,
    );

    if (!$success){
        throw new \InternalServerError("unable to update user contact.");
    }

    return fetch_user($user_id);
}

function delete_user($user_id) {
    $affectedRowCount = \UserRepository\delete_user($user_id);

    if ($affectedRowCount == 0) throw new \NotFoundException("");
}

function add_family_member($user_id, $name, $diet, $type, $attendance){
    $lastInsertId = \FamilyMemberRepository\create_family_member($user_id, $name, $diet, $type, $attendance);

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
        $type,
        $attendance,
        $brunch_attendance,
    ){
    if (\FamilyMemberRepository\get_family_member($user_id, $family_member_id) === NULL) {
        throw new \NotFoundException("");
    }

    \FamilyMemberRepository\update_family_member($user_id, $family_member_id, $name, $diet, $type, $attendance, $brunch_attendance);

    http_response_code(response_code: 200);
    return \FamilyMemberRepository\get_family_member($user_id, $family_member_id);
}

function submit_brunch_rsvp($token){
    $payload = \AuthService\validate_brunch_token($token);

    $user_id = $payload["user_id"];
    $answer = $payload["answer"];

    if ($answer === "will_join") {
        \FamilyMemberRepository\set_brunch_attendance_join($user_id);
    } else {
        \FamilyMemberRepository\set_brunch_attendance_decline($user_id);
    }

    $user = \UserRepository\get_user_by_id($user_id);

    $counts = \FamilyMemberRepository\count_brunch_responses($user_id);

    return [
        "name" => $user->name,
        "brunch_attendance" => $answer,
        "joining" => $counts["joining"],
        "undecided" => $counts["undecided"],
    ];
}

function get_login_token($user_id){
    $jti = \UserRepository\get_user_token_jti($user_id);

    if ($jti === NULL) {
        throw new \NotFoundException("user not found");
    }

    return \AuthService\generate_user_token($user_id, $jti);
}

function get_brunch_tokens($user_id){
    $jti = \UserRepository\get_user_token_jti($user_id);

    if ($jti === NULL) {
        throw new \NotFoundException("user not found");
    }

    return [
        "will_join" => \AuthService\generate_brunch_token($user_id, $jti, "will_join"),
        "will_not_join" => \AuthService\generate_brunch_token($user_id, $jti, "will_not_join"),
    ];
}

function remove_family_member($user_id, $family_member_id){
    $affectedRowCount = \FamilyMemberRepository\delete_family_member($user_id, $family_member_id);

    if ($affectedRowCount == 0) throw new \NotFoundException("");
}
