import { NewParking, Parking } from "@/../db/schema";
import { parkingRepository } from "../repositorys/parking.repository";

export const parkingService = {
  getAll: (): Promise<Parking[]> => parkingRepository.findAll(),

  getById: (id: string): Promise<Parking[]> =>
    parkingRepository.findById(id),

  create: async (data: NewParking): Promise<Parking> => {
    const [parking] = await parkingRepository.create(data);
    return parking;
  },

  remove: (id: string) => parkingRepository.remove(id),
};
