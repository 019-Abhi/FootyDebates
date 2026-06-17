import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { searchPlayers } from "./services/apicall.js";
import "./PlayerSearch.css";

const SEASON = 2025;
const MIN_QUERY_LEN = 3;
const DEBOUNCE_MS = 300;


function PlayerSearch() {

    const navigate = useNavigate();

    const [playerA, setplayerA] = useState("");
    const [playerB, setplayerB] = useState("");
    const [resultsA, setresultsA] = useState([]);
    const [resultsB, setresultsB] = useState([]);
    const [inputA, setinputA] = useState("");
    const [inputB, setinputB] = useState("");
    const [loadingA, setloadingA] = useState(false);
    const [loadingB, setloadingB] = useState(false);
    const [searchError, setsearchError] = useState("");

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
                const players = await searchPlayers(query);
                setResults(players);
            } catch (err) {
                setsearchError(err.message || "Somethign went wrong");
                setResults([]);
            } finally {
                setLoading(false)
            }
        }, DEBOUNCE_MS)

    }

    function handleAchanges(val){
        setinputA(val);
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
        setinputA(player.name);
        setresultsA([]);
    }

    function handleSelectB(player){
        setplayerB(player);
        setinputB(player.name);
        setresultsB([]);
    }

    function handleCompare(){
        if (!playerA || !playerB) return;
        navigate(`/compare?playerA=${playerA.id}&playerB=${playerB.id}&season=${SEASON}`);
    }

    const showDropdownA = inputA.trim().length >= MIN_QUERY_LEN && !playerA;
    const showDropdownB = inputB.trim().length >= MIN_QUERY_LEN && !playerB;

    return (
        <div className='search_panel'>
            <h1>Compare Players</h1>
            <p>Search two players and break down their season stats side-by-side</p>
       
            <div className="search_grid">
                
                <div className = "search_block">
                    <label className = "search_block_label">Player 1</label>
                    <input className="search_block_input" type="text" value={inputA} onChange={(e) => handleAchanges(e.target.value)} placeholder="Player name"
                    />
                    {showDropdownA && (
                        <div className="search_block_dropdown">
                            {loadingA ? (
                                <div className="search_block_muted">Searching...</div>
                            ) : resultsA.length ? (
                                resultsA.map((p) => (
                                <button key={p.id} className="search_block_option" type="button" onClick={() => handleSelectA(p)}>
                                    {/* <img src={p.photo} alt={p.name} /> */}
                                    <span>{p.name}</span>
                                </button>
                                ))
                            ) : (
                                <div className="search_block_muted">No players found</div>
                            )}
                        </div>
                    )}
                </div>


                <div className="search_block">
                    <label className="search_block_label">Player 2</label>
                    <input className="search_block_input" type="text" value={inputB} onChange={(e) => handleBchanges(e.target.value)} placeholder="Player name"/>
                    {showDropdownB && (
                        <div className="search_block_dropdown">
                        {loadingB ? (
                            <div className="search_block_muted">Searching...</div>
                        ) : resultsB.length ? (
                            resultsB.map((p) => (
                            <button key={p.id} className="search_block_option" type="button" onClick={() => handleSelectB(p)}>
                                <img src={p.photo} alt={p.name} />
                                <span>{p.name}</span>
                            </button>
                            ))
                        ) : (
                            <div className="search_block_muted">No players found</div>
                        )}
                        </div>
                    )}
                </div>



            </div>


            {searchError && <p className="search error">{searchError}</p>}

            <button className="compare-btn" type="button" disabled={!playerA || !playerB} onClick={handleCompare}>
                Compare
            </button>

        </div>
    );
}

export default PlayerSearch;

