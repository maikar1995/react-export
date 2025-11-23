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
    const svgWidth = 1400;
    const svgHeight = 700;
    const visitWidth = 160;
    const visitSpacing = 280;
    const nodeHeight = 20;
    const nodeSpacing = 30;

    const visits = ['visit1', 'visit2', 'visit3', 'visit4'];
    const maxTotalByVisit = visits.map(visit => 
      Math.max(...sources.map(source => totals[visit][source.name] || 0))
    );
    const globalMax = Math.max(...maxTotalByVisit);

    // Escalado ajustado: calcular factor de reducción global para que todo quepa
    const topMargin = 80;
    const bottomMargin = 40;
    const availableHeight = svgHeight - topMargin - bottomMargin;
    const minNodeHeight = 10;
    const minGap = 6;
    const totalGaps = minGap * (sources.length - 1);
    const heightForNodes = availableHeight - totalGaps;
    
    // Encontrar el valor individual máximo global
    const globalMaxValue = Math.max(
      ...['visit1', 'visit2', 'visit3', 'visit4'].flatMap(visit =>
        sources.map(s => totals[visit][s.name] || 0)
      )
    );
    
    // Calcular escalado proporcional puro para cada columna
    const columnScales = ['visit1', 'visit2', 'visit3', 'visit4'].map(visit => {
      const sourceValues = sources.map(s => totals[visit][s.name] || 0);
      const pureHeights = sourceValues.map(v => v === 0 ? 0 : Math.max(minNodeHeight, (v / globalMaxValue) * heightForNodes));
      const totalHeight = pureHeights.reduce((sum, h) => sum + h, 0);
      return { visit, totalHeight, pureHeights };
    });
    
    // Encontrar la columna que más se excede y calcular factor de reducción
    const maxTotalHeight = Math.max(...columnScales.map(col => col.totalHeight));
    const reductionFactor = maxTotalHeight > heightForNodes ? heightForNodes / maxTotalHeight : 1;
    
    const getNodePosition = (visitIndex, sourceIndex, value) => {
      const x = 180 + visitIndex * visitSpacing;
      const visit = visits[visitIndex];
      const columnScale = columnScales[visitIndex];
      
      // Aplicar factor de reducción a las alturas proporcionales
      const adjustedHeights = columnScale.pureHeights.map(h => h * reductionFactor);
      
      // Calcular Y para este nodo
      let y = topMargin;
      for (let i = 0; i < sourceIndex; i++) {
        y += adjustedHeights[i] + minGap;
      }
      
      return { 
        x, 
        y, 
        height: adjustedHeights[sourceIndex], 
        nodeHeights: adjustedHeights, 
        minGap, 
        topMargin, 
        globalMax: globalMaxValue, 
        availableHeight: heightForNodes,
        reductionFactor
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
        const fromValue = totals[visits[fromVisitIndex]][flow.from];
        const toValue = totals[visits[toVisitIndex]][flow.to];
        // Escalado ajustado: aplicar el mismo factor de reducción a los flujos
        const globalMax = fromPos.globalMax;
        const availableHeight = fromPos.availableHeight;
        const reductionFactor = fromPos.reductionFactor;
        const flowHeight = Math.max(2, (flow.value / globalMax) * availableHeight * reductionFactor);
        const color = sources.find(s => s.name === flow.from)?.color || '#ccc';
        // Calcular offset Y para múltiples flujos desde el mismo nodo
        const fromFlows = flowData.filter(f => f.from === flow.from);
        const flowIndex = fromFlows.findIndex(f => f.to === flow.to);
        const previousFlowsHeight = fromFlows.slice(0, flowIndex).reduce((sum, f) => {
          return sum + Math.max(2, (f.value / globalMax) * availableHeight * reductionFactor);
        }, 0);
        const fromY = fromPos.y + previousFlowsHeight;
        // Para el destino, hay que sumar los flujos previos que llegan a ese destino
        const toFlows = flowData.filter(f => f.to === flow.to);
        const toFlowIndex = toFlows.findIndex(f => f.from === flow.from);
        const previousToFlowsHeight = toFlows.slice(0, toFlowIndex).reduce((sum, f) => {
          return sum + Math.max(2, (f.value / globalMax) * availableHeight * reductionFactor);
        }, 0);
        const toY = toPos.y + previousToFlowsHeight;
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
        
        {/* Nodos */}
        {visits.map((visit, visitIndex) => 
          sources.map((source, sourceIndex) => {
            const value = totals[visit][source.name] || 0;
            if (value === 0) return null;
            
            const pos = getNodePosition(visitIndex, sourceIndex, value);
            
            // Determinar si este nodo está en una journey resaltada
            let isInHighlightedJourney = false;
            if (hoveredNode) {
              const journeys = findJourneysForNode(hoveredNode.visitIndex, hoveredNode.sourceName);
              isInHighlightedJourney = journeys.some(journey => {
                const step = journey[visitIndex];
                return step && step.source === source.name;
              });
            }
            
            let nodeOpacity = 0.8;
            if (hoveredNode) {
              if (hoveredNode.visitIndex === visitIndex && hoveredNode.sourceName === source.name) {
                nodeOpacity = 1.0; // Nodo hover
              } else if (isInHighlightedJourney) {
                nodeOpacity = 0.9; // Nodos en journeys resaltadas
              } else {
                nodeOpacity = 0.2; // Nodos difuminados
              }
            }

            const handleNodeMouseEnter = () => {
              setHoveredNode({ visitIndex, sourceName: source.name });
            };

            const handleNodeMouseLeave = () => {
              setHoveredNode(null);
            };

            return (
              <g key={`node-${visitIndex}-${sourceIndex}`}>
                <rect
                  x={pos.x}
                  y={pos.y}
                  width={visitWidth}
                  height={pos.height}
                  fill={source.color}
                  opacity={nodeOpacity}
                  rx={4}
                  onMouseEnter={handleNodeMouseEnter}
                  onMouseLeave={handleNodeMouseLeave}
                  className="cursor-pointer transition-all duration-300"
                />
                <text
                  x={pos.x + visitWidth / 2}
                  y={pos.y + pos.height / 2}
                  textAnchor="middle"
                  dy="0.35em"
                  fontSize="12"
                  fill="white"
                  fontWeight="600"
                  style={{ pointerEvents: 'none' }}
                >
                  {value}
                </text>
              </g>
            );
          })
        )}
        
        {/* Labels de visitas */}
        {['Visit 1', 'Visit 2', 'Visit 3', 'Visit 4'].map((label, index) => (
          <text
            key={`visit-label-${index}`}
            x={180 + index * visitSpacing + visitWidth / 2}
            y={50}
            textAnchor="middle"
            fontSize="18"
            fill="#E0E0E0"
            fontWeight="600"
          >
            {label}
          </text>
        ))}
        
        {/* Labels de fuentes - alineados con los nodos de la primera visita */}
        {sources.map((source, index) => {
          const nodePos = getNodePosition(0, index, totals.visit1[source.name]);
          const centerY = nodePos.y + nodePos.height / 2;
          return (
            <text
              key={`source-label-${index}`}
              x={165}
              y={centerY + 5}
              textAnchor="end"
              fontSize="15"
              fill="#A0A0A0"
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
              minWidth: '1500px',
              overflowY: 'auto',
              maxHeight: '1100px',
              paddingLeft: '40px',
              paddingBottom: '80px',
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