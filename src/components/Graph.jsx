import { useRef, useCallback, useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

export default function Graph({ graphData, bookMap, activeBooks, onSelectCharacter, selectedCharacter }) {
  const fgRef = useRef();
  const [hoveredNode, setHoveredNode] = useState(null);
  const HEADER = 58;
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight - HEADER });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight - HEADER });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getNodeColor = useCallback((node) => {
    const book = bookMap[node.primaryBook];
    const color = book ? book.color : '#888';
    const isActive = activeBooks.size === 0 || node.books.some(b => activeBooks.has(b));
    if (!isActive) return '#333';
    if (selectedCharacter && selectedCharacter.id !== node.id) {
      const isConnected = graphData.links.some(
        l => (l.source.id === selectedCharacter.id && l.target.id === node.id) ||
             (l.target.id === selectedCharacter.id && l.source.id === node.id)
      );
      if (!isConnected) return '#2a2a2a';
    }
    return color;
  }, [bookMap, activeBooks, selectedCharacter, graphData.links]);

  const getNodeSize = useCallback((node) => {
    const base = 4 + node.books.length * 2;
    if (hoveredNode?.id === node.id) return base + 3;
    return base;
  }, [hoveredNode]);

  const getLinkColor = useCallback((link) => {
    const book = bookMap[link.book];
    const sourceActive = activeBooks.size === 0 || link.source.books?.some(b => activeBooks.has(b));
    const targetActive = activeBooks.size === 0 || link.target.books?.some(b => activeBooks.has(b));
    if (!sourceActive || !targetActive) return 'rgba(60,60,60,0.2)';
    if (selectedCharacter) {
      const connected = link.source.id === selectedCharacter.id || link.target.id === selectedCharacter.id;
      if (!connected) return 'rgba(60,60,60,0.15)';
      return book ? book.color : '#888';
    }
    return book ? `${book.color}99` : '#88888855';
  }, [bookMap, activeBooks, selectedCharacter]);

  const getLinkWidth = useCallback((link) => {
    if (selectedCharacter) {
      const connected = link.source.id === selectedCharacter.id || link.target.id === selectedCharacter.id;
      return connected ? 2 : 0.5;
    }
    return 1;
  }, [selectedCharacter]);

  const drawNode = useCallback((node, ctx, globalScale) => {
    const size = getNodeSize(node);
    const color = getNodeColor(node);
    const isActive = activeBooks.size === 0 || node.books.some(b => activeBooks.has(b));
    const isSelected = selectedCharacter?.id === node.id;

    // glow for selected
    if (isSelected) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, size + 5, 0, 2 * Math.PI);
      ctx.fillStyle = `${color}44`;
      ctx.fill();
    }

    // outer ring for hovered
    if (hoveredNode?.id === node.id) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, size + 2, 0, 2 * Math.PI);
      ctx.strokeStyle = '#ffffff55';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();

    // label
    const label = node.name;
    const fontSize = Math.max(10 / globalScale, 3);
    ctx.font = `${fontSize}px Inter, sans-serif`;
    const textOpacity = isActive ? (isSelected || !selectedCharacter ? 1 : 0.3) : 0.15;
    ctx.fillStyle = `rgba(255,255,255,${textOpacity})`;
    ctx.textAlign = 'center';
    ctx.fillText(label, node.x, node.y + size + fontSize * 1.2);
  }, [getNodeSize, getNodeColor, hoveredNode, selectedCharacter, activeBooks]);

  return (
    <ForceGraph2D
      ref={fgRef}
      width={dimensions.width}
      height={dimensions.height}
      graphData={graphData}
      nodeId="id"
      nodeLabel={() => ''}
      nodeCanvasObject={drawNode}
      nodeCanvasObjectMode={() => 'replace'}
      linkColor={getLinkColor}
      linkWidth={getLinkWidth}
      linkDirectionalParticles={0}
      onNodeClick={(node) => {
        onSelectCharacter(selectedCharacter?.id === node.id ? null : node);
      }}
      onNodeHover={setHoveredNode}
      onBackgroundClick={() => onSelectCharacter(null)}
      backgroundColor="#111111"
      cooldownTicks={100}
      d3AlphaDecay={0.02}
      d3VelocityDecay={0.3}
    />
  );
}
