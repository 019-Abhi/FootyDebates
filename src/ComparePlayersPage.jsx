import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getPlayerSeasonStats } from "./services/apicall.js";
import "./ComparePlayersPage.css";

const STAT_ROWS = [
    { label: "Goals", key: "goals"},
    { label: "Assists", key: "assists"},
    { label: "Apperences", key: "appearences"},
    { label: "Minutes", key: "minutes"},
    { label: "Yellow Cards", key: "yellow_cards"},
    { label: "Red Cards", key: "red_cards"},
];

function StatRow({ label, A, B}) {
    const numA = parseFloat(A);
    const numB = parseFloat(B);
    const winsA = !isNaN(numA) && !isNaN(numB) && numA > numB;
    const winsB = !isNaN(numA) && !isNaN(numB) && numB > numA;

    return (
        <div className="stat_row">
            <span className={`stat-val ${aWins ? "stat-winner" : ""}`}>{valA ?? "—"}</span>
            <span className="stat-label">{label}</span>
            <span className={`stat-val stat-val-right ${bWins ? "stat-winner" : ""}`}>{valB ?? "—"}</span>
        </div>
    )

}