import styles from './BookFilter.module.css';

export default function BookFilter({ books, activeBooks, onToggleBook }) {
  const allActive = activeBooks.size === 0;

  return (
    <div className={styles.container}>
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
            </li>
          );
        })}
      </ul>
    </div>
  );
}
