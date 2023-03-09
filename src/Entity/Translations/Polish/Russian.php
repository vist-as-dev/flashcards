<?php

namespace App\Entity\Translations\Polish;


use App\Entity\Translation;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Table(name: 'translation_polish_to_russian')]
#[ORM\Entity]
class Russian extends Translation
{

}