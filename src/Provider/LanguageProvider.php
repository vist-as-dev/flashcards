<?php

namespace App\Provider;

use App\Entity\Translations\English;
use App\Entity\Translations\Spanish;
use App\Entity\Translations\French;
use App\Entity\Translations\German;
use App\Entity\Translations\Italian;
use App\Entity\Translations\Polish;
use App\Entity\Translations\Ukrainian;
use App\Entity\Translations\Russian;

class LanguageProvider
{
    const ENGLISH = 'en';
    const SPANISH = 'es';
    const FRENCH = 'fr';
    const GERMAN = 'de';
    const ITALIAN = 'it';
    const POLISH = 'pl';
    const UKRAINIAN = 'uk';
    const RUSSIAN = 'ru';

    const CODES = [
        self::ENGLISH,
        self::SPANISH,
        self::FRENCH,
        self::GERMAN,
        self::ITALIAN,
        self::POLISH,
        self::UKRAINIAN,
        self::RUSSIAN,
    ];

    const NAMES = [
        self::ENGLISH => 'English',
        self::SPANISH => 'Spanish',
        self::FRENCH => 'French',
        self::GERMAN => 'German',
        self::ITALIAN => 'Italian',
        self::POLISH => 'Polish',
        self::UKRAINIAN => 'Ukrainian',
        self::RUSSIAN => 'Russian',
    ];

    public function getEntity($source, $target): ?string
    {
        $entities = [
            self::ENGLISH => [
                self::SPANISH => English\Spanish::class,
                self::FRENCH => English\French::class,
                self::GERMAN => English\German::class,
                self::ITALIAN => English\Italian::class,
                self::POLISH => English\Polish::class,
                self::UKRAINIAN => English\Ukrainian::class,
                self::RUSSIAN => English\Russian::class,
            ],
            self::SPANISH => [
                self::ENGLISH => Spanish\English::class,
                self::FRENCH => Spanish\French::class,
                self::GERMAN => Spanish\German::class,
                self::ITALIAN => Spanish\Italian::class,
                self::POLISH => Spanish\Polish::class,
                self::UKRAINIAN => Spanish\Ukrainian::class,
                self::RUSSIAN => Spanish\Russian::class,
            ],
            self::FRENCH => [
                self::SPANISH => French\Spanish::class,
                self::ENGLISH => French\English::class,
                self::GERMAN => French\German::class,
                self::ITALIAN => French\Italian::class,
                self::POLISH => French\Polish::class,
                self::UKRAINIAN => French\Ukrainian::class,
                self::RUSSIAN => French\Russian::class,
            ],
            self::GERMAN => [
                self::SPANISH => German\Spanish::class,
                self::FRENCH => German\French::class,
                self::ENGLISH => German\English::class,
                self::ITALIAN => German\Italian::class,
                self::POLISH => German\Polish::class,
                self::UKRAINIAN => German\Ukrainian::class,
                self::RUSSIAN => German\Russian::class,
            ],
            self::ITALIAN => [
                self::SPANISH => Italian\Spanish::class,
                self::FRENCH => Italian\French::class,
                self::GERMAN => Italian\German::class,
                self::ENGLISH => Italian\English::class,
                self::POLISH => Italian\Polish::class,
                self::UKRAINIAN => Italian\Ukrainian::class,
                self::RUSSIAN => Italian\Russian::class,
            ],
            self::POLISH => [
                self::SPANISH => Polish\Spanish::class,
                self::FRENCH => Polish\French::class,
                self::GERMAN => Polish\German::class,
                self::ENGLISH => Polish\English::class,
                self::ITALIAN => Polish\Italian::class,
                self::UKRAINIAN => Polish\Ukrainian::class,
                self::RUSSIAN => Polish\Russian::class,
            ],
            self::UKRAINIAN => [
                self::SPANISH => Ukrainian\Spanish::class,
                self::FRENCH => Ukrainian\French::class,
                self::GERMAN => Ukrainian\German::class,
                self::ENGLISH => Ukrainian\English::class,
                self::POLISH => Ukrainian\Polish::class,
                self::ITALIAN => Ukrainian\Italian::class,
                self::RUSSIAN => Ukrainian\Russian::class,
            ],
            self::RUSSIAN => [
                self::SPANISH => Russian\Spanish::class,
                self::FRENCH => Russian\French::class,
                self::GERMAN => Russian\German::class,
                self::ENGLISH => Russian\English::class,
                self::POLISH => Russian\Polish::class,
                self::UKRAINIAN => Russian\Ukrainian::class,
                self::ITALIAN => Russian\Italian::class,
            ],
        ];

        return ($entities[$source] ?? [])[$target] ?? null;
    }

}