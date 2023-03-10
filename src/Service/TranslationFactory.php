<?php

namespace App\Service;

use App\Model\Translation;

class TranslationFactory
{
    public function create(array $data): Translation
    {
        $sentences = $data['sentences'] ?? null;
        $dictionaries = $data['dict'] ?? null;

        $original = ($sentences[0] ?? [])['orig'] ?? null;
        $translation = ($sentences[0] ?? [])['trans'] ?? null;
        $transliteration = ($sentences[1] ?? [])['src_translit'] ?? null;

        $definitions = $data['definitions'] ?? [];
        $synonyms = $data['synsets'] ?? [];
        $examples = $data['examples'] ?? [];
        $examples = $examples['example'] ?? [];
        $relatedWords = $data['related_words'] ?? [];

        return new Translation(
            $original,
            $transliteration,
            $this->makeTranslations($translation, $dictionaries),
            $this->makeDefinitions($definitions, $this->makeSynonyms($synonyms)),
            $this->makeExamples($examples),
            $this->makeRelatedWords($relatedWords),
        );
    }

    protected function makeTranslations(string $translation, ?array $dictionaries): array
    {
        $result = ['main' => $translation];

        if (null !== $dictionaries) {
            $scores = [];
            foreach ($dictionaries as $key => $dictionary) {
                ['terms' => $terms, 'entry' => $entry] = $dictionary;
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
                $result[] = $dictionaries[$key]['terms'];
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

    protected function makeSynonyms(array $synonyms): array
    {
        $result = [];
        foreach ($synonyms as $synonym) {
            $entries = $synonym['entry'] ?? [];

            foreach ($entries as $entry) {
                $id = $entry['definition_id'] ?? null;


                if (null !== $id) {
                    $_synonyms = $entry['synonym'] ?? [];
                    $label = $entry['label_info'] ?? [];
                    $register = $label['register'] ?? ['main'];

                    if (!isset($result[$id])) {
                        $result[$id] = [];
                    }

                    foreach ($register as $key) {
                        $result[$id][$key] = array_merge($result[$id][$key] ?? [], $_synonyms);
                    }
                }
            }
        }

        return $result;
    }

    protected function makeExamples(array $examples): array
    {
        $result = [];
        foreach ($examples as ['text' => $text]) {
            $result[] = $text;
        }

        return $result;
    }

    protected function makeRelatedWords(array $relatedWords): array
    {
        return $relatedWords['word'] ?? [];
    }
}