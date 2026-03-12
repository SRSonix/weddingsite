<?php

namespace InfoService;

function get_overview(){
    $info = [
        "date" => "2026-10-31",
        "arrival_time" => "15:30-16:00",
        "location"=> "Casa Flor de Maria, C. 31, 97345 Conkal, Yucatán",
        "whatsapp"=> [
            "Regina" => "+49 152 5606 2564",
            "Yannic" => "+49 179 235 5762"
        ]
    ];

    return $info;
}

function get_agenda() {
    $info = [
        "01:30" => [
            "en" => "-Closing-",
            "de" => "-Ende-",
            "es" => "-Cierre-"
        ]
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

