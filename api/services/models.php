<?php

class User{
    public $id;
    public $name;

    public function __construct($id, $name, $token){
        $this->id = $id;
        $this->name = $name;
    }
}