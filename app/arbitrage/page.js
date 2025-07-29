"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ArbitrageCalculator from "./components/ArbitrageCalculator";

export default function ArbitragePage() {
  const [prices, setPrices] = useState({});
  const [symbols, setSymbols] = useState([]);
  const [calculators, setCalculators] = useState([0]); // ID listesi
  const pricesRef = useRef({});

  useEffect(() => {
    const fetchSymbols = async () => {
      try {
        const res = await fetch("https://api.binance.com/api/v3/ticker/price");
        const data = await res.json();

        const usdtSymbols = data
          .map((item) => item.symbol)
          .filter((sym) => sym.endsWith("USDT"))
          .map((sym) => sym.replace("USDT", ""));

        setSymbols(usdtSymbols);
      } catch (err) {
        console.error("Fetch symbols error:", err);
      }
    };

    fetchSymbols();
  }, []);

  useEffect(() => {
    const ws = new WebSocket("wss://stream.binance.com:9443/ws/!ticker@arr");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const updatedPrices = { ...pricesRef.current };

      data.forEach((item) => {
        if (item.c && item.c !== "0") {
          updatedPrices[item.s] = item.c;
        }
      });

      pricesRef.current = updatedPrices;
      setPrices(updatedPrices);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => ws.close();
  }, []);

  const handleAddCalculator = (afterIndex) => {
    setCalculators((prev) => {
      const newId = Math.max(...prev) + 1;
      const newArray = [...prev];
      newArray.splice(afterIndex + 1, 0, newId); // ilgili indexin sonrasına ekle
      return newArray;
    });
  };
  const handleRemove = (index) => {
    if (calculators.length <= 1) return; // en az 1 tane kalsın
    const newIds = [...calculators];
    newIds.splice(index, 1);
    setCalculators(newIds);
  };

  return (
    <>
      <Navbar />
      <main className="flex-grow px-6 py-10 bg-black min-h-screen">
        <h1 className="text-3xl font-bold text-gray-200 mb-6 text-center">
          Arbitrage Bot - Üçgen Arbitraj
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {calculators.map((id, idx) => (
            <ArbitrageCalculator
              key={id}
              id={idx}
              prices={prices}
              symbols={symbols}
              onAdd={() => handleAddCalculator(idx)}
              onRemove={handleRemove}
            />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
