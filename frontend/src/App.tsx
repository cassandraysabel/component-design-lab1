import { Slide, ToastContainer } from "react-toastify";
import { Routes, Route, Link } from "react-router-dom";
import Form from "./components/form";
import Employees from "./Employees"
import Interviewees from "./Interviewee";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      
      <nav className="p-4 bg-blue-500 text-white flex gap-4">
        <Link to="/" className="hover:underline">Form</Link>
        <Link to="/employees" className="hover:underline">Employees</Link>
        <Link to="/interviewee" className="hover:underline">Interviewee</Link>
      </nav>

      <div className="flex items-center justify-center">
        <Routes>
          <Route path="/" element={<Form />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/interviewee" element={<Interviewees />} />
          
        </Routes>
      </div>

      <ToastContainer position="top-right" autoClose={3000} transition={Slide} />
    </div>
  );
};

export default App;
