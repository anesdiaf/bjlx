import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins"
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from "@/src";
import * as schema from "@/src/db/auth-schema"
import { nextCookies } from "better-auth/next-js";


export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", // or "pg" or "mysql"
        schema
    }), 
    emailAndPassword: {
        enabled: true
    },
    plugins: [
        admin(),
        nextCookies()
    ]
});