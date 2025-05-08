import { Slide, ToastContainer } from "react-toastify";
import { Routes, Route, Link } from "react-router-dom";
import Form from "./components/form";
import Employees from "./pages/Employees"
import Interviewees from "./pages/Interviewee";
import Midterm from "./pages/Midterm";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      
      <nav className="p-4 bg-blue-500 text-white flex gap-4">
        <Link to="/" className="hover:underline">Form</Link>
        <Link to="/employees" className="hover:underline">Employees</Link>
        <Link to="/interviewee" className="hover:underline">Interviewee</Link>
        <Link to="/midterm" className="hover:underline">Midterm</Link>
      </nav>

      <div className="flex items-center justify-center">
        <Routes>
          <Route path="/" element={<Form />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/interviewee" element={<Interviewees />} />
          <Route path="/midterm" element={<Midterm />} />

          
        </Routes>
      </div>

      <ToastContainer position="top-right" autoClose={3000} transition={Slide} />
    </div>
  );
};

export default App;
