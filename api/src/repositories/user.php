<?php

namespace UserRepository;

require_once "services/models.php";
require_once "repositories/helper.php";

function user_from_row($row){
    return new \User(
        id: $row["id"],
        role: $row["role"],
        name: $row["name"], 
        mail: $row["mail"], 
        attendance: $row["attendance"] , 
        language: $row["language"] , 
        last_visit: $row["last_visit"],
        family_members: NULL,
    );
}

function get_user_by_id($user_id) {
    $session = create_db_session();
    
    $stmt = $session->prepare("SELECT * FROM user WHERE id = :id;");
    $stmt->execute(["id" => $user_id]);
    $result = $stmt->fetchAll();
    
    if (count($result) == 0){
        _log("no result found");
        return NULL;
    }

    $session = null;
    
    return user_from_row($result[0]);
}

function get_all_users(){
    $session = create_db_session();

    $stmt = $session->prepare("SELECT * FROM user;");
    $stmt->execute([]);
    
    $result = $stmt->fetchAll();

    $session = null;

    $users = [];
    foreach ($result as $row){
        $users[] = user_from_row($row);
    }

    return $users;
}

function get_user_token_jti($user_id) {
    $session = create_db_session();
    
    $stmt = $session->prepare("SELECT jti FROM user_auth WHERE id = :id;");
    $stmt->execute(["id" => $user_id]);

    $result = $stmt->fetchAll();
    
    if (count($result) == 0){
        _log("no result found");
        return NULL;
    }
    if (count($result) > 1){
        _log("multiple results found!");
        throw new \InternalServerError("multiple users with same id! id: $user_id");
    }

    $session = null;
    
    return $result[0]["jti"];
}

function create_user($name, $role, $language, $jti) {
    $session = create_db_session();    

    try {
        $stmt = $session->prepare("INSERT INTO user_auth(jti) VALUES (:jti);");       
        $stmt->execute(["jti"=>$jti]);
        $lastInsertId = $session->lastInsertId();
        $stmt = $session->prepare("INSERT INTO user (id, role, name, language) VALUES(:id, :role, :name, :language);");
        $stmt->execute(["id"=>$lastInsertId, "role"=> $role, "name"=>$name, "language"=>$language]);
    }
    catch(\PDOException $e) 
    {
        _log($e);
        $session = null;
        return NULL;
    }

    $session = null;
    return $lastInsertId;
}

function update_user_core_info(
    $user_id, 
    $name, 
    $role,
    ){
    $session = create_db_session();    

    try {
        $stmt = $session->prepare("UPDATE user SET name = :name, role = :role WHERE id = :user_id;");
        $stmt->execute(["user_id"=>$user_id, "name"=>$name, "role"=> $role]);
    }
    catch(\PDOException $e) 
    {
        _log($e);
        $session = null;
        return False;
    }
    
    $session = null;

    return True;
}

function update_user_rsvp(
    $user_id, 
    $mail, 
    $attendance,
    $language,
    ){
    $session = create_db_session();    

    try {
        $stmt = $session->prepare("UPDATE user SET mail = :mail, attendance = :attendance, language = :language WHERE id = :user_id;");
        $stmt->execute(["user_id"=>$user_id, "mail"=>$mail, "attendance"=>$attendance, "language"=>$language]);
    }
    catch(\PDOException $e) 
    {
        _log($e);
        $session = null;
        return False;
    }
    
    $session = null;

    return True;
}

function update_last_visited(int $user_id): void {
    $session = create_db_session();   

    $stmt = $session->prepare(
        "UPDATE user SET last_visit = FROM_UNIXTIME(:last_visited) WHERE id = :user_id;"
    );
    $stmt->execute(["last_visited" => time(), "user_id" => $user_id]);

    $session = null;
}

function update_user_token_jti(int $user_id, $jti) {
    $session = create_db_session();   

    if ($session === null) {
        _log("failed to create session");
        return;
    }
    try {
        $stmt = $session->prepare(
            "UPDATE user_auth SET jti = :jti WHERE id = :user_id;"
        );
        $stmt->execute(["jti" => $jti, "user_id" => $user_id]);

        $session = null;
    }
    catch(\PDOException $e) 
    {
        _log($e);
        $session = null;
        http_response_code(response_code: 404);
        return NULL;
    }

    return true;
}

function delete_user($user_id) {
    $session = create_db_session();

    try {
        $stmt = $session->prepare("DELETE FROM user WHERE id = :user_id; DELETE FROM user_auth WHERE id = :user_id;");
        $stmt->execute(["user_id"=>$user_id]);
        $affectedRows = $stmt->rowCount();
    }
    catch(\PDOException $e)
    {
        _log($e);
        $session = null;
        throw \InternalServerError("error deleting user");
    }

    $session = null;

    return $affectedRows;
}
