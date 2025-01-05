"use client";

import { useState, useEffect } from "react";

export default function ShoppingItems() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editAmount, setEditAmount] = useState(0);

  const BASE_URL =
    process.env.REACT_APP_BASE_URL || "http://localhost:5001/api/shoppingItems";

  // Alle Artikel abrufen
  const fetchItems = async () => {
    try {
      setError("");
      const response = await fetch(BASE_URL);
      const data = await response.json();
      setItems(data);
    } catch (err) {
      setError("Fehler beim Laden der Artikel");
    }
  };

  // Artikel hinzufügen
  const addItem = async () => {
    if (!name || amount <= 0) {
      setError("Name und Menge sind erforderlich");
      return;
    }

    try {
      setError("");
      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, amount }),
      });

      fetchItems(); // Liste neu laden
      setName("");
      setAmount(0);
      
    } catch (err) {
      setError("Fehler beim Hinzufügen des Artikels");
    }
  };

  // Artikel aktualisieren
  const updateItem = async () => {
    if (!editId || !editName || editAmount <= 0) {
      setError("Ungültige Eingabe für Aktualisierung");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: editName, amount: editAmount }),
      });

      if (response.ok) {
        fetchItems(); // Liste neu laden
        setEditId(null);
        setEditName("");
        setEditAmount(0);
      } else {
        setError("Fehler beim Aktualisieren des Artikels");
      }
    } catch (err) {
      setError("Fehler beim Aktualisieren des Artikels");
    }
  };

  // Artikel löschen
  const deleteItem = async (id) => {
    try {
      setError("");
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setItems((prevItems) => prevItems.filter((item) => item._id !== id)); // Artikel aus der Liste entfernen
      } else {
        setError("Fehler beim Löschen des Artikels");
      }
    } catch (err) {
      setError("Fehler beim Löschen des Artikels");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Shopping Items</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Menge"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <button onClick={addItem}>Hinzufügen</button>
      </div>

      <ul>
        {items.map((item) => (
          <li key={item._id}>
            {item.name} - {item.amount}
            <button
              onClick={() => deleteItem(item._id)}
              style={{ marginLeft: "10px" }}
            >
              Löschen
            </button>
            <button
              onClick={() => {
                setEditId(item._id);
                setEditName(item.name); // Name setzen
                setEditAmount(item.amount); // Menge setzen
              }}
              style={{ marginLeft: "10px" }}
            >
              Bearbeiten
            </button>
            {editId === item._id && (
              <div>
                <input
                  type="text"
                  value={editName} // Name bearbeiten
                  onChange={(e) => setEditName(e.target.value)}
                />
                <input
                  type="number"
                  value={editAmount} // Menge bearbeiten
                  onChange={(e) => setEditAmount(Number(e.target.value))}
                />
                <button onClick={updateItem}>Speichern</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
