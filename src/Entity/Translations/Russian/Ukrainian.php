<?php

namespace App\Entity\Translations\Russian;


use App\Entity\Translation;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Table(name: 'translation_russian_to_ukrainian')]
#[ORM\Entity]
class Ukrainian extends Translation
{

}