<?php

namespace App\Service;

use App\Provider\LanguageProvider;

class LanguageService
{
    protected ?LanguageProvider $lp;

    public function __construct(LanguageProvider $lp)
    {
        $this->lp = $lp;
    }

    public function list(): array
    {
        return $this->lp->getMap();
    }
}