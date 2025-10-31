<?php
namespace InfoController;

require_once "services/info.php";

function get_overview(\Request $request){
    $user_id = $request->user_id;
    if ($user_id === NULL){
		http_response_code(response_code: 403);
        return [];
    }

    return \InfoService\get_overview();
}


function get_gifts(\Request $request){
    $user_id = $request->user_id;
    if ($user_id === NULL){
		http_response_code(response_code: 403);
        return [];
    }

    return array_map(
        fn(\Gift $gift) => [
            // TODO: remove null values
            "id" => $gift->id,
            "type" => $gift->type,
            "title" => [
                "en" => $gift->title_en,
                "de" => $gift->title_de,
                "es" => $gift->title_es,
            ],
            "price_euro" => $gift->price_euro,
            "price_euro_left" => $gift->price_euro_left,
            "amount" => $gift->amount,
            "amount_left" =>$gift->amount_left
        ],
        \InfoService\get_gifts()
    );
}