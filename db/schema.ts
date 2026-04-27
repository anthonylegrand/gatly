import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";

import { PLATE_COUNTRIES } from "@/constants/plate.constant";

export const parkings = sqliteTable("parkings", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  createdAt: integer("created_at")
    .notNull()
    .$defaultFn(() => Date.now()),
});
export type Parking = typeof parkings.$inferSelect;
export type NewParking = typeof parkings.$inferInsert;

export const plates = sqliteTable("plates", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  plate: text("plate").notNull(),
  customName: text("custom_name"),
  country: text("country", {
    enum: PLATE_COUNTRIES as [string, ...string[]],
  }).notNull(),
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
export type Plate = typeof plates.$inferSelect;
export type NewPlate = typeof plates.$inferInsert;
