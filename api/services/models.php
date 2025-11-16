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
    public $gift_claims;

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
            $seating_preference,
            $gift_claims,
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
        $this->gift_claims = $gift_claims;
    }
}

class Gift{
    public $id;
    public $type;
    public $title_en;
    public $title_de;
    public $title_es;
    public $price_euro;
    public $amount;
    public $amount_left;
    public $price_euro_left;

    public function __construct(array  $data){
        $this->id = $data["id"];
        $this->type = $data["type"];
        $this->title_en = $data["title_en"];
        $this->title_de = $data["title_de"];
        $this->title_es = $data["title_es"];
        $this->price_euro = $data["price_euro"];
        $this->amount = $data["amount"];
        $this->amount_left = $data["amount_left"];
        $this->price_euro_left = $data["price_euro_left"];
    }
}


class GiftClaim{
    public $user_id;
    public $gift_id;
    public $amount;

    public function __construct($user_id, $gift_id, $amount){
        $this->user_id = $user_id;
        $this->gift_id = $gift_id;
        $this->amount = $amount;
    }
}