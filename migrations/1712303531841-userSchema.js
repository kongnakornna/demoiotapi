"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$userSchema1712303531841 = void 0;
class $userSchema1712303531841 {
    constructor() {
        this.name = ' $userSchema1712303531841';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TYPE "public"."user_usertype_enum" AS ENUM('therapist', 'supervisor', 'supervisor', 'supervisor', 'supervisor')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userName" character varying NOT NULL, "email" character varying NOT NULL, "isActive" boolean NOT NULL, "password" character varying NOT NULL, "userType" "public"."user_usertype_enum" NOT NULL DEFAULT 'supervisor', CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_usertype_enum"`);
    }
}
exports.$userSchema1712303531841 = $userSchema1712303531841;
//# sourceMappingURL=1712303531841-userSchema.js.map