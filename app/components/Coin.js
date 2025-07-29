import { useState, useEffect } from "react";

export default function Coin({ symbol, price, prevPrice }) {
  const [fav, setFav] = useState(false);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFav(favs.includes(symbol));
  }, [symbol]);

  const toggleFav = () => {
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    const newFavs = fav ? favs.filter((s) => s !== symbol) : [...favs, symbol];
    localStorage.setItem("favorites", JSON.stringify(newFavs));
    setFav(!fav);
  };

  let bgColor = "bg-gray-800";

  if (prevPrice && price !== prevPrice) {
    bgColor =
      parseFloat(price) > parseFloat(prevPrice) ? "bg-green-700" : "bg-red-700";
  }

  return (
    <div
      className={`${bgColor} relative rounded-xl w-40 h-28 p-3 flex flex-col justify-between items-center text-white shadow-md transition-colors duration-300 sm:w-44 sm:h-32`}>
      <h3 className="text-md font-semibold text-center truncate">{symbol}</h3>
      <p className="font-mono text-base sm:text-lg">
        {parseFloat(price).toFixed(6)}
      </p>

      {/* Kalp ikonu - sağ alt köşede sabit */}
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
            className="w-4 h-4 sm:w-5 sm:h-5">
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
              2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 
              4.5 2.09C13.09 3.81 14.76 3 16.5 3 
              19.58 3 22 5.42 22 8.5c0 3.78-3.4 
              6.86-8.55 11.54L12 21.35z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            className="w-4 h-4 sm:w-5 sm:h-5">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
              2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 
              4.5 2.09C13.09 3.81 14.76 3 16.5 3 
              19.58 3 22 5.42 22 8.5c0 3.78-3.4 
              6.86-8.55 11.54L12 21.35z"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
