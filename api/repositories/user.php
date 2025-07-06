<?php

namespace UserRepository;

require_once "config.php";
require_once "services/models.php";

function create_db_session() {
    $servername = DB_SERVER;
    $username = DB_USER;
    $password = DB_PASSWORD;
    $dbname = DB_NAME;

    try {
        $session = new \PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        $session->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
    }
    catch (\PDOException  $e) {
        _log($e->getMessage());
        return NULL;
    }

    return $session;
}

function get_user_by_id($user_id) {
    $session = create_db_session();
    if ($session === null) {
        _log("failed to create session");
        return NULL;
    }
    
    $stmt = $session->prepare("SELECT * FROM user WHERE id = :id ");
    $stmt->execute(["id" => $user_id]);

    $result = $stmt->fetchAll();
    
    if (count($result) == 0){
        _log("no result found");
        return NULL;
    }
    if (count($result) > 1){
        _log("multiple results found!");
        throw new \ErrorException("multiple users with same id! id: $user_id");
    }

    $session = null;
    
    return \User::from_row($result[0]);
}

function get_all_users(){
    $session = create_db_session();
    if ($session === null) {
        _log("failed to create session");
        return NULL;
    }

    $stmt = $session->prepare("SELECT * FROM user;");
    $stmt->execute([]);
    
    $result = $stmt->fetchAll();

    $session = null;

    $users = [];
    foreach ($result as $row){
        $users[] = \User::from_row($row);
    }

    return $users;
}

function get_password_hash_by_id($user_id) {
    $session = create_db_session();
    if ($session === null) {
        _log("failed to create session");
        return NULL;
    }
    $stmt = $session->prepare("SELECT password_hash FROM user_auth WHERE id = :id;");
    $stmt->execute(["id" => $user_id]);

    $result = $stmt->fetchAll();
    
    if (count($result) == 0){
        _log("no result found");
        return NULL;
    }
    if (count($result) > 1){
        _log("multiple results found!");
        throw new \ErrorException("multiple users with same id! id: $user_id");
    }

    $session = null;
    
    return $result[0]["password_hash"];
}

function create_user($first_name, $last_name, $role, $password_hash) {
    $session = create_db_session();    
    if ($session === null) {
        _log("failed to create session");
        return NULL;
    }

    // TODO use CTE instead
    $stmt = $session->prepare("SELECT max(id) AS max_id FROM user;");
    $stmt->execute([]);
    $result = $stmt->fetch();

    _log($result[0]);

    $id = $result[0] + 1;
    try {
        $stmt = $session->prepare("INSERT INTO user_auth(id, password_hash) VALUES (:id, :password_hash); INSERT INTO user (id, role, first_name, last_name) VALUES(:id, :role, :first_name, :last_name);");
        $stmt->execute(["id"=>$id, "password_hash"=>$password_hash, "role"=> $role, "first_name"=>$first_name, "last_name"=>$last_name]);
    }
    catch(\PDOException $e) 
    {
        _log($e);
        $session = null;
        return NULL;
    }

    $session = null;
    return $id;
}

function update_user($user_id, $mail, $diet, $attendance){
    $session = create_db_session();    if ($session === null) {
    _log("failed to create session");
        return NULL;
    }

    try {
        $stmt = $session->prepare("UPDATE user SET mail = :mail, diet = :diet, attendance = :attendance WHERE id = :user_id;");
        $stmt->execute(["user_id"=>$user_id, "mail"=>$mail, "diet"=> $diet, "attendance"=>$attendance]);
    }
    catch(\PDOException $e) 
    {
        _log($e);
        $session = null;
        return NULL;
    }
    
    $session = null;

    return get_user_by_id($user_id);
}
