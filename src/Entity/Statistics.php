<?php

namespace App\Entity;

use App\Repository\StatisticsRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: StatisticsRepository::class)]
class Statistics
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\OneToOne(inversedBy: 'statistics', cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?Translation $translation = null;

    #[ORM\Column]
    private ?int $translationsFromWordList = 0;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTranslation(): ?Translation
    {
        return $this->translation;
    }

    public function setTranslation(Translation $translation): self
    {
        $this->translation = $translation;

        return $this;
    }

    public function getTranslationsFromWordList(): ?int
    {
        return $this->translationsFromWordList;
    }

    public function setTranslationsFromWordList(?int $translationsFromWordList): self
    {
        $this->translationsFromWordList = $translationsFromWordList;

        return $this;
    }
}
