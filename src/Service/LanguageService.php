<?php

namespace App\Service;

use App\Repository\LanguageRepository;

class LanguageService
{
    protected ?LanguageRepository $repo;

    public function __construct(LanguageRepository $repo)
    {
        $this->repo = $repo;
    }

    public function list(): array
    {
        $languages = $this->repo->findAll();

        $result = [];
        foreach ($languages as $language) {
            $result[$language->getCode()] = $language->getName();
        }

        return $result;
    }
}