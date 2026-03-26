import { Link, useParams } from 'react-router-dom';
import data from '../data/vonnegut.json';
import styles from './CharacterPage.module.css';

const bookMap = Object.fromEntries(data.books.map(b => [b.id, b]));
const characterMap = Object.fromEntries(data.characters.map(c => [c.id, c]));

export default function CharacterPage() {
  const { id } = useParams();
  const character = characterMap[id];

  if (!character) {
    return (
      <div className={styles.page}>
        <nav className={styles.nav}>
          <Link to="/" className={styles.backLink}>← Back to graph</Link>
        </nav>
        <p className={styles.notFound}>Character not found.</p>
      </div>
    );
  }

  const primaryBook = bookMap[character.primaryBook];
  const interactions = data.interactions.filter(
    i => i.source === id || i.target === id
  );

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <Link to="/" className={styles.backLink}>← Back to graph</Link>
      </nav>

      <div className={styles.header}>
        <div className={styles.accent} style={{ backgroundColor: primaryBook?.color ?? '#888' }} />
        <h1 className={styles.name}>{character.name}</h1>
        {primaryBook && (
          <Link to={`/books/${primaryBook.id}`} className={styles.primaryBookLink} style={{ color: primaryBook.color }}>
            {primaryBook.title} · {primaryBook.year}
          </Link>
        )}
        <p className={styles.description}>{character.description}</p>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Appears In</h2>
        <ul className={styles.bookList}>
          {character.books.map(bookId => {
            const book = bookMap[bookId];
            return book ? (
              <li key={bookId}>
                <Link to={`/books/${bookId}`} className={styles.bookItem}>
                  <span className={styles.bookDot} style={{ backgroundColor: book.color }} />
                  <span className={styles.bookTitle}>{book.title}</span>
                  <span className={styles.bookYear}>{book.year}</span>
                </Link>
              </li>
            ) : null;
          })}
        </ul>
      </section>

      {interactions.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Interactions</h2>
          <ul className={styles.interactionList}>
            {interactions.map((interaction, i) => {
              const otherId = interaction.source === id ? interaction.target : interaction.source;
              const other = characterMap[otherId];
              const book = bookMap[interaction.book];
              return (
                <li key={i} className={styles.interactionItem}>
                  <div className={styles.interactionHeader}>
                    {other && (
                      <Link to={`/characters/${otherId}`} className={styles.characterLink}>
                        {other.name}
                      </Link>
                    )}
                    {book && (
                      <Link
                        to={`/books/${interaction.book}`}
                        className={styles.bookTag}
                        style={{ backgroundColor: `${book.color}33`, color: book.color, borderColor: `${book.color}66` }}
                      >
                        {book.title}
                      </Link>
                    )}
                  </div>
                  <p className={styles.interactionDesc}>{interaction.description}</p>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
