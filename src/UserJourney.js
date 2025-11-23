import React, { useState } from 'react';

const UserJourney = () => {
  const [hoveredFlow, setHoveredFlow] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, content: '' });

  // Fuentes de tráfico (mismas que el funnel)
  const sources = [
    { name: 'Facebook', color: '#FF9D3D' },
    { name: 'Instagram', color: '#FFB366' },
    { name: 'Google Ads', color: '#FFC699' },
    { name: 'Direct', color: '#FFE0CC' }
  ];

  // Datos de journeys - van diluyéndose progresivamente
  const journeyData = {
    // Visita 1 → Visita 2
    visit1_to_visit2: [
      { from: 'Facebook', to: 'Facebook', value: 1200 },
      { from: 'Facebook', to: 'Instagram', value: 800 },
      { from: 'Facebook', to: 'Google Ads', value: 400 },
      { from: 'Facebook', to: 'Direct', value: 600 },
      
      { from: 'Instagram', to: 'Instagram', value: 700 },
      { from: 'Instagram', to: 'Facebook', value: 500 },
      { from: 'Instagram', to: 'Direct', value: 300 },
      { from: 'Instagram', to: 'Google Ads', value: 200 },
      
      { from: 'Google Ads', to: 'Google Ads', value: 400 },
      { from: 'Google Ads', to: 'Direct', value: 250 },
      { from: 'Google Ads', to: 'Facebook', value: 200 },
      { from: 'Google Ads', to: 'Instagram', value: 150 },
      
      { from: 'Direct', to: 'Direct', value: 300 },
      { from: 'Direct', to: 'Facebook', value: 150 },
      { from: 'Direct', to: 'Instagram', value: 100 },
      { from: 'Direct', to: 'Google Ads', value: 50 }
    ],
    
    // Visita 2 → Visita 3 (más dilución)
    visit2_to_visit3: [
      { from: 'Facebook', to: 'Facebook', value: 600 },
      { from: 'Facebook', to: 'Instagram', value: 350 },
      { from: 'Facebook', to: 'Direct', value: 300 },
      { from: 'Facebook', to: 'Google Ads', value: 150 },
      
      { from: 'Instagram', to: 'Instagram', value: 450 },
      { from: 'Instagram', to: 'Facebook', value: 250 },
      { from: 'Instagram', to: 'Direct', value: 200 },
      { from: 'Instagram', to: 'Google Ads', value: 100 },
      
      { from: 'Google Ads', to: 'Google Ads', value: 200 },
      { from: 'Google Ads', to: 'Direct', value: 150 },
      { from: 'Google Ads', to: 'Facebook', value: 100 },
      { from: 'Google Ads', to: 'Instagram', value: 75 },
      
      { from: 'Direct', to: 'Direct', value: 200 },
      { from: 'Direct', to: 'Facebook', value: 80 },
      { from: 'Direct', to: 'Instagram', value: 60 },
      { from: 'Direct', to: 'Google Ads', value: 30 }
    ],
    
    // Visita 3 → Visita 4 (máxima dilución)
    visit3_to_visit4: [
      { from: 'Facebook', to: 'Facebook', value: 250 },
      { from: 'Facebook', to: 'Instagram', value: 150 },
      { from: 'Facebook', to: 'Direct', value: 120 },
      { from: 'Facebook', to: 'Google Ads', value: 80 },
      
      { from: 'Instagram', to: 'Instagram', value: 200 },
      { from: 'Instagram', to: 'Facebook', value: 100 },
      { from: 'Instagram', to: 'Direct', value: 80 },
      { from: 'Instagram', to: 'Google Ads', value: 50 },
      
      { from: 'Google Ads', to: 'Google Ads', value: 80 },
      { from: 'Google Ads', to: 'Direct', value: 60 },
      { from: 'Google Ads', to: 'Facebook', value: 40 },
      { from: 'Google Ads', to: 'Instagram', value: 30 },
      
      { from: 'Direct', to: 'Direct', value: 90 },
      { from: 'Direct', to: 'Facebook', value: 35 },
      { from: 'Direct', to: 'Instagram', value: 25 },
      { from: 'Direct', to: 'Google Ads', value: 15 }
    ]
  };

  // Calcular totales por visita y fuente
  const calculateTotals = () => {
    const totals = {
      visit1: {},
      visit2: {},
      visit3: {},
      visit4: {}
    };

    // Visita 1 (entrada inicial)
    sources.forEach(source => {
      totals.visit1[source.name] = journeyData.visit1_to_visit2
        .filter(flow => flow.from === source.name)
        .reduce((sum, flow) => sum + flow.value, 0);
    });

    // Visita 2
    sources.forEach(source => {
      totals.visit2[source.name] = journeyData.visit1_to_visit2
        .filter(flow => flow.to === source.name)
        .reduce((sum, flow) => sum + flow.value, 0);
    });

    // Visita 3
    sources.forEach(source => {
      totals.visit3[source.name] = journeyData.visit2_to_visit3
        .filter(flow => flow.to === source.name)
        .reduce((sum, flow) => sum + flow.value, 0);
    });

    // Visita 4
    sources.forEach(source => {
      totals.visit4[source.name] = journeyData.visit3_to_visit4
        .filter(flow => flow.to === source.name)
        .reduce((sum, flow) => sum + flow.value, 0);
    });

    return totals;
  };

  const totals = calculateTotals();

  // Función para encontrar todas las journeys que pasan por un nodo específico
  const findJourneysForNode = (visitIndex, sourceName) => {
    const journeys = [];
    
    if (visitIndex === 0) {
      // Para Visit 1, encontrar todas las journeys que empiezan aquí
      const visit1Flows = journeyData.visit1_to_visit2.filter(f => f.from === sourceName);
      visit1Flows.forEach(flow1 => {
        const visit2Flows = journeyData.visit2_to_visit3.filter(f => f.from === flow1.to);
        visit2Flows.forEach(flow2 => {
          const visit3Flows = journeyData.visit3_to_visit4.filter(f => f.from === flow2.to);
          visit3Flows.forEach(flow3 => {
            journeys.push([
              { visit: 0, source: sourceName },
              { visit: 1, source: flow1.to },
              { visit: 2, source: flow2.to },
              { visit: 3, source: flow3.to }
            ]);
          });
        });
      });
    } else if (visitIndex === 1) {
      // Para Visit 2, encontrar journeys que pasan por aquí
      const visit1Flows = journeyData.visit1_to_visit2.filter(f => f.to === sourceName);
      visit1Flows.forEach(flow1 => {
        const visit2Flows = journeyData.visit2_to_visit3.filter(f => f.from === sourceName);
        visit2Flows.forEach(flow2 => {
          const visit3Flows = journeyData.visit3_to_visit4.filter(f => f.from === flow2.to);
          visit3Flows.forEach(flow3 => {
            journeys.push([
              { visit: 0, source: flow1.from },
              { visit: 1, source: sourceName },
              { visit: 2, source: flow2.to },
              { visit: 3, source: flow3.to }
            ]);
          });
        });
      });
    } else if (visitIndex === 2) {
      // Para Visit 3, encontrar journeys que pasan por aquí
      const visit2Flows = journeyData.visit2_to_visit3.filter(f => f.to === sourceName);
      visit2Flows.forEach(flow2 => {
        const visit1Flows = journeyData.visit1_to_visit2.filter(f => f.to === flow2.from);
        visit1Flows.forEach(flow1 => {
          const visit3Flows = journeyData.visit3_to_visit4.filter(f => f.from === sourceName);
          visit3Flows.forEach(flow3 => {
            journeys.push([
              { visit: 0, source: flow1.from },
              { visit: 1, source: flow2.from },
              { visit: 2, source: sourceName },
              { visit: 3, source: flow3.to }
            ]);
          });
        });
      });
    } else if (visitIndex === 3) {
      // Para Visit 4, encontrar todas las journeys que terminan aquí
      const visit3Flows = journeyData.visit3_to_visit4.filter(f => f.to === sourceName);
      visit3Flows.forEach(flow3 => {
        const visit2Flows = journeyData.visit2_to_visit3.filter(f => f.to === flow3.from);
        visit2Flows.forEach(flow2 => {
          const visit1Flows = journeyData.visit1_to_visit2.filter(f => f.to === flow2.from);
          visit1Flows.forEach(flow1 => {
            journeys.push([
              { visit: 0, source: flow1.from },
              { visit: 1, source: flow2.from },
              { visit: 2, source: flow3.from },
              { visit: 3, source: sourceName }
            ]);
          });
        });
      });
    }
    
    return journeys;
  };

  const renderSankeyDiagram = () => {
    const svgWidth = 1200;
    const svgHeight = 600;
    const visitWidth = 120;
    const visitSpacing = 220;
    const visits = ['visit1', 'visit2', 'visit3', 'visit4'];

    // Mejor distribución del espacio
    const topMargin = 60;
    const bottomMargin = 40;
    const availableHeight = svgHeight - topMargin - bottomMargin;
    const minNodeHeight = 20;
    const nodeGap = 12;
    
    // Calcular total por visita para escalado proporcional
    const visitTotals = visits.map(visit => 
      sources.reduce((sum, source) => sum + (totals[visit][source.name] || 0), 0)
    );
    const maxVisitTotal = Math.max(...visitTotals);
    
    const getNodePosition = (visitIndex, sourceIndex, value) => {
      const x = 100 + visitIndex * visitSpacing;
      
      // Escalado proporcional basado en el total de la visita
      const visitTotal = visitTotals[visitIndex];
      const scaleFactor = visitTotal > 0 ? availableHeight / maxVisitTotal : 0;
      
      // Calcular alturas proporcionales para esta visita
      const sourceValues = sources.map(s => totals[visits[visitIndex]][s.name] || 0);
      const nonZeroValues = sourceValues.filter(v => v > 0);
      const totalNonZeroGaps = Math.max(0, nonZeroValues.length - 1) * nodeGap;
      const heightForNodes = availableHeight * (visitTotal / maxVisitTotal) - totalNonZeroGaps;
      
      const nodeHeights = sourceValues.map(v => {
        if (v === 0) return 0;
        return Math.max(minNodeHeight, (v / visitTotal) * heightForNodes);
      });
      
      // Centrar verticalmente los nodos de esta visita
      const totalUsedHeight = nodeHeights.reduce((sum, h) => sum + h, 0) + 
                             (nodeHeights.filter(h => h > 0).length - 1) * nodeGap;
      const startY = topMargin + (availableHeight - totalUsedHeight) / 2;
      
      // Calcular Y para este nodo específico
      let y = startY;
      for (let i = 0; i < sourceIndex; i++) {
        if (nodeHeights[i] > 0) {
          y += nodeHeights[i] + nodeGap;
        }
      }
      
      return { 
        x, 
        y, 
        height: nodeHeights[sourceIndex],
        visitTotal,
        maxVisitTotal,
        nodeHeights,
        startY
      };
    };

    // Renderizar flujos (curvas)
    const renderFlows = (flowData, fromVisitIndex, toVisitIndex) => {
      return flowData.map((flow, index) => {
        const fromSourceIndex = sources.findIndex(s => s.name === flow.from);
        const toSourceIndex = sources.findIndex(s => s.name === flow.to);
        // Usar la escala de nodos para los flujos
        const fromPos = getNodePosition(fromVisitIndex, fromSourceIndex, totals[visits[fromVisitIndex]][flow.from]);
        const toPos = getNodePosition(toVisitIndex, toSourceIndex, totals[visits[toVisitIndex]][flow.to]);

        // Calcular altura del flujo basada en el valor proporcional
        const flowHeight = Math.max(1, (flow.value / fromPos.visitTotal) * fromPos.height * 0.8);
        const color = sources.find(s => s.name === flow.from)?.color || '#ccc';
        // Calcular offset Y para múltiples flujos desde el mismo nodo
        // Calcular posiciones Y de inicio y fin del flujo
        const fromFlows = flowData.filter(f => f.from === flow.from);
        const flowIndex = fromFlows.findIndex(f => f.to === flow.to);
        const previousFlowsHeight = fromFlows.slice(0, flowIndex).reduce((sum, f) => {
          return sum + Math.max(1, (f.value / fromPos.visitTotal) * fromPos.height * 0.8);
        }, 0);
        const fromY = fromPos.y + fromPos.height * 0.1 + previousFlowsHeight;
        
        // Para el destino
        const toFlows = flowData.filter(f => f.to === flow.to);
        const toFlowIndex = toFlows.findIndex(f => f.from === flow.from);
        const previousToFlowsHeight = toFlows.slice(0, toFlowIndex).reduce((sum, f) => {
          return sum + Math.max(1, (f.value / toPos.visitTotal) * toPos.height * 0.8);
        }, 0);
        const toY = toPos.y + toPos.height * 0.1 + previousToFlowsHeight;
        const midX = (fromPos.x + visitWidth + toPos.x) / 2;
        const pathData = `
          M ${fromPos.x + visitWidth} ${fromY}
          C ${midX} ${fromY}, ${midX} ${toY}, ${toPos.x} ${toY}
          L ${toPos.x} ${toY + flowHeight}
          C ${midX} ${toY + flowHeight}, ${midX} ${fromY + flowHeight}, ${fromPos.x + visitWidth} ${fromY + flowHeight}
          Z
        `;
        const isHovered = hoveredFlow === `${fromVisitIndex}-${toVisitIndex}-${index}`;
        const handleMouseEnter = (e) => {
          setHoveredFlow(`${fromVisitIndex}-${toVisitIndex}-${index}`);
          setTooltip({
            show: true,
            x: e.clientX,
            y: e.clientY - 10,
            content: `${flow.from} → ${flow.to}: ${flow.value} users`
          });
        };
        const handleMouseLeave = () => {
          setHoveredFlow(null);
          setTooltip({ show: false, x: 0, y: 0, content: '' });
        };
        const handleMouseMove = (e) => {
          if (isHovered) {
            setTooltip(prev => ({
              ...prev,
              x: e.clientX,
              y: e.clientY - 10
            }));
          }
        };
        // Determinar si este flujo está en una journey resaltada
        let isInHighlightedJourney = false;
        if (hoveredNode) {
          const journeys = findJourneysForNode(hoveredNode.visitIndex, hoveredNode.sourceName);
          isInHighlightedJourney = journeys.some(journey => {
            const fromStep = journey[fromVisitIndex];
            const toStep = journey[toVisitIndex];
            return fromStep && toStep && fromStep.source === flow.from && toStep.source === flow.to;
          });
        }
        
        let flowOpacity = 0.4;
        if (isHovered) {
          flowOpacity = 0.9;
        } else if (hoveredNode) {
          flowOpacity = isInHighlightedJourney ? 0.8 : 0.1;
        }

        return (
          <path
            key={`flow-${fromVisitIndex}-${toVisitIndex}-${index}`}
            d={pathData}
            fill={color}
            opacity={flowOpacity}
            stroke={isHovered ? 'white' : 'none'}
            strokeWidth={isHovered ? 1 : 0}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            className="cursor-pointer transition-all duration-300"
          />
        );
      });
    };

    return (
      <svg width={svgWidth} height={svgHeight} className="mx-auto">
        {/* Flujos */}
        {renderFlows(journeyData.visit1_to_visit2, 0, 1)}
        {renderFlows(journeyData.visit2_to_visit3, 1, 2)}
        {renderFlows(journeyData.visit3_to_visit4, 2, 3)}
        
        {/* Nodos simplificados y limpios */}
        {visits.map((visit, visitIndex) => 
          sources.map((source, sourceIndex) => {
            const value = totals[visit][source.name] || 0;
            if (value === 0) return null;
            
            const pos = getNodePosition(visitIndex, sourceIndex, value);
            
            // Determinar si este nodo está en una journey resaltada
            let isInHighlightedJourney = false;
            let nodeOpacity = 0.85;
            
            if (hoveredNode) {
              if (hoveredNode.visitIndex === visitIndex && hoveredNode.sourceName === source.name) {
                nodeOpacity = 1.0; // Nodo seleccionado
              } else {
                const journeys = findJourneysForNode(hoveredNode.visitIndex, hoveredNode.sourceName);
                isInHighlightedJourney = journeys.some(journey => {
                  const currentStep = journey[visitIndex];
                  return currentStep && currentStep.source === source.name;
                });
                nodeOpacity = isInHighlightedJourney ? 0.9 : 0.2;
              }
            }
            
            return (
              <g key={`node-${visitIndex}-${sourceIndex}`}>
                {/* Nodo principal */}
                <rect
                  x={pos.x}
                  y={pos.y}
                  width={visitWidth}
                  height={pos.height}
                  fill={source.color}
                  opacity={nodeOpacity}
                  rx={6}
                  stroke={hoveredNode?.visitIndex === visitIndex && hoveredNode?.sourceName === source.name ? '#ffffff' : 'none'}
                  strokeWidth={2}
                  onMouseEnter={() => setHoveredNode({ visitIndex, sourceName: source.name })}
                  onMouseLeave={() => setHoveredNode(null)}
                  className="cursor-pointer transition-all duration-300"
                />
                
                {/* Texto del valor */}
                <text
                  x={pos.x + visitWidth / 2}
                  y={pos.y + pos.height / 2}
                  textAnchor="middle"
                  dy="0.35em"
                  fontSize="14"
                  fill="white"
                  fontWeight="700"
                  style={{ pointerEvents: 'none' }}
                >
                  {value}
                </text>
                
                {/* Sombra interior para dar profundidad */}
                <rect
                  x={pos.x}
                  y={pos.y}
                  width={visitWidth}
                  height={4}
                  fill="rgba(255,255,255,0.2)"
                  rx={6}
                  style={{ pointerEvents: 'none' }}
                />
              </g>
            );
          })
        )}
        
        {/* Labels de visitas */}
        {['Visit 1', 'Visit 2', 'Visit 3', 'Visit 4'].map((label, index) => (
          <text
            key={`visit-label-${index}`}
            x={100 + index * visitSpacing + visitWidth / 2}
            y={40}
            textAnchor="middle"
            fontSize="16"
            fill="#E0E0E0"
            fontWeight="600"
          >
            {label}
          </text>
        ))}
        
        {/* Labels de fuentes - alineados con los nodos de la primera visita */}
        {sources.map((source, index) => {
          const nodePos = getNodePosition(0, index, totals.visit1[source.name]);
          if (nodePos.height === 0) return null;
          const centerY = nodePos.y + nodePos.height / 2;
          return (
            <text
              key={`source-label-${index}`}
              x={85}
              y={centerY + 5}
              textAnchor="end"
              fontSize="13"
              fill="#B0B0B0"
              fontWeight="500"
            >
              {source.name}
            </text>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="w-full bg-gray-900 p-8 rounded-lg min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-200">
        User Journey Flow
      </h1>
      
      <div className="bg-gray-800 rounded-lg p-8 shadow-2xl border border-gray-700">
        {/* Legend */}
        <div className="flex justify-center gap-12 mb-8">
          {sources.map(source => (
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
        
        {/* Sankey Diagram */}
        <div className="overflow-x-auto pb-4">
          <div 
            style={{ 
              minWidth: '1200px',
              display: 'flex',
              justifyContent: 'center',
              paddingBottom: '40px',
            }}
          >
            {renderSankeyDiagram()}
          </div>
        </div>
        
        {/* Description */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>This diagram shows how users flow between different traffic sources across multiple visits.</p>
          <p>Each visit shows progressive dilution as fewer users return for subsequent visits.</p>
        </div>
      </div>
      
      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-4 gap-4">
        {['visit1', 'visit2', 'visit3', 'visit4'].map((visit, index) => {
          const total = sources.reduce((sum, source) => sum + (totals[visit][source.name] || 0), 0);
          return (
            <div key={visit} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="text-lg font-semibold text-gray-200 mb-2">
                Visit {index + 1}
              </h3>
              <p className="text-2xl font-bold text-blue-400">{total}</p>
              <p className="text-sm text-gray-400">Total Users</p>
            </div>
          );
        })}
      </div>
      
      {/* Tooltip */}
      {tooltip.show && (
        <div
          className="fixed bg-gray-700 text-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium z-50 pointer-events-none border border-gray-600"
          style={{
            left: tooltip.x + 10,
            top: tooltip.y,
            transform: 'translateY(-100%)'
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
};

export default UserJourney;