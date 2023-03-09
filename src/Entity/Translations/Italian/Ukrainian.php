<?php

namespace App\Entity\Translations\Italian;


use App\Entity\Translation;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Table(name: 'translation_italian_to_ukrainian')]
#[ORM\Entity]
class Ukrainian extends Translation
{

}