<?php

namespace App\Service\Formatter;

use App\Model\Translation;
use App\Request\TranslationRequest;

class Reword implements FormatterInterface
{
    protected bool $hasDefinitions;
    protected bool $hasDefinitionExamples;
    protected bool $hasDefinitionSynonyms;
    protected bool $hasExamples;

    public function __construct(TranslationRequest $request)
    {
        $this->hasDefinitions = $request->hasDefinitions();
        $this->hasDefinitionExamples = $request->hasDefinitionExamples();
        $this->hasDefinitionSynonyms = $request->hasDefinitionSynonyms();
        $this->hasExamples = $request->hasExamples();
    }

    public function format(Translation $model): string
    {
        return '"' . join('"; "', array_merge(
            [
                $this->renderOriginal($model),
                $this->renderTransliteration($model),
                $this->renderTranslations($model),
            ],
            $this->hasDefinitions
                ? $this->renderDefinitions($model, $this->hasDefinitionExamples, $this->hasDefinitionSynonyms)
                : [],
            $this->hasExamples ? $this->renderExamples($model) : [],
        )) . '"';
    }

    protected function renderOriginal(Translation $model): string
    {
        return $model->getOriginal();
    }

    protected function renderTransliteration(Translation $model): string
    {
        $transliteration = $model->getTransliteration();
        if (null == $transliteration) {
            return '';
        }

        return "[$transliteration]";
    }

    protected function renderTranslations(Translation $model): string
    {
        $translations = [];
        foreach ($model->getTranslations() as $value) {
            $translations[] = is_array($value) ? join(', ', $value) : $value;
        }

        return join(' | ', $translations);
    }

    protected function renderDefinitions(Translation $model, bool $hasExample, bool $hasSynonyms): array
    {
        $definitions = [];
        foreach ($model->getDefinitions() ?: [] as $key => $definition) {
            if (is_array($definition)) {
                foreach ($definition as $def) {
                    $str = $key . ': ' . $def['gloss'];
                    if ($hasExample && !empty($def['example'])) {
                        $str .= ' (example: ' . $def['example'] . ')';
                    }

                    $definitions[] = $str;

                    if ($hasSynonyms && !empty($def['synonyms'])) {
                        $synonyms = $def['synonyms'];
                        $str = isset($synonyms['main']) ? join(', ', $synonyms['main']) : '';
                        unset($synonyms['main']);

                        foreach ($synonyms as $register => $values) {
                            $str .= (empty($str) ? '' : $str . ' | ') . $register . ': ' . join(', ', $values);
                        }

                        $definitions[] = empty($str) ? '_' : 'synonyms: ' . $str;
                    } else {
                        $definitions[] = '_';
                    }
                }
            } else {
                $definitions[] = $key . ': ' . $definition;
                $definitions[] = '_';
            }
        }

        return $definitions;
    }

    protected function renderExamples(Translation $model): array
    {
        $result = [];
        foreach ($model->getExamples() as $example) {
            $result[] = $example;
            $result[] = '-';
        }

        return $result;
    }
}