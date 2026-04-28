import { count, desc, eq, getTableColumns } from "drizzle-orm";

import { db } from "@/../db/client";
import { NewParking, Parking, parkings, plates } from "@/../db/schema";

export type ParkingWithCount = Parking & { plateCount: number };

export const parkingRepository = {
  findAll: () =>
    db
      .select({ ...getTableColumns(parkings), plateCount: count(plates.id) })
      .from(parkings)
      .orderBy(desc(parkings.lastUsed))
      .leftJoin(plates, eq(plates.parkingId, parkings.id))
      .groupBy(parkings.id) as Promise<ParkingWithCount[]>,

  findById: (id: string) =>
    db.select().from(parkings).where(eq(parkings.id, id)),

  create: (data: NewParking) => db.insert(parkings).values(data).returning(),

  update: (id: string, data: Partial<NewParking>) =>
    db.update(parkings).set(data).where(eq(parkings.id, id)).returning(),

  remove: (id: string) => db.delete(parkings).where(eq(parkings.id, id)),
};
