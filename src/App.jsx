// frontend/src/App.jsx or wherever you have routes
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PaymentPage from "./PaymentPage";
import ThankYou from "./ThankYou";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PaymentPage />} />
        <Route path="/thank-you" element={<ThankYou />} />
      </Routes>
    </Router>
  );
}

export default App;
