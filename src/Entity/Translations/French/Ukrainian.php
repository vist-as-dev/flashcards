<?php

namespace App\Entity\Translations\French;


use App\Entity\Translation;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Table(name: 'translation_french_to_ukrainian')]
#[ORM\Entity]
class Ukrainian extends Translation
{

}