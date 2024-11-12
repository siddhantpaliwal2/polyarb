'use client';

import { useState, useEffect } from "react";
import { ChevronDownIcon } from 'lucide-react';
import { Menu } from '@headlessui/react';

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
  strategy: string;
}

export function ArbitrageContent() {
  const [activeItem, setActiveItem] = useState('arbitrage');
  const [comparisons, setComparisons] = useState<MarketComparison[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sidebarItems = ['Dashboard', 'Arbitrage', 'Analysis'];

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

  function calculateAverageProfit(): string {
    if (comparisons.length === 0) return '0';
    const total = comparisons.reduce((sum, comp) => sum + comp.potentialProfit, 0);
    return (total / comparisons.length).toFixed(2);
  }

  function calculateTotalVolume(): number {
    return comparisons.reduce((sum, comp) => 
      sum + comp.polymarket.volume + comp.kalshi.volume, 0);
  }

  const tradingStats = [
    { label: 'Total Opportunities', value: comparisons.length.toString() },
    { label: 'Avg Profit', value: `${calculateAverageProfit()}%` },
    { label: 'Total Volume', value: formatVolume(calculateTotalVolume()) },
    { label: 'Active Markets', value: comparisons.length.toString() },
  ];

  const getDifferenceColor = (diff: number): string => {
    const absDiff = Math.abs(diff);
    if (absDiff > 5) return 'text-red-600 dark:text-red-400';
    if (absDiff > 2) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  useEffect(() => {
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
  }, []);

  return (
    <div className="flex flex-col h-screen">
      {/* Terminal Bar */}
      

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 bg-black bg-opacity-30 backdrop-blur-sm border-r border-gray-800/50">
          {sidebarItems.map((item) => (
            <button
              key={item}
              className={`w-full text-left p-4 transition-colors duration-200 border-b border-gray-800/30 ${
                activeItem === item.toLowerCase() 
                  ? 'bg-blue-600/20 text-blue-400' 
                  : 'hover:bg-gray-800/30'
              }`}
              onClick={() => setActiveItem(item.toLowerCase())}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Right side content */}
        <div className="flex-1 overflow-auto p-6">
          {activeItem === 'dashboard' && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-white">Trading Statistics</h2>
              <div className="grid grid-cols-2 gap-4">
                {tradingStats.map((stat) => (
                  <div key={stat.label} className="bg-gray-800 bg-opacity-30 p-4 rounded-lg">
                    <div className="text-sm text-gray-300">{stat.label}</div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeItem === 'arbitrage' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-4 text-white">Arbitrage Opportunities</h2>
              {loading && (
                <div className="text-center p-4 text-white">
                  <p>Finding arbitrage opportunities...</p>
                </div>
              )}
              
              {error && (
                <div className="text-center p-4">
                  <p className="text-red-500">Error: {error}</p>
                </div>
              )}
              
              {!loading && !error && comparisons.length > 0 && (
                <div className="space-y-4">
                  {comparisons.map((comp, index) => (
                    <Menu as="div" key={index} className="bg-gray-800 bg-opacity-30 p-4 rounded-lg">
                      <Menu.Button className="w-full text-left flex justify-between items-center text-white">
                        <div className="flex-1">
                          <div className="text-white font-medium">{comp.polymarket.title}</div>
                        </div>
                        <ChevronDownIcon className="w-5 h-5 ml-2 flex-shrink-0" />
                      </Menu.Button>
                      <Menu.Items className="mt-4 space-y-4">
                        <div className="text-sm text-gray-400 mb-2">
                          <div><span className="text-blue-400">Polymarket:</span> {comp.polymarket.title}</div>
                          <div><span className="text-green-400">Kalshi:</span> {comp.kalshi.title}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-blue-500/10 backdrop-blur-sm p-4 rounded-lg border border-blue-500/10">
                            <h3 className="font-semibold mb-2 text-blue-400">Polymarket</h3>
                            <div className="space-y-2 text-gray-200">
                              <div className="flex justify-between">
                                <span>Yes:</span>
                                <span>{formatPercentage(comp.polymarket.prices.yes * 100)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>No:</span>
                                <span>{formatPercentage(comp.polymarket.prices.no * 100)}</span>
                              </div>
                              <div className="text-sm text-blue-400">
                                Volume: {formatVolume(comp.polymarket.volume)}
                              </div>
                            </div>
                          </div>

                          <div className="bg-green-500/10 backdrop-blur-sm p-4 rounded-lg border border-green-500/10">
                            <h3 className="font-semibold mb-2 text-green-400">Kalshi</h3>
                            <div className="space-y-2 text-gray-200">
                              <div className="flex justify-between">
                                <span>Yes:</span>
                                <span>{formatPercentage(comp.kalshi.prices.yes * 100)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>No:</span>
                                <span>{formatPercentage(comp.kalshi.prices.no * 100)}</span>
                              </div>
                              <div className="text-sm text-green-400">
                                Volume: {formatVolume(comp.kalshi.volume)}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-500/10 backdrop-blur-sm p-4 rounded-lg border border-gray-500/10">
                          <h3 className="font-semibold mb-2 text-white">Strategy</h3>
                          <div className="space-y-2">
                            <div className="text-green-400 font-bold">
                              Potential Arbitrage: {formatPercentage(comp.potentialProfit)}
                            </div>
                            <div className="text-gray-200">
                              {comp.strategy}
                            </div>
                          </div>
                        </div>
                      </Menu.Items>
                    </Menu>
                  ))}
                </div>
              )}
              
              {!loading && !error && comparisons.length === 0 && (
                <div className="text-center p-4 text-white">
                  <p>No arbitrage opportunities found</p>
                </div>
              )}
            </div>
          )}

          {activeItem === 'analysis' && (
            <div className="text-center text-gray-400 mt-20">
              Analysis tools coming soon.
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 