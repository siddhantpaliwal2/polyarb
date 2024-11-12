'use client'

import React, { useState } from 'react'
import { ChevronDownIcon } from 'lucide-react'
import { Menu } from '@headlessui/react'

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

  const bettingLines = [
    { event: 'Match A vs B', yesPercentage: 60, noPercentage: 40, volume: '$50,000' },
    { event: 'Player X to Score', yesPercentage: 75, noPercentage: 25, volume: '$30,000' },
    { event: 'Team Y to Win', yesPercentage: 55, noPercentage: 45, volume: '$75,000' },
  ]

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
                <h2 className="text-2xl font-bold mb-4">Betting Lines Analysis</h2>
                <div className="space-y-4">
                  {bettingLines.map((line, index) => (
                    <Menu as="div" key={index} className="bg-gray-800 bg-opacity-30 p-4 rounded-lg">
                      <Menu.Button className="w-full text-left flex justify-between items-center">
                        <span>{line.event}</span>
                        <ChevronDownIcon className="w-5 h-5" />
                      </Menu.Button>
                      <Menu.Items className="mt-2 space-y-2">
                        <Menu.Item>
                          <div>Yes: {line.yesPercentage}%</div>
                        </Menu.Item>
                        <Menu.Item>
                          <div>No: {line.noPercentage}%</div>
                        </Menu.Item>
                        <Menu.Item>
                          <div>Volume: {line.volume}</div>
                        </Menu.Item>
                      </Menu.Items>
                    </Menu>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}