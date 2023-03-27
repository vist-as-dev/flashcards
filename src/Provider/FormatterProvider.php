<?php

namespace App\Provider;

use App\Request\TranslationRequest;
use App\Service\Formatter\Anki;
use App\Service\Formatter\FormatterInterface;
use App\Service\Formatter\Json;
use App\Service\Formatter\Reword;

class FormatterProvider
{
    const REWORD = 'reword';
    const ANKI = 'anki';
    const JSON = 'json';

    const FORMATS = [
        self::REWORD,
        self::ANKI,
        self::JSON,
    ];

    public function getFormatter(TranslationRequest $request): ?FormatterInterface
    {
        $formatters = [
            self::REWORD => new Reword($request),
            self::ANKI => new Anki($request),
            self::JSON => new Json($request),
        ];

        return $formatters[$request->getFormat()] ?? null;
    }
}