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
                "name" => "TODO",
                "tel" => "TODO",
                "web" => "TODO",
                "note" => [
                    "de" => "TODO",
                    "fr" => "TOO"
                ]
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
            "en" => "Arrival & Welcome Drinks",
            "de" => "Ankunft & Willkommensgetränke",
            "fr" => "Arrivée & Cocktail de bienvenue"
        ],
        "15:00" => [
            "en" => "Wedding Ceremony",
            "de" => "Trauzeremonie",
            "fr" => "Cérémonie de mariage"
        ],
        "16:00" => [
            "en" => "Cocktail Hour & Photos",
            "de" => "Sektempfang & Fotos",
            "fr" => "Cocktail & Photos"
        ],
        "17:30" => [
            "en" => "Dinner",
            "de" => "Abendessen",
            "fr" => "Dîner"
        ],
        "19:30" => [
            "en" => "Speeches & Cake",
            "de" => "Reden & Hochzeitstorte",
            "fr" => "Discours & Gâteau"
        ],
        "20:30" => [
            "en" => "Dancing",
            "de" => "Tanz",
            "fr" => "Danse"
        ],
        "01:30" => [
            "en" => "End",
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

