import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import axios from 'axios';
import './GraphBox.css'; // Import the CSS file for animations

const GraphBox = ({ selectedMlId }) => {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [explanation, setExplanation] = useState('');
  const [isExplanationVisible, setIsExplanationVisible] = useState(false); // Start minimized
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [mlType, setMlType] = useState(''); // Store ML type of the selected case
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get('http://localhost:5506/api/graph', {
          params: { mlId: selectedMlId || '' } // Fetch all nodes if no mlId is provided
        });
        console.log('hi')
        setGraphData(response.data);

        if (selectedMlId) {
          const mlCaseResponse = await axios.get('http://localhost:5506/api/mlcase', {
            params: { mlId: selectedMlId }
          });
          setExplanation(mlCaseResponse.data.explaination);
          setChatHistory([]); // Reset chat history when a new case is selected
          setIsExplanationVisible(true); // Open the explanation box
          setShowChat(true); // Show chat when a specific case is selected
          setMlType(mlCaseResponse.data.ML_type); // Set ML type for the selected case
        } else {
          setExplanation('');
          setIsExplanationVisible(false); // Minimize explanation box when showing all nodes
          setShowChat(false); // Hide chat when showing all nodes
          setMlType(''); // Reset ML type
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data', error);
        setLoading(false);
      }
    };

    getData();
  }, [selectedMlId]);
  // setLoading(true);
  useEffect(() => {
    const svg = d3.select('#graph')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', '0 0 800 600');

    svg.selectAll('*').remove();

    // Define arrow markers for graph links
    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 20) // Extend the arrow length
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('xoverflow', 'visible')
      .append('svg:path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', '#999')
      .style('stroke', 'none');

    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background', '#fff')
      .style('border', '1px solid #ccc')
      .style('padding', '10px')
      .style('border-radius', '4px')
      .style('box-shadow', '0 0 10px rgba(0,0,0,0.1)')
      .style('color', '#000');

    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    const g = svg.append('g');

    // Set initial positions of nodes if not already set
    graphData.nodes.forEach(node => {
      if (node.x === undefined) node.x = 400 + Math.random() * 200 - 100;
      if (node.y === undefined) node.y = 300 + Math.random() * 200 - 100;
    });

    const linkForceDistance = selectedMlId ? 50 : 30; // Closer distance when no ML ID is selected
    const chargeForceStrength = selectedMlId ? -100 : -50; // Adjust the spread of nodes

    const specialCases = ['gather-scatter', 'fan-in', 'fan-out', 'scatter-gather'];
    const isSpecialCase = specialCases.includes(mlType);

    const specialLinkForceDistance = isSpecialCase ? 150 : linkForceDistance;
    const specialChargeForceStrength = isSpecialCase ? -200 : chargeForceStrength;

    const simulation = d3.forceSimulation(graphData.nodes)
      .force('link', d3.forceLink(graphData.links).id(d => d.NAME).distance(specialLinkForceDistance)) // Adjust distance based on ML type
      .force('charge', d3.forceManyBody().strength(specialChargeForceStrength)) // Adjust strength based on ML type
      .force('center', d3.forceCenter(400, 300))
      .on('end', () => {
        // Zoom out to show all nodes when no specific ML case is selected
        if (!selectedMlId && graphData.nodes.length > 0) {
          const { width, height } = svg.node().getBoundingClientRect();
          const nodesWithCoords = graphData.nodes.filter(node => node.x !== undefined && node.y !== undefined);
          if (nodesWithCoords.length > 0) {
            const [minX, maxX] = d3.extent(nodesWithCoords, d => d.x);
            const [minY, maxY] = d3.extent(nodesWithCoords, d => d.y);
            const midX = (minX + maxX) / 2;
            const midY = (minY + maxY) / 2;
            const scale = 0.9 / Math.max((maxX - minX) / width, (maxY - minY) / height);
            const translate = [width / 2 - scale * midX, height / 2 - scale * midY];
            svg.call(zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));
          }
        
        }
      });

    // Apply center force only when displaying all cases
    if (!selectedMlId) {
      simulation.force('center', d3.forceCenter(-100, -300));
    }

    const link = g.append('g')
      .selectAll('line')
      .data(graphData.links)
      .enter().append('line')
      .attr('stroke-width', 2)
      .attr('stroke', '#999')
      .attr('marker-end', 'url(#arrowhead)')
      .on('mouseover', (event, d) => {
        tooltip.html(`<strong>Transaction Info:</strong><br>
                      Sender: ${d.SENDER_ACCOUNT}<br>
                      Receiver: ${d.RECEIVER_ACCOUNT}<br>
                      Amount: ${d.TX_AMOUNT || 'N/A'}<br>
                      Type: ${d.TX_TYPE}<br>
                      Timestamp: ${d.TIMESTAMP || 'N/A'}
                      `)
          .style('visibility', 'visible')
          .style('top', (event.pageY - 10) + 'px')
          .style('left', (event.pageX + 10) + 'px');
      })
      .on('mousemove', (event) => {
        tooltip.style('top', (event.pageY - 10) + 'px')
          .style('left', (event.pageX + 10) + 'px');
      })
      .on('mouseout', () => {
        tooltip.style('visibility', 'hidden');
      });

    const node = g.append('g')
      .selectAll('circle')
      .data(graphData.nodes)
      .enter().append('circle')
      .attr('r', 10)
      .attr('fill', d => d.flag_company.low === 1 ? '#ff7f0e' : '#69b3a2') // Use the flag_company.low property to set the color
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    const label = g.append('g')
      .selectAll('text')
      .data(graphData.nodes)
      .enter().append('text')
      .attr('dy', -15)
      .attr('text-anchor', 'middle')
      .attr('font-size', selectedMlId ? '12px' : '8px') // Adjust font size based on ML ID
      .text(d => d.NAME);

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

      label
        .attr('x', d => d.x)
        .attr('y', d => d.y);
    });

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      tooltip.remove();
    };
  }, [graphData, selectedMlId, mlType]);

  const handleChatSubmit = async (e) => {
    e.preventDefault();

    // Minimize the explanation box
    setIsExplanationVisible(false);

    // Add the user message to the chat history
    const newChatHistory = [
      { sender: 'user', message: chatInput }
    ];
    setChatHistory(newChatHistory.slice(-2)); // Keep only the last two messages
    setIsTyping(true);

    try {
      const response = await axios.post('http://localhost:5001/chat', {
        user_id: 'enjang69',
        ml_id: selectedMlId,
        prompt: chatInput
      });

      newChatHistory.push({ sender: 'backend', message: response.data.response });
      setChatHistory(newChatHistory.slice(-2)); // Keep only the last two messages
      setChatInput('');
    } catch (error) {
      console.error('Error sending message to backend', error);
      newChatHistory.push({ sender: 'backend', message: 'Error fetching response from server.' });
      setChatHistory(newChatHistory.slice(-2)); // Keep only the last two messages
    } finally {
      setIsTyping(false);
    }
  };

  const formatExplanation = (text) => {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  };

  const formatChatMessage = (text) => {
    const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                              .replace(/\n/g, '<br>');
    return { __html: formattedText };
  };

  return (
    <div className=" w-full h-full p-4 relative flex bg-gray-50">
      <div className="flex grow w-full h-full border border-gray-300 shadow-lg bg-white relative">
        {loading ? (
          <div className="flex w-full justify-center items-center h-full">
            <div className="loader">Loading...</div>
          </div>
        ) : (
          <>
            <svg id="graph" className="w-full h-full"></svg>
            {selectedMlId && (
              <div className="absolute top-0 left-0 m-4 p-2 bg-white bg-opacity-75 rounded shadow-lg">
                <h2 className="text-xl text-blue-500 font-bold">{selectedMlId}</h2>
              </div>
            )}
            <div className="absolute bottom-0 w-full p-4 bg-white bg-opacity-75">
              <div className="relative">
                <button
                  className="absolute top-0 right-0 m-2 p-1 bg-gray-200 hover:bg-gray-300 rounded"
                  onClick={() => setIsExplanationVisible(!isExplanationVisible)}
                >
                  {isExplanationVisible ? '-' : '+'}
                </button>
              </div>
              {isExplanationVisible && (
                <div className="h-32 overflow-y-scroll mb-2">
                  <p
                    className="text-black whitespace-pre-line"
                    dangerouslySetInnerHTML={{ __html: formatExplanation(explanation) }}
                  ></p>
                </div>
              )}
              {showChat && (
                <div className="chat-history mt-4">
                  {chatHistory.map((chat, index) => (
                    <div
                      key={index}
                      className={`p-2 my-2 rounded-lg chat-message ${
                        chat.sender === 'user' ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <span dangerouslySetInnerHTML={formatChatMessage(chat.message)}></span>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="p-2 my-2 rounded-lg chat-message bg-gray-100 text-gray-900">
                      <div className="typing-animation">...</div>
                    </div>
                  )}
                </div>
              )}
              {showChat && (
                <form onSubmit={handleChatSubmit} className="w-full mt-2">
                  <input
                    type="text"
                    className="chat-input shadow-lg shadow-indigo-500/40"
                    placeholder={`Tanyakan tentang kasus ${selectedMlId || 'Roundtrip-01'}`}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                  />
                </form>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GraphBox;
