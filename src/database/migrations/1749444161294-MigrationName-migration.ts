import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1749444161294 implements MigrationInterface {


    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "addresses" RENAME state TO STATE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "addresses" RENAME STATE  TO state`);
    }

}
