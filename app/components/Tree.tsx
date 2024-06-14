"use client";
import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

interface DataNode {
  child: string;
  parent: string;
  spouse?: string;
}

export default function Tree() {
  const svgRef = useRef(null);
  const cardWidth = 168;
  const cardHeight = 178;
  const spouseOffset = 220;

  const [data, setData] = useState<DataNode[]>([
    { child: "Raj Rup", parent: "", spouse: "Desh" },
    { child: "Bhim Prasad", parent: "Raj Rup", spouse: "Krishna" },
    { child: "Dhanser", parent: "Raj Rup", spouse: "Chatra" },
    { child: "Rudra", parent: "Raj Rup", spouse: "Dhan" },
    { child: "Purna Kumar", parent: "Raj Rup", spouse: "Kalpana" },
    { child: "Siba kumar", parent: "Raj Rup", spouse: "Sujata" },
    { child: "Surya Man", parent: "Bhim Prasad", spouse: "Nirjala" },
    { child: "Niru", parent: "Bhim Prasad" },
    { child: "Sujan", parent: "Bhim Prasad" },
    { child: "Surya Mans", parent: "Rudra" },
    { child: "Niru", parent: "Rudra" },
    { child: "Sujan", parent: "Rudra" },
    { child: "Niru", parent: "Rudra" },
    { child: "Sujan", parent: "Rudra" },
    { child: "Niru", parent: "Rudra" },
    { child: "Niru", parent: "Surya Man", spouse: "Nirjala" },
    { child: "Sujan", parent: "Surya Man", spouse: "Sujata" },
    { child: "Niru", parent: "Surya Man", spouse: "Nirjala" },
    { child: "Sujan", parent: "Surya Man", spouse: "Sujata" },
    { child: "Niru", parent: "Surya Man", spouse: "Nirjala" },
    { child: "Sujan", parent: "Surya Man", spouse: "Sujata" },
    { child: "Niru", parent: "Surya Man", spouse: "Nirjala" },
    { child: "Sujan", parent: "Surya Man", spouse: "Sujata" },
    { child: "Niru", parent: "Surya Man", spouse: "Nirjala" },
    { child: "Sujan", parent: "Surya Man", spouse: "Sujata" },
    { child: "Niru", parent: "Surya Man", spouse: "Nirjala" },
    { child: "Sujan", parent: "Surya Man", spouse: "Sujata" },
    { child: "Niru", parent: "Surya Man", spouse: "Nirjala" },
    { child: "Sujan", parent: "Surya Man", spouse: "Sujata" },
  ]);

  useEffect(() => {
    const svgElement = d3.select(svgRef.current);
    svgElement.selectAll("*").remove();

    const nodeCount = data.length;
    const levels = data.reduce((acc, d) => {
      const parent = d.parent;
      if (!acc[parent]) {
        acc[parent] = 0;
      }
      acc[parent]++;
      return acc;
    }, {});

    const maxDepth = Math.max(...Object.values(levels)) || 1;
    const width = 600 + nodeCount * 300;
    const height = 400 + maxDepth * 200;

    const root = d3
    .stratify<DataNode>()
    .id((d) => d.child)
    .parentId((d) => d.parent)(data);

    const treeLayout = d3
      .tree<d3.HierarchyPointNode<DataNode>>()
      .nodeSize([cardWidth + 50, cardHeight + 100])
      .separation((a, b) => (a.parent === b.parent ? 2 : 2));

    const treeData = treeLayout(root);

    const nodes = treeData.descendants();
    const links = treeData.links();

    const svgWidth = Math.max(...nodes.map(d => d.x)) + cardWidth + 200;
    const svgHeight = Math.max(...nodes.map(d => d.y)) + cardHeight + 200;

    const svg = svgElement
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .call(
        d3.zoom().on("zoom", function (event) {
          svg.attr("transform", event.transform);
        })
      )
      .append("g")
      .attr("transform", "translate(40, 40)");

    const linkGenerator: any = d3
      .linkHorizontal<
        d3.HierarchyPointLink<DataNode>,
        d3.HierarchyPointNode<DataNode>
      >()
      .x((d) => d.x)
      .y((d) => d.y);

    svg
      .selectAll<SVGPathElement, d3.HierarchyPointLink<DataNode>>("path")
      .data(links)
      .enter()
      .append("path")
      .attr(
        "d",
        (d) => `
        M${d.source.x + 110},${d.source.y }
        
        V${(d.source.y + d.target.y) / 1.9}
        H${d.target.x}
        V${d.target.y}
      `
      )
      .attr("fill", "none")
      .attr("stroke", "#ccc");

    svg
      .selectAll<SVGRectElement, d3.HierarchyPointNode<DataNode>>("rect.node")
      .data(nodes)
      .enter()
      .append("rect")
      .attr("class", "node")
      .attr("x", (d) => d.x - cardWidth / 2)
      .attr("y", (d) => d.y - cardHeight / 2)
      .attr("width", cardWidth)
      .attr("height", cardHeight)
      .attr("fill", "#69b3a2")
      .attr("rx", 20)
      .attr("ry", 20);

    svg
      .selectAll<SVGTextElement, d3.HierarchyPointNode<DataNode>>("text.node")
      .data(nodes)
      .enter()
      .append("text")
      .attr("class", "node")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .text((d) => d.data.child);

    nodes.forEach((node) => {
      if (node.data.spouse) {
        const spouseX = node.x + spouseOffset;
        const spouseY = node.y;

        svg
          .append("rect")
          .attr("class", "spouse")
          .attr("x", spouseX - cardWidth / 2)
          .attr("y", spouseY - cardHeight / 2)
          .attr("width", cardWidth)
          .attr("height", cardHeight)
          .attr("fill", "#ffcc00")
          .attr("rx", 20)
          .attr("ry", 20);

        svg
          .append("text")
          .attr("class", "spouse")
          .attr("x", spouseX)
          .attr("y", spouseY)
          .attr("dy", ".35em")
          .attr("text-anchor", "middle")
          .text(node.data.spouse);

        svg
          .append("path")
          .attr(
            "d",
            `M${node.x + cardWidth / 2},${node.y}H${spouseX - cardWidth / 2}`
          )
          .attr("fill", "none")
          .attr("stroke", "#ccc");
      }
    });
  }, [data]);

  const addNode = (child: string, parent: string, spouse?: string) => {
    setData([...data, { child, parent, spouse }]);
  };

  return (
    <div style={{ overflowX: "hidden" }}>
      <div
        ref={svgRef}
        style={{
          width: "100%",
          height: "100%",
          overflowX: "scroll",
          overflowY: "hidden",
          whiteSpace: "nowrap",
          position: "relative",
        }}
      ></div>
      <button onClick={() => addNode("New Child", "Raj Rup")}>Add Node</button>
    </div>
  );
}
