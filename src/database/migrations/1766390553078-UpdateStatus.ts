import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateStatus1766390553078 implements MigrationInterface {
    name = 'UpdateStatus1766390553078'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`status\` \`status\` varchar(255) NOT NULL DEFAULT 'active'`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`role\` \`role\` varchar(255) NOT NULL DEFAULT 'user'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`role\` \`role\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`status\` \`status\` varchar(255) NOT NULL`);
    }

}
