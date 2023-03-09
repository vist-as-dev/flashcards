<?php

namespace App\Service;

class GoogleTranslate
{
    public function translate(string $source, string $target, string $word): string|bool
    {
        $url = "https://translate.google.com/translate_a/single?" . $this->query();

        $fields = array(
            'sl' => urlencode($source),
            'tl' => urlencode($target),
            'q' => urlencode($word)
        );

        $fields_string = [];
        foreach($fields as $key=>$value) {
            $fields_string[] = $key.'='.$value;
        }

        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, count($fields));
        curl_setopt($ch, CURLOPT_POSTFIELDS, join('&', $fields_string));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_ENCODING, 'UTF-8');
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($ch, CURLOPT_USERAGENT, 'AndroidTranslate/5.3.0.RC02.130475354-53000263 5.1 phone TRANSLATE_OPM5_TEST_1');

        $result = curl_exec($ch);

        curl_close($ch);

        return $result;
    }

    private function query(): string
    {
        $args = [
            'client' => 'at',
            'dt' => ['t', 'ld', 'qca', 'rm', 'bd', 'md', 'ex', 'ss', 'rw'],
            'dj' => 1,
            'hl' => 'en-US',
            'ie' => 'UTF-8',
            'oe' => 'UTF-8',
            'inputm' => 2,
            'otf' => 2,
            'iid' => '1dd3b944-fa62-4b55-b330-74909a99969e',
        ];

        $result = [];

        foreach ($args as $key => $value) {
            if (is_array($value)) {
                foreach ($value as $v) {
                    $result[] = $key . '=' . $v;
                }
                continue;
            }

            $result[] = $key . '=' . $value;
        }

        return join('&', $result);
    }
}