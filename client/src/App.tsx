import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import axios from "axios";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import UserHome from "./pages/UserHome";
import Profile from "./pages/Profile";
import ResumeBuilder from "./pages/ResumeBuilder";

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = (boolean: boolean) => {
    setIsAuthenticated(boolean);
  };

  const checkAuthenticated = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/auth/verify",
        {},
        {
          headers: { jwt_token: localStorage.getItem("token") }
        }
      );

      const parseRes = response.data;

      parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);

    } catch (error: unknown) {
      console.error(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  useEffect(() => {
    checkAuthenticated();
  }, []);

  return (
    <Router future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }}>
      <Routes>
        <Route path="/" element={!isAuthenticated ? <Landing /> : <Navigate to="/userHome" />}></Route>
        <Route path="/register" element={!isAuthenticated ? <Register setAuth={setAuth} /> : <Navigate to="/userHome" />}></Route>
        <Route path="/login" element={!isAuthenticated ? <Login setAuth={setAuth} /> : <Navigate to="/userHome" />}></Route>
        <Route path="/userHome" element={!isAuthenticated ? <Landing /> : <UserHome />}></Route>
        <Route path="/profile" element={!isAuthenticated ? <Landing /> : <Profile />}></Route>
        <Route path="/resumeBuilder" element={!isAuthenticated ? <Landing /> : <ResumeBuilder />}></Route>
        </Routes>
    </Router>
  )
}

export default App
