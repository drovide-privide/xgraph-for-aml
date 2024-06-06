// src/components/Graph.jsx
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const Graph = () => {
  const svgRef = useRef();

  useEffect(() => {
    fetch('/api/graph')
      .then(response => response.json())
      .then(data => {
        const uniqueNodes = {};
        data.nodes.forEach(node => {
          uniqueNodes[node.name] = node;
        });

        const nodes = Object.values(uniqueNodes).map(node => ({ ...node, id: node.name }));
        const links = data.links;

        const svg = d3.select(svgRef.current)
          .attr('width', '100%')
          .attr('height', '100%')
          .attr('viewBox', '0 0 960 600');

        const simulation = d3.forceSimulation(nodes)
          .force("link", d3.forceLink(links).id(d => d.id).distance(100))
          .force("charge", d3.forceManyBody().strength(-300))
          .force("center", d3.forceCenter(480, 300));

        const link = svg.append("g")
          .attr("class", "links")
          .selectAll("line")
          .data(links)
          .enter().append("line")
          .attr("class", "link");

        const linkLabel = svg.append("g")
          .attr("class", "link-labels")
          .selectAll("text")
          .data(links)
          .enter().append("text")
          .attr("class", "link-label")
          .attr("dy", -3)
          .attr("dx", 5)
          .text(d => d.type);

        const node = svg.append("g")
          .attr("class", "nodes")
          .selectAll("g")
          .data(nodes)
          .enter().append("g")
          .attr("class", "node")
          .on("mouseover", (event, d) => {
            d3.select("#node-name").text(`Name: ${d.name}`);
            const interactions = links
              .filter(link => link.source.id === d.id || link.target.id === d.id)
              .map(link => {
                const otherNode = link.source.id === d.id ? link.target : link.source;
                return `${link.type} with ${otherNode.name}`;
              });
            const interactionsList = d3.select("#node-interactions").selectAll("li").data(interactions);
            interactionsList.enter().append("li").merge(interactionsList).text(d => d);
            interactionsList.exit().remove();
          })
          .on("mouseout", () => {
            d3.select("#node-name").text("Hover over a node to see details");
            d3.select("#node-interactions").selectAll("li").remove();
          });

        node.append("circle")
          .attr("r", 10);

        node.append("text")
          .attr("dy", -15)
          .text(d => d.name);

        simulation.on("tick", () => {
          link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

          linkLabel
            .attr("x", d => (d.source.x + d.target.x) / 2)
            .attr("y", d => (d.source.y + d.target.y) / 2);

          node
            .attr("transform", d => `translate(${d.x},${d.y})`);
        });
      })
      .catch(error => console.error('Error loading graph data:', error));
  }, []);

  return (
    <div className="flex-grow relative bg-gray-400">
      <svg ref={svgRef} className="w-full h-full"></svg>
      <div className="absolute top-0 right-0 p-4 bg-white shadow rounded">
        <h2 className="text-lg">Node Information</h2>
        <p id="node-name" className="mb-2">Hover over a node to see details</p>
        <ul id="node-interactions"></ul>
      </div>
    </div>
  );
};

export default Graph;
