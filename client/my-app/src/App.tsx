import "./App.css";
import Header from "./components/Header";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import UsersPage from "./pages/Users";
import { AnimatePresence } from "motion/react";

function App() {
  return (
    <Router>
      <Header />
      <ToastContainer />
      <main>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/usuarios" element={<UsersPage />} />
          </Routes>
        </AnimatePresence>
      </main>
    </Router>
  );
}

export default App;
