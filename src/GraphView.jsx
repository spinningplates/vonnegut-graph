import { useState, useMemo } from 'react';
import Graph from './components/Graph';
import CharacterPanel from './components/CharacterPanel';
import BookFilter from './components/BookFilter';
import data from './data/vonnegut.json';
import './App.css';

const bookMap = Object.fromEntries(data.books.map(b => [b.id, b]));

export default function GraphView() {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [activeBooks, setActiveBooks] = useState(new Set());
  const [showFilter, setShowFilter] = useState(false);

  const graphData = useMemo(() => {
    const nodes = data.characters.map(c => ({ ...c }));
    const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));
    const links = data.interactions.map(i => ({
      ...i,
      source: nodeMap[i.source],
      target: nodeMap[i.target],
    })).filter(l => l.source && l.target);
    return { nodes, links };
  }, []);

  const handleToggleBook = (bookId) => {
    if (bookId === null) {
      setActiveBooks(new Set());
      return;
    }
    setActiveBooks(prev => {
      const next = new Set(prev);
      if (next.has(bookId)) next.delete(bookId);
      else next.add(bookId);
      return next;
    });
    setSelectedCharacter(null);
  };

  const handleSelectCharacter = (character) => {
    setSelectedCharacter(character);
  };

  const handleSelectByNode = (node) => {
    const fullNode = graphData.nodes.find(n => n.id === node.id);
    setSelectedCharacter(fullNode ?? null);
  };

  return (
    <div className="app">
      {showFilter && (
        <div className="filter-overlay" onClick={() => setShowFilter(false)} />
      )}

      <BookFilter
        books={data.books}
        activeBooks={activeBooks}
        onToggleBook={handleToggleBook}
        isOpen={showFilter}
        onClose={() => setShowFilter(false)}
      />

      <div className="graph-area">
        <header className="title-bar">
          <h1>Vonnegut Universe</h1>
          <p>Characters &amp; connections across the novels</p>
        </header>

        <Graph
          graphData={graphData}
          bookMap={bookMap}
          activeBooks={activeBooks}
          onSelectCharacter={handleSelectCharacter}
          selectedCharacter={selectedCharacter}
        />
      </div>

      <CharacterPanel
        character={selectedCharacter}
        bookMap={bookMap}
        graphData={graphData}
        onClose={() => setSelectedCharacter(null)}
        onSelectCharacter={handleSelectByNode}
      />

      <button
        className="filter-fab"
        onClick={() => setShowFilter(v => !v)}
        aria-label="Toggle book filter"
      >
        {activeBooks.size > 0 ? `Books (${activeBooks.size})` : 'Books'}
      </button>
    </div>
  );
}
