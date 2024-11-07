import { useState, useEffect} from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import axios from "axios";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
    <Router>
      <Routes>
        <Route path="/" element={!isAuthenticated ? <Landing /> : <Navigate to="/userHome" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/userHome" />}></Route>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/userHome" />}></Route>
      </Routes>
    </Router>
  )
}

export default App
