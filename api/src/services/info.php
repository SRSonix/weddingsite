<?php

namespace InfoService;

function get_overview(){
    $info = [
        "date" => "2026-10-31",
        "arrival_time" => "14:0ß",
        "location"=> "Reitpark Mergenthau, Mergenthau 2, 86438 Kissing",
        "phone"=> [
            "Alexine" => "+49 152 33521759",
            "Michael" => "+49 157 87061643"
        ]
    ];

    return $info;
}

function get_agenda() {
    $info = [
        "01:30" => [
            "de" => "-Ende-",
            "fr" => "-fr:-"
        ]
    ];

    return $info;
}

function get_payment_details() {
    $info = [
        "bank" => [
            "name" => "a-name",
            "iban" => "a-iban",
            "bic" => "a-bic"
        ]
    ];

    return $info;
}

