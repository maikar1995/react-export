import React, { useState } from 'react';

const SalesFunnel = () => {
  const [activeStages, setActiveStages] = useState(new Set()); // Múltiples stages activos
  const [hoveredSegment, setHoveredSegment] = useState(null); // Solo para tooltips
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, content: '' });

  // Intent Scores realistas por stage y fuente
  const intentScores = {
    'Website Visits': {
      'Facebook': 8.5,    // Usuarios casuales, bajo intent inicial
      'Instagram': 12.3,  // Más engagement visual
      'Google Ads': 18.7, // Búsqueda activa, mayor intent
      'Organic': 25.2     // Usuarios que nos encontraron naturalmente
    },
    'Prospective Purchasers': {
      'Facebook': 19.1,   // Han pasado el filtro, mayor intent
      'Instagram': 22.4,  // Engagement más profundo
      'Google Ads': 26.3, // Muy alta intención de compra
      'Organic': 28.8     // Los más comprometidos
    },
    'Moderate Intent Users': {
      'Facebook': 22.3,   // Usuarios con interés moderado
      'Instagram': 24.1,  // Engagement consistente
      'Google Ads': 27.2, // Búsquedas repetidas
      'Organic': 29.1     // Visitantes recurrentes
    },
    'High Intent Users': {
      'Facebook': 26.8,   // Los más convertidos de FB
      'Instagram': 27.9,  // Instagram premium users
      'Google Ads': 29.2, // Ready to buy
      'Organic': 30.0     // Máximo score posible
    }
  };

  // Función para convertir intent score a color (azul bajo → verde alto)
  const getColorByIntentScore = (score, isShadow = false) => {
    // Normalizar score de 0-30 a 0-1
    const normalized = Math.max(0, Math.min(1, score / 30));
    
    if (isShadow) {
      // Modo shadow: grises suaves
      const intensity = Math.round(100 + normalized * 60); // 100-160 range
      return `rgb(${intensity}, ${intensity}, ${intensity})`;
    }
    
    // Modo normal: interpolación de azul (#1E40AF) a verde (#059669)
    const blue = { r: 30, g: 64, b: 175 };
    const green = { r: 5, g: 150, b: 105 };
    
    const r = Math.round(blue.r + (green.r - blue.r) * normalized);
    const g = Math.round(blue.g + (green.g - blue.g) * normalized);
    const b = Math.round(blue.b + (green.b - blue.b) * normalized);
    
    return `rgb(${r}, ${g}, ${b})`;
  };

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
      stage: 'Moderate Intent Users',
      sources: [
        { name: 'Facebook', value: 1190, color: '#FF9D3D' },    // 35% de prospects → moderate
        { name: 'Instagram', value: 380, color: '#FFB366' },    // 30% de prospects → moderate
        { name: 'Google Ads', value: 910, color: '#FFC699' },   // 50% de prospects → moderate
        { name: 'Organic', value: 576, color: '#FFE0CC' }       // 60% de prospects → moderate
      ]
    },
    {
      stage: 'High Intent Users',
      sources: [
        { name: 'Facebook', value: 357, color: '#FF9D3D' },     // 30% de moderate → high
        { name: 'Instagram', value: 95, color: '#FFB366' },     // 25% de moderate → high
        { name: 'Google Ads', value: 455, color: '#FFC699' },   // 50% de moderate → high
        { name: 'Organic', value: 346, color: '#FFE0CC' }       // 60% de moderate → high - ¡Mejor!
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
    const svgHeight = 500; // Aumentado para labels superiores + 4 niveles
    const maxWidth = 700;
    const startY = 40; // Más espacio para las etiquetas de fuentes
    const stageHeight = 105; // Ligeramente reducido para acomodar 4 niveles

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
                    
                    // Intent score y colores - iluminar toda la fila si el stage está activo
                    const stageName = stage.stage;
                    const intentScore = intentScores[stageName][source.name];
                    const isStageActive = activeStages.has(stageIdx);
                    const shouldUseShadow = !isStageActive;
                    const segmentColor = getColorByIntentScore(intentScore, shouldUseShadow);
                    
                    // Calcular porcentajes y datos para tooltip
                    const percentage = ((source.value / total) * 100).toFixed(1);
                    const stageNames = ['Website Visits', 'Prospective Purchasers', 'Total Interest Score'];
                    const conversionRate = stageIdx > 0 
                      ? ((source.value / funnelData[stageIdx - 1].sources[sourceIdx].value) * 100).toFixed(1)
                      : null;

                    // Click handler para toggle stage completo (múltiples simultáneos)
                    const handleClick = () => {
                      setActiveStages(prev => {
                        const newSet = new Set(prev);
                        if (newSet.has(stageIdx)) {
                          newSet.delete(stageIdx);
                        } else {
                          newSet.add(stageIdx);
                        }
                        return newSet;
                      });
                    };

                    const handleMouseEnter = (e) => {
                      setHoveredSegment(`${stageIdx}-${sourceIdx}`);
                      const tooltipContent = `
                        <div class="bg-gray-800 text-white p-3 rounded-lg shadow-lg border border-gray-600">
                          <div class="font-semibold text-lg mb-2">${source.name}</div>
                          <div class="text-sm space-y-1">
                            <div><span class="text-gray-300">Stage:</span> ${stageNames[stageIdx]}</div>
                            <div><span class="text-gray-300">Value:</span> <span class="font-semibold">${source.value.toLocaleString()}</span></div>
                            <div><span class="text-gray-300">% of Stage:</span> <span class="font-semibold">${percentage}%</span></div>
                            <div><span class="text-gray-300">Intent Score:</span> <span class="font-semibold">${intentScore}</span></div>
                            ${conversionRate ? `<div><span class="text-gray-300">Conversion:</span> <span class="font-semibold">${conversionRate}%</span></div>` : ''}
                            <div class="text-xs text-gray-500 mt-2">Click to highlight entire stage</div>
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

                    // Para el último stage (High Intent Users), usar rectángulo
                    const shape = stageIdx === 3 ? (
                      <rect
                        key={`segment-${stageIdx}-${sourceIdx}`}
                        x={segX}
                        y={y}
                        width={segmentWidth}
                        height={stageHeight}
                        fill={segmentColor}
                        opacity={opacity}
                        onClick={handleClick}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onMouseMove={handleMouseMove}
                        className="cursor-pointer transition-all duration-200"
                        stroke={isStageActive ? "#FFFFFF" : "#2D3748"}
                        strokeWidth={isStageActive ? "2" : "0.5"}
                      />
                    ) : (
                      <polygon
                        key={`segment-${stageIdx}-${sourceIdx}`}
                        points={`${segX},${y} ${segX + segmentWidth},${y} ${nextSegXPos + nextSegW},${y + stageHeight} ${nextSegXPos},${y + stageHeight}`}
                        fill={segmentColor}
                        opacity={opacity}
                        onClick={handleClick}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onMouseMove={handleMouseMove}
                        className="cursor-pointer transition-all duration-200"
                        stroke={isStageActive ? "#FFFFFF" : "#2D3748"}
                        strokeWidth={isStageActive ? "2" : "0.5"}
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

        {/* Labels de fuentes encima del primer nivel */}
        {(() => {
          const firstStageData = funnelData[0];
          const total = stageWidths[0].total;
          const maxTotal = Math.max(...stageWidths.map(s => s.total));
          const currentWidth = maxWidth * (total / maxTotal);
          const x = (svgWidth - currentWidth) / 2;
          let currentSegX = x;
          
          return firstStageData.sources.map((source, sourceIdx) => {
            const segmentWidth = (source.value / total) * currentWidth;
            const labelX = currentSegX + segmentWidth / 2;
            const labelY = startY - 15;
            
            // Actualizar posición para siguiente segmento
            currentSegX += segmentWidth;
            
            return (
              <text
                key={`source-label-${sourceIdx}`}
                x={labelX}
                y={labelY}
                textAnchor="middle"
                fontSize="14"
                fill="#E0E0E0"
                fontWeight="600"
              >
                {source.name}
              </text>
            );
          });
        })()}

        {/* Leyendas alineadas con cada bloque */}
        {['Website Visits', 'Prospective Purchasers', 'Moderate Intent Users', 'High Intent Users'].map((label, idx) => {
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
              Despite lowest volume (1,200 visits), organic traffic shows <strong>Intent Score of 30.0</strong> in high intent users - the highest possible score with 60% conversion from moderate to high intent.
            </p>
          </div>
          <div className="bg-gray-700 rounded-md p-4">
            <h4 className="font-semibold text-blue-400 mb-2">💰 Google Ads Efficiency</h4>
            <p className="text-gray-300">
              Google Ads shows <strong>Intent Score progression from 18.7 to 29.2</strong> - excellent ROI with 50% conversion rate at each intent stage, delivering 455 high-intent users.
            </p>
          </div>
          <div className="bg-gray-700 rounded-md p-4">
            <h4 className="font-semibold text-orange-400 mb-2">📊 Intent Segmentation</h4>
            <p className="text-gray-300">
              <strong>Moderate Intent:</strong> 3,056 users identified. <strong>High Intent:</strong> 1,253 premium users ready for conversion - clear segmentation for targeted campaigns.
            </p>
          </div>
          <div className="bg-gray-700 rounded-md p-4">
            <h4 className="font-semibold text-purple-400 mb-2">🚀 Interactive Analysis</h4>
            <p className="text-gray-300">
              <strong>Click on any segment</strong> to illuminate the entire stage and reveal intent score colors (blue=low, green=high). Multiple stages can be active simultaneously.
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
        {/* Legend - Intent Score Scale */}
        <div className="flex justify-center items-center gap-8 mb-8">
          <span className="text-sm font-medium text-gray-300">Intent Score:</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: getColorByIntentScore(5, false) }}></div>
              <span className="text-sm text-gray-400">Low (0-10)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: getColorByIntentScore(15, false) }}></div>
              <span className="text-sm text-gray-400">Medium (10-20)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: getColorByIntentScore(25, false) }}></div>
              <span className="text-sm text-gray-400">High (20-30)</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Sources:</span>
            <span>Facebook • Instagram • Google Ads • Organic</span>
          </div>
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
            {['Website Visits', 'Prospective Purchasers', 'Moderate Intent Users', 'High Intent Users'].map((stageName, idx) => (
              <tr key={idx} className="border-b border-gray-700 hover:bg-gray-700 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-300">{stageName}</td>
                {funnelData[idx].sources.map((source, srcIdx) => (
                  <td key={srcIdx} className="px-4 py-3 text-center text-gray-400">
                    {source.value.toLocaleString()}
                  </td>
                ))}
                <td className="px-4 py-3 text-center font-semibold text-gray-200">
                  {funnelData[idx].sources.reduce((sum, src) => sum + src.value, 0).toLocaleString()}
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