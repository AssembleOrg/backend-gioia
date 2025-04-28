import { MigrationInterface, QueryRunner } from 'typeorm';

export class AdminSettings1745865153361 implements MigrationInterface {
  name = 'AdminSettings1745865153361';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "admin_settings" ("id" SERIAL NOT NULL, "minimumOrderAmount" numeric(30,2) NOT NULL DEFAULT '400000', "sellerEmail" character varying(120) NOT NULL DEFAULT 'ventas@kansaco.com', "infoEmail" character varying(120) NOT NULL DEFAULT 'info@kansaco.com', CONSTRAINT "UQ_4e4f4ef8cfd1b0be4d72418a8cd" UNIQUE ("sellerEmail"), CONSTRAINT "UQ_e356f644cfaf474ce3f047d19d4" UNIQUE ("infoEmail"), CONSTRAINT "PK_8eeabc518a2e33306f19fa557cc" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "admin_settings"`);
  }
}
