<?php

namespace App\Provider;

use App\Request\TranslationRequest;
use App\Service\Formatter\Anki;
use App\Service\Formatter\FormatterInterface;
use App\Service\Formatter\Reword;
use App\Service\TranslationFactory\TranslationAllInOneFactory;
use App\Service\TranslationFactory\TranslationByPosFactory;
use App\Service\TranslationFactory\TranslationFactoryInterface;

class TranslationFactoryProvider
{
    public function getFactory(TranslationRequest $request): ?TranslationFactoryInterface
    {
        if ($request->hasSpeechPartsApart()) {
            return new TranslationByPosFactory();
        }

        return new TranslationAllInOneFactory();
    }
}