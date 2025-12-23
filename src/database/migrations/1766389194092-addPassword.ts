import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPassword1766389194092 implements MigrationInterface {
    name = 'AddPassword1766389194092'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`password\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`password\``);
    }

}
