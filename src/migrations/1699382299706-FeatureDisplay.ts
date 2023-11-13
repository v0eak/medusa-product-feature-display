import { MigrationInterface, QueryRunner } from "typeorm"

export class FeatureDisplay1699382299706 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "feature_display" (
            "id" character varying NOT NULL PRIMARY KEY,
            "title" text,
            "description" text,
            "product_id" text,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            "order" INTEGER NOT NULL DEFAULT 0,
            "metadata" jsonb,
            FOREIGN KEY ("product_id") REFERENCES "product" ("id")
        )`)
        
        await queryRunner.query(`CREATE TABLE "feature_display_images" (
            "feature_display_id" character varying NOT NULL,
            "image_id" character varying NOT NULL,
            PRIMARY KEY ("feature_display_id", "image_id"),
            FOREIGN KEY ("feature_display_id") REFERENCES "feature_display" ("id") ON DELETE CASCADE,
            FOREIGN KEY ("image_id") REFERENCES "image" ("id") ON DELETE CASCADE
        )`)

        await queryRunner.query(
            "ALTER TABLE \"product\"" + 
            " ADD COLUMN \"feature_displays\" text"
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE \"feature_display\" CASCADE")
        await queryRunner.query("DROP TABLE \"feature_display_images\" CASCADE")

        await queryRunner.query(
            "ALTER TABLE \"product\" DROP COLUMN \"feature_displays\""
        )
    }
}