<?php

namespace App\Service;

use App\Model\Translation;

class TranslationFormatter
{
    public function render(Translation $model): void
    {
        echo $this->renderOriginal($model) . "\n";
        echo $this->renderTransliteration($model) . "\n";
        echo $this->renderTranslations($model) . "\n";
        echo "Definitions:\n" . $this->renderDefinitions($model) . "\n";
        echo "Examples:\n" . $this->renderExamples($model) . "\n";
    }

    public function asCsvRow(Translation $model): array
    {
        $result = [
            $this->renderOriginal($model),
            $this->renderTransliteration($model),
            $this->renderTranslations($model),
        ];

        $definitions = [];
        foreach ($model->getDefinitions() ?: [] as $key => $definition) {
            if (is_array($definition)) {
                foreach ($definition as $def) {
                    $definitions[] = $key . ': ' . $def['gloss'];

                    $synonyms = $def['synonyms'] ?? [];
                    $str = isset($synonyms['main']) ? join(', ', $synonyms['main']) : '';
                    unset($synonyms['main']);

                    foreach ($synonyms as $register => $values) {
                        $str .= (empty($str) ? '' : $str . ' | ') . $register . ': ' . join(', ', $values);
                    }

                    $definitions[] = empty($str) ? '_' : 'synonyms: ' . $str;
                }
            } else {
                $definitions[] = $key . ': ' . $definition;
                $definitions[] = '_';
            }
        }

        return array_merge($result, $definitions);
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

        return "[{$transliteration}]";
    }

    protected function renderTranslations(Translation $model): string
    {
        $translations = [];
        foreach ($model->getTranslations() as $key => $value) {
            $translations[] = is_array($value) ? join(', ', $value) : $value;
        }

        return join(' | ', $translations);
    }

    protected function renderDefinitions(Translation $model): string
    {
        $definitions = [];
        foreach ($model->getDefinitions() as $key => $value) {
            $definitions[] = $key . ":\n- " . join("\n- ", $value);
        }

        return join("\n", $definitions);
    }

    protected function renderExamples(Translation $model): string
    {
        return (count($model->getExamples()) > 0 ? '- ' : '') . join(";\n- ", $model->getExamples());
    }
}