import { MigrationInterface, QueryRunner } from 'typeorm';

export class EditingRoles1745810704238 implements MigrationInterface {
  name = 'EditingRoles1745810704238';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."user_role" RENAME TO "user_role_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_role" AS ENUM('USER', 'EMPLOYEE', 'ADMIN')`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "role" TYPE "public"."user_role" USING "role"::"text"::"public"."user_role"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'USER'`,
    );
    await queryRunner.query(`DROP TYPE "public"."user_role_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."user_role_old" AS ENUM('USER')`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "role" TYPE "public"."user_role_old" USING "role"::"text"::"public"."user_role_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'USER'`,
    );
    await queryRunner.query(`DROP TYPE "public"."user_role"`);
    await queryRunner.query(
      `ALTER TYPE "public"."user_role_old" RENAME TO "user_role"`,
    );
  }
}
