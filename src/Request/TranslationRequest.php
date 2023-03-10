<?php

namespace App\Request;

use App\Provider\FormatterProvider;
use App\Provider\LanguageProvider;
use Symfony\Component\Validator\Constraints\All;
use Symfony\Component\Validator\Constraints\Choice;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\NotNull;
use Symfony\Component\Validator\Constraints\Type;

class TranslationRequest extends AbstractRequest
{
    #[NotBlank]
    #[Choice(choices: LanguageProvider::CODES)]
    protected string $source;

    #[NotBlank]
    #[Choice(choices: LanguageProvider::CODES)]
    protected string $target;

    #[NotBlank]
    #[All([new Type('string')])]
    protected array $text;

    #[NotNull]
    protected bool $definitions;

    #[NotNull]
    protected bool $definition_examples;

    #[NotNull]
    protected bool $definition_synonyms;

    #[NotNull]
    protected bool $examples;

    #[NotNull]
    protected bool $related_words;

    #[NotBlank]
    #[Choice(choices: FormatterProvider::FORMATS)]
    protected string $format;

    /**
     * @return string
     */
    public function getSource(): string
    {
        return $this->source;
    }

    /**
     * @return string
     */
    public function getTarget(): string
    {
        return $this->target;
    }

    /**
     * @return array
     */
    public function getText(): array
    {
        return $this->text;
    }

    /**
     * @return bool
     */
    public function hasDefinitions(): bool
    {
        return $this->definitions;
    }

    /**
     * @return bool
     */
    public function hasDefinitionExamples(): bool
    {
        return $this->definition_examples;
    }

    /**
     * @return bool
     */
    public function hasDefinitionSynonyms(): bool
    {
        return $this->definition_synonyms;
    }

    /**
     * @return bool
     */
    public function hasExamples(): bool
    {
        return $this->examples;
    }

    /**
     * @return string
     */
    public function getFormat(): string
    {
        return $this->format;
    }

    /**
     * @return bool
     */
    public function hasRelatedWords(): bool
    {
        return $this->related_words;
    }
}