import { BrowserRouter as Router, Route, Routes, Link, Form } from "react-router-dom";

const AppRoutes = () => {
  return (
    <Router>
      <nav className="p-4 bg-blue-500 text-white flex gap-4">
      <Link to="/" className="hover:underline">Form</Link>
      <Link to="/home" className="hover:underline">Home</Link>
        
      </nav>

      <Routes>
        <Route path="/" element={<Form />} />
        
      </Routes>
    </Router>
  );
};

export default AppRoutes;
