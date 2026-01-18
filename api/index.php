<?php
// api/index.php

// Vercel read-only filesystem fix
$storagePath = '/tmp/storage';
if (!is_dir($storagePath . '/framework/views')) {
    @mkdir($storagePath . '/framework/views', 0755, true);
    @mkdir($storagePath . '/framework/sessions', 0755, true);
    @mkdir($storagePath . '/framework/cache', 0755, true);
    @mkdir($storagePath . '/framework/cache/data', 0755, true);
}

// Inisialisasi index asli Laravel
require __DIR__ . '/../public/index.php';
