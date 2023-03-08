<?php

namespace App\Entity\Translations\Polish;


use App\Entity\Translation;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Table(name: 'translation_polish_to_ukrainian')]
#[ORM\Entity]
class Ukrainian extends Translation
{

}