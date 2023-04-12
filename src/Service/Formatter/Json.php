<?php

namespace App\Service\Formatter;

use App\Model\Translation;
use App\Request\TranslationRequest;
use Psr\Log\LoggerInterface;

class Json implements FormatterInterface
{
    protected bool $hasDefinitions = true;
    protected bool $hasDefinitionExamples = true;
    protected bool $hasDefinitionSynonyms = true;
    protected bool $hasExamples = true;

    protected array $items = [];

    protected LoggerInterface $logger;

    public function __construct(TranslationRequest $request, LoggerInterface $logger)
    {
        $this->hasDefinitions = $request->hasDefinitions();
        $this->hasDefinitionExamples = $request->hasDefinitionExamples();
        $this->hasDefinitionSynonyms = $request->hasDefinitionSynonyms();
        $this->hasExamples = $request->hasExamples();

        $this->logger = $logger;
    }

    public function add(Translation $model)
    {
        $this->items[] = array_merge(
            $this->renderOriginal($model),
            $this->renderTransliteration($model),
            $this->renderTranslations($model),
            $this->hasDefinitions
                ? $this->renderDefinitions($model, $this->hasDefinitionExamples, $this->hasDefinitionSynonyms)
                : [],
            $this->hasExamples ? $this->renderExamples($model) : [],
        );
    }

    public function content(): array
    {
        return $this->items;
    }

    protected function renderOriginal(Translation $model): array
    {
        return ['original' => $model->getOriginal()];
    }

    protected function renderTransliteration(Translation $model): array
    {
        return ['transliteration' => $model->getTransliteration()];
    }

    protected function renderTranslations(Translation $model): array
    {
        $translations = [];
        foreach ($model->getTranslations() as $value) {
            $translations[] = is_array($value) ? join(', ', $value) : $value;
        }

        return ['translations' => join(' | ', $translations)];
    }

    protected function renderDefinitions(Translation $model, bool $hasExample, bool $hasSynonyms): array
    {
        $this->logger->debug(json_encode($model->getDefinitions()));
        $definitions = [];
        foreach ($model->getDefinitions() ?: [] as $key => $definition) {
            if (is_array($definition)) {
                $definitions[$key] = array_values($definition);
            } else {
                $definitions[$key] = $definition;
            }
        }

        return ['definitions' => $definitions];
    }

    protected function renderExamples(Translation $model): array
    {
        return ['examples' => $model->getExamples()];
    }
}