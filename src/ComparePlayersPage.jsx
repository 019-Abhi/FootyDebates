import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getPlayerSeasonStats } from "./services/apicall.js";
import "./ComparePlayersPage.css";

const STAT_ROWS = [
    { label: "Goals", key: "goals"},
    { label: "Assists", key: "assists"},
    { label: "Appearences", key: "appearances"},
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
            <span className={`stat_val ${winsA ? "stat_winner" : ""}`}>{A ?? "—"}</span>
            <span className="stat_label">{label}</span>
            <span className={`stat_val stat_val_right ${winsB ? "stat_winner" : ""}`}>{B ?? "—"}</span>
        </div>
    )

}

function PlayerCard({data}) {

    if (!data) return null;

    return (
        <div className="player_card">
            {data.photo && <img className="player_photo" src = {data.photo} />}
            <div className="player_info">

                <span className="player_name">{data.name}</span>
                <span className="player_meta">{data.nationality} · {data.age} yrs</span>

                {data.club && (
                    <div className="player_club">
                        <span>{data.club}</span>
                    </div>
                )}

            </div>
        </div>

    );
}

export default function ComparePlayers(){
    const [params] = useSearchParams();
    const navigate = useNavigate();

    const [dataA, setDataA] = useState(null);
    const [dataB, setDataB] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const idA = params.get("playerA");
        const idB = params.get("playerB");

        if (!idA || !idB){
            setError("Missing player IDs...");
            setLoading(false);
            return;
        }

        Promise.all([getPlayerSeasonStats(idA), getPlayerSeasonStats(idB)])
            .then(([a, b]) => { setDataA(a); setDataB(b); })
            .catch(err => setError(err.message || "Something went wrong"))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="compare_shell">
            <div className="compare_loading">
                <p>Loading stats</p>
            </div>
        </div>
    );

    if (error) return(
        <div className="compare_shell">
            <div className="compare_error">
                <p>{error}</p>
                <button onClick={() => navigate(-1)}> ← Back</button>
            </div>
        </div>
    )

    return (
        <div className="compare_shell">
            <button className="back_button" onClick={() => navigate(-1)}>← Back</button>

            <div className="compare_header">
                <PlayerCard data={dataA} />
                <div className="vs_badge">VS</div>
                <PlayerCard data={dataB} />
            </div>

            <div className="season_tag">{dataA?.season} Season</div>

            <div className="compare_table">
                {STAT_ROWS.map(({label, key}) => (
                    <StatRow key={key} label={label} A={dataA?.[key]} B={dataB?.[key]} />
                ))}
            </div>
        </div>
    );
}