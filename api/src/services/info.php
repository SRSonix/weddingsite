<?php

namespace InfoService;

function get_overview(){
    $info = [
        "date" => "2026-10-31",
        "arrival_time" => "14:00",
        "location"=> "Reitpark Mergenthau, Mergenthau 2, 86438 Kissing",
        "location_maps_link" => "https://maps.app.goo.gl/7SRGo6cvHnD9aFqCA",
        "phone"=> [
            "Alexine" => "+49 152 33521759",
            "Michael" => "+49 157 87061643"
        ],
        "hotels" => [
            [
                "name" => "Schlosserwirt in Mering",
                "tel" => " +49 8233 9504",
                "web" => "https://schlosserwirt.de/"
            ]
        ],
        "public_transport" => [
            "de" => "Vom Bahnhof Kissing zu Fuß erreichbar",
            "fr" => "Accessible à pied depuis la gare de Kissing"
        ]
    ];

    return $info;
}

function get_agenda() {
    $info = [
        "14:00" => [
            "de" => "Ankunft & Willkommensgetränke",
            "fr" => "Arrivée & Cocktail de bienvenue"
        ],
        "01:00" => [
            "de" => "Ende",
            "fr" => "Fin"
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

