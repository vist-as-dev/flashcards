<?php

namespace App\Provider;

use App\Request\TranslationRequest;
use App\Service\Formatter\FormatterInterface;
use App\Service\Formatter\Reword;

class FormatterProvider
{
    const REWORD = 'reword';
    const ANKI = 'anki';

    const FORMATS = [
        self::REWORD,
        self::ANKI,
    ];

    public function getFormatter(TranslationRequest $request): ?FormatterInterface
    {
        $formatters = [
            self::REWORD => new Reword($request),
        ];

        return $formatters[$request->getFormat()] ?? null;
    }
}