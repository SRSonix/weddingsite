<?php

namespace DataBaseService;

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
    if (is_null($session)) {
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
    
    return new \User($result[0]["id"], $result[0]["name"], $result[0]["token"], $result[0]["salt"] );
}