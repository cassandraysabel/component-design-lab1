import "dotenv/config";
import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

// Initialize Express App
const app = express();
app.use(express.json()); // Allow JSON requests

// ✅ Allow frontend access (Fixed CORS issue)
app.use(cors({ origin: ["http://localhost:3000", "http://localhost:5173"] }));

// Initialize Supabase Client
const supabase = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_KEY as string
);

// Test API Route
app.get("/", (req, res) => {
    res.send("✅ Supabase Backend with TSX is running...");
});

// Handle Form Submission
app.post("/submit-form", async (req, res) => {
    const { name, email } = req.body;

    // Validate Input
    if (!name || !email) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        // Insert Data into Supabase
        const { data, error } = await supabase
            .from("users") // Ensure "users" table exists in Supabase
            .insert([{ name, email }]);

        if (error) throw error;

        res.status(201).json({ message: "✅ Form submitted successfully", data });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
