import React, { useState } from 'react';
import SalesFunnel from './SalesFunnel';
import UserJourney from './UserJourney';

const App = () => {
  const [activeView, setActiveView] = useState('funnel');

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex justify-center">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveView('funnel')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeView === 'funnel'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Sales Funnel
            </button>
            <button
              onClick={() => setActiveView('journey')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeView === 'journey'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              User Journey
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="p-4">
        {activeView === 'funnel' ? <SalesFunnel /> : <UserJourney />}
      </div>
    </div>
  );
};

export default App;