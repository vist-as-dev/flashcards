<?php

namespace App\Service\Formatter;

use App\Model\Translation;

interface FormatterInterface
{
    public function format(
        Translation $model,
        bool        $hasDefinitions,
        bool        $hasDefinitionExamples,
        bool        $hasDefinitionSynonyms,
        bool        $hasExamples,
    ): string;

}