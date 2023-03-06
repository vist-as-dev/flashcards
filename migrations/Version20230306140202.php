<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230306140202 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE direction (id INT AUTO_INCREMENT NOT NULL, source_id INT DEFAULT NULL, target_id INT DEFAULT NULL, INDEX IDX_3E4AD1B3953C1C61 (source_id), INDEX IDX_3E4AD1B3158E0B66 (target_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE language (id INT AUTO_INCREMENT NOT NULL, code VARCHAR(4) NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE statistics (id INT AUTO_INCREMENT NOT NULL, translation_id INT NOT NULL, translations_from_word_list INT NOT NULL, UNIQUE INDEX UNIQ_E2D38B229CAA2B25 (translation_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE translation (id INT AUTO_INCREMENT NOT NULL, direction_id INT DEFAULT NULL, original VARCHAR(255) NOT NULL, translation TINYTEXT DEFAULT NULL, INDEX IDX_B469456FAF73D997 (direction_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE direction ADD CONSTRAINT FK_3E4AD1B3953C1C61 FOREIGN KEY (source_id) REFERENCES language (id)');
        $this->addSql('ALTER TABLE direction ADD CONSTRAINT FK_3E4AD1B3158E0B66 FOREIGN KEY (target_id) REFERENCES language (id)');
        $this->addSql('ALTER TABLE statistics ADD CONSTRAINT FK_E2D38B229CAA2B25 FOREIGN KEY (translation_id) REFERENCES translation (id)');
        $this->addSql('ALTER TABLE translation ADD CONSTRAINT FK_B469456FAF73D997 FOREIGN KEY (direction_id) REFERENCES direction (id)');
    }

    public function postUp(Schema $schema): void
    {
        parent::postUp($schema); // TODO: Change the autogenerated stub

        $languages = [
            ['en', 'English'],
            ['uk', 'Ukrainian'],
            ['de', 'German'],
            ['ru', 'Russian'],
        ];

        foreach ($languages as $language) {
            $this->connection->executeQuery('INSERT INTO language (code, name) VALUES (?, ?)', $language);
        }
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE direction DROP FOREIGN KEY FK_3E4AD1B3953C1C61');
        $this->addSql('ALTER TABLE direction DROP FOREIGN KEY FK_3E4AD1B3158E0B66');
        $this->addSql('ALTER TABLE statistics DROP FOREIGN KEY FK_E2D38B229CAA2B25');
        $this->addSql('ALTER TABLE translation DROP FOREIGN KEY FK_B469456FAF73D997');
        $this->addSql('DROP TABLE direction');
        $this->addSql('DROP TABLE language');
        $this->addSql('DROP TABLE statistics');
        $this->addSql('DROP TABLE translation');
    }
}
