import { eq } from "drizzle-orm";

import { db } from "@/../db/client";
import { NewPlate, plates } from "@/../db/schema";

export const plateRepository = {
  findAll: () => db.select().from(plates),

  findByParkingId: (parkingId: string) =>
    db.select().from(plates).where(eq(plates.parkingId, parkingId)),

  create: (data: NewPlate) => db.insert(plates).values(data).returning(),

  update: (id: string, data: Partial<NewPlate>) =>
    db.update(plates).set(data).where(eq(plates.id, id)).returning(),

  remove: (id: string) => db.delete(plates).where(eq(plates.id, id)),
};
