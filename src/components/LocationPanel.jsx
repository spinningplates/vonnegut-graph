import { Link } from 'react-router-dom';
import styles from './LocationPanel.module.css';

const TYPE_LABELS = {
  real: 'Real Location',
  'fictional-earth': 'Fictional Location',
  'off-world': 'Off-World',
};

const TYPE_COLORS = {
  real: '#4FD1FF',
  'fictional-earth': '#F6AD55',
  'off-world': '#9B5DE5',
};

export default function LocationPanel({ location, bookMap, characterMap, onClose }) {
  if (!location) return null;

  const color = TYPE_COLORS[location.type] ?? '#888';

  return (
    <div className={styles.panel}>
      <button className={styles.close} onClick={onClose} aria-label="Close">✕</button>

      <div className={styles.accent} style={{ backgroundColor: color }} />

      <div className={styles.nameRow}>
        <h2 className={styles.name}>{location.name}</h2>
      </div>

      <span
        className={styles.typeBadge}
        style={{ color, borderColor: `${color}55`, backgroundColor: `${color}14` }}
      >
        {TYPE_LABELS[location.type]}
      </span>

      {location.realWorldNote && (
        <p className={styles.realWorldNote}>
          <span className={styles.noteIcon}>~</span>
          {location.realWorldNote}
        </p>
      )}

      {location.description && (
        <p className={styles.description}>{location.description}</p>
      )}

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Featured In</h3>
        <ul className={styles.bookList}>
          {location.books.map(bookId => {
            const book = bookMap[bookId];
            return book ? (
              <li key={bookId} className={styles.bookItem}>
                <span className={styles.bookDot} style={{ backgroundColor: book.color }} />
                <Link to={`/books/${bookId}`} className={styles.bookTitle}>{book.title}</Link>
                <span className={styles.bookYear}>{book.year}</span>
              </li>
            ) : null;
          })}
        </ul>
      </section>

      {location.characters?.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Characters Here</h3>
          <ul className={styles.characterList}>
            {location.characters.map(charId => {
              const character = characterMap[charId];
              return character ? (
                <li key={charId} className={styles.characterItem}>
                  <span
                    className={styles.characterDot}
                    style={{ backgroundColor: bookMap[character.primaryBook]?.color ?? '#555' }}
                  />
                  <Link to={`/characters/${charId}`} className={styles.characterName}>
                    {character.name}
                  </Link>
                </li>
              ) : null;
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
