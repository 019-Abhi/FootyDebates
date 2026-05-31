import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
// import { searchPlayers } from "../services/apiFootball";
import "./PlayerSearch.css";

const SEASON = 2026;
const MIN_QUERY_LEN = 2;
const DEBOUNCE_MS = 300;


function PlayerSearch() {

    const navigate = useNavigate();

    const [playerA, setplayerA] = useState("");
    const [playerB, setplayerB] = useState("");
    const [resultsA, setresultsA] = useState([]);
    const [resultsB, setresultsB] = useState([]);
    const [inputA, setinputA] = useState(null);
    const [inputB, setinputB] = useState(null);
    const [loadingA, setloadingA] = useState(false);
    const [loadingB, setloadingB] = useState(false);
    const [searchError, setsearchError] = useState(false);

    const timerA = useRef(null);
    const timerB = useRef(null);

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

    function handleAchanges(val){
        setInputA(val);
        setplayerA(null);
        search(val, setresultsA, setloadingA, timerA)
    }

    function handleBchanges(val){
        setinputB(val)
        setplayerB(null);
        search(val, setresultsB, setloadingB, timerB);
    }

    function handleSelectA(player){
        setplayerA(player);
        setInputA(player.name);
        setresultsA([]);
    }

    function handleSelectB(player){
        setplayerB(player);
        setinputB(player.name);
        setResults([]);
    }

    function handleComapre(){
        if (!playerA || !playerB) return;
        navigate(`/compare?playerA=${playerA.id}&playerB=${playerB.id}&season=${SEASON}`);
    }

    const showDropdownA = inputA.trim().length >= MIN_QUERY_LENGTH && !playerA;
    const showDropdownB = inputB.trim().length >= MIN_QUERY_LEN && !playerB;

    return (
        <div classname='search-panel'>
            <h1>Compare Players</h1>
            <p>Search two players and break down their season stats side-by-side</p>
       
            <div classname="search-grid">
                
                <div classname = "search-block">
                    <label classname = "search-blocj_label">Player 1</label>
                    <input className="search-block__input" type="text" value={inputA} onChange={(e) => handleChangeA(e.target.value)} placeholder="Player name"
                    />
                    {showDropdownA && (
                        <div className="search-block__dropdown">
                            {loadingA ? (
                                <div className="search-block__muted">Searching...</div>
                            ) : resultsA.length ? (
                                resultsA.map((p) => (
                                <button key={p.id} className="search-block__option" type="button" onClick={() => handleSelectA(p)}>
                                    <img src={p.photo} alt={p.name} />
                                    <span>{p.name}</span>
                                </button>
                                ))
                            ) : (
                                <div className="search-block__muted">No players found</div>
                            )}
                        </div>
                    )}
                </div>
            </div>


            <div className="search-block">
                <label classname="search_block_label">Player 2</label>
                <input className="search-block__input" type="text" value={inputB} onChange={(e) => handleChangeB(e.target.value)} placeholder="Player name"/>
                {showDropdownB && (
                    <div className="search-block__dropdown">
                    {loadingB ? (
                        <div className="search-block__muted">Searching...</div>
                    ) : resultsB.length ? (
                        resultsB.map((p) => (
                        <button
                            key={p.id}
                            className="search-block__option"
                            type="button"
                            onClick={() => handleSelectB(p)}
                        >
                            <img src={p.photo} alt={p.name} />
                            <span>{p.name}</span>
                        </button>
                        ))
                    ) : (
                        <div className="search-block__muted">No players found</div>
                    )}
                    </div>
                )}
            </div>
        </div>



    )
}

