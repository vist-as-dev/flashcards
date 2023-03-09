<?php

namespace App\Service;

use App\Provider\LanguageProvider;

class LanguageService
{
    public function list(): array
    {
        return LanguageProvider::NAMES;
    }
}