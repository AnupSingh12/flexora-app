import { createContext, useContext, useState, useEffect } from "react";

const GlobalCounterContext = createContext();

const API_URL = import.meta.env.VITE_API_URL;

export function GlobalCounterProvider({ children }) {
  const [reloadCount, setReloadCount] = useState(0);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);

  function triggerReload() {
    setReloadCount((prev) => prev + 1);
  }

  useEffect(() => {
    async function fetchUserData() {
      try {
        const res = await fetch(`${API_URL}/api/wishlist-products`, {
          method: "POST",
          credentials: "include",
        });
        const rawdata = await res.json();
        const data = rawdata.data;
        setWishlist(data.items || []);
      } catch (error) {
        console.log("Failed to get wishlist data");
      }

      try {
        const res = await fetch(`${API_URL}/api/cart-products`, {
          method: "POST",
          credentials: "include",
        });
        const rawdata = await res.json();
        const data = rawdata.data;
        setCart(data.items || []);
      } catch (error) {
        console.log("Failed tol get cart data");
      }
    }

    fetchUserData();
  }, [reloadCount]);

  return (
    <GlobalCounterContext.Provider
      value={{
        reloadCount,
        triggerReload,
        wishlist,
        cart,
      }}
    >
      {children}
    </GlobalCounterContext.Provider>
  );
}

export function useGlobalCounter() {
  return useContext(GlobalCounterContext);
}
