import { Link } from 'react-router-dom';
import styles from './BookFilter.module.css';

export default function BookFilter({ books, activeBooks, onToggleBook, isOpen, onClose }) {
  const allActive = activeBooks.size === 0;

  return (
    <div className={`${styles.container} ${isOpen ? styles.open : ''}`}>
      <div className={styles.header}>
        <span className={styles.label}>Filter by Book</span>
        {!allActive && (
          <button className={styles.clearBtn} onClick={() => onToggleBook(null)}>
            Clear
          </button>
        )}
      </div>
      <ul className={styles.list}>
        {books.map(book => {
          const isActive = allActive || activeBooks.has(book.id);
          return (
            <li key={book.id}>
              <div className={styles.bookRow}>
              <button
                className={`${styles.bookBtn} ${!isActive ? styles.inactive : ''}`}
                onClick={() => onToggleBook(book.id)}
              >
                <span
                  className={styles.dot}
                  style={{ backgroundColor: isActive ? book.color : '#444' }}
                />
                <span className={styles.title}>{book.title}</span>
                <span className={styles.year}>{book.year}</span>
              </button>
              <Link to={`/books/${book.id}`} className={styles.bookPageLink} title="View book page">→</Link>
            </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
