<?php

namespace App\Service\Formatter;

use App\Model\Translation;
use App\Request\TranslationRequest;

class Json implements FormatterInterface
{
    protected bool $hasDefinitions = true;
    protected bool $hasDefinitionExamples = true;
    protected bool $hasDefinitionSynonyms = true;
    protected bool $hasExamples = true;

    protected array $items = [];

    public function __construct(TranslationRequest $request)
    {
        $this->hasDefinitions = $request->hasDefinitions();
        $this->hasDefinitionExamples = $request->hasDefinitionExamples();
        $this->hasDefinitionSynonyms = $request->hasDefinitionSynonyms();
        $this->hasExamples = $request->hasExamples();
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
        $definitions = [];
        foreach ($model->getDefinitions() ?: [] as $key => $definition) {
            if (is_array($definition)) {
                foreach ($definition as $def) {
                    $definitions[$key]['gloss'] = $def['gloss'];
                    if ($hasExample && !empty($def['example'])) {
                        $definitions[$key]['example'] = $def['example'];
                    }

                    if ($hasSynonyms && !empty($def['synonyms'])) {
                        $synonyms = $def['synonyms'];
                        $_str = isset($synonyms['main']) ? join(', ', $synonyms['main']) : '';
                        unset($synonyms['main']);

                        foreach ($synonyms as $register => $values) {
                            $_str .= (empty($_str) ? '' : $_str . ' | ') . $register . ': ' . join(', ', $values);
                        }

                        $definitions[$key]['synonyms'] = $_str;
                    }
                }
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