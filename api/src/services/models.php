<?php

class User{
    public $id;
    public $role;
    public $name;
    public $mail;
    public $attendance;
    public $language;
    public $last_visit;
    public $family_members;
    public $invited_by;

    public function __construct(
            $id,
            $role,
            $name,
            $mail,
            $attendance,
            $language,
            $last_visit,
            $family_members,
            $invited_by = NULL,
        ){
        $this->id = $id;
        $this->role = $role;
        $this->name = $name;
        $this->mail = $mail;
        $this->attendance = $attendance;
        $this->language = $language;
        $this->last_visit = $last_visit;
        $this->family_members = $family_members;
        $this->invited_by = $invited_by;
    }
}


class FamilyMember{
    public $id;
    public $user_id;
    public $name;
    public $diet;
    public $is_child;

    public function __construct($id, $user_id, $name, $diet, $is_child){
        $this->id = $id;
        $this->user_id = $user_id;
        $this->name = $name;
        $this->diet = $diet;
        $this->is_child = $is_child;
    }
}