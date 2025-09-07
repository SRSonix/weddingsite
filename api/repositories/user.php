<?php

namespace UserRepository;

require_once "secrets/config.php";
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

function user_from_row($row){
    $drinks = [];
    if ($row["drinks"]!= null && ($row["drinks"]!="")) $drinks = explode(",", $row["drinks"]);

    return new \User(
        id: $row["id"],
        role: $row["role"], 
        first_name: $row["first_name"], 
        last_name: $row["last_name"], 
        diet: $row["diet"], 
        drinks: $drinks,
        mail: $row["mail"], 
        attendance: $row["attendance"] , 
        language: $row["language"] , 
        arrival_date: $row["arrival_date"] , 
        departure_date: $row["departure_date"],
        seating_preference: $row["seating_preference"],
        last_visit: $row["last_visit"]
    );
}

function get_user_by_id($user_id) {
    $session = create_db_session();
    if ($session === null) {
        _log("failed to create session");
        return NULL;
    }
    
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
        $users[] = user_from_row($row);
    }

    return $users;
}

function get_user_token_jti($user_id) {
    $session = create_db_session();
    if ($session === null) {
        _log("failed to create session");
        return NULL;
    }
    $stmt = $session->prepare("SELECT jti FROM user_auth WHERE id = :id;");
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
    
    return $result[0]["jti"];
}

function create_user($first_name, $last_name, $role, $jti, $language) {
    $session = create_db_session();    
    if ($session === null) {
        _log("failed to create session");
        return NULL;
    }

    try {
        $stmt = $session->prepare("INSERT INTO user_auth(jti) VALUES (:jti);");       
        $stmt->execute(["jti"=>$jti]);
        $lastInsertId = $session->lastInsertId();
        $stmt = $session->prepare("INSERT INTO user (id, role, first_name, last_name, language) VALUES(:id, :role, :first_name, :last_name, :language);");
        $stmt->execute(["id"=>$lastInsertId, "role"=> $role, "first_name"=>$first_name, "last_name"=>$last_name, "language"=>$language]);
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

function update_user_name(
    $user_id, 
    $first_name, 
    $last_name, 
    ){
    $session = create_db_session();    
    if ($session === null) {
        _log("failed to create session");
        return NULL;
    }

    try {
        $stmt = $session->prepare("UPDATE user SET first_name = :first_name, last_name = :last_name WHERE id = :user_id;");
        $stmt->execute(["user_id"=>$user_id, "first_name"=>$first_name, "last_name"=> $first_name]);
    }
    catch(\PDOException $e) 
    {
        _log($e);
        $session = null;
        http_response_code(response_code: 422);
        return ["msg"=>"error inserting user"];
    }
    
    $session = null;

    return get_user_by_id($user_id);
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
    $session = create_db_session();    
    if ($session === null) {
        _log("failed to create session");
        return NULL;
    }

    $drinks_str = implode(",", $drinks);

    try {
        $stmt = $session->prepare("UPDATE user SET mail = :mail, diet = :diet, drinks = :drinks, attendance = :attendance, language = :language, arrival_date = :arrival_date, departure_date = :departure_date, seating_preference = :seating_preference WHERE id = :user_id;");
        $stmt->execute(["user_id"=>$user_id, "mail"=>$mail, "diet"=> $diet, "drinks"=>$drinks_str, "attendance"=>$attendance, "language"=>$language, "arrival_date"=>$arrival_date, "departure_date"=>$departure_date, "seating_preference"=>$seating_preference]);
    }
    catch(\PDOException $e) 
    {
        _log($e);
        $session = null;
        http_response_code(response_code: 422);
        return ["msg"=>"error inserting user"];
    }
    
    $session = null;

    return get_user_by_id($user_id);
}

function update_last_visited(int $user_id): void {
    $session = create_db_session();   
     if ($session === null) {
        _log("failed to create session");
        return;
    }

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