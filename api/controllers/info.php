<?php
namespace InfoController;

function get_overview(\Request $request){
    $user_id = $request->user_id;
    if ($user_id === NULL){
		http_response_code(response_code: 403);
        return [];
    }

    $info = [
        "date" => "2025-11-29",
        "arrival_time" => "15:30-16:00",
        "location"=> "Casa Flor de Maria, C. 31, 97345 Conkal, Yuc.",
        "car_minutes"=> "15-30",
        "car_from"=> "Mérida",
        "pre_wedding_day" => "Friday, 28.11.",
        "pre_wedding_location" => "location tbd",
        "post_wedding_day" => "sunday",
        "post_wedding_location"=> "beach in Progreso",
        "whatsapp"=> [
            "Regina" => "+49 152 5606 2564",
            "Yannic" => "+49 179 235 5762"
        ]
    ];

    return $info;
}