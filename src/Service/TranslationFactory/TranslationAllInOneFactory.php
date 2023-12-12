<?php

namespace App\Service\TranslationFactory;

use App\Model\Translation;

class TranslationAllInOneFactory extends TranslationFactory
{
    public function create(array $data): array
    {
        $sentences = $data['sentences'] ?? null;
        $dictionaries = $data['dict'] ?? null;

        $definitions = $data['definitions'] ?? [];
        $synonyms = $data['synsets'] ?? [];
        $examples = $data['examples'] ?? [];
        $examples = $examples['example'] ?? [];
        $relatedWords = $data['related_words'] ?? [];

        return [
            new Translation(
                $this->makeOriginal($sentences),
                $this->makeTransliteration($sentences),
                $this->makeTranslations($this->makeTranslation($sentences), $dictionaries),
                $this->makeDefinitions($definitions, $this->makeSynonyms($synonyms)),
                $this->makeExamples($examples),
                $this->makeRelatedWords($relatedWords),
            )
        ];
    }

    protected function makeTranslations(string $translation, ?array $dictionaries): array
    {
        $result = ['main' => $translation];

        if (null !== $dictionaries) {
            $scores = [];
            foreach ($dictionaries as $key => $dictionary) {
                $entry = $dictionary['entry'] ?? [];
                $terms = $dictionary['terms'] ?? [];

                if (empty($terms)) {
                    foreach ($entry as $e) {
                        if (isset($e['word'])) {
                            $terms[] = $e['word'];
                        }
                    }
                    $dictionaries[$key]['terms'] = $terms;
                }

                $mean = 0;
                foreach ($entry as $e) {
                    if (isset($e['score'])) {
                        $mean += $e['score'];
                    }
                }
                $mean = $mean / count($entry);

//                while (isset($scores[strval($mean)])) {
//                    $mean += 0.00000000000000001;
//                }

                $scores[strval($mean)] = $key;

                if (isset($result['main']) && in_array($result['main'], $terms)) {
                    unset($result['main']);
                }
            }

            krsort($scores, SORT_NUMERIC);

            foreach ($scores as $key) {
                if (isset($dictionaries[$key]['terms'])) {
                    $result[] = $dictionaries[$key]['terms'];
                }
            }
        }

        return $result;
    }

    protected function makeDefinitions(array $definitions, array $synonyms): array
    {
        $result = [];
        foreach ($definitions as $definition) {
            $pos = $definition['pos'] ?? null;
            $entries = $definition['entry'] ?? [];

            foreach ($entries as $entry) {
                $id = $entry['definition_id'] ?? null;
                $gloss = $entry['gloss'] ?? null;
                $example = $entry['example'] ?? null;

                $result[$pos][$id] = [
                    'gloss' => $gloss,
                    'example' => $example,
                    'synonyms' => $synonyms[$id] ?? [],
                ];
            }
        }

        return $result;
    }
}