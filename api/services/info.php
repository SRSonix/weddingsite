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

function get_agenda() {
    $info = [
        "15:30" => "Arrival & refreshments",
        "16:00" => "Wedding Ceremony",
        "17:00" => "Bar opens",
        "18:00" => "Take seats at tables",
        "18:15" => "Entry of the couple",
        "18:20" => "Dinner",
        "19:30" => "Couple and family dance",
        "20:00" => "Dance floor opening",
        "20:15" => "Desert table opens",
        "22:00" => "Snack cart opens",
        "22:30" => "Keex B2B DJ Baron",
        "23:30" => "Taco truck opens; Mariachi",
        "00:15" => "DJ continues",
        "02:30" => "Dance floor closes",
        "03:30" => "-Closing-"
    ];

    return $info;
}

function get_payment_details() {
    $info = [
        "paypal" => [
            "mail" =>"reg.yannic.bm@gmail.com",
            "username" => "regandyannic"
        ],
        "bank" => [
            "name" => "R MARTINEZ GRACIA-MEDRANO & Y Bode",
            "iban" => "DE04 1001 0178 9396 5106 76",
            "bic" => "REVODEB2"
        ]
    ];

    return $info;
}

