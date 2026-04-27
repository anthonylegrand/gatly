import { NewParking, Parking } from "@/../db/schema";
import { parkingRepository, ParkingWithCount } from "../repositorys/parking.repository";

export type { ParkingWithCount };

export const parkingService = {
  getAll: (): Promise<ParkingWithCount[]> => parkingRepository.findAll(),

  getById: (id: string): Promise<Parking[]> => parkingRepository.findById(id),

  create: async (data: NewParking): Promise<Parking> => {
    const [parking] = await parkingRepository.create(data);
    return parking;
  },

  update: async (id: string, data: Partial<NewParking>): Promise<Parking> => {
    const [plate] = await parkingRepository.update(id, data);
    return plate;
  },

  remove: (id: string) => parkingRepository.remove(id),
};
