"use client";

import { useEffect, useState, useRef } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CoinBox from "./components/CoinBox";
import LoadingSpinner from "./components/LoadingSnipper";

export default function HomePage() {
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState("");
  const symbolsOrder = useRef([]);
  const pricesRef = useRef({}); // coin fiyatlarını burada tutuyoruz

  useEffect(() => {
    const ws = new WebSocket("wss://stream.binance.com:9443/ws/!ticker@arr");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (symbolsOrder.current.length === 0) {
        symbolsOrder.current = data.map((item) => item.s);
        data.forEach((item) => {
          pricesRef.current[item.s] =
            item.c !== "0" && item.c !== "" ? item.c : null;
        });
      }

      const updatedPrices = {};
      data.forEach((item) => {
        if (item.c && item.c !== "0") {
          updatedPrices[item.s] = item.c;
        } else if (pricesRef.current[item.s]) {
          // Fiyat 0 veya boşsa önceki fiyatı koru
          updatedPrices[item.s] = pricesRef.current[item.s];
        }
      });

      const updatedCoins = symbolsOrder.current.map((symbol) => {
        const prevPrice = pricesRef.current[symbol] || null;
        const newPrice = updatedPrices[symbol] || prevPrice || "0";
        pricesRef.current[symbol] = newPrice;

        return { symbol, price: newPrice, prevPrice };
      });

      setCoins(updatedCoins);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
  }, []);

  const filteredCoins = coins.filter((coin) =>
    coin.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const isLoading = coins.length === 0;

  return (
    <>
      <Navbar />
      <main className="flex-grow px-6 py-10 bg-black min-h-screen">
        <h2 className="text-2xl text-gray-200 mb-6 text-center">
          Binance Coin Çiftleri (Canlı)
        </h2>

        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="Coin ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-xs px-4 py-2 rounded bg-gray-800 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {isLoading ? <LoadingSpinner /> : <CoinBox coins={filteredCoins} />}
      </main>
      <Footer />
    </>
  );
}
