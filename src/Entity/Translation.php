<?php

namespace App\Entity;

use Doctrine\DBAL\Types\Types;
use App\Repository\TranslationRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TranslationRepository::class)]
class Translation
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Direction::class, inversedBy: 'translations')]
    private ?int $direction = null;

    #[ORM\Column(length: 255)]
    private ?string $original = null;

    #[ORM\Column(type: Types::TEXT, length: 255, nullable: true)]
    private ?string $translation = null;

    #[ORM\OneToOne(mappedBy: 'translation', cascade: ['persist', 'remove'])]
    private ?Statistics $statistics = null;

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

    public function setTranslation(?array $translation): self
    {
        $this->translation = json_encode($translation);

        return $this;
    }

    public function getStatistics(): ?Statistics
    {
        return $this->statistics;
    }

    public function setStatistics(Statistics $statistics): self
    {
        // set the owning side of the relation if necessary
        if ($statistics->getTranslation() !== $this) {
            $statistics->setTranslation($this);
        }

        $this->statistics = $statistics;

        return $this;
    }
}
