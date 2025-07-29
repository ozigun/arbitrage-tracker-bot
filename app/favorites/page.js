"use client";

import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CoinBox from "../components/CoinBox";

export default function FavoritesPage() {
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState("");
  const symbolsOrder = useRef([]);
  const pricesRef = useRef({}); // fiyatları tutuyoruz

  // Favori coinleri localStorage'dan alıyoruz
  const getFavorites = () => {
    return JSON.parse(localStorage.getItem("favorites") || "[]");
  };

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const res = await fetch("https://api.binance.com/api/v3/ticker/price");
        const data = await res.json();

        const favs = getFavorites();

        // Favorilerden sadece olanları filtrele
        const filtered = data.filter((coin) => favs.includes(coin.symbol));

        symbolsOrder.current = filtered.map((c) => c.symbol);

        // İlk fiyatları kaydet
        filtered.forEach((c) => {
          pricesRef.current[c.symbol] = c.price || "0";
        });

        setCoins(filtered);
      } catch (err) {
        console.error("API error:", err);
      }
    };

    fetchCoins();

    // Websocket bağlantısı
    const ws = new WebSocket("wss://stream.binance.com:9443/ws/!ticker@arr");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      const favs = getFavorites();

      // Favori coinlerin fiyatını güncelle
      const updatedPrices = {};
      data.forEach((item) => {
        if (favs.includes(item.s)) {
          updatedPrices[item.s] = item.c;
        }
      });

      if (symbolsOrder.current.length === 0) {
        symbolsOrder.current = Object.keys(updatedPrices);
      }

      // coins array'ini güncelle (symbol, price, prevPrice)
      setCoins((prevCoins) =>
        symbolsOrder.current.map((symbol) => {
          const prevCoin = prevCoins.find((c) => c.symbol === symbol);
          const prevPrice = prevCoin ? prevCoin.price : null;
          const newPrice =
            updatedPrices[symbol] || pricesRef.current[symbol] || "0";

          pricesRef.current[symbol] = newPrice;

          return {
            symbol,
            price: newPrice,
            prevPrice,
          };
        })
      );
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

  return (
    <>
      <Navbar />
      <main className="flex-grow px-6 py-10 bg-black min-h-screen">
        <h2 className="text-2xl text-gray-200 mb-6 text-center">Favorites</h2>

        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="Coin ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-xs px-4 py-2 rounded bg-gray-800 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <CoinBox coins={filteredCoins} />
      </main>
      <Footer />
    </>
  );
}
