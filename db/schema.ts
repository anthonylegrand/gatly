import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

export const parkings = sqliteTable("parkings", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  createdAt: integer("created_at")
    .notNull()
    .$defaultFn(() => Date.now()),
});

export const plates = sqliteTable("plates", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  plate: text("plate").notNull(),
  customName: text("custom_name"),
  color: text("color"),
  isAuthorized: integer("is_authorized", { mode: "boolean" }),
  authorizedUntil: integer("authorized_until"),
  createdAt: integer("created_at")
    .notNull()
    .$defaultFn(() => Date.now()),

  parkingId: text("parking_id")
    .notNull()
    .references(() => parkings.id),
});
