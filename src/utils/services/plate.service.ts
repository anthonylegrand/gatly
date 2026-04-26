import { NewPlate, Plate } from "@/../db/schema";
import { plateRepository } from "../repositorys/plate.repository";

export const plateService = {
  getAll: (): Promise<Plate[]> => plateRepository.findAll(),

  getByParking: (parkingId: string): Promise<Plate[]> =>
    plateRepository.findByParkingId(parkingId),

  add: async (data: NewPlate): Promise<Plate> => {
    const [plate] = await plateRepository.create(data);
    return plate;
  },

  update: async (id: string, data: Partial<NewPlate>): Promise<Plate> => {
    const [plate] = await plateRepository.update(id, data);
    return plate;
  },

  remove: (id: string) => plateRepository.remove(id),
};
