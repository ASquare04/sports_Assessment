import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { auth } from "./utility/firebase"; 

import Register from "./pages/RegisterPage";
import Login from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import Trending from "./pages/Trending";
import PayoutPage from "./pages/PayoutPage";
import Dashboard from "./pages/Dashboard";
import Loader from "./components/Loader";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false); 
    });
    return () => unsubscribe(); 
  }, []);

  if (loading) {
    return <Loader/>; 
  }

  return (
    <Router>
      <Routes>

        <Route path="/" element={<HomePage />} />
        <Route
          path="/trending"
          element={user ? <Trending /> : <Navigate to="/login" />}
        />
        <Route
          path="/payout"
          element={user ? <PayoutPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />

        <Route
          path="/register"
          element={user ? <Navigate to="/dashboard" /> : <Register />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" /> : <Login />}
        />
      </Routes>
    </Router>
  );
};

export default App;
