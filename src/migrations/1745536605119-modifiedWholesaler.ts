import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifiedWholesaler1745536605119 implements MigrationInterface {
  name = 'ModifiedWholesaler1745536605119';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product" ALTER COLUMN "wholeSaler" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product" ALTER COLUMN "wholeSaler" SET NOT NULL`,
    );
  }
}
