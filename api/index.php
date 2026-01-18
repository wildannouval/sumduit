<?php
// api/index.php

// Pastikan folder untuk view compiled ada di /tmp
if (!is_dir('/tmp/views')) {
    mkdir('/tmp/views', 0755, true);
}

// Redirect request ke public/index.php asli Laravel
require __DIR__ . '/../public/index.php';
