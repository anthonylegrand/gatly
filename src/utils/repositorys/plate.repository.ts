import { desc, eq } from "drizzle-orm";

import { db } from "@/../db/client";
import { NewPlate, plates } from "@/../db/schema";

export const plateRepository = {
  findAll: () => db.select().from(plates).orderBy(desc(plates.lastSeen)),

  findByParkingId: (parkingId: string) =>
    db
      .select()
      .from(plates)
      .where(eq(plates.parkingId, parkingId))
      .orderBy(desc(plates.lastSeen)),

  create: (data: NewPlate) => db.insert(plates).values(data).returning(),

  update: (id: string, data: Partial<NewPlate>) =>
    db.update(plates).set(data).where(eq(plates.id, id)).returning(),

  remove: (id: string) => db.delete(plates).where(eq(plates.id, id)),
};
