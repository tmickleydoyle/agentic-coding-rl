import React, { createContext, useContext, useState, ReactNode } from "react";
import { Asset, Beneficiary } from "../lib/types";
import { getState, addAsset, deleteAsset, addBeneficiary, deleteBeneficiary, saveNotes } from "../lib/store";

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

const AppContext = createContext<AppContextType | null>(null);

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppStateProvider");
  return ctx;
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const initial = getState();
  const [route, setRoute] = useState("/");
  const [assets, setAssets] = useState<Asset[]>(initial.assets);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(initial.beneficiaries);
  const [notes, setNotes] = useState(initial.notes);

  const handleAddAsset = (a: Omit<Asset, "id">) => {
    const newA = addAsset(a);
    setAssets((prev) => [...prev, newA]);
  };

  const handleDeleteAsset = (id: string) => {
    deleteAsset(id);
    setAssets((prev) => prev.filter((a) => a.id !== id));
  };

  const handleAddBeneficiary = (b: Omit<Beneficiary, "id">) => {
    const newB = addBeneficiary(b);
    setBeneficiaries((prev) => [...prev, newB]);
  };

  const handleDeleteBeneficiary = (id: string) => {
    deleteBeneficiary(id);
    setBeneficiaries((prev) => prev.filter((x) => x.id !== id));
  };

  const handleSaveNotes = (n: string) => {
    saveNotes(n);
    setNotes(n);
  };

  return (
    <AppContext.Provider
      value={{
        route,
        navigate: setRoute,
        assets,
        beneficiaries,
        notes,
        addAsset: handleAddAsset,
        deleteAsset: handleDeleteAsset,
        addBeneficiary: handleAddBeneficiary,
        deleteBeneficiary: handleDeleteBeneficiary,
        saveNotes: handleSaveNotes,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
