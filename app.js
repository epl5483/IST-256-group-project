import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupPage from './SignupPage';
import SessionPage from './SessionPage';
import CartPage from './CartPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* This defines which component shows up at which URL */}
        <Route path="/" element={<SignupPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/session" element={<SessionPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </Router>
  );
}

export default app;
