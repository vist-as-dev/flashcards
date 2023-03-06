<?php

namespace App\Entity;

use App\Repository\DirectionRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: DirectionRepository::class)]
class Direction
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Language::class, inversedBy: 'sources')]
    private ?Language $source = null;

    #[ORM\ManyToOne(targetEntity: Language::class, inversedBy: 'targets')]
    private ?Language $target = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return Language|null
     */
    public function getSource(): ?Language
    {
        return $this->source;
    }

    /**
     * @param Language|null $source
     */
    public function setSource(?Language $source): void
    {
        $this->source = $source;
    }

    /**
     * @return Language|null
     */
    public function getTarget(): ?Language
    {
        return $this->target;
    }

    /**
     * @param Language|null $target
     */
    public function setTarget(?Language $target): void
    {
        $this->target = $target;
    }
}
