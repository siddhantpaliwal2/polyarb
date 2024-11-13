'use client';

import { useState, useEffect } from "react";
import { ChevronDownIcon, TrendingDownIcon, TrendingUpIcon } from 'lucide-react';
import { Menu } from '@headlessui/react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from 'react-markdown';

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
  analysis: string;
}

export function ArbitrageContent() {
  const [activeItem, setActiveItem] = useState('arbitrage');
  const [comparisons, setComparisons] = useState<MarketComparison[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const tradesPerPage = 10;
  const [analyses, setAnalyses] = useState<{ [key: string]: string }>({});
  const [loadingAnalyses, setLoadingAnalyses] = useState<{ [key: string]: boolean }>({});

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

  const analysisData = [
    {
      title: 'BTC Price > $50k by EOY',
      polymarket: { yes: '65%', no: '35%' },
      kalshi: { yes: '62%', no: '38%' },
      analysis: 'Market sentiment slightly favors BTC reaching $50k. Consider the potential for arbitrage between platforms.',
      recommendation: 'Buy',
      trend: 'up',
    },
    {
      title: 'ETH 2.0 Launch in Q3',
      polymarket: { yes: '40%', no: '60%' },
      kalshi: { yes: '45%', no: '55%' },
      analysis: 'Both markets lean towards a delay in ETH 2.0 launch. Monitor development progress for potential shifts.',
      recommendation: 'Hold',
      trend: 'neutral',
    },
    {
      title: 'Fed Rate Hike in July',
      polymarket: { yes: '75%', no: '25%' },
      kalshi: { yes: '78%', no: '22%' },
      analysis: 'High confidence in a July rate hike across both platforms. Consider the impact on crypto markets.',
      recommendation: 'Sell',
      trend: 'down',
    },
  ];

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUpIcon className="h-4 w-4" />;
      case 'down':
        return <TrendingDownIcon className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation.toLowerCase()) {
      case 'buy':
        return 'bg-green-500';
      case 'sell':
        return 'bg-red-500';
      default:
        return 'bg-yellow-500';
    }
  };

  const renderAnalysisCell = (comp: MarketComparison) => (
    <TableCell className="text-right py-4">
      <Collapsible>
        <CollapsibleTrigger 
          className="flex items-center justify-end w-full hover:text-gray-300 transition-colors"
          onClick={() => !comp.analysis && loadAnalysis(comp.polymarket.title)}
        >
          View Analysis
          <ChevronDownIcon className="ml-2 h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3">
          <div className="max-h-[300px] overflow-y-auto pr-4 text-left">
            <ReactMarkdown
              className="prose prose-invert prose-sm max-w-none"
              components={{
                h3: ({children}) => <h3 className="text-white font-semibold mt-4 mb-2">{children}</h3>,
                ul: ({children}) => <ul className="list-disc pl-4 space-y-1">{children}</ul>,
                li: ({children}) => <li className="text-gray-300">{children}</li>,
                p: ({children}) => <p className="mb-2 text-gray-300">{children}</p>,
                strong: ({children}) => <strong className="text-white font-semibold">{children}</strong>,
              }}
            >
              {comp.analysis || 'Click to load analysis'}
            </ReactMarkdown>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </TableCell>
  );

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

  // Calculate pagination
  const indexOfLastTrade = currentPage * tradesPerPage;
  const indexOfFirstTrade = indexOfLastTrade - tradesPerPage;
  const currentTrades = comparisons.slice(indexOfFirstTrade, indexOfLastTrade);
  const totalPages = Math.ceil(comparisons.length / tradesPerPage);

  // Pagination controls
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Main Content Area - Flex container */}
      <div className="flex flex-1 min-h-0"> {/* min-h-0 prevents flex children from expanding */}
        {/* Sidebar - Fixed position */}
        <div className="w-48 flex-none bg-black bg-opacity-30 backdrop-blur-sm border-r border-gray-800/50 overflow-y-auto">
          <div className="sticky top-0">
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
        </div>

        {/* Content Area - Scrollable with fixed bounds */}
        <div className="flex-1 overflow-y-auto relative">
          <div className="absolute inset-0 overflow-y-auto">
            <div className="p-6">
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
                          <Menu.Items className="space-y-4">
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
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Market Analysis</h2>
                
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-gray-800">
                        <TableHead className="w-[300px] py-4">Trade Title</TableHead>
                        <TableHead className="text-center py-4">Polymarket (Yes/No)</TableHead>
                        <TableHead className="text-center py-4">Kalshi (Yes/No)</TableHead>
                        <TableHead className="text-center py-4">Recommendation</TableHead>
                        <TableHead className="text-right py-4">Analysis</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentTrades.map((comp, index) => {
                        // Determine recommendation based on price differences
                        const priceDiff = comp.priceDifference.yes;
                        let recommendation = 'Hold';
                        let trend = 'neutral';
                        
                        if (Math.abs(priceDiff) > 3) {
                          if (priceDiff > 0) {
                            recommendation = 'Sell';
                            trend = 'down';
                          } else {
                            recommendation = 'Buy';
                            trend = 'up';
                          }
                        }

                        // Generate analysis text
                        const analysis = `${comp.strategy}. Price difference: ${formatPercentage(Math.abs(priceDiff))}. ` +
                          `Polymarket volume: ${formatVolume(comp.polymarket.volume)}. ` +
                          `Kalshi volume: ${formatVolume(comp.kalshi.volume)}.`;

                        return (
                          <TableRow key={index} className="border-b border-gray-800 hover:bg-gray-800/30">
                            <TableCell className="font-medium flex items-center py-2">
                              <span className={`mr-3 ${getTrendColor(trend)}`}>
                                {getTrendIcon(trend)}
                              </span>
                              {comp.polymarket.title}
                            </TableCell>
                            <TableCell className="text-center py-2">
                              <span className="text-green-500">{formatPercentage(comp.polymarket.prices.yes * 100)}</span>
                              <span className="mx-2">/</span>
                              <span className="text-red-500">{formatPercentage(comp.polymarket.prices.no * 100)}</span>
                            </TableCell>
                            <TableCell className="text-center py-2">
                              <span className="text-green-500">{formatPercentage(comp.kalshi.prices.yes * 100)}</span>
                              <span className="mx-2">/</span>
                              <span className="text-red-500">{formatPercentage(comp.kalshi.prices.no * 100)}</span>
                            </TableCell>
                            <TableCell className="text-center py-2">
                              <span 
                                className={`${getRecommendationColor(recommendation)} px-6 py-2 rounded-md text-white font-medium`}
                              >
                                {recommendation}
                              </span>
                            </TableCell>
                            {renderAnalysisCell(comp)}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>

                  <div className="mt-6 flex justify-between items-center text-sm text-gray-400">
                    <div>
                      Showing {indexOfFirstTrade + 1} to {Math.min(indexOfLastTrade, comparisons.length)} of {comparisons.length} trades
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded bg-gray-800/50 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700/50"
                      >
                        Previous
                      </button>
                      <span>
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded bg-gray-800/50 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700/50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 