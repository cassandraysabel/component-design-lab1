import "dotenv/config";
import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(express.json()); 


app.use(cors({ origin: ["http://localhost:3000", "http://localhost:5173"] }));


const supabase = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_KEY as string
);

app.get("/", (req, res) => {
    res.send("✅ Supabase Backend with TSX is running...");
});


app.post("/submit-form", async (req, res) => {
    const { name, email } = req.body;

   
    if (!name || !email) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        
        const { data, error } = await supabase
            .from("users") 
            .insert([{ name, email }]);

        if (error) throw error;

        res.status(201).json({ message: "✅ Form submitted successfully", data });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
