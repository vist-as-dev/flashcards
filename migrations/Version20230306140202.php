<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use App\Provider\LanguageProvider;
use Doctrine\DBAL\Connection;
use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;
use Psr\Log\LoggerInterface;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230306140202 extends AbstractMigration
{
    protected LanguageProvider $lp;

    public function __construct(Connection $connection, LoggerInterface $logger, LanguageProvider $lp)
    {
        $this->lp = $lp;

        parent::__construct($connection, $logger);
    }

    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE language (id INT AUTO_INCREMENT NOT NULL, code VARCHAR(4) NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');

        foreach ($this->lp->getMap() as $source) {
            foreach ($this->lp->getMap() as $target) {
                if ($source !== $target) {
                    $this->addSql(
                        'CREATE TABLE translation_' . strtolower($source[1]) . '_to_' . strtolower($target[1]) . ' (
                                id INT AUTO_INCREMENT NOT NULL, 
                                original VARCHAR(255) NOT NULL, 
                                translation TEXT DEFAULT NULL, 
                                counter INT DEFAULT 0 NOT NULL,
                                PRIMARY KEY(id)
                            ) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB'
                    );
                }
            }
        }
    }

    public function down(Schema $schema): void
    {
        foreach ($this->lp->getMap() as $source) {
            foreach ($this->lp->getMap() as $target) {
                if ($source !== $target) {
                    $this->addSql(
                        'DROP TABLE translation_' . $source[1] . '_to_' . $target[1]);
                }
            }
        }
    }
}
