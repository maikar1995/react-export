import React, { useState } from 'react';

const SalesFunnel = () => {
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, content: '' });

  // Datos del funnel por fuente de tráfico con variabilidad realista
  // Orgánico: menor volumen pero mejor calidad de conversión
  // Facebook: alto volumen pero conversión media-baja
  // Instagram: volumen medio, conversión baja
  // Google Ads: volumen medio, conversión media-alta
  const funnelData = [
    {
      stage: 'Website Visits',
      sources: [
        { name: 'Facebook', value: 8500, color: '#FF9D3D' },
        { name: 'Instagram', value: 4200, color: '#FFB366' },
        { name: 'Google Ads', value: 2800, color: '#FFC699' },
        { name: 'Organic', value: 1200, color: '#FFE0CC' }
      ]
    },
    {
      stage: 'Prospective Purchasers',
      sources: [
        { name: 'Facebook', value: 3400, color: '#FF9D3D' },    // 40% conversion
        { name: 'Instagram', value: 1260, color: '#FFB366' },   // 30% conversion  
        { name: 'Google Ads', value: 1820, color: '#FFC699' },  // 65% conversion
        { name: 'Organic', value: 960, color: '#FFE0CC' }       // 80% conversion - ¡Mejor!
      ]
    },
    {
      stage: 'Total Interest Score',
      sources: [
        { name: 'Facebook', value: 680, color: '#FF9D3D' },     // 20% de interesados
        { name: 'Instagram', value: 190, color: '#FFB366' },    // 15% de interesados
        { name: 'Google Ads', value: 546, color: '#FFC699' },   // 30% de interesados
        { name: 'Organic', value: 432, color: '#FFE0CC' }       // 45% de interesados - ¡Mejor!
      ]
    }
  ];

  // Calcular totales por stage
  const stageWidths = funnelData.map(stage => ({
    total: stage.sources.reduce((sum, source) => sum + source.value, 0)
  }));

  // SVG para renderizar el funnel
  const renderFunnel = () => {
    const svgWidth = 1200; // Tamaño ajustado
    const svgHeight = 400;
    const maxWidth = 700;
    const startY = 20;
    const stageHeight = 110;

    return (
      <svg width={svgWidth} height={svgHeight} className="mx-auto" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
        {funnelData.map((stage, stageIdx) => {
          const total = stageWidths[stageIdx].total;
          const maxTotal = Math.max(...stageWidths.map(s => s.total));
          
          const widthRatio = total / maxTotal;
          const currentWidth = maxWidth * widthRatio;
          const x = (svgWidth - currentWidth) / 2;
          const y = startY + stageIdx * stageHeight;

              // Calcular anchos proporcionales basados en valores reales
              const nextWidth = stageIdx < funnelData.length - 1 
                ? maxWidth * (stageWidths[stageIdx + 1].total / maxTotal)
                : maxWidth * 0.15;
              const nextX = (svgWidth - nextWidth) / 2;

              // Calcular posiciones acumulativas para segmentos proporcionales
              let currentSegX = x;
              let nextSegX = nextX;

              return (
                <g key={stageIdx}>
                  {/* Rectángulos por fuente */}
                  {stage.sources.map((source, sourceIdx) => {
                    // Ancho proporcional al valor del segmento actual
                    const segmentWidth = (source.value / total) * currentWidth;
                    
                    // Ancho proporcional para el siguiente nivel
                    const nextSegW = stageIdx < funnelData.length - 1 
                      ? (funnelData[stageIdx + 1].sources[sourceIdx].value / stageWidths[stageIdx + 1].total) * nextWidth
                      : (source.value / total) * nextWidth;
                    
                    const segX = currentSegX;
                    const nextSegXPos = nextSegX;
                    
                    const isHovered = hoveredSegment === `${stageIdx}-${sourceIdx}`;
                    const opacity = isHovered ? 1 : 0.85;
                    
                    // Calcular porcentajes y datos para tooltip
                    const percentage = ((source.value / total) * 100).toFixed(1);
                    const stageNames = ['Website Visits', 'Prospective Purchasers', 'Total Interest Score'];
                    const conversionRate = stageIdx > 0 
                      ? ((source.value / funnelData[stageIdx - 1].sources[sourceIdx].value) * 100).toFixed(1)
                      : null;

                    const handleMouseEnter = (e) => {
                      setHoveredSegment(`${stageIdx}-${sourceIdx}`);
                      const tooltipContent = `
                        <div class="bg-gray-800 text-white p-3 rounded-lg shadow-lg border border-gray-600">
                          <div class="font-semibold text-lg mb-2">${source.name}</div>
                          <div class="text-sm space-y-1">
                            <div><span class="text-gray-300">Stage:</span> ${stageNames[stageIdx]}</div>
                            <div><span class="text-gray-300">Value:</span> <span class="font-semibold">${source.value.toLocaleString()}</span></div>
                            <div><span class="text-gray-300">% of Stage:</span> <span class="font-semibold">${percentage}%</span></div>
                            ${conversionRate ? `<div><span class="text-gray-300">Conversion:</span> <span class="font-semibold">${conversionRate}%</span></div>` : ''}
                          </div>
                        </div>
                      `;
                      setTooltip({
                        show: true,
                        x: e.clientX + 10,
                        y: e.clientY - 10,
                        content: tooltipContent
                      });
                    };

                    const handleMouseLeave = () => {
                      setHoveredSegment(null);
                      setTooltip({ show: false, x: 0, y: 0, content: '' });
                    };

                    const handleMouseMove = (e) => {
                      if (isHovered) {
                        setTooltip(prev => ({
                          ...prev,
                          x: e.clientX + 10,
                          y: e.clientY - 10
                        }));
                      }
                    };

                    // Para el último stage (Total Interest Score), usar rectángulo
                    const shape = stageIdx === 2 ? (
                      <rect
                        key={`segment-${stageIdx}-${sourceIdx}`}
                        x={segX}
                        y={y}
                        width={segmentWidth}
                        height={stageHeight}
                        fill={source.color}
                        opacity={opacity}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onMouseMove={handleMouseMove}
                        className="cursor-pointer transition-opacity duration-200"
                        stroke="#1F2937"
                        strokeWidth="2"
                      />
                    ) : (
                      <polygon
                        key={`segment-${stageIdx}-${sourceIdx}`}
                        points={`${segX},${y} ${segX + segmentWidth},${y} ${nextSegXPos + nextSegW},${y + stageHeight} ${nextSegXPos},${y + stageHeight}`}
                        fill={source.color}
                        opacity={opacity}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onMouseMove={handleMouseMove}
                        className="cursor-pointer transition-opacity duration-200"
                        stroke="#1F2937"
                        strokeWidth="2"
                      />
                    );
                    
                    // Actualizar posiciones para el siguiente segmento
                    currentSegX += segmentWidth;
                    nextSegX += nextSegW;
                    
                    return shape;
              })}

              {/* Las líneas divisoras ya no son necesarias ya que los polígonos tienen bordes */}

              {/* Total del stage */}
              <text
                x={x - 50}
                y={y + stageHeight / 2 + 8}
                textAnchor="end"
                fontSize="20"
                fill="#FFFFFF"
                fontWeight="700"
              >
                {total.toLocaleString()}
              </text>
            </g>
          );
        })}

        {/* Labels de ejes */}
        <text x="15" y="95" fontSize="13" fill="#B0B0B0" fontStyle="italic" fontWeight="500">
          Number of
        </text>
        <text x="15" y="115" fontSize="13" fill="#B0B0B0" fontStyle="italic" fontWeight="500">
          prospective
        </text>
        <text x="15" y="135" fontSize="13" fill="#B0B0B0" fontStyle="italic" fontWeight="500">
          purchasers
        </text>

        {/* Leyendas alineadas con cada bloque */}
        {['Website Visits', 'Prospective Purchasers', 'Total Interest Score'].map((label, idx) => {
          const labelY = startY + idx * stageHeight + stageHeight / 2;
          return (
            <text 
              key={`label-${idx}`}
              x={svgWidth - 220} 
              y={labelY + 5} 
              fontSize="16" 
              fill="#E0E0E0" 
              fontWeight="700"
              textAnchor="start"
            >
              {label}
            </text>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="w-full bg-gray-900 p-8 rounded-lg min-h-screen relative">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-200">
        Marketing Funnel Analysis
      </h1>

      {/* Key Insights */}
      <div className="mb-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-gray-200 mb-4">📊 Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-700 rounded-md p-4">
            <h4 className="font-semibold text-green-400 mb-2">🎯 Organic Traffic Quality</h4>
            <p className="text-gray-300">
              Despite lowest volume (1,200 visits), organic traffic shows <strong>80% conversion to prospects</strong> and <strong>highest interest score</strong> - the highest quality traffic.
            </p>
          </div>
          <div className="bg-gray-700 rounded-md p-4">
            <h4 className="font-semibold text-blue-400 mb-2">💰 Google Ads Efficiency</h4>
            <p className="text-gray-300">
              Google Ads delivers <strong>65% prospect conversion</strong> and <strong>strong interest scores</strong> from prospects - strong ROI for paid traffic.
            </p>
          </div>
          <div className="bg-gray-700 rounded-md p-4">
            <h4 className="font-semibold text-orange-400 mb-2">📱 Social Media Volume</h4>
            <p className="text-gray-300">
              Facebook brings highest volume (8,500 visits) but lower conversion rates. Instagram shows potential for improvement.
            </p>
          </div>
          <div className="bg-gray-700 rounded-md p-4">
            <h4 className="font-semibold text-purple-400 mb-2">🚀 Optimization Opportunity</h4>
            <p className="text-gray-300">
              Focus on <strong>scaling organic content</strong> and <strong>improving social media quality</strong> to maximize interest scores.
            </p>
          </div>
        </div>
      </div>
      
      {/* Tooltip */}
      {tooltip.show && (
        <div 
          className="fixed pointer-events-none z-50"
          style={{ left: tooltip.x, top: tooltip.y }}
          dangerouslySetInnerHTML={{ __html: tooltip.content }}
        />
      )}

      {/* Legend + Funnel en el mismo bloque */}
      <div className="bg-gray-800 rounded-lg p-8 shadow-2xl border border-gray-700">
        {/* Legend - Línea recta */}
        <div className="flex justify-center gap-12 mb-8">
          {[
            { name: 'Facebook', color: '#FF9D3D' },
            { name: 'Instagram', color: '#FFB366' },
            { name: 'Google Ads', color: '#FFC699' },
            { name: 'Organic', color: '#FFE0CC' }
          ].map(source => (
            <div key={source.name} className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded" 
                style={{ backgroundColor: source.color }}
              />
              <span className="text-sm font-medium text-gray-300">
                {source.name}
              </span>
            </div>
          ))}
        </div>

        {/* Funnel SVG */}
        {renderFunnel()}
      </div>

      {/* Data Table */}
      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-sm bg-gray-800 rounded-lg shadow-2xl border border-gray-700">
          <thead className="bg-gray-700 border-b border-gray-600">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-300">Stage</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-300">Facebook</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-300">Instagram</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-300">Google Ads</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-300">Organic</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-300">Total</th>
            </tr>
          </thead>
          <tbody>
            {['Website Visits', 'Prospective Purchasers', 'Total Interest Score'].map((stageName, idx) => (
              <tr key={idx} className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-300">{stageName}</td>
                {funnelData[idx].sources.map((source, srcIdx) => (
                  <td key={srcIdx} className="px-4 py-3 text-center text-gray-400">
                    {source.value}
                  </td>
                ))}
                <td className="px-4 py-3 text-center font-semibold text-gray-200">
                  {funnelData[idx].sources.reduce((sum, src) => sum + src.value, 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      
      <style jsx>{`
        .tooltip {
          background: #1F2937;
          color: white;
          padding: 12px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          border: 1px solid #374151;
          max-width: 250px;
        }
      `}</style>
    </div>
  );
};

export default SalesFunnel;