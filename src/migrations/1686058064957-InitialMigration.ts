import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1686058064957 implements MigrationInterface {
    name = 'InitialMigration1686058064957'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "artist_album" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "image" varchar NOT NULL, "artistId" integer)`);
        await queryRunner.query(`CREATE TABLE "artist" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "player" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "username" varchar NOT NULL, "score" integer NOT NULL, CONSTRAINT "UQ_331aaf0d7a5a45f9c74cc699ea8" UNIQUE ("username"))`);
        await queryRunner.query(`CREATE TABLE "game" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "score" integer, "step" integer NOT NULL DEFAULT (1), "usedAlbums" text NOT NULL, "is_finished" boolean NOT NULL DEFAULT (0), "artistId" integer, "playerId" integer)`);
        await queryRunner.query(`CREATE TABLE "temporary_artist_album" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "image" varchar NOT NULL, "artistId" integer, CONSTRAINT "FK_4f0b19ec885c73c16d2d53efc14" FOREIGN KEY ("artistId") REFERENCES "artist" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_artist_album"("id", "name", "image", "artistId") SELECT "id", "name", "image", "artistId" FROM "artist_album"`);
        await queryRunner.query(`DROP TABLE "artist_album"`);
        await queryRunner.query(`ALTER TABLE "temporary_artist_album" RENAME TO "artist_album"`);
        await queryRunner.query(`CREATE TABLE "temporary_game" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "score" integer, "step" integer NOT NULL DEFAULT (1), "usedAlbums" text NOT NULL, "is_finished" boolean NOT NULL DEFAULT (0), "artistId" integer, "playerId" integer, CONSTRAINT "FK_ad600d707ab83b475ff44303e6d" FOREIGN KEY ("artistId") REFERENCES "artist" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_d5ca205249b208d25dcc5f6355e" FOREIGN KEY ("playerId") REFERENCES "player" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_game"("id", "score", "step", "usedAlbums", "is_finished", "artistId", "playerId") SELECT "id", "score", "step", "usedAlbums", "is_finished", "artistId", "playerId" FROM "game"`);
        await queryRunner.query(`DROP TABLE "game"`);
        await queryRunner.query(`ALTER TABLE "temporary_game" RENAME TO "game"`);
        await queryRunner.query(`CREATE TABLE "query-result-cache" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "identifier" varchar, "time" bigint NOT NULL, "duration" integer NOT NULL, "query" text NOT NULL, "result" text NOT NULL)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "query-result-cache"`);
        await queryRunner.query(`ALTER TABLE "game" RENAME TO "temporary_game"`);
        await queryRunner.query(`CREATE TABLE "game" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "score" integer, "step" integer NOT NULL DEFAULT (1), "usedAlbums" text NOT NULL, "is_finished" boolean NOT NULL DEFAULT (0), "artistId" integer, "playerId" integer)`);
        await queryRunner.query(`INSERT INTO "game"("id", "score", "step", "usedAlbums", "is_finished", "artistId", "playerId") SELECT "id", "score", "step", "usedAlbums", "is_finished", "artistId", "playerId" FROM "temporary_game"`);
        await queryRunner.query(`DROP TABLE "temporary_game"`);
        await queryRunner.query(`ALTER TABLE "artist_album" RENAME TO "temporary_artist_album"`);
        await queryRunner.query(`CREATE TABLE "artist_album" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "image" varchar NOT NULL, "artistId" integer)`);
        await queryRunner.query(`INSERT INTO "artist_album"("id", "name", "image", "artistId") SELECT "id", "name", "image", "artistId" FROM "temporary_artist_album"`);
        await queryRunner.query(`DROP TABLE "temporary_artist_album"`);
        await queryRunner.query(`DROP TABLE "game"`);
        await queryRunner.query(`DROP TABLE "player"`);
        await queryRunner.query(`DROP TABLE "artist"`);
        await queryRunner.query(`DROP TABLE "artist_album"`);
    }

}
