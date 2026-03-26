import { Link } from 'react-router-dom';
import styles from './CharacterPanel.module.css';

export default function CharacterPanel({ character, bookMap, graphData, onClose, onSelectCharacter }) {
  if (!character) return null;

  const interactions = graphData.links.filter(
    l => l.source.id === character.id || l.target.id === character.id
  );

  return (
    <div className={styles.panel}>
      <button className={styles.close} onClick={onClose} aria-label="Close">✕</button>

      <div
        className={styles.accent}
        style={{ backgroundColor: bookMap[character.primaryBook]?.color ?? '#888' }}
      />

      <div className={styles.nameRow}>
        <h2 className={styles.name}>{character.name}</h2>
        <Link to={`/characters/${character.id}`} className={styles.pageLink}>View page →</Link>
      </div>
      <p className={styles.description}>{character.description}</p>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Appears In</h3>
        <ul className={styles.bookList}>
          {character.books.map(bookId => {
            const book = bookMap[bookId];
            return book ? (
              <li key={bookId} className={styles.bookItem}>
                <span
                  className={styles.bookDot}
                  style={{ backgroundColor: book.color }}
                />
                <Link to={`/books/${bookId}`} className={styles.bookTitle}>{book.title}</Link>
                <span className={styles.bookYear}>{book.year}</span>
              </li>
            ) : null;
          })}
        </ul>
      </section>

      {interactions.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Interactions</h3>
          <ul className={styles.interactionList}>
            {interactions.map((link, i) => {
              const other = link.source.id === character.id ? link.target : link.source;
              const book = bookMap[link.book];
              return (
                <li key={i} className={styles.interactionItem}>
                  <div className={styles.interactionHeader}>
                    <button
                      className={styles.characterLink}
                      onClick={() => onSelectCharacter(other)}
                    >
                      {other.name}
                    </button>
                    {book && (
                      <span
                        className={styles.bookTag}
                        style={{ backgroundColor: `${book.color}33`, color: book.color, borderColor: `${book.color}66` }}
                      >
                        {book.title}
                      </span>
                    )}
                  </div>
                  <p className={styles.interactionDesc}>{link.description}</p>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
