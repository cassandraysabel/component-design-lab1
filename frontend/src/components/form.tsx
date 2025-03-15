import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Form = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.name || !formData.email) {
            toast.error("Please fill out all fields.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/submit-form", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Form submission failed");

            toast.success("Form submitted successfully!");

            setFormData({ name: "", email: "" });

            setTimeout(() => {
                navigate("/");
            }, 1000);
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-5 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Form</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                />
                <button type="submit" className="w-full bg-blue-400 text-white py-2 rounded hover:bg-blue-600 cursor-pointer">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default Form;
