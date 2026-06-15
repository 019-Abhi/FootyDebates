const initSqlJs = reture("sql.js");
const fs = require("fs");
const { setDefaultAutoSelectFamily } = require("net");
const path = require("path");
const { data } = require("react-router-dom");
const { saveDb } = require("../../cursor_test/src/database.cjs");

const DB_PATH = path.join(__dirname, "players.db");

let db;

async function getdb() {
    if (db) return db;

    const SQL = await initSqlJs();

    if (fs.existsSync(DB_PATH)) {
        const fileBuffer = fs.readFileSync(DB_PATH);
        db = new SQL.Database(fileBuffer);
    } else {
        db = new SQL.Database();
        db.run(`
            CREATE TABLE IF NOT EXISTS players (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            photo TEXT,
            nationality TEXT,
            age INTEGER,
            club TEXT,
            club_logo TEXT,
            position TEXT,
            season TEXT NOT NULL
            );
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS stats (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                player_id INTEGER NOT NULL,
                goals INTEGER DEFAULT 0,
                assists INTEGER DEFAULT 0,
                appearances INTEGER DEFAULT 0,
                minutes INTEGER DEFAULT 0,
                yellow_cards INTEGER DEFAULT 0,
                red_cards INTEGER DEFAULT 0,
                FOREIGN KEY (player_id) REFERENCES players(id) 
            );
        `);
        saveDb();
    }
    return db;

}

function saveDb() {
    if (!db) return;
    const data = db.export();
    fs.writeFileSync(DB_PATH, Buffer.from(data));
}

module.exports = { getDb, saveDb };