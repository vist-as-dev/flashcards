<?php

namespace App\Controller\Api;

use Exception as ExceptionAlias;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api')]
class ParserController extends AbstractController
{
    #[Route('/parser', methods: ['GET'])]
    public function parse(): JsonResponse
    {
        // Функция для загрузки HTML-страницы
        function loadHtmlPage($url) {
            // Получение HTML-страницы
            $htmlContent = file_get_contents($url);
            if ($htmlContent === false) {
                throw new ExceptionAlias("Не удалось загрузить страницу $url");
            }
            return $htmlContent;
        }

// Функция для извлечения текста с помощью регулярных выражений
        function extractTextFromHtml($htmlContent) {
            $pattern = '/<div><\/div>\s+(?:<h\d>(?P<title>[^<]+)?<\/h\d>|<p>(?P<title_fallback>[^<]+)?<\/p>).*?(?:<p>\s*(.+?)\s*<\/p>(?:<div[^>]*>(?:<script>[^<]*<\/script>)*<\/div>)*)+\s/is';
            $content = [];

            // Регулярное выражение для извлечения текста из <div class="chapter-content">...</div>
            if (preg_match($pattern, $htmlContent, $matches)) {
                if (preg_match('/class="chr-title".*?title="(.*?)"/is', $htmlContent, $titleMatches)) {
                    $content['title'] = $titleMatches[1];
                } else {
                    $content['title'] = $matches['title'] ?: $matches['title_fallback'];
                }

                $content['text'] = '';

                // Регулярное выражение для извлечения текста из всех <p> внутри этого div
                    preg_match_all('/<p>\s*(.*?)\s*<\/p>/is', $matches[0], $paragraphs);

                // Соединяем все абзацы в один текст с двумя переносами строки между абзацами
                foreach ($paragraphs[1] as $paragraph) {
                    // Удаляем HTML-теги и добавляем текст в общую строку
                    $content['text'] .= strip_tags($paragraph) . "\n\n";
                }

                if (preg_match('/<a.*href="([^"]+)"[^>]+?id="next_chap">/is', $htmlContent, $next)) {
                    $content['next'] = $next[1];
                }
            } else {
                throw new ExceptionAlias("Текст главы не найден.");
            }

            return $content;
        }

// Функция для создания FB2
        function createFb2($title, $author, $content, $outputFile) {
            $fb2Template = '<?xml version="1.0" encoding="UTF-8"?>
<FictionBook xmlns="http://www.gribuser.ru/xml/fictionbook/2.0" xmlns:xlink="http://www.w3.org/1999/xlink">
    <description>
        <title-info>
            <genre>fantasy</genre>
            <author>
                <first-name>' . htmlspecialchars($author['first_name']) . '</first-name>
            </author>
            <book-title>' . htmlspecialchars($title) . '</book-title>
            <date>' . date('Y-m-d') . '</date>
        </title-info>
    </description>
    <body>
        <section>
            <title><p>' . htmlspecialchars($title) . '</p></title>
            ' . formatTextToFb2($content) . '
        </section>
    </body>
</FictionBook>';

            file_put_contents($outputFile, $fb2Template);
        }

// Функция для форматирования текста в FB2-формат
        function formatTextToFb2($content) {
            $paragraphs = explode("\n\n", $content);
            $fb2Content = '';

            foreach ($paragraphs as $paragraph) {
                if (trim($paragraph) !== '') {
                    $fb2Content .= '<p>' . htmlspecialchars(trim($paragraph)) . '</p>' . "\n";
                }
            }

            return $fb2Content;
        }

// Основная программа
        function parse($url, $chapter = 1) {
            $htmlContent = loadHtmlPage($url);

            // Извлечение текста
            $textContent = extractTextFromHtml($htmlContent);

            // Создание FB2 книги
            $title = 'Shadow Slave: ' . $textContent['title'];
            $text = $textContent['text'];
            $author = ['first_name' => 'Guiltythree']; // Можно изменить
            $outputFile = "parser/shadow_slave_chapter{$chapter}.fb2";

            createFb2($title, $author, $text, $outputFile);

            echo "FB2 файл успешно создан: $outputFile\n";

            if (!empty($textContent['next'])) {
                parse($textContent['next'], $chapter + 1);
            }
        }

        try {
//            $url = 'https://novelbjn.phieuvu.com/book/shadow-slave/chapter-1200-battle-of-the-black-skull-14';
//            parse($url, 1200);
        } catch (ExceptionAlias $e) {
            echo 'Ошибка: ' . $e->getMessage();
        }

        function extractChapterContent($fb2FilePath) {
            $content = file_get_contents($fb2FilePath);

            // Используем регулярное выражение для извлечения содержимого тега <body>
            if (preg_match('/<body>(.*?)<\/body>/is', $content, $matches)) {
                return $matches[1]; // Возвращаем содержимое между <body> и </body>
            }

            return null;
        }

        $sections = '';
        for ($i = 1501; $i <= 1876; $i++) {
            $sections .= extractChapterContent("parser/shadow_slave_chapter{$i}.fb2") . "\n";
        }

        $fb2Template = '<?xml version="1.0" encoding="UTF-8"?>
<FictionBook xmlns="http://www.gribuser.ru/xml/fictionbook/2.0" xmlns:xlink="http://www.w3.org/1999/xlink">
    <description>
        <title-info>
            <genre>fantasy</genre>
            <author>
                <first-name>Guiltythree</first-name>
            </author>
            <book-title>Shadow Slave: 1501 - 1876</book-title>
            <date>' . date('Y-m-d') . '</date>
        </title-info>
    </description>
    <body>
        ' . $sections . '
    </body>
</FictionBook>';

        file_put_contents('parser/shadow_slave_1501-1876.fb2', $fb2Template);

        return $this->json(null);
    }
}