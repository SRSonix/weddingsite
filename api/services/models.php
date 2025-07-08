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
    public $guests;

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
            $guests
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
        $this->guests = $guests;
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
            guests: json_decode($row["guests"]) ?? [],
        );
    }
}