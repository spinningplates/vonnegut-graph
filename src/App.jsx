import { Routes, Route } from 'react-router-dom';
import GraphView from './GraphView';
import CharacterPage from './pages/CharacterPage';
import BookPage from './pages/BookPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<GraphView />} />
      <Route path="/characters/:id" element={<CharacterPage />} />
      <Route path="/books/:id" element={<BookPage />} />
    </Routes>
  );
}
