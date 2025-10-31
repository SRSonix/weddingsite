<?php

namespace InfoService;

require_once "repositories/gift.php";

function get_overview(){
    $info = [
        "date" => "2025-11-29",
        "arrival_time" => "15:30-16:00",
        "location"=> "Casa Flor de Maria, C. 31, 97345 Conkal, Yucatán",
        "car_minutes"=> "15-30",
        "car_from"=> "Mérida",
        "pre_wedding_day" => "Friday, 28.11.",
        "pre_wedding_location" => "location tbd",
        "post_wedding_day" => "sunday",
        "post_wedding_location"=> "Progreso",
        "whatsapp"=> [
            "Regina" => "+49 152 5606 2564",
            "Yannic" => "+49 179 235 5762"
        ]
    ];

    return $info;
}

function get_gifts() {
    return \GiftRepository\get_gifts();
}
