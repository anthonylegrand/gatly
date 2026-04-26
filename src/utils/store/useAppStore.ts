import { create } from "zustand";

import { NewParking, NewPlate, Parking, Plate } from "@/../db/schema";
import { parkingService } from "@/utils/services/parking.service";
import { plateService } from "@/utils/services/plate.service";

type AppState = {
  parkings: Parking[];
  loadParkings: () => Promise<Parking[]>;
  createParking: (data: NewParking) => Promise<Parking>;
  removeParking: (id: string) => Promise<void>;

  plates: Plate[];
  loadPlates: () => Promise<Plate[]>;
  addPlate: (data: Omit<NewPlate, "parkingId">) => Promise<Plate>;
  updatePlate: (id: string, data: Partial<NewPlate>) => Promise<Plate>;
  removePlate: (id: string) => Promise<void>;

  selectedParking: string | null;
  setSelectedParking: (parkingId: string | null) => void;

  selectedPlate: Plate | null;
  setSelectedPlate: (plate: Plate | null) => void;
};

export const useAppStore = create<AppState>()((set, get) => ({
  parkings: [],
  loadParkings: async () => {
    const parkings = await parkingService.getAll();
    set({ parkings });
    return parkings;
  },
  createParking: async (data) => {
    const parking = await parkingService.create(data);
    const parkings = await parkingService.getAll();
    set({ parkings });
    return parking;
  },
  removeParking: async (id) => {
    await parkingService.remove(id);
    const parkings = await parkingService.getAll();
    const wasSelected = get().selectedParking === id;
    set({ parkings, ...(wasSelected && { selectedParking: null }) });
  },

  plates: [],
  loadPlates: async () => {
    const plates = await plateService.getAll();
    set({ plates });
    return plates;
  },
  addPlate: async (data) => {
    const { selectedParking } = get();
    if (!selectedParking) throw new Error("Aucun parking sélectionné");

    const plate = await plateService.add({
      ...data,
      parkingId: selectedParking,
    });
    const plates = await plateService.getAll();
    set({ plates });
    return plate;
  },
  updatePlate: async (id, data) => {
    const plate = await plateService.update(id, data);
    const plates = await plateService.getAll();
    set({ plates });
    return plate;
  },
  removePlate: async (id) => {
    await plateService.remove(id);
    const plates = await plateService.getAll();
    const wasSelected = get().selectedPlate?.id === id;
    set({ plates, ...(wasSelected && { selectedPlate: null }) });
  },

  selectedParking: null,
  setSelectedParking: (parkingId) => set({ selectedParking: parkingId }),

  selectedPlate: null,
  setSelectedPlate: (plate) => set({ selectedPlate: plate }),
}));
