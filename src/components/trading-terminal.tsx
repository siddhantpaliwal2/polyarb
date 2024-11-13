'use client'

import React, { useState } from 'react'
import { ChevronDownIcon, TrendingDownIcon, TrendingUpIcon } from 'lucide-react'
import { Menu } from '@headlessui/react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"

export function TradingTerminalComponent() {
  const [activeItem, setActiveItem] = useState('dashboard')
  const [showContent, setShowContent] = useState(true)

  const sidebarItems = ['Dashboard', 'Arbitrage', 'Analysis']

  const tradingStats = [
    { label: 'Total Trades', value: '1,234' },
    { label: 'Win Rate', value: '68%' },
    { label: 'Profit/Loss', value: '+$15,678' },
    { label: 'ROI', value: '22.5%' },
  ]

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
  ]

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
        return 'text-green-500'
      case 'down':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUpIcon className="h-4 w-4" />
      case 'down':
        return <TrendingDownIcon className="h-4 w-4" />
      default:
        return null
    }
  }

  const getRecommendationColor = (recommendation) => {
    switch (recommendation.toLowerCase()) {
      case 'buy':
        return 'bg-green-500'
      case 'sell':
        return 'bg-red-500'
      default:
        return 'bg-yellow-500'
    }
  }

  return (
    <div className={`bg-black text-white font-sans relative ${showContent ? 'h-auto' : 'min-h-screen'}`}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/4 w-full h-full bg-green-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute -bottom-1/2 -right-1/4 w-full h-full bg-blue-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-purple-500/10 rounded-full filter blur-3xl"></div>
      </div>

      <div className="relative z-10 flex flex-col h-screen">
        {/* Menubar */}
        <div className="bg-gray-900 bg-opacity-50 p-2 flex justify-between items-center">
          <div className="text-xl font-bold">Trading Terminal</div>
          <div className="flex space-x-4">
            <button className="hover:bg-gray-700 px-2 py-1 rounded">File</button>
            <button className="hover:bg-gray-700 px-2 py-1 rounded">Edit</button>
            <button className="hover:bg-gray-700 px-2 py-1 rounded">View</button>
            <button className="hover:bg-gray-700 px-2 py-1 rounded">Help</button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-1 overflow-hidden p-4">
          {/* Sidebar */}
          <div className="w-48 bg-black bg-opacity-30 p-4 m-2 rounded-xl backdrop-blur-sm">
            {sidebarItems.map((item) => (
              <button
                key={item}
                className={`w-full text-left p-2 mb-2 rounded-lg transition-colors duration-200 ${
                  activeItem === item.toLowerCase() ? 'bg-blue-600 bg-opacity-50' : 'hover:bg-gray-800 hover:bg-opacity-50'
                }`}
                onClick={() => setActiveItem(item.toLowerCase())}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Right side content */}
          <div className="flex-1 m-2 p-6 overflow-auto bg-black bg-opacity-30 rounded-xl backdrop-blur-sm">
            {activeItem === 'dashboard' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Trading Statistics</h2>
                <div className="grid grid-cols-2 gap-4">
                  {tradingStats.map((stat) => (
                    <div key={stat.label} className="bg-gray-800 bg-opacity-30 p-4 rounded-lg">
                      <div className="text-sm text-gray-300">{stat.label}</div>
                      <div className="text-2xl font-bold">{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeItem === 'arbitrage' && (
              <div className="text-center text-gray-400 mt-20">
                Arbitrage content will be displayed here.
              </div>
            )}

            {activeItem === 'analysis' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Market Analysis</h2>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Trade Title</TableHead>
                      <TableHead className="text-center">Polymarket (Yes/No)</TableHead>
                      <TableHead className="text-center">Kalshi (Yes/No)</TableHead>
                      <TableHead className="text-center">Recommendation</TableHead>
                      <TableHead className="text-right">Analysis</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analysisData.map((item, index) => (
                      <TableRow key={index} className="border-b border-gray-700">
                        <TableCell className="font-medium flex items-center">
                          <span className={`mr-2 ${getTrendColor(item.trend)}`}>
                            {getTrendIcon(item.trend)}
                          </span>
                          {item.title}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="text-green-500">{item.polymarket.yes}</span> / 
                          <span className="text-red-500">{item.polymarket.no}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="text-green-500">{item.kalshi.yes}</span> / 
                          <span className="text-red-500">{item.kalshi.no}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={`${getRecommendationColor(item.recommendation)}`}>
                            {item.recommendation}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Collapsible>
                            <CollapsibleTrigger className="flex items-center justify-end w-full">
                              View Analysis
                              <ChevronDownIcon className="ml-2 h-4 w-4" />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-2 text-sm text-gray-400">
                              {item.analysis}
                            </CollapsibleContent>
                          </Collapsible>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}