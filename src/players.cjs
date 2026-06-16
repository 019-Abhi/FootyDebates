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
router.get("/", async (req, res) => {
    try {
        const db = await getDb();
        const stmt = db.prepare(
            "SELECT p.*, s.goals, s.assists, s.appearances, s.minutes, s.yellow_cards, s.red_cards FROM players p LEFT JOIN stats s ON s.player_id = p.id ORDER BY p.name ASC"
        );
        const results = [];
        while (stmt.step()) results.push(stmt.getAsObject());
        stmt.free();
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// POST
router.post("/", async (req, res) => {
    const { name, photo, nationality, age, club, club_logo, position, season, goals, assists, appearances, minutes, yellow_cards, red_cards } = req.body;

    if (!name || !season) return res.status(400).json({error: "name and season required"});

    try {
        const db = await getDb();

        db.run(
            "INSERT INTO players (name, photo, nationality, age, club, club_logo, position, season) VALUES (?,?,?,?,?,?,?,?)",
            [name, photo || "", nationality || "", age || null, club || "", club_logo || "", position || "", season]
        )

        const idResult = db.exec("SELECT last_insert_rowid() as id");
        const playerid = idResult[0].values[0][0];

        db.run(
            "INSERT INTO stats (player_id, goals, assists, appearances, minutes, yellow_cards, red_cards) VALUES (?,?,?,?,?,?,?)",
            [playerid, goals || 0, assists || 0, appearances || 0, minutes || 0, yellow_cards || 0, red_cards || 0]
        );

        saveDb();
        res.status(201).json({id:playerid, message:"Player added"});

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//PUT /api/players/id

router.put("/:id", async (req, res) => {
    const { name, photo, nationality, age, club, club_logo, position, season, goals, assists, appearances, minutes, yellow_cards, red_cards } = req.body;

    try {
        const db = await getDb();

        db.run(
            "UPDATE players SET name=?, photo=?, nationality=?, age=?, club=?, club_logo=?, position=?, season=? WHERE id=?",
            [name, photo || "", nationality || "", age || null, club || "", club_logo || "", position || "", season, req.params.id]
        )

        db.run(
            "UPDATE stats SET goals=?, assists=?, appearances=?, minutes=?, yellow_cards=?, red_cards=? WHERE player_id=?",
            [goals || 0, assists || 0, appearances || 0, minutes || 0, yellow_cards || 0, red_cards || 0, req.params.id]
        );

        saveDb();
        res.json({ message: "Player updated"})
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

// DELETE /api/players/:id
router.delete("/:id", async (req, res) => {
    try {
        const db = await getDb();
        db.run("DELETE FROM stats WHERE player_id=?", [req.params.id]);
        db.run("DELETE FROM players WHERE id=?", [req.params.id]);
        saveDb();
        res.json({ message: "Player deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;