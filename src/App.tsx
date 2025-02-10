import { Slide, ToastContainer } from "react-toastify";
import Form from "./components/form";


const App = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Form/>
      <ToastContainer 
      position="top-right" 
      autoClose={3000}
      transition={Slide}
      />
    </div>
  )
}

export default App