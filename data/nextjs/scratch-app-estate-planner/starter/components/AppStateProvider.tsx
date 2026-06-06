import React, { createContext, useContext, useState, ReactNode } from "react";
import { Asset, Beneficiary } from "../lib/types";

interface AppContextType {
  route: string;
  navigate: (r: string) => void;
  assets: Asset[];
  beneficiaries: Beneficiary[];
  notes: string;
  addAsset: (a: Omit<Asset, "id">) => void;
  deleteAsset: (id: string) => void;
  addBeneficiary: (b: Omit<Beneficiary, "id">) => void;
  deleteBeneficiary: (id: string) => void;
  saveNotes: (n: string) => void;
}

const AppContext = createContext<AppContextType>({
  route: "/",
  navigate: () => {},
  assets: [],
  beneficiaries: [],
  notes: "",
  addAsset: () => {},
  deleteAsset: () => {},
  addBeneficiary: () => {},
  deleteBeneficiary: () => {},
  saveNotes: () => {},
});

export function useApp(): AppContextType {
  return useContext(AppContext);
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState("/");
  return (
    <AppContext.Provider value={{
      route,
      navigate: setRoute,
      assets: [],
      beneficiaries: [],
      notes: "",
      addAsset: () => {},
      deleteAsset: () => {},
      addBeneficiary: () => {},
      deleteBeneficiary: () => {},
      saveNotes: () => {},
    }}>
      {children}
    </AppContext.Provider>
  );
}
