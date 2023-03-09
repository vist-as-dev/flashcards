<?php

namespace App\Entity\Translations\Polish;


use App\Entity\Translation;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Table(name: 'translation_polish_to_italian')]
#[ORM\Entity]
class Italian extends Translation
{

}