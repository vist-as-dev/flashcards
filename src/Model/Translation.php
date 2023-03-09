<?php

namespace App\Model;

class Translation
{
    protected string $original;
    protected ?string $transliteration;
    protected array $translations;
    protected ?array $definitions;
    protected ?array $examples;
    protected ?array $relatedWords;

    public function __construct(
        string $original,
        ?string $transliteration,
        array $translations,
        ?array $definitions,
        ?array $examples,
        ?array $relatedWords
    ) {
        $this->original = $original;
        $this->transliteration = $transliteration;
        $this->translations = $translations;
        $this->definitions = $definitions;
        $this->examples = $examples;
        $this->relatedWords = $relatedWords;
    }

    public function getOriginal(): string
    {
        return $this->original;
    }

    public function getTransliteration(): ?string
    {
        return $this->transliteration;
    }

    public function getTranslations(): array
    {
        return $this->translations;
    }

    public function getDefinitions(): ?array
    {
        return $this->definitions;
    }

    public function getExamples(): ?array
    {
        return $this->examples;
    }

    public function getRelatedWords(): ?array
    {
        return $this->relatedWords;
    }
}