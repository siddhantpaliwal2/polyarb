'use client';

import { useEffect, useState } from "react";

interface MarketPrices {
  yes: number;
  no: number;
}

interface Market {
  title: string;
  prices: MarketPrices;
  volume: number;
}

interface MarketComparison {
  polymarket: Market;
  kalshi: Market;
  potentialProfit: number;
  priceDifference: MarketPrices;
}

export default function Home() {
  const [comparisons, setComparisons] = useState<MarketComparison[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const fetchComparisons = async () => {
        try {
          const response = await fetch('http://localhost:3001/api/arbitrage');
          if (!response.ok) {
            throw new Error('Failed to fetch market comparisons');
          }
          const data = await response.json();
          setComparisons(data);
          setLoading(false);
        } catch (err) {
          console.error('Fetch error:', err);
          setError(err instanceof Error ? err.message : 'An error occurred');
          setLoading(false);
        }
      };

      fetchComparisons();
    }
  }, [mounted]);

  if (!mounted) return null;

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(2)}%`;
  };

  const formatVolume = (volume: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(volume);
  };

  const getDifferenceColor = (diff: number): string => {
    const absDiff = Math.abs(diff);
    if (absDiff > 5) return 'text-red-600 dark:text-red-400';
    if (absDiff > 2) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <main className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Arbitrage Opportunities</h1>
        
        {loading && (
          <div className="text-center p-4">
            <p>Finding arbitrage opportunities...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center p-4">
            <p className="text-red-500">Error: {error}</p>
          </div>
        )}
        
        {!loading && !error && comparisons.length > 0 && (
          <div className="space-y-6">
            {comparisons.map((comp, index) => (
              <div key={index} className="border rounded-lg p-6 shadow-sm bg-white dark:bg-gray-800">
                <div className="mb-4">
                  <h2 className="text-xl font-bold mb-2">Similar Bets Found:</h2>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-semibold">Polymarket:</span> {comp.polymarket.title}</p>
                    <p><span className="font-semibold">Kalshi:</span> {comp.kalshi.title}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Polymarket Prices</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Yes:</span>
                        <span>{formatPercentage(comp.polymarket.prices.yes * 100)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>No:</span>
                        <span>{formatPercentage(comp.polymarket.prices.no * 100)}</span>
                      </div>
                      <div className="text-sm text-blue-600 dark:text-blue-400">
                        Volume: {formatVolume(comp.polymarket.volume)}
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Kalshi Prices</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Yes:</span>
                        <span>{formatPercentage(comp.kalshi.prices.yes * 100)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>No:</span>
                        <span>{formatPercentage(comp.kalshi.prices.no * 100)}</span>
                      </div>
                      <div className="text-sm text-green-600 dark:text-green-400">
                        Volume: {formatVolume(comp.kalshi.volume)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Price Analysis</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Yes Difference:</span>
                      <span className={getDifferenceColor(comp.priceDifference.yes)}>
                        {comp.priceDifference.yes > 0 ? '+' : ''}{formatPercentage(comp.priceDifference.yes)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>No Difference:</span>
                      <span className={getDifferenceColor(comp.priceDifference.no)}>
                        {comp.priceDifference.no > 0 ? '+' : ''}{formatPercentage(comp.priceDifference.no)}
                      </span>
                    </div>
                    {comp.potentialProfit > 0 && (
                      <div className="mt-4 text-green-600 dark:text-green-400 font-bold">
                        Potential Arbitrage: {formatPercentage(comp.potentialProfit)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!loading && !error && comparisons.length === 0 && (
          <div className="text-center p-4">
            <p>No arbitrage opportunities found</p>
          </div>
        )}
      </main>
    </div>
  );
}
