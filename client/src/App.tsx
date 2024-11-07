import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/login" element={<Login />}></Route>
      </Routes>
    </Router>
  )
}

export default App
