<?php

namespace App\Provider;

use App\Service\Formatter\FormatterInterface;
use App\Service\Formatter\Reword;

class FormatterProvider
{
    const REWORD = 'reword';
    const ANKI = 'anki';

    const FORMATTERS = [
        self::REWORD,
        self::ANKI,
    ];

    public function getFormatter(string $key): ?FormatterInterface
    {
        $formatters = [
            self::REWORD => new Reword(),
        ];

        return $formatters[$key] ?? null;
    }
}