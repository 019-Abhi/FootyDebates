const express = require("express");
const router = express.Router();
const { getDb, saveDb } = require("./database.cjs");

router.get("/search", async (req, res) => {
    const { q } = req.query
    if (!q) return res.json([]);

    try {
        const db = await getDb();
        const stmt = db.prepare("SELECT p.*, s.goals, s.assists, s.appearances, s.minutes, s.yellow_cards, s.red_cards FROM players p LEFT JOIN stats s ON s.player_id = p.id WHERE p.name LIKE ? LIMIT 8");
        
        const results = [];
        stmt.bind([`%${q.trim()}%`]);
        while (stmt.step()) results.push(stmt.getAsObject());
        stmt.free();
        res.json(results);
    }   catch (err) {
        res.status(500).json({error: err.message});
    }
});


//GET /api/players/:id
router.get("/:id", async (req, res) => {
    try{
        const db = await getDb();
        const stmt = db.prepare("SELECT p.*, s.goals, s.assists, s.appearances, s.minutes, s.yellow_cards, s.red_cards FROM players p LEFT JOIN stats s ON s.player_id = p.id WHERE p.id = ?");

        stmt.bind([req.params.id]);
        if(stmt.step()){
            res.json(stmt.getAsObject());
        }   else {
            res.status(404).json({error: "Player not found"});
        }
        stmt.free();
    }   catch(err){
        res.status(500).json({error:err.message});
    }
});

//GT /api/players
router.get()