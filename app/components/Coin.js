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
      className={`${bgColor} relative rounded-md w-48 h-32 p-4 flex flex-col justify-between items-center text-white shadow-md transition-colors duration-300`}>
      <h3 className="text-lg font-semibold">{symbol}</h3>
      <p className="font-mono text-xl">{parseFloat(price).toFixed(6)}</p>

      {/* Küçük kalp ikonu sağ alt köşede */}
      <button
        onClick={toggleFav}
        className="absolute bottom-1.5 right-1.5 text-white hover:text-red-500 transition-colors"
        aria-label={fav ? "Remove from favorites" : "Add to favorites"}>
        {fav ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="red"
            viewBox="0 0 24 24"
            stroke="red"
            className="w-5 h-5">
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 
             4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 
             14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 
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
            className="w-5 h-5">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 
             4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 
             14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 
             6.86-8.55 11.54L12 21.35z"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
