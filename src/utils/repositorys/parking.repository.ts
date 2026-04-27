import { eq } from "drizzle-orm";

import { db } from "@/../db/client";
import { NewParking, parkings } from "@/../db/schema";

export const parkingRepository = {
  findAll: () => db.select().from(parkings),

  findById: (id: string) =>
    db.select().from(parkings).where(eq(parkings.id, id)),

  create: (data: NewParking) => db.insert(parkings).values(data).returning(),

  update: (id: string, data: Partial<NewParking>) =>
    db.update(parkings).set(data).where(eq(parkings.id, id)).returning(),

  remove: (id: string) => db.delete(parkings).where(eq(parkings.id, id)),
};
