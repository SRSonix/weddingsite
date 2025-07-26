<?php
namespace ImageController;

require_once "services/image.php";
require_once "controllers/request.php";

function get_image(\Request $request){
    $user_id = $request->user_id;
    if ($user_id === NULL){
        header('Content-Type: img/png');   
		http_response_code(response_code: 403);
        exit;
    }

    $image_path = $request->path_params["image_path"];
    [$mimeType, $image] = \ImageService\get_image($image_path);
    if (is_null($mimeType) || is_null($image)){

        header('Content-Type: img/png');    
        http_response_code(response_code: 404);
        exit;
    }

    header('Content-Type: '. $mimeType);    
    echo $image;
    exit;
}