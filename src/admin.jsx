import { useState, useEffect } from "react";
// import "./admin.css";

const API = "http://localhost:3001/api/players";

//default form
const EMPTY_FORM = {
    name: "", photo: "", nationality: "", age: "", club: "", club_logo: "",
    position: "", season: "2025",
    goals: "", assists: "", appearances: "", minutes: "", yellow_cards: "", red_cards: "",
}

export default function Admin() {
    const [players, setPlayers] = useState([]);
    const [form, setForm] = useState(EMPTY_FORM);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");

    useEffect(() => {
        fetchPlayers();
    }, []);

    async function fetchPlayers() {
        const res = await fetch(API);
        const data = await res.json();
        setPlayers(data);
    }

    //field updates handling
    function handleChange(e) {
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    }

    //new player or update existing player
    async function handleSubmit() {
        if(!form.name || !form.season) return setMsg("Name and season are required");
        setLoading(true);
        setMsg("");

        const method = editingId ? "PUT" : "POST";
        const url = editingId ? `${API}/${editingId}` : API;

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error("Failed to save");
            setMsg(editingId ? "Player Updated" : "Player added");
            setForm(EMPTY_FORM);
            setEditingId(null);
            fetchPlayers();
        } catch (err) {
            setMsg(err.message);
        } finally {
            setLoading(false);
        }

    }

    function handleEdit(p) {
        setEditingId(p.id);
        setForm({
            name: p.name || "", photo: p.photo || "", nationality: p.nationality || "",
            age: p.age || "", club: p.club || "", club_logo: p.club_logo || "",
            position: p.position || "", season: p.season || "2024",
            goals: p.goals ?? "", assists: p.assists ?? "", appearances: p.appearances ?? "",
            minutes: p.minutes ?? "", yellow_cards: p.yellow_cards ?? "", red_cards: p.red_cards ?? "",
        });
    }

    function handlecancel() {
        setForm(EMPTY_FORM);
        setEditingId(null);
        setMsg("");
    }

    return (
        <div className = "admin_page">
            <p>Admin</p>

            <div className="admin_form">
                <h2>{editingId ? "Edit Player" : "Add Player"}</h2>

                <div className = "player_details">
                    <label>*Name
                        <input name ="name" value = {form.name} onChange={handleChange} placeholder="Kylian Mbappe" /></label> <br /><br />
                    <label>Nationality
                        <input name ="nationality" value = {form.nationality} onChange={handleChange} placeholder=" France" /> </label><br /><br />
                    <label>Age
                        <input name ="age" value = {form.age} onChange={handleChange} placeholder="26" /></label><br /><br />
                    <label>Position
                        <input name ="position" value = {form.position} onChange={handleChange} placeholder="Striker" /></label><br /><br />
                    <label>Club
                        <input name ="club" value = {form.club} onChange={handleChange} placeholder="Los Blancos" /></label><br /><br />
                    <label>*Season
                        <input name ="season" value = {form.season} onChange={handleChange} placeholder="2025" /></label><br /><br />
                    <label className="full">Photo URL *
                        <input name ="photo" value = {form.photo} onChange={handleChange} placeholder="https://.." /></label><br /><br />

                
                </div>

                <div className="stats">
                    <label>Goals<input name="goals" type="number" value={form.goals} onChange={handleChange} placeholder="0" /></label><br /><br />
                    <label>Assists<input name="assists" type="number" value={form.assists} onChange={handleChange} placeholder="0" /></label><br /><br />
                    <label>Appearances<input name="appearances" type="number" value={form.appearances} onChange={handleChange} placeholder="0" /></label><br /><br />
                    <label>Minutes<input name="minutes" type="number" value={form.minutes} onChange={handleChange} placeholder="0" /></label><br /><br />
                    <label>Yellow Cards<input name="yellow_cards" type="number" value={form.yellow_cards} onChange={handleChange} placeholder="0" /></label><br /><br />
                    <label>Red Cards<input name="red_cards" type="number" value={form.red_cards} onChange={handleChange} placeholder="0" /></label><br /><br />
                </div>

                {msg && <p className="admin_msg">{msg}</p>}

                <div className = "form_actions">
                    <button className="button" onClick={handleSubmit} disabled={loading}>
                        {loading? "Saving " : editingId ? "Update player" : "Add player"}
                    </button>
                    {editingId && <button className = "button_2" onClick={handlecancel}>Cancel</button>}
                </div>
            </div>


        </div>
    )


}