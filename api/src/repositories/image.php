<?php
namespace ImageRepository;

const BASE_PATH = "images";

function get_image(string $image_path): array {
    $image_path = __DIR__ . "/../images/" . $image_path;

    if (!file_exists($image_path)) {
        return [NULL, NULL];
    }

    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $image_path);
    finfo_close($finfo);

    $image = file_get_contents($image_path);

    return [$mimeType, $image];
}   