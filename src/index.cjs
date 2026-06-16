const express = require("express");
const cors = require("cors");
const playersRouter = require("./players.cjs");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use("/api/players", playersRouter);

app.get("/api/health", (_, res) => res.json({ status: "ok" }));

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});