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
        "15:30" => [
            "en" =>"Arrival & refreshments",
            "de" => "Ankunft & Apperetif",
            "es" => "Llegada y refrescos"
        ],
        "16:00" => [
            "en" =>"Wedding Ceremony",
            "de" => "Hochzeitszeremonie",
            "es" => "Ceremonia de boda"
        ],
        "17:00" => [
            "en" =>"Bar opens",
            "de" => "Bar öffnet",
            "es" => "Apertura de la barra"
        ],
        "18:00" => [
            "en" => "Take seats at tables",
            "de" => "Platz nehmen am Tisch",
            "es" => "Tomar asiento en las mesas"
        ],
        "18:15" => [
            "en" => "Entry of the couple",
            "de" => "Eintritt des Hochzeitpaares",
            "es" => "Entrada de la pareja"
        ],
        "18:20" => [
            "en" => "Dinner",
            "de" => "Abendessen",
            "es" => "Cena"
        ],
        "19:30" => [
            "en" => "Couple and family dance",
            "de" => "Paar- und Familientanz",
            "es" => "Baile de la pareja y familia"
        ],
        "20:00" => [
            "en" => "Dance floor opening",
            "de" => "Tannzfläche öffnet",
            "es" => "Apertura de la pista de baile"
        ],
        "20:15" => [
            "en" => "Desert table opens",
            "de" => "Nachtischbüffet öffnet",
            "es" => "Apertura de la mesa de postres"
        ],
        "22:00" => [
            "en" => "Snack cart opens",
            "de" => "Snäckwagen öffnet",
            "es" => "Apertura del carrito de snacks"
        ],
        "22:30" => [
            "en" => "Keex B2B DJ Baron",
            "de" => "Keex B2B DJ Baron",
            "es" => "Keex B2B DJ Baron"
        ],
        "23:30" => [
            "en" => "Taco truck opens; Mariachi",
            "de" => "Taco-Foodtruck öffnet; Mariachi",
            "es" => "Apertura del camión de tacos; Mariachi"
        ],
        "00:15" => [
            "en" => "DJ continues",
            "de" => "Der DJ macht weiter",
            "es" => "El DJ continúa"
        ],
        "02:30" => [
            "en" => "Dance floor closes",
            "de" => "Tanzfläche schließt",
            "es" => "Cierre de la pista de baile"
        ],
        "03:30" => [
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

