"use client";

import { useState, useEffect } from 'react';

export default function ShoppingItems() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState('');
  const [editName, setEditName] = useState('');
  const [editAmount, setEditAmount] = useState(0);

  const BASE_URL = 'http://localhost:5001/api/shoppingItems';

  // Alle Artikel abrufen
  const fetchItems = async () => {
    try {
      const response = await fetch(BASE_URL);
      const data = await response.json();
      setItems(data);
    } catch (err) {
      setError('Fehler beim Laden der Artikel');
    }
  };

  // Artikel hinzufügen
  const addItem = async () => {
    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, amount: parseInt(amount) }),
      });
      if (response.ok) {
        fetchItems();
        setName('');
        setAmount(0);
      } else {
        setError('Fehler beim Hinzufügen des Artikels');
      }
    } catch (err) {
      setError('Fehler beim Hinzufügen des Artikels');
    }
  };

  // Artikel aktualisieren
  const updateItem = async (itemName) => {
    try {
      const response = await fetch(`${BASE_URL}/${itemName}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editName, amount: parseInt(editAmount) }),
      });
      if (response.ok) {
        fetchItems();
        setEditName('');
        setEditAmount(0);
      } else {
        setError('Fehler beim Aktualisieren des Artikels');
      }
    } catch (err) {
      setError('Fehler beim Aktualisieren des Artikels');
    }
  };

  // Artikel löschen
  const deleteItem = async (itemName) => {
    try {
      const response = await fetch(`${BASE_URL}/${itemName}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchItems();
      } else {
        setError('Fehler beim Löschen des Artikels');
      }
    } catch (err) {
      setError('Fehler beim Löschen des Artikels');
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Shopping Items</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
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
          onChange={(e) => setAmount(e.target.value)}
        />
        <button onClick={addItem}>Hinzufügen</button>
      </div>

      <ul>
        {items.map((item) => (
          <li key={item.name}>
            {item.name} - {item.amount}
            <button onClick={() => deleteItem(item.name)} style={{ marginLeft: '10px' }}>
              Löschen
            </button>
            <button
              onClick={() => {
                setEditName(item.name);
                setEditAmount(item.amount);
              }}
              style={{ marginLeft: '10px' }}
            >
              Bearbeiten
            </button>
            {editName === item.name && (
              <div>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                <input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                />
                <button onClick={() => updateItem(item.name)}>Speichern</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
