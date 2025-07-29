"use client";

import { useState, useEffect } from "react";

export default function ArbitrageCalculator({
  prices,
  symbols,
  id,
  onAdd,
  onRemove,
}) {
  const [coinA, setCoinA] = useState("BTC");
  const [coinB, setCoinB] = useState("ETH");
  const [startAmount, setStartAmount] = useState(100);
  const [result, setResult] = useState(null);

  const feeRate = 0.001;

  function calculateArbitrage(
    startAmount,
    prices,
    coinA,
    coinB,
    feeRate = 0.001
  ) {
    const keyA = `${coinA}USDT`;
    const keyB_A = `${coinB}${coinA}`;
    const keyB = `${coinB}USDT`;

    if (!prices[keyA] || !prices[keyB_A] || !prices[keyB]) {
      return null;
    }

    const priceA_USDT = parseFloat(prices[keyA]);
    const priceB_A = parseFloat(prices[keyB_A]);
    const priceB_USDT = parseFloat(prices[keyB]);

    if (
      isNaN(priceA_USDT) ||
      isNaN(priceB_A) ||
      isNaN(priceB_USDT) ||
      priceA_USDT <= 0 ||
      priceB_A <= 0 ||
      priceB_USDT <= 0
    ) {
      return null;
    }

    const effectiveStartAmount = startAmount * (1 - feeRate);
    const amountCoinA = effectiveStartAmount / priceA_USDT;

    const amountCoinA_afterFee = amountCoinA * (1 - feeRate);
    const amountCoinB = amountCoinA_afterFee / priceB_A;

    const amountCoinB_afterFee = amountCoinB * (1 - feeRate);
    const endAmount = amountCoinB_afterFee * priceB_USDT;

    const profit = endAmount - startAmount;

    return {
      profit,
      endAmount,
      startAmount,
      feeRate: feeRate * 100,
    };
  }

  useEffect(() => {
    const res = calculateArbitrage(startAmount, prices, coinA, coinB, feeRate);
    setResult(res);
  }, [coinA, coinB, startAmount, prices]);

  return (
    <div className="p-6 bg-gray-800 rounded-md text-gray-200 max-w-md mx-auto mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">
          Arbitraj Hesaplayıcı #{id + 1}
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onRemove(id)}
            className="text-2xl font-bold text-red-400 hover:text-red-600 focus:outline-none"
            aria-label={`Remove Arbitrage Calculator #${id + 1}`}>
            –
          </button>
          <button
            onClick={onAdd}
            className="text-2xl font-bold text-green-400 hover:text-green-600 focus:outline-none"
            aria-label={`Add new Arbitrage Calculator after #${id + 1}`}>
            +
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <select
          value={coinA}
          onChange={(e) => setCoinA(e.target.value)}
          className="p-2 rounded bg-gray-700 flex-grow">
          {symbols.map((sym) => (
            <option key={sym} value={sym}>
              {sym}
            </option>
          ))}
        </select>

        <select
          value={coinB}
          onChange={(e) => setCoinB(e.target.value)}
          className="p-2 rounded bg-gray-700 flex-grow">
          {symbols.map((sym) => (
            <option key={sym} value={sym}>
              {sym}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1">Başlangıç Miktarı (USDT)</label>
        <input
          type="number"
          min={1}
          value={startAmount}
          onChange={(e) => setStartAmount(Number(e.target.value))}
          className="w-full p-2 rounded bg-gray-700 text-gray-200"
        />
      </div>

      {result ? (
        <div className="bg-gray-900 p-4 rounded space-y-2">
          <p>Başlangıç: {result.startAmount.toFixed(6)} USDT</p>
          <p>Bitiş: {result.endAmount.toFixed(6)} USDT</p>
          <p>Kar: {result.profit.toFixed(6)} USDT</p>
          <p>İşlem Ücreti Oranı: %{result.feeRate.toFixed(3)}</p>

          {result.profit > 0 ? (
            <p className="text-green-400 font-semibold">Kârlı fırsat!</p>
          ) : (
            <p className="text-red-400 font-semibold">Kâr yok veya zarar!</p>
          )}

          <hr className="border-gray-700" />
        </div>
      ) : (
        <p className="text-yellow-400">
          Seçilen çiftlerde fiyat bilgisi eksik.
        </p>
      )}
    </div>
  );
}
