import { useState, useEffect } from "react";

export default function Coin({ symbol, price, prevPrice }) {
  // Favori durumu localStorage’dan oku, yoksa false
  const [fav, setFav] = useState(false);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFav(favs.includes(symbol));
  }, [symbol]);

  // Favori toggle fonksiyonu
  const toggleFav = () => {
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    let newFavs;
    if (fav) {
      newFavs = favs.filter((s) => s !== symbol);
    } else {
      newFavs = [...favs, symbol];
    }
    localStorage.setItem("favorites", JSON.stringify(newFavs));
    setFav(!fav);
  };

  // Arka plan rengini belirle
  let bgColor = "bg-gray-800"; // default gri

  if (prevPrice && price !== prevPrice) {
    if (parseFloat(price) > parseFloat(prevPrice)) {
      bgColor = "bg-green-700";
    } else if (parseFloat(price) < parseFloat(prevPrice)) {
      bgColor = "bg-red-700";
    }
  }

  return (
    <div
      className={`${bgColor} relative rounded-md w-full max-w-[190px] h-32 p-4 flex flex-col justify-center items-center text-white shadow-md transition-colors duration-300`}>
      <h3 className="text-lg font-semibold mb-2">{symbol}</h3>
      <p className="font-mono text-2xl">{parseFloat(price).toFixed(6)}</p>

      {/* Kalp ikonu sağ alt köşede */}
      <button
        onClick={toggleFav}
        className="absolute bottom-2 right-2 text-white hover:text-red-500 transition-colors"
        aria-label={fav ? "Remove from favorites" : "Add to favorites"}>
        {fav ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="red"
            viewBox="0 0 24 24"
            stroke="red"
            className="w-6 h-6">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36..." />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            className="w-6 h-6">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36..." />
          </svg>
        )}
      </button>
    </div>
  );
}
