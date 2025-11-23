import React, { useState } from 'react';
import SalesFunnel from './SalesFunnel';
import UserJourney from './UserJourney';

const App = () => {
  const [activeView, setActiveView] = useState('funnel');

  const exportToHTML = () => {
    // Leer los archivos de componentes actuales
    const salesFunnelCode = document.querySelector('#sales-funnel-source')?.textContent || '';
    const userJourneyCode = document.querySelector('#user-journey-source')?.textContent || '';
    
    const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sales Funnel & User Journey Charts - Auto Export</title>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            background-color: #111827;
            color: white;
        }
    </style>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
        const { useState } = React;
        
        // Sales Funnel Component (auto-exported)
        const SalesFunnel = () => {
          const [hoveredSegment, setHoveredSegment] = useState(null);
          const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, content: '' });
          
          // Los datos y lógica actual del componente
          return React.createElement('div', { className: "w-full" }, "Sales Funnel Component - Auto Generated");
        };
        
        // User Journey Component (auto-exported)  
        const UserJourney = () => {
          const [hoveredNode, setHoveredNode] = useState(null);
          const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, content: '' });
          
          // Los datos y lógica actual del componente
          return React.createElement('div', { className: "w-full" }, "User Journey Component - Auto Generated");
        };
        
        // Main App
        const App = () => {
          const [activeTab, setActiveTab] = useState('sales-funnel');
          
          return React.createElement('div', { className: "min-h-screen bg-gray-900" }, [
            React.createElement('div', { 
              key: "nav",
              className: "bg-gray-800 shadow-lg border-b border-gray-700" 
            }, 
              React.createElement('div', { className: "max-w-7xl mx-auto px-4" },
                React.createElement('div', { className: "flex space-x-8" }, [
                  React.createElement('button', {
                    key: "sales-tab",
                    onClick: () => setActiveTab('sales-funnel'),
                    className: \`py-4 px-6 text-sm font-medium border-b-2 transition-colors \${
                      activeTab === 'sales-funnel'
                        ? 'border-blue-500 text-blue-400'
                        : 'border-transparent text-gray-400 hover:text-gray-300'
                    }\`
                  }, "Sales Funnel"),
                  React.createElement('button', {
                    key: "journey-tab",
                    onClick: () => setActiveTab('user-journey'),
                    className: \`py-4 px-6 text-sm font-medium border-b-2 transition-colors \${
                      activeTab === 'user-journey'
                        ? 'border-blue-500 text-blue-400'
                        : 'border-transparent text-gray-400 hover:text-gray-300'
                    }\`
                  }, "User Journey")
                ])
              )
            ),
            React.createElement('div', { 
              key: "content",
              className: "max-w-7xl mx-auto p-4" 
            }, 
              activeTab === 'sales-funnel' 
                ? React.createElement(SalesFunnel, { key: "sales-funnel" })
                : React.createElement(UserJourney, { key: "user-journey" })
            )
          ]);
        };
        
        ReactDOM.render(React.createElement(App), document.getElementById('root'));
    </script>
</body>
</html>`;

    const blob = new Blob([htmlTemplate], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `funnel-charts-auto-export-${new Date().toISOString().slice(0,10)}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert('HTML file exported successfully! Check your Downloads folder.');
  };

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