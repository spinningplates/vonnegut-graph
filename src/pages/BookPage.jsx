import { Link, useParams } from 'react-router-dom';
import data from '../data/vonnegut.json';
import styles from './BookPage.module.css';

const bookMap = Object.fromEntries(data.books.map(b => [b.id, b]));
const characterMap = Object.fromEntries(data.characters.map(c => [c.id, c]));

export default function BookPage() {
  const { id } = useParams();
  const book = bookMap[id];

  if (!book) {
    return (
      <div className={styles.page}>
        <nav className={styles.nav}>
          <Link to="/" className={styles.backLink}>← Back to graph</Link>
        </nav>
        <p className={styles.notFound}>Book not found.</p>
      </div>
    );
  }

  const characters = data.characters.filter(c => c.books.includes(id));
  const interactions = data.interactions.filter(i => i.book === id);

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <Link to="/" className={styles.backLink}>← Back to graph</Link>
      </nav>

      <div className={styles.header}>
        <div className={styles.accent} style={{ backgroundColor: book.color }} />
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{book.title}</h1>
          <span className={styles.year}>{book.year}</span>
        </div>
        {book.synopsis && <p className={styles.synopsis}>{book.synopsis}</p>}
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Characters ({characters.length})</h2>
        <div className={styles.characterGrid}>
          {characters.map(character => {
            const primaryBook = bookMap[character.primaryBook];
            return (
              <Link key={character.id} to={`/characters/${character.id}`} className={styles.characterCard}>
                <span
                  className={styles.characterDot}
                  style={{ backgroundColor: primaryBook?.color ?? '#888' }}
                />
                <span className={styles.characterName}>{character.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {interactions.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Interactions ({interactions.length})</h2>
          <ul className={styles.interactionList}>
            {interactions.map((interaction, i) => {
              const source = characterMap[interaction.source];
              const target = characterMap[interaction.target];
              return (
                <li key={i} className={styles.interactionItem}>
                  <div className={styles.interactionHeader}>
                    {source && (
                      <Link to={`/characters/${interaction.source}`} className={styles.characterLink}>
                        {source.name}
                      </Link>
                    )}
                    <span className={styles.arrow} style={{ color: book.color }}>↔</span>
                    {target && (
                      <Link to={`/characters/${interaction.target}`} className={styles.characterLink}>
                        {target.name}
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
