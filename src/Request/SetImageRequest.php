<?php

namespace App\Request;

use App\Provider\LanguageProvider;
use Symfony\Component\Validator\Constraints\Choice;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Url;

class SetImageRequest extends AbstractRequest
{
    #[NotBlank]
    #[Choice(choices: LanguageProvider::CODES)]
    protected string $source;

    #[NotBlank]
    #[Choice(choices: LanguageProvider::CODES)]
    protected string $target;

    #[NotBlank]
    protected string $original;

    #[NotBlank]
    #[Url]
    protected string $image;

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

    public function getOriginal(): string
    {
        return $this->original;
    }

    public function getImage(): string
    {
        return $this->image;
    }
}