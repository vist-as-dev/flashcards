<?php

namespace App\Service\TranslationFactory;

use App\Model\Translation;

abstract class TranslationFactory implements TranslationFactoryInterface
{
    abstract public function create(array $data): array;

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