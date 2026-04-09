import styles from './CosmosView.module.css';

const PLANET_COLORS = {
  tralfamadore: '#22D3EE',
  titan: '#FBBF24',
  mars: '#F87171',
  mercury: '#94A3B8',
};

export default function CosmosView({ locations, bookMap, activeBooks, onSelectLocation, selectedLocation }) {
  const cosmosLocations = locations.filter(l => l.type === 'off-world');

  const isActive = (loc) =>
    activeBooks.size === 0 || loc.books.some(b => activeBooks.has(b));

  return (
    <div className={styles.strip}>
      <div className={styles.stars} aria-hidden="true" />

      <div className={styles.label}>Cosmos</div>

      <div className={styles.planets}>
        {cosmosLocations.map(loc => {
          const color = PLANET_COLORS[loc.id] ?? '#888';
          const active = isActive(loc);
          const selected = selectedLocation?.id === loc.id;
          return (
            <button
              key={loc.id}
              className={`${styles.planet} ${!active ? styles.dim : ''} ${selected ? styles.selected : ''}`}
              onClick={() => onSelectLocation(loc)}
              style={{ '--planet-color': color }}
            >
              <div className={styles.orb} style={{ background: color }} />
              <span className={styles.planetName}>{loc.name}</span>
              <span className={styles.bookCount}>
                {loc.books.map(bId => bookMap[bId]?.title.split(' ')[0]).join(', ')}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
