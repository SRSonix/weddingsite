<?php

class User{
    public $id;
    public $role;
    public $first_name;
    public $last_name;
    public $diet;
    public $mail;
    public $attendance;

    public function __construct($id, $role, $first_name, $last_name, $diet, $mail, $attendance){
        $this->id = $id;
        $this->role = $role;
        $this->first_name = $first_name;
        $this->last_name = $last_name;
        $this->diet = $diet;
        $this->mail = $mail;
        $this->attendance = $attendance;
    }

    static public function from_row($row){
        return new User(
            id: $row["id"], 
            role: $row["role"], 
            first_name: $row["first_name"], 
            last_name: $row["last_name"], 
            diet: $row["diet"], 
            mail: $row["mail"], 
            attendance: $row["attendance"] 
        );
    }
}