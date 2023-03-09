<?php

namespace App\Entity\Translations\French;


use App\Entity\Translation;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Table(name: 'translation_french_to_italian')]
#[ORM\Entity]
class Italian extends Translation
{

}