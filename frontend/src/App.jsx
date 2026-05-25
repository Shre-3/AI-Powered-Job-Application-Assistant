import { BrowserRouter, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import BaseCV from "./pages/BaseCV.jsx";
import Generate from "./pages/Generate.jsx";
import Home from "./pages/Home.jsx";
import Tracker from "./pages/Tracker.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/base-cv" element={<BaseCV />} />
          <Route path="/generate" element={<Generate />} />
          <Route path="/tracker" element={<Tracker />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
