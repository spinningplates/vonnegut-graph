import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import LocationMap from './components/LocationMap';
import CosmosView from './components/CosmosView';
import LocationPanel from './components/LocationPanel';
import BookFilter from './components/BookFilter';
import data from './data/vonnegut.json';
import styles from './MapView.module.css';

const bookMap = Object.fromEntries(data.books.map(b => [b.id, b]));
const characterMap = Object.fromEntries(data.characters.map(c => [c.id, c]));

export default function MapView() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [activeBooks, setActiveBooks] = useState(new Set());
  const [showFilter, setShowFilter] = useState(false);

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
  };

  const handleSelectLocation = (loc) => {
    setSelectedLocation(prev => prev?.id === loc.id ? null : loc);
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

      <div className={styles.mapArea}>
        <header className={styles.header}>
          <div className={styles.titleGroup}>
            <h1 className={styles.title}>Vonnegut Universe</h1>
            <p className={styles.subtitle}>Where the stories happened</p>
          </div>
          <nav className={styles.tabs}>
            <Link to="/" className={styles.tab}>Graph</Link>
            <span className={`${styles.tab} ${styles.tabActive}`}>Map</span>
          </nav>
        </header>

        <div className={styles.mapContainer}>
          <LocationMap
            locations={data.locations}
            bookMap={bookMap}
            activeBooks={activeBooks}
            onSelectLocation={handleSelectLocation}
            selectedLocation={selectedLocation}
          />
        </div>

        <CosmosView
          locations={data.locations}
          bookMap={bookMap}
          activeBooks={activeBooks}
          onSelectLocation={handleSelectLocation}
          selectedLocation={selectedLocation}
        />
      </div>

      <LocationPanel
        location={selectedLocation}
        bookMap={bookMap}
        characterMap={characterMap}
        onClose={() => setSelectedLocation(null)}
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
