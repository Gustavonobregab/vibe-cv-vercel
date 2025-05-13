import { sql } from "drizzle-orm";
import { smallint } from "drizzle-orm/mysql-core";
import {
  text,
  timestamp,
  pgTable,
  boolean,
  varchar,
  pgEnum,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  googleId: varchar("google_id", { length: 255 }).unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  picture: text("picture"),
  isActive: boolean("is_active").notNull().default(true),
  jobTitle: varchar("job_title", { length: 255 }),
  role: varchar("role", { length: 50 }).notNull().default("user"),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),
});
