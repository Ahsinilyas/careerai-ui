import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import fetch from 'node-fetch';

// Configure environment variables
dotenv.config();

// Validate API key
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY is not set in .env file");
  process.exit(1);
}

// Initialize OpenAI with fetch
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  fetch: fetch
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Simple in-memory progress store
let dashboard = { introspection: 0, exploration: 0, reflection: 0, action: 0 };
let journalEntries = [];

// Routes
app.get("/api/dashboard", (_, res) => {
  console.log("GET /api/dashboard", dashboard);
  res.json(dashboard);
});

app.post("/api/dashboard", (req, res) => {
  console.log("POST /api/dashboard", req.body);
  dashboard = { ...dashboard, ...req.body };
  res.json(dashboard);
});

app.post("/api/summary", async (req, res) => {
  try {
    const { text } = req.body;
    console.log("\n🔍 Received request for summary:");
    console.log("Text to summarize:", text);

    if (!text || typeof text !== 'string') {
      console.error("❌ Invalid request - text is required");
      return res.status(400).json({ error: "Text is required" });
    }

    console.log("\n🤖 Calling OpenAI API...");
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that provides concise summaries of journal entries, focusing on key insights, emotions, and main themes."
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    });
    
    const summary = completion.choices[0].message.content;
    console.log("\n✅ OpenAI API Response:");
    console.log(summary);
    
    res.json({ summary });
  } catch (e) {
    console.error("\n❌ OpenAI API error:", e);
    
    if (e.code === 'invalid_api_key') {
      return res.status(403).json({
        error: "Invalid API key",
        details: "The provided OpenAI API key is invalid."
      });
    }
    
    if (e.code === 'insufficient_quota') {
      return res.status(402).json({
        error: "API quota exceeded",
        details: "Your OpenAI API quota has been exceeded."
      });
    }
    
    res.status(500).json({ 
      error: "Failed to generate summary", 
      details: e.message 
    });
  }
});

// Journal routes
app.get("/api/journal", (_, res) => {
  console.log("GET /api/journal", journalEntries);
  res.json(journalEntries);
});

app.post("/api/journal", (req, res) => {
  console.log("POST /api/journal", req.body);
  const entry = {
    ...req.body,
    date: new Date(req.body.date) // Ensure date is parsed
  };
  journalEntries = [entry, ...journalEntries];
  
  // Update dashboard stats based on journal activity
  dashboard.reflection = Math.min(100, dashboard.reflection + 5); // Increment reflection progress
  
  res.json(entry);
});

// IKIGAI analysis endpoint
app.post("/api/ikigai", async (req, res) => {
  try {
    console.log("\n🔍 Received request for IKIGAI analysis");
    
    // Use all journal entries for analysis
    if (journalEntries.length === 0) {
      return res.status(400).json({ error: "No journal entries found. Add some entries to generate IKIGAI analysis." });
    }

    console.log("Number of entries:", journalEntries.length);
    const combinedContent = journalEntries.map(e => e.content).join('\n\n');

    console.log("\n🤖 Calling OpenAI API for IKIGAI analysis...");
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [
        {
          role: "system",
          content: `You are an expert career coach and IKIGAI analyst. Analyze the journal entries to identify the four components of IKIGAI:
          1. What they LOVE (Passion)
          2. What they're GOOD AT (Profession)
          3. What the World NEEDS (Mission)
          4. What they can be PAID FOR (Vocation)
          
          Then, based on these components:
          1. Suggest specific roles that align with their IKIGAI
          2. Recommend companies where they might find fulfillment
          3. Provide personalized outreach strategies for connecting with recruiters/founders

          Format your response as a JSON object with the following structure:
          {
            "passion": ["item1", "item2", ...],
            "mission": ["item1", "item2", ...],
            "profession": ["item1", "item2", ...],
            "vocation": ["item1", "item2", ...],
            "recommendedRoles": ["role1", "role2", ...],
            "recommendedCompanies": ["company1 - outreach strategy", ...]
          }`
        },
        {
          role: "user",
          content: combinedContent
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });
    
    const result = JSON.parse(completion.choices[0].message.content);
    console.log("\n✅ IKIGAI Analysis completed");
    
    // Update dashboard progress
    dashboard.introspection = Math.min(100, dashboard.introspection + 10);
    dashboard.exploration = Math.min(100, dashboard.exploration + 10);
    
    res.json(result);
  } catch (e) {
    console.error("\n❌ OpenAI API error:", e);
    res.status(500).json({ 
      error: "Failed to generate IKIGAI analysis", 
      details: e.message 
    });
  }
});

// Build in Public post generator endpoint
app.post("/api/generate-post", async (req, res) => {
  try {
    const { ikigaiData } = req.body;
    console.log("\n🔍 Received request for post generation");
    console.log("IKIGAI data:", ikigaiData);

    if (!ikigaiData) {
      return res.status(400).json({ error: "IKIGAI data is required" });
    }

    console.log("\n🤖 Calling OpenAI API for post generation...");
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [
        {
          role: "system",
          content: `You are an expert at creating engaging LinkedIn posts in the "Build in Public" style. 
          Create a concise post that MUST BE UNDER 350 CHARACTERS (not including hashtags) that:
          1. Shares one key insight about the person's career journey based on their IKIGAI analysis
          2. Uses professional but conversational tone
          3. Includes a clear call-to-action or question
          4. Includes 3-4 relevant hashtags

          Format your response as a JSON object with:
          {
            "content": "The main post content (MUST BE UNDER 350 CHARACTERS)",
            "hashtags": ["list", "of", "hashtags"]
          }`
        },
        {
          role: "user",
          content: `Generate a LinkedIn post based on this IKIGAI analysis:
          Passion: ${ikigaiData.passion.join(', ')}
          Mission: ${ikigaiData.mission.join(', ')}
          Profession: ${ikigaiData.profession.join(', ')}
          Vocation: ${ikigaiData.vocation.join(', ')}
          Recommended Roles: ${ikigaiData.recommendedRoles.join(', ')}`
        }
      ],
      temperature: 0.7,
      max_tokens: 200,
      response_format: { type: "json_object" }
    });
    
    const post = JSON.parse(completion.choices[0].message.content);
    
    // Validate character count
    if (post.content.length > 350) {
      post.content = post.content.substring(0, 347) + "...";
    }
    
    console.log("\n✅ Post generated successfully");
    console.log("Character count:", post.content.length);
    
    res.json(post);
  } catch (e) {
    console.error("\n❌ OpenAI API error:", e);
    res.status(500).json({ 
      error: "Failed to generate post", 
      details: e.message 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("\n❌ Unhandled error:", err);
  res.status(500).json({ error: "Server error", details: err.message });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n✅ API running on http://localhost:${PORT}`);
  console.log("Ready to handle requests!");
}); 