<?php

namespace App\Provider;

use App\Entity\Translations\English;
use App\Entity\Translations\Spanish;
use App\Entity\Translations\French;
use App\Entity\Translations\German;
use App\Entity\Translations\Italian;
use App\Entity\Translations\Polish;
use App\Entity\Translations\Ukrainian;
use App\Entity\Translations\Russian;
use App\Request\TranslationRequest;
use App\Service\Formatter\FormatterInterface;
use App\Service\TranslationFactory\TranslationFactoryInterface;
use App\Service\TranslationService;

class TranslationServiceProvider
{
    private TranslationFactoryProvider $factoryProvider;
    private FormatterProvider $formatterProvider;
    private TranslationService $service;

    public function __construct(
        TranslationFactoryProvider $factoryProvider,
        FormatterProvider $formatterProvider,
        TranslationService $service,
    )
    {
        $this->factoryProvider = $factoryProvider;
        $this->formatterProvider = $formatterProvider;
        $this->service = $service;
    }

    public function getService(TranslationRequest $request): TranslationService
    {
        return $this->service
            ->setFactory($this->factoryProvider->getFactory($request))
            ->setFormatter($this->formatterProvider->getFormatter($request))
            ->setRequest($request);
    }
}