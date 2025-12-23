import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1766384780217 implements MigrationInterface {
    name = 'Init1766384780217'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`refresh_tokens\` (\`id\` int NOT NULL AUTO_INCREMENT, \`token\` varchar(255) NOT NULL, \`revoked\` tinyint NOT NULL DEFAULT 0, \`expired_at\` datetime NOT NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`review\` (\`id\` int NOT NULL AUTO_INCREMENT, \`rating\` varchar(255) NOT NULL, \`comment\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`userId\` int NULL, \`productId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`category\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`parent_id\` int NULL, UNIQUE INDEX \`IDX_23c05c292c439d77b0de816b50\` (\`name\`), UNIQUE INDEX \`REL_1117b4fcb3cd4abb4383e1c274\` (\`parent_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`product_category\` (\`id\` int NOT NULL AUTO_INCREMENT, \`productId\` int NULL, \`categoryId\` int NULL, INDEX \`IDX_7e60cbb6e911363b5ff8ed28e8\` (\`productId\`, \`categoryId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`product\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`price\` int NOT NULL, \`stock\` int NOT NULL, \`status\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`order_item\` (\`id\` int NOT NULL AUTO_INCREMENT, \`quantity\` int NOT NULL, \`priceSnapshot\` int NOT NULL, \`orderId\` int NULL, \`productId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`order\` (\`id\` int NOT NULL AUTO_INCREMENT, \`status\` varchar(255) NOT NULL, \`total_amout\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`userId\` int NULL, INDEX \`IDX_bf50d4fdb33d6ffd352a8f89a1\` (\`userId\`, \`status\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`status\` varchar(255) NOT NULL, \`role\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`refresh_tokens\` ADD CONSTRAINT \`FK_610102b60fea1455310ccd299de\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`review\` ADD CONSTRAINT \`FK_1337f93918c70837d3cea105d39\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`review\` ADD CONSTRAINT \`FK_2a11d3c0ea1b2b5b1790f762b9a\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`category\` ADD CONSTRAINT \`FK_1117b4fcb3cd4abb4383e1c2743\` FOREIGN KEY (\`parent_id\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product_category\` ADD CONSTRAINT \`FK_930110e92aed1778939fdbdb302\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product_category\` ADD CONSTRAINT \`FK_559e1bc4d01ef1e56d75117ab9c\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_item\` ADD CONSTRAINT \`FK_646bf9ece6f45dbe41c203e06e0\` FOREIGN KEY (\`orderId\`) REFERENCES \`order\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_item\` ADD CONSTRAINT \`FK_904370c093ceea4369659a3c810\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_caabe91507b3379c7ba73637b84\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_caabe91507b3379c7ba73637b84\``);
        await queryRunner.query(`ALTER TABLE \`order_item\` DROP FOREIGN KEY \`FK_904370c093ceea4369659a3c810\``);
        await queryRunner.query(`ALTER TABLE \`order_item\` DROP FOREIGN KEY \`FK_646bf9ece6f45dbe41c203e06e0\``);
        await queryRunner.query(`ALTER TABLE \`product_category\` DROP FOREIGN KEY \`FK_559e1bc4d01ef1e56d75117ab9c\``);
        await queryRunner.query(`ALTER TABLE \`product_category\` DROP FOREIGN KEY \`FK_930110e92aed1778939fdbdb302\``);
        await queryRunner.query(`ALTER TABLE \`category\` DROP FOREIGN KEY \`FK_1117b4fcb3cd4abb4383e1c2743\``);
        await queryRunner.query(`ALTER TABLE \`review\` DROP FOREIGN KEY \`FK_2a11d3c0ea1b2b5b1790f762b9a\``);
        await queryRunner.query(`ALTER TABLE \`review\` DROP FOREIGN KEY \`FK_1337f93918c70837d3cea105d39\``);
        await queryRunner.query(`ALTER TABLE \`refresh_tokens\` DROP FOREIGN KEY \`FK_610102b60fea1455310ccd299de\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_bf50d4fdb33d6ffd352a8f89a1\` ON \`order\``);
        await queryRunner.query(`DROP TABLE \`order\``);
        await queryRunner.query(`DROP TABLE \`order_item\``);
        await queryRunner.query(`DROP TABLE \`product\``);
        await queryRunner.query(`DROP INDEX \`IDX_7e60cbb6e911363b5ff8ed28e8\` ON \`product_category\``);
        await queryRunner.query(`DROP TABLE \`product_category\``);
        await queryRunner.query(`DROP INDEX \`REL_1117b4fcb3cd4abb4383e1c274\` ON \`category\``);
        await queryRunner.query(`DROP INDEX \`IDX_23c05c292c439d77b0de816b50\` ON \`category\``);
        await queryRunner.query(`DROP TABLE \`category\``);
        await queryRunner.query(`DROP TABLE \`review\``);
        await queryRunner.query(`DROP TABLE \`refresh_tokens\``);
    }

}
