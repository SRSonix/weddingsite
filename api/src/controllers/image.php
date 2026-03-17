<?php
namespace ImageController;

require_once "services/image.php";
require_once "controllers/base/request.php";
require_once "controllers/base/response.php";

function get_image(\Request $request){
    $user_id = $request->getUserIdOrRaise();

    $image_path = $request->path_params["image_path"];
    [$mimeType, $image] = \ImageService\get_image($image_path);
    if (is_null($mimeType) || is_null($image)){
        throw new \NotFoundException();
    }

    return new \Response(
        contentType: $mimeType,
        body: $image
    );
}