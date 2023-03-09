<?php

namespace App\Entity\Translations\Ukrainian;


use App\Entity\Translation;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Table(name: 'translation_ukrainian_to_polish')]
#[ORM\Entity]
class Polish extends Translation
{

}