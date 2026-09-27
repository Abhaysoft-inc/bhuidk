"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";
import {
  INDIAN_STATES_CATALOG,
  DistrictCatalogItem,
  StateCatalogItem,
  LiveDistrictBoundary,
  getDistrictCatalogItem,
  getStateCatalogItem,
} from "@/components/simulator/india-districts-catalog";

interface TerritoryContextType {
  selectedStateId: string;
  selectedDistrictId: string | null;
  districtBoundary: LiveDistrictBoundary | null;
  isLoadingBoundary: boolean;
  selectedDistrictMetadata: DistrictCatalogItem | null;
  availableDistricts: DistrictCatalogItem[];
  handleStateChange: (stateId: string) => void;
  handleDistrictChange: (districtId: string) => void;
  handleClearTerritory: () => void;
  statesCatalog: StateCatalogItem[];
}

const TerritoryContext = createContext<TerritoryContextType | undefined>(undefined);

export function TerritoryProvider({ children }: { children: ReactNode }) {
  const [selectedStateId, setSelectedStateId] = useState<string>("all");
  const [selectedDistrictId, setSelectedDistrictId] = useState<string | null>(null);
  const [districtBoundary, setDistrictBoundary] = useState<LiveDistrictBoundary | null>(null);
  const [isLoadingBoundary, setIsLoadingBoundary] = useState(false);

  // Available districts for selected state
  const availableDistricts = useMemo(() => {
    if (selectedStateId === "all") return [];
    const stateObj = getStateCatalogItem(selectedStateId);
    return stateObj ? stateObj.districts : [];
  }, [selectedStateId]);

  // Selected district metadata
  const selectedDistrictMetadata = useMemo(() => {
    if (!selectedDistrictId) return null;
    return getDistrictCatalogItem(selectedDistrictId);
  }, [selectedDistrictId]);

  // Fetch live district boundary from API when selectedDistrictId changes
  useEffect(() => {
    if (!selectedDistrictId || selectedStateId === "all") {
      setDistrictBoundary(null);
      return;
    }

    const meta = getDistrictCatalogItem(selectedDistrictId);
    if (!meta) return;

    let isMounted = true;
    setIsLoadingBoundary(true);

    fetch(
      `/api/gis/district-boundary?district=${encodeURIComponent(
        meta.name
      )}&state=${encodeURIComponent(meta.state_name)}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Boundary fetch failed");
        return res.json();
      })
      .then((data: LiveDistrictBoundary) => {
        if (isMounted) {
          setDistrictBoundary(data);
          setIsLoadingBoundary(false);
        }
      })
      .catch((err) => {
        console.error("Error loading district boundary:", err);
        if (isMounted) {
          setIsLoadingBoundary(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedDistrictId, selectedStateId]);

  const handleStateChange = (stateId: string) => {
    setSelectedStateId(stateId);
    if (stateId === "all") {
      setSelectedDistrictId(null);
      setDistrictBoundary(null);
    } else {
      const stateObj = getStateCatalogItem(stateId);
      if (stateObj && stateObj.districts.length > 0) {
        setSelectedDistrictId(stateObj.districts[0].id);
      } else {
        setSelectedDistrictId(null);
      }
    }
  };

  const handleDistrictChange = (districtId: string) => {
    setSelectedDistrictId(districtId || null);
  };

  const handleClearTerritory = () => {
    setSelectedStateId("all");
    setSelectedDistrictId(null);
    setDistrictBoundary(null);
  };

  return (
    <TerritoryContext.Provider
      value={{
        selectedStateId,
        selectedDistrictId,
        districtBoundary,
        isLoadingBoundary,
        selectedDistrictMetadata,
        availableDistricts,
        handleStateChange,
        handleDistrictChange,
        handleClearTerritory,
        statesCatalog: INDIAN_STATES_CATALOG,
      }}
    >
      {children}
    </TerritoryContext.Provider>
  );
}

export function useTerritory() {
  const context = useContext(TerritoryContext);
  if (!context) {
    throw new Error("useTerritory must be used within a TerritoryProvider");
  }
  return context;
}
