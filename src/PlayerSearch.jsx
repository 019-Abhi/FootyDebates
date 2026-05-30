import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchPlayers } from "../services/apiFootball";
import "./PlayerSearch.css";

const SEASON = 2026;
const MIN_QUERY_LEN = 2;
const DEBOUNCE_MS = 300;


function PlayerSearch() {

    const navigate = useNavigate();

    const [playerA, setplayerA] = useState("");
    const [playerB, setplayerB] = useState("");
    const [resultsA, setresultsB] = useState([]);
    const [resultsB, setresultsB] = useState([]);
    const [] = useState(null);
    const [] = useState(null);
    const [loadingA, setloadingA] = useState(false);
    const [loadingB, setloadingB] = useState(false);
    const [searchError, setsearchError] = useState(false);

    function search(query, setResults, setLoading, timerRef){
        clearTimeout(timerRef.current);

        if(query.trim().length < MIN_QUERY_LEN){
            setResults([]);
            return;
        }

        timerRef.current = setTimeout( async () => {
            setLoading(true);
            
            try {
                const players = await setPlayers(query);
                setResults(players);
            } catch (err) {
                setsearchError(err.message || "Somethign went wrong");
                setResults([]);
            } finally {
                setLoading(true)
            }
        }, DEBOUNCE_MS)

    }

}