"use client";
import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import axios from "axios";

interface DataNode {
  id: string;
  child: string;
  parent: string | null;
  spouse?: string;
}

interface Person {
  id: number;
  name: string;
  gender: string;
  birthdate: string;
  deathdate: string | null;
  birthplace: string;
  deathPlace: string | null;
  email: string;
  phone: string;
  address: string;
  current_address: string;
  image: string;
  relationshipsFrom: Relationship[];
  relationshipsTo: Relationship[];
}

interface Relationship {
  id: number;
  type: string;
  fromNode: number;
  toNode: number;
  from: Person;
  to: Person;
}

const fetchData = async (url: string) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

const transformData = (data: Person[]): DataNode[] => {
  const transformed: DataNode[] = [];
  const spouseMap = new Map<string, string>();

  // Identify spouse relationships
  data.forEach((person) => {
    person.relationshipsFrom.forEach((relationship) => {
      if (relationship.type === "spouse") {
        spouseMap.set(`${relationship.fromNode}`, relationship.to.name);
        spouseMap.set(`${relationship.toNode}`, relationship.from.name);
      }
    });
  });

  // Transform data
  data.forEach((person) => {
    const isParent = person.relationshipsFrom.some(
      (relationship) => relationship.type === "parent"
    );
    const spouse = spouseMap.get(`${person.id}`) || "";

    if (!isParent) {
      transformed.unshift({
        id: `${person.id}`,
        child: person.name,
        parent: null,
        spouse: spouse,
      });
    } else {
      person.relationshipsFrom.forEach((relationship) => {
        if (relationship.type === "parent") {
          const childName = relationship.to.name;
          const parentName = person.name;
          transformed.push({
            id: `${relationship.to.id}`,
            child: childName,
            parent: person.name,
            spouse: spouse,
          });
        }
      });
    }
  });

  return transformed;
};

const addNode = async (
  child: string,
  parent: string,
  spouse: string | undefined,
  nodes: Person[],
  setNodes: React.Dispatch<React.SetStateAction<Person[]>>,
  setRelationships: React.Dispatch<React.SetStateAction<Relationship[]>>
) => {
  try {
    const newNode = { name: child };
    const response = await axios.post("/api/person", newNode);
    const nodeId = response.data.id;

    const parentNode = nodes.find((node) => node.name === parent);
    if (parentNode) {
      await axios.post("/api/relationship", {
        type: "parent",
        fromNode: parentNode.id,
        toNode: nodeId,
      });
    }

    if (spouse) {
      const spouseNode = nodes.find((node) => node.name === spouse);
      if (spouseNode) {
        await axios.post("/api/relationship", {
          type: "spouse",
          fromNode: nodeId,
          toNode: spouseNode.id,
        });
      }
    }

    const updatedNodes = await fetchData("/api/person");
    const updatedRelationships = await fetchData("/api/relationship");
    setNodes(updatedNodes);
    setRelationships(updatedRelationships);
  } catch (error) {
    console.error("Error adding node:", error);
  }
};

const findSpouseName = (
  nodeId: string,
  relationships: Relationship[],
  nodeMap: Map<string, DataNode>
): string => {
  const spouseRelationship = relationships.find(
    (r) => r.fromNode === Number(nodeId) && r.type === "spouse"
  );
  return spouseRelationship
    ? nodeMap.get(`${spouseRelationship.toNode}`)?.child || ""
    : "";
};

export default function Tree() {
  const svgRef = useRef(null);
  const cardWidth = 168;
  const cardHeight = 178;
  const spouseOffset = 220;

  const [nodes, setNodes] = useState<Person[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      const nodesData = await fetchData("/api/person");
      const relationshipsData = await fetchData("/api/relationship");
      setNodes(nodesData);
      setRelationships(relationshipsData);
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const svgElement = d3.select(svgRef.current);
    svgElement.selectAll("*").remove();

    if (nodes.length === 0 || relationships.length === 0) return;

    const nodeMap = new Map(
      nodes.map((node) => [
        `${node.id}`,
        { id: `${node.id}`, child: node.name, parent: null, spouse: "" },
      ])
    );

    const data = relationships
      .filter((rel) => rel.type === "parent")
      .map((rel) => {
        const childNode = nodeMap.get(`${rel.toNode}`);
        const parentNode = nodeMap.get(`${rel.fromNode}`);
        return {
          id: `${rel.toNode}`,
          child: childNode ? childNode.child : "",
          parent: parentNode ? parentNode.child : "",
          spouse: childNode
            ? findSpouseName(`${rel.toNode}`, relationships, nodeMap)
            : "",
        };
      });

    nodes.forEach((node) => {
      const hasParent = relationships.some(
        (rel) => rel.toNode === node.id && rel.type === "parent"
      );
      const hasSpouse = relationships.some(
        (rel) => rel.toNode === node.id && rel.type === "spouse"
      );
      if (!hasParent && !hasSpouse) {
        data.unshift({
          id: `${node.id}`,
          child: node.name,
          parent: null,
          spouse: findSpouseName(`${node.id}`, relationships, nodeMap),
        });
      }
    });
    console.log("data", data);
    const width = 1600;
    const height = 1000;

    const svg = svgElement
      .append("svg")
      .attr("width", width + 200)
      .attr("height", height + 200)
      .call(
        d3.zoom().on("zoom", function (event) {
          svg.attr("transform", event.transform);
        })
      )
      .append("g")
      .attr("transform", "translate(40, 40)");

    const root = d3
      .stratify<DataNode>()
      .id((d) => d.id)
      .parentId((d) => {
        const parent = data.find((p) => p.child === d.parent);
        return parent ? parent.id : null;
      })(data);

    const treeLayout = d3
      .tree<d3.HierarchyPointNode<DataNode>>()
      .size([width, height])
      .separation((a, b) => (a.parent === b.parent ? 1 : 2));

    const treeData = treeLayout(root);

    const nodesD3 = treeData.descendants();
    const links = treeData.links();

    const linkGenerator = d3
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
      .data(nodesD3)
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
      .data(nodesD3)
      .enter()
      .append("text")
      .attr("class", "node")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .text((d) => d.data.child);

    nodesD3.forEach((node) => {
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
  }, [nodes, relationships]);

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
      <button
        onClick={() =>
          addNode(
            "New Child",
            "Raj Rup",
            undefined,
            nodes,
            setNodes,
            setRelationships
          )
        }
      >
        Add Node
      </button>
    </div>
  );
}