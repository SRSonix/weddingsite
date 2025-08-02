<?php

namespace UserRepository;

require_once "secrets/config.php";
require_once "services/models.php";

const GET_USER_QUERY = <<<EOD
WITH g AS (
SELECT user_id, JSON_ARRAYAGG(JSON_OBJECT('id', guest.id, 'first_name', guest.first_name, 'last_name', guest.last_name, 'diet', guest.diet)) as guests
from guest
GROUP BY user_id
)
select user.*, guests
from user LEFT JOIN g ON user.id = g.user_id
EOD;

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
    
    $stmt = $session->prepare(GET_USER_QUERY." HAVING id = :id;");
    $stmt->execute(["id" => $user_id]);
    $result = $stmt->fetchAll();
    
    if (count($result) == 0){
        _log("no result found");
        return NULL;
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

    $stmt = $session->prepare(GET_USER_QUERY.";");
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

function create_user($first_name, $last_name, $role, $password_hash, $language) {
    $session = create_db_session();    
    if ($session === null) {
        _log("failed to create session");
        return NULL;
    }

    try {
        $stmt = $session->prepare("INSERT INTO user_auth(password_hash) VALUES (:password_hash);");       
        $stmt->execute(["password_hash"=>$password_hash]);
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

function update_user(
    $user_id, 
    $mail, 
    $diet, 
    $attendance,
    $language, 
    $arrival_date, 
    $departure_date,
    $seating_preference,
    $guests
    ){
    $session = create_db_session();    
    if ($session === null) {
        _log("failed to create session");
        return NULL;
    }

    try {
        $stmt = $session->prepare("UPDATE user SET mail = :mail, diet = :diet, attendance = :attendance, language = :language, arrival_date = :arrival_date, departure_date = :departure_date, seating_preference = :seating_preference WHERE id = :user_id;");
        $stmt->execute(["user_id"=>$user_id, "mail"=>$mail, "diet"=> $diet, "attendance"=>$attendance, "language"=>$language, "arrival_date"=>$arrival_date, "departure_date"=>$departure_date, "seating_preference"=>$seating_preference]);

        $stmt = $session->prepare("DELETE FROM guest WHERE user_id = :user_id;");
        $stmt->execute(["user_id"=>$user_id]);

        $stmt = $session->prepare("INSERT INTO guest (user_id, id, first_name, last_name, diet) values (:user_id, :id, :first_name, :last_name, :diet);");
        for ($i = 0; $i < count($guests); $i++) {
            $guest = $guests[$i];
            $stmt->execute(["user_id"=>$user_id, "id"=>$i, "first_name"=>$guest["first_name"], "last_name"=>$guest["last_name"], "diet"=>$guest["diet"]]);
        }
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