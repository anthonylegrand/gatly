import { create } from "zustand";

import { NewParking, NewPlate, Parking, Plate } from "@/../db/schema";
import { PlateDetectionResult } from "@/libs/plate-reader.lib";
import {
  parkingService,
  ParkingWithCount,
} from "@/utils/services/parking.service";
import { plateService } from "@/utils/services/plate.service";

type AppState = {
  parkings: ParkingWithCount[];
  loadParkings: () => Promise<ParkingWithCount[]>;
  getParking: (id: string) => Promise<Parking | null>;
  createParking: (data: Omit<NewParking, "id">) => Promise<Parking>;
  updateParking: (id: string, data: Partial<NewParking>) => Promise<Parking>;
  removeParking: (id: string) => Promise<void>;

  plates: Plate[];
  loadPlates: () => Promise<Plate[]>;
  getPlate: (idOrPlate: string) => Promise<Plate | null>;
  addPlate: (data: Omit<NewPlate, "parkingId">) => Promise<Plate>;
  updatePlate: (id: string, data: Partial<NewPlate>) => Promise<Plate>;
  removePlate: (id: string) => Promise<void>;

  selectedParking: Parking | null;
  setSelectedParking: (parking: Parking | null) => void;

  selectedPlate: Plate | PlateDetectionResult | null;
  setSelectedPlate: (plate: Plate | PlateDetectionResult | null) => void;
};

export const useAppStore = create<AppState>()((set, get) => ({
  parkings: [],
  loadParkings: async () => {
    const parkings = await parkingService.getAll();
    set({ parkings });
    return parkings;
  },
  getParking: async (id) => {
    let { parkings } = get();
    if (parkings.length === 0) parkings = await get().loadParkings();
    const parking = parkings.find((p) => p.id === id);
    set({ selectedParking: parking });
    return parking || null;
  },
  createParking: async (data) => {
    const parking = await parkingService.create(data);
    const parkings = await parkingService.getAll();
    set({ parkings, selectedParking: parking });
    return parking;
  },
  updateParking: async (id, data) => {
    const parking = await parkingService.update(id, data);
    const parkings = await parkingService.getAll();
    set({ parkings });
    return parking;
  },
  removeParking: async (id) => {
    await parkingService.remove(id);
    const parkings = await parkingService.getAll();
    const wasSelected = get().selectedParking?.id === id;
    set({ parkings, ...(wasSelected && { selectedParking: null }) });
  },

  plates: [],
  loadPlates: async () => {
    const { selectedParking } = get();
    if (!selectedParking) throw new Error("Aucun parking sélectionné");

    const plates = await plateService.getByParking(selectedParking.id);
    set({ plates });
    return plates;
  },
  getPlate: async (idOrPlate) => {
    let { plates } = get();
    if (plates.length === 0) plates = await get().loadPlates();
    const plate = plates.find(
      (p) => p.id === idOrPlate || p.plate === idOrPlate,
    );
    set({ selectedPlate: plate });
    return plate || null;
  },
  addPlate: async (data) => {
    const { selectedParking } = get();
    if (!selectedParking) throw new Error("Aucun parking sélectionné");

    const plate = await plateService.add({
      ...data,
      parkingId: selectedParking.id,
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

    const plate = get().selectedPlate;
    const wasSelected = plate && "id" in plate && plate.id === id;
    set({ plates, ...(wasSelected && { selectedPlate: null }) });
  },

  selectedParking: null,
  setSelectedParking: (parking) => set({ selectedParking: parking }),

  selectedPlate: null,
  setSelectedPlate: (plate) => set({ selectedPlate: plate }),
}));
