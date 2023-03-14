<?php

namespace App\Service\Formatter;

use App\Model\Translation;
use App\Request\TranslationRequest;

class Anki implements FormatterInterface
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
        return trim(join("\t", array_merge(
            [
                $this->renderOriginal($model),
                $this->renderTransliteration($model),
                $this->renderTranslations($model),
            ],
            $this->hasDefinitions
                ? [$this->renderDefinitions($model, $this->hasDefinitionExamples, $this->hasDefinitionSynonyms)]
                : [],
            $this->hasExamples ? [$this->renderExamples($model)] : [],
        )));
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

    protected function renderDefinitions(Translation $model, bool $hasExample, bool $hasSynonyms): string
    {
        $definitions = [];
        foreach ($model->getDefinitions() ?: [] as $key => $definition) {
            if (is_array($definition)) {
                foreach ($definition as $def) {
                    $str = $key . ': ' . $def['gloss'];
                    if ($hasExample && !empty($def['example'])) {
                        $str .= ' (example: ' . $def['example'] . ')';
                    }

                    if ($hasSynonyms && !empty($def['synonyms'])) {
                        $synonyms = $def['synonyms'];
                        $_str = isset($synonyms['main']) ? join(', ', $synonyms['main']) : '';
                        unset($synonyms['main']);

                        foreach ($synonyms as $register => $values) {
                            $_str .= (empty($_str) ? '' : $_str . ' | ') . $register . ': ' . join(', ', $values);
                        }

                        $str .= empty($_str) ? '' : '; synonyms: ' . $_str;
                    }

                    $definitions[] = $str;
                }
            } else {
                $definitions[] = $key . ': ' . $definition;
            }
        }

        return join(' | ', $definitions);
    }

    protected function renderExamples(Translation $model): string
    {
        return join(' | ', $model->getExamples());
    }
}