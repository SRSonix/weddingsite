<?php

class User{
    public $id;
    public $role;
    public $first_name;
    public $last_name;
    public $diet;
    public $drinks;
    public $mail;
    public $attendance;
    public $language;
    public $arrival_date;
    public $departure_date;
    public $seating_preference;
    public $last_visit;

    public function __construct(
            $id, 
            $role, 
            $first_name, 
            $last_name, 
            $diet, 
            $drinks,
            $mail, 
            $attendance, 
            $language, 
            $arrival_date, 
            $departure_date,
            $last_visit,
            $seating_preference
        ){
        $this->id = $id;
        $this->role = $role;
        $this->first_name = $first_name;
        $this->last_name = $last_name;
        $this->diet = $diet;
        $this->drinks = $drinks;
        $this->mail = $mail;
        $this->attendance = $attendance;
        $this->language = $language;
        $this->arrival_date = $arrival_date;
        $this->departure_date = $departure_date;
        $this->seating_preference = $seating_preference;
        $this->last_visit = $last_visit;
    }
}