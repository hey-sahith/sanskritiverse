import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import express from "express";
import cors from "cors";

// Define secret reference from Google Cloud Secret Manager
const mapsApiKey = defineSecret("MAPS_API_KEY");

const app = express();
app.use(cors({ origin: true }));

// Secure API endpoint for your frontend
app.get("/api/config/maps", (req, res) => {
    const apiKey = mapsApiKey.value();

    if (!apiKey) {
        return res.status(500).json({ error: "Maps API key not configured." });
    }

    return res.json({ mapsApiKey: apiKey });
});

// Export Cloud Function with secret access bound
export const api = onRequest({ secrets: [mapsApiKey] }, app);
