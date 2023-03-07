<?php

namespace App\Entity;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\MappedSuperclass]
class Translation
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $original = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $translation = null;

    #[ORM\Column]
    private ?int $counter = 0;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getOriginal(): ?string
    {
        return $this->original;
    }

    public function setOriginal(string $original): self
    {
        $this->original = $original;

        return $this;
    }

    public function getTranslation(): ?array
    {
        return null === $this->translation ? null : json_decode($this->translation, true);
    }

    public function setTranslation(?string $translation): self
    {
        $this->translation = $translation;

        return $this;
    }

    /**
     * @return int|null
     */
    public function getCounter(): ?int
    {
        return $this->counter;
    }

    /**
     * @param int|null $counter
     */
    public function setCounter(?int $counter): void
    {
        $this->counter = $counter;
    }

    public function addCounter(): void
    {
        $this->counter++;
    }
}
