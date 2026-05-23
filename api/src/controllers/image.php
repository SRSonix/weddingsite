<?php
namespace ImageController;

require_once "services/image.php";
require_once "controllers/base/request.php";
require_once "controllers/base/response.php";

function get_image(\Request $request){
    $user_id = $request->getUserIdOrRaise();

    $image_path = $request->path_params["image_path"];
    [$mimeType, $etag, $lastModified] = \ImageService\get_image_metadata($image_path);
    if (is_null($mimeType)){
        throw new \NotFoundException();
    }

    $cacheHeaders = [
        'ETag'          => $etag,
        'Last-Modified' => $lastModified,
        'Cache-Control' => 'private, max-age=86400',
    ];

    $ifNoneMatch = $request->headers['If-None-Match'] ?? null;
    if ($ifNoneMatch === $etag) {
        return new \Response(status: 304, contentType: $mimeType, headers: $cacheHeaders);
    }

    [$mimeType, $image] = \ImageService\get_image($image_path);
    return new \Response(
        contentType: $mimeType,
        body: $image,
        headers: $cacheHeaders
    );
}