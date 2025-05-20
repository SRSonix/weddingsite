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

function get_user_by_id($id) {
    $session = create_db_session();
    if ($session === null) {
        _log("failed to create session");
        return NULL;
    }
    
    $stmt = $session->prepare("SELECT * FROM user WHERE id = :id ");
    $stmt->execute(["id" => $id]);

    $result = $stmt->fetchAll();
    
    if (count($result) == 0){
        _log("no result found");
        return NULL;
    }
    if (count($result) > 1){
        _log("multiple results found!");
        throw new \ErrorException("multiple users with same id! id: $id");
    }

    $session = null;
    
    return new \User($result[0]["id"], $result[0]["name"], $result[0]["token"] );
}

function get_user_token_by_id($id) {
    $session = create_db_session();
    if ($session === null) {
        _log("failed to create session");
        return NULL;
    }
    
    $stmt = $session->prepare("SELECT token FROM user WHERE id = :id ");
    $stmt->execute(["id" => $id]);

    $result = $stmt->fetchAll();
    
    if (count($result) == 0){
        _log("no result found");
        return NULL;
    }
    if (count($result) > 1){
        _log("multiple results found!");
        throw new \ErrorException("multiple users with same id! id: $id");
    }

    $session = null;
    
    return $result[0]["token"];
}

function create_user($name, $token) {
    $session = create_db_session();

    $stmt = $session->prepare("SELECT max(id) AS max_id FROM user");
    $stmt->execute([]);
    $result = $stmt->fetch();

    _log($result[0]);

    $id = $result[0] + 1;

    $stmt = $session->prepare("INSERT INTO user VALUES ( :id, :name, :token);");
    $stmt->execute(["id"=>$id, "name"=>$name,"token"=>$token]);

    $session = null;

    return $id;
}