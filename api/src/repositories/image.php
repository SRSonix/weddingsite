<?php
namespace ImageRepository;

const BASE_PATH = "images";

function _resolve_path(string $image_path): string {
    return __DIR__ . "/../images/" . $image_path;
}

function get_image_metadata(string $image_path): array {
    $full_path = _resolve_path($image_path);

    if (!file_exists($full_path)) {
        return [NULL, NULL, NULL];
    }

    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $full_path);
    finfo_close($finfo);

    $mtime = filemtime($full_path);
    $etag = '"' . $mtime . '-' . filesize($full_path) . '"';
    $lastModified = gmdate('D, d M Y H:i:s', $mtime) . ' GMT';

    return [$mimeType, $etag, $lastModified];
}

function get_image(string $image_path): array {
    $full_path = _resolve_path($image_path);

    if (!file_exists($full_path)) {
        return [NULL, NULL];
    }

    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $full_path);
    finfo_close($finfo);

    $image = file_get_contents($full_path);

    return [$mimeType, $image];
}