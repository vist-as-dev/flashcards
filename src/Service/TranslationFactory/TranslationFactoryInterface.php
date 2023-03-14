<?php

namespace App\Service\TranslationFactory;

use App\Model\Translation;

interface TranslationFactoryInterface
{
    /**
     * @param array $data
     * @return Translation[]
     */
    public function create(array $data): array;
}