import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ShopContext = createContext(null);

/**
 * Local-only buyer state: the inquiry list (Med-Mart's equivalent of a cart —
 * buyers request quotes rather than checking out) and saved items. Backed by
 * component state for now; swaps to the API once those endpoints exist.
 */
export function ShopProvider({ children }) {
  const [inquiry, setInquiry] = useState([]);
  const [saved, setSaved] = useState([]);

  const addToInquiry = useCallback((product) => {
    setInquiry((list) =>
      list.some((p) => p.id === product.id) ? list : [...list, product]
    );
  }, []);

  const toggleSaved = useCallback((product) => {
    setSaved((list) =>
      list.some((p) => p.id === product.id)
        ? list.filter((p) => p.id !== product.id)
        : [...list, product]
    );
  }, []);

  const isSaved = useCallback((id) => saved.some((p) => p.id === id), [saved]);
  const inInquiry = useCallback((id) => inquiry.some((p) => p.id === id), [inquiry]);

  const value = useMemo(
    () => ({
      inquiry,
      saved,
      inquiryCount: inquiry.length,
      savedCount: saved.length,
      addToInquiry,
      toggleSaved,
      isSaved,
      inInquiry,
    }),
    [inquiry, saved, addToInquiry, toggleSaved, isSaved, inInquiry]
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used inside <ShopProvider>");
  return ctx;
}
