<?php

namespace InfoService;

function get_overview(){
    $info = [
        "date" => "2026-10-31",
        "arrival_time" => "14:30",
        "rsvp_deadline" => "2026-05-15",
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
        "brunch" => [
            "date" => "2026-11-01",
            "time" => "10:30",
            "location" => "Augsburg",
            "location_maps_link" => NULL
        ]
    ];

    return $info;
}

function get_agenda() {
    $info = [
        "14:30" => [
            "de" => "Ankunft & Willkommensgetränke",
            "fr" => "Arrivée & Cocktail de bienvenue",
            "en" => "Arrival & Welcome Drinks"
        ],
        "15:00" => [
            "de" => "Trauung",
            "fr" => "Cérémonie",
            "en" => "Ceremony"
        ],
        "15:30" => [
            "de" => "Gruppenfotos",
            "fr" => "Photos de groupe",
            "en" => "Group Photos"
        ],
        "16:00" => [
            "de" => "Aperitif",
            "fr" => "Apéritif",
            "en" => "Aperitif"
        ],
        "18:30" => [
            "de" => "Abendessen",
            "fr" => "Dîner",
            "en" => "Dinner"
        ],
        "20:00" => [
            "de" => "Musik & Party",
            "fr" => "Musique & fête",
            "en" => "Music & Party"
        ],
        "01:00" => [
            "de" => "Ende",
            "fr" => "Fin",
            "en" => "End"
        ]
    ];

    return $info;
}

function get_payment_details() {
    $info = [
        "bank" => [
            "name" => "Alexine Zapf",
            "iban" => "DE22 1203 0000 1204 9835 95",
            "bic" => "BYLADEM1001"
        ]
    ];

    return $info;
}

