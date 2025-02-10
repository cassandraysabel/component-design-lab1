import React, { useState } from "react";
import { toast } from "react-toastify";

const Form = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.name || !formData.email) {
            toast.error("Form submission unsuccessful. Please fill out all fields.");
            return;
        }
        
        console.log("form submitted");
        toast.success("Form submitted successfully. YIPEE!");   
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-5 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Form</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="name"
                    placeholder="input name here"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
                <input
                    type="email"
                    name="email"
                    placeholder="input email here"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
                <button type="submit" className="w-full bg-blue-400 text-white py-2 rounded hover:bg-blue-600 cursor-pointer">
                    Submit
                </button>
            </form>
        </div>
    )
}

export default Form;
