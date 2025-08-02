<?php

class User{
    public $id;
    public $role;
    public $first_name;
    public $last_name;
    public $diet;
    public $mail;
    public $attendance;
    public $language;
    public $arrival_date;
    public $departure_date;
    public $seating_preference;
    public $guests;
    public $last_visit;

    public function __construct(
            $id, 
            $role, 
            $first_name, 
            $last_name, 
            $diet, $mail, 
            $attendance, 
            $language, 
            $arrival_date, 
            $departure_date,
            $guests,
            $last_visit,
            $seating_preference
        ){
        $this->id = $id;
        $this->role = $role;
        $this->first_name = $first_name;
        $this->last_name = $last_name;
        $this->diet = $diet;
        $this->mail = $mail;
        $this->attendance = $attendance;
        $this->language = $language;
        $this->arrival_date = $arrival_date;
        $this->departure_date = $departure_date;
        $this->seating_preference = $seating_preference;
        $this->guests = $guests;
        $this->last_visit = $last_visit;
    }

    static public function from_row($row){
        return new User(
            id: $row["id"], 
            role: $row["role"], 
            first_name: $row["first_name"], 
            last_name: $row["last_name"], 
            diet: $row["diet"], 
            mail: $row["mail"], 
            attendance: $row["attendance"] , 
            language: $row["language"] , 
            arrival_date: $row["arrival_date"] , 
            departure_date: $row["departure_date"],
            seating_preference: $row["seating_preference"],
            guests: json_decode($row["guests"]) ?? [],
            last_visit: $row["last_visit"]
        );
    }
}