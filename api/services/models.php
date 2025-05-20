<?php

class User{
    public $id;
    public $name;
    public $token;
    public $salt;

    public function __construct($id, $name, $token, $salt){
        $this->id = $id;
        $this->name = $name;
        $this->token = $token;
        $this->salt = $salt;
    }
}