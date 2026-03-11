<?php

namespace FamilyMemberRepository;

require_once "services/models.php";
require_once "repositories/helper.php";

function get_family_members($user_id) {
    $session = create_db_session();
    
    $stmt = $session->prepare("SELECT * FROM family_member WHERE user_id = :user_id;");
    $stmt->execute(["user_id"=>$user_id]);
    
    $result = $stmt->fetchAll();

    $session = null;

    $family_members = [];
    foreach ($result as $row){
        $family_members[] = new \FamilyMember(
            id: $row["id"],
            user_id: $row["user_id"],
            name: $row["name"], 
            diet: $row["diet"], 
            is_child: boolval($row["child"]), 
        );
    }

    return $family_members;
}

function get_family_member($user_id, $family_member_id){
    $session = create_db_session();
    
    $stmt = $session->prepare("SELECT * FROM family_member WHERE id = :id AND user_id = :user_id;");
    $stmt->execute(["id" => $family_member_id, "user_id" => $user_id]);
    $result = $stmt->fetchAll();
    
    if (count($result) == 0){
        _log("no result found");
        return NULL;
    }

    $session = null;
    
    $row = $result[0];
    return new \FamilyMember(
        id: $row["id"],
        user_id: $row["user_id"],
        name: $row["name"], 
        diet: $row["diet"], 
        is_child: boolval($row["child"]), 
    );
}

function update_family_member($user_id, $family_member_id,  $name, $diet, $is_child){
    $session = create_db_session();

    $stmt = $session->prepare("UPDATE family_member SET name = :name, diet = :diet, child = :child WHERE id = :id AND user_id = :user_id;");
    $stmt->execute(["user_id" => $user_id, "id"=>$family_member_id, "name"=> $name, "diet"=>$diet, "child"=>(int)$is_child]);
    $affectedRows = $stmt->rowCount();
    
    $session = null;
    
    return $affectedRows;
}

function create_family_member($user_id, $name, $diet, $is_child){
    $session = create_db_session();
    
    $stmt = $session->prepare("INSERT INTO family_member (user_id, name, diet, child) VALUES (:user_id, :name, :diet, :child)");
    $stmt->execute(["user_id" => $user_id, "name"=> $name, "diet"=>$diet, "child"=>(int)$is_child]);
    $lastInsertId = $session->lastInsertId();
    
    $session = null;
    
    return $lastInsertId;
}


function delete_family_member($user_id, $family_member_id){
    $session = create_db_session();
    
    $stmt = $session->prepare("DELETE FROM family_member WHERE id = :id AND user_id = :user_id;");
    $stmt->execute(["id" => $family_member_id, "user_id"=> $user_id]);
    $affectedRows = $stmt->rowCount();

    $session = null;

    return $affectedRows;
}