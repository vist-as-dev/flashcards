<?php

namespace App\Service\TranslationFactory;

use App\Model\Translation;

class TranslationByPosFactory extends TranslationFactory
{
    public function create(array $data): array
    {
        $sentences = $data['sentences'] ?? null;
        $dictionaries = $data['dict'] ?? [];

        $translation = ($sentences[0] ?? [])['trans'] ?? null;
        if (null === $translation) {
            return [];
        }

        $original = ($sentences[0] ?? [])['orig'] ?? null;
        $transliteration = ($sentences[1] ?? [])['src_translit'] ?? null;

        $definitions = $data['definitions'] ?? null;
        $synonyms = $data['synsets'] ?? [];
        $examples = $data['examples'] ?? [];
        $examples = $examples['example'] ?? [];
        $relatedWords = $data['related_words'] ?? [];

        $result = [
            new Translation(
                $original,
                $transliteration,
                [$translation],
                null,
                $this->makeExamples($examples),
                $this->makeRelatedWords($relatedWords),
            )
        ];

        foreach ($dictionaries as $dictionary) {
            ['terms' => $terms, 'pos' => $pos] = $dictionary;

            $result[] = new Translation(
                $original . ' |' . $pos,
                $transliteration,
                [$terms],
                $this->makeDefinitions($pos, $definitions, $this->makeSynonyms($synonyms)),
                $this->makeExamples($examples),
                $this->makeRelatedWords($relatedWords),
            );
        }

        return $result;
    }

    protected function makeDefinitions(string $pos, ?array $definitions, array $synonyms): ?array
    {
        if (null === $definitions) {
            return null;
        }

        $result = [];
        foreach ($definitions as $definition) {
            if ($pos !== $definition['pos']) {
                continue;
            }

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