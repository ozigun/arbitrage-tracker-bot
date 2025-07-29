import Coin from "./Coin";

export default function CoinBox({ coins }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 justify-center">
      {coins.map((coin) => (
        <Coin
          key={coin.symbol}
          symbol={coin.symbol}
          price={coin.price}
          prevPrice={coin.prevPrice}
        />
      ))}
    </div>
  );
}
