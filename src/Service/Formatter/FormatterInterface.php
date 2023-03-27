<?php

namespace App\Service\Formatter;

use App\Model\Translation;

interface FormatterInterface
{
    public function add(Translation $model);
    public function content(): string|array;
}