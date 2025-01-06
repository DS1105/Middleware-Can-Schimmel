"use client"; // Enable client-side rendering for this component

import { useState, useEffect } from "react";

export default function ShoppingItems() {
  const [items, setItems] = useState([]); // State for storing shopping items
  const [name, setName] = useState(""); // State for new item's name
  const [amount, setAmount] = useState(0); // State for new item's amount
  const [error, setError] = useState(""); // State for error messages
  const [editId, setEditId] = useState(null); // State for the item being edited
  const [editName, setEditName] = useState(""); // State for edited item's name
  const [editAmount, setEditAmount] = useState(0); // State for edited item's amount

  // Base URL for API (12-Factor: Config via environment variables)
  const BASE_URL =
    process.env.REACT_APP_BASE_URL || "http://localhost:5001/api/shoppingItems";

  // Logger function for standardized logging
  const log = (level, message, data = {}) => {
    console[level](`[${level.toUpperCase()}] ${message}`, data);
  };

  // Fetch all shopping items
  const fetchItems = async () => {
    try {
      setError(""); // Clear previous error
      log("info", "Fetching items...");
      const response = await fetch(BASE_URL);
      const data = await response.json();
      setItems(data); // Update items in state
      log("info", "Items fetched successfully", { items: data });
    } catch (err) {
      setError("Error loading items");
      log("error", "Error fetching items", { error: err.message });
    }
  };

  // Add a new shopping item
  const addItem = async () => {
    if (!name || amount <= 0) {
      setError("Name and amount are required"); // Validate input
      log("warn", "Invalid input for adding an item", { name, amount });
      return;
    }

    try {
      setError(""); // Clear previous error
      log("info", "Adding item...", { name, amount });
      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, amount }), // Send new item to API
      });

      if (response.ok) {
        fetchItems(); // Refresh the item list
        setName(""); // Clear name input
        setAmount(0); // Clear amount input
        log("info", "Item added successfully", { name, amount });
      } else {
        throw new Error("Failed to add item");
      }
    } catch (err) {
      setError("Error adding item");
      log("error", "Error adding item", { error: err.message });
    }
  };

  // Update an existing shopping item
  const updateItem = async () => {
    if (!editId || !editName || editAmount <= 0) {
      setError("Invalid input for update"); // Validate input
      log("warn", "Invalid input for updating an item", { editId, editName, editAmount });
      return;
    }

    try {
      log("info", "Updating item...", { editId, editName, editAmount });
      const response = await fetch(`${BASE_URL}/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: editName, amount: editAmount }), // Send updated data to API
      });

      if (response.ok) {
        fetchItems(); // Refresh the item list
        setEditId(null); // Clear edit state
        setEditName("");
        setEditAmount(0);
        log("info", "Item updated successfully", { editId });
      } else {
        throw new Error("Failed to update item");
      }
    } catch (err) {
      setError("Error updating item");
      log("error", "Error updating item", { error: err.message });
    }
  };

  // Delete a shopping item
  const deleteItem = async (id) => {
    try {
      setError(""); // Clear previous error
      log("info", "Deleting item...", { id });
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setItems((prevItems) => prevItems.filter((item) => item._id !== id)); // Remove item from state
        log("info", "Item deleted successfully", { id });
      } else {
        throw new Error("Failed to delete item");
      }
    } catch (err) {
      setError("Error deleting item");
      log("error", "Error deleting item", { error: err.message });
    }
  };

  // Fetch items on component mount (12-Factor: Stateless processes)
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
          onChange={(e) => setName(e.target.value)} // Handle name input change
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))} // Handle amount input change
        />
        <button onClick={addItem}>Add</button>
      </div>

      <ul>
        {items.map((item) => (
          <li key={item._id}>
            {item.name} - {item.amount}
            <button
              onClick={() => deleteItem(item._id)} // Delete item
              style={{ marginLeft: "10px" }}
            >
              Delete
            </button>
            <button
              onClick={() => {
                setEditId(item._id);
                setEditName(item.name); // Set name for editing
                setEditAmount(item.amount); // Set amount for editing
              }}
              style={{ marginLeft: "10px" }}
            >
              Edit
            </button>
            {editId === item._id && (
              <div>
                <input
                  type="text"
                  value={editName} // Update name input
                  onChange={(e) => setEditName(e.target.value)}
                />
                <input
                  type="number"
                  value={editAmount} // Update amount input
                  onChange={(e) => setEditAmount(Number(e.target.value))}
                />
                <button onClick={updateItem}>Save</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
