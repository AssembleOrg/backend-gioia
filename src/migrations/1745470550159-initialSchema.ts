import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1745470550159 implements MigrationInterface {
  name = 'InitialSchema1745470550159';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "product" ("id" SERIAL NOT NULL, "name" character varying(120) NOT NULL, "sku" character varying(120) NOT NULL, "category" text array NOT NULL, "description" text NOT NULL, "presentation" character varying(120) NOT NULL, "aplication" character varying(90) NOT NULL, "imageUrl" character varying(200), "wholeSaler" character varying(100) NOT NULL, "stock" integer NOT NULL, "isVisible" boolean NOT NULL DEFAULT true, "price" numeric(15,2) NOT NULL, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_role" AS ENUM('ADMIN', 'EMPLOYEE', 'USER')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL, "email" character varying(120) NOT NULL, "fullName" character varying(120) NOT NULL, "role" "public"."user_role" NOT NULL DEFAULT 'USER', CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user_role"`);
    await queryRunner.query(`DROP TABLE "product"`);
  }
}
