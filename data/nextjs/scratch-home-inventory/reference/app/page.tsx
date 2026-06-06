import React, { useState } from "react";

type Room = "Living Room" | "Kitchen" | "Bedroom" | "Bathroom" | "Garage" | "Other";
type Category = "Furniture" | "Electronics" | "Appliances" | "Clothing" | "Tools" | "Other";

interface Item {
  id: number;
  name: string;
  room: Room;
  category: Category;
  quantity: number;
  value: number;
}

const ROOMS: Room[] = ["Living Room", "Kitchen", "Bedroom", "Bathroom", "Garage", "Other"];
const CATEGORIES: Category[] = ["Furniture", "Electronics", "Appliances", "Clothing", "Tools", "Other"];

const SEED_ITEMS: Item[] = [
  { id: 1, name: "65\" TV", room: "Living Room", category: "Electronics", quantity: 1, value: 800 },
  { id: 2, name: "Sofa", room: "Living Room", category: "Furniture", quantity: 1, value: 1200 },
  { id: 3, name: "Coffee Table", room: "Living Room", category: "Furniture", quantity: 1, value: 300 },
  { id: 4, name: "Refrigerator", room: "Kitchen", category: "Appliances", quantity: 1, value: 950 },
  { id: 5, name: "Microwave", room: "Kitchen", category: "Appliances", quantity: 1, value: 120 },
  { id: 6, name: "Bed Frame", room: "Bedroom", category: "Furniture", quantity: 1, value: 600 },
  { id: 7, name: "Laptop", room: "Bedroom", category: "Electronics", quantity: 1, value: 1100 },
];

export default function App() {
  const [items, setItems] = useState<Item[]>(SEED_ITEMS);
  const [nextId, setNextId] = useState(8);
  const [filterRoom, setFilterRoom] = useState<string>("All Rooms");

  const [name, setName] = useState("");
  const [room, setRoom] = useState<Room>("Living Room");
  const [category, setCategory] = useState<Category>("Furniture");
  const [quantity, setQuantity] = useState(1);
  const [value, setValue] = useState(0);

  const handleAdd = () => {
    if (!name.trim()) return;
    const newItem: Item = {
      id: nextId,
      name: name.trim(),
      room,
      category,
      quantity: quantity < 1 ? 1 : quantity,
      value: value < 0 ? 0 : value,
    };
    setItems([...items, newItem]);
    setNextId(nextId + 1);
    setName("");
    setRoom("Living Room");
    setCategory("Furniture");
    setQuantity(1);
    setValue(0);
  };

  const handleDelete = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const filteredItems = filterRoom === "All Rooms"
    ? items
    : items.filter((item) => item.room === filterRoom);

  const totalCount = items.length;
  const totalValue = items.reduce((sum, item) => sum + item.quantity * item.value, 0);

  return (
    <div>
      <h1>Home Inventory</h1>

      <div data-testid="summary">
        <span data-testid="total-count">Total Items: {totalCount}</span>
        <span data-testid="total-value">Total Value: ${totalValue}</span>
      </div>

      <div>
        <h2>Add Item</h2>
        <label htmlFor="item-name">Name</label>
        <input
          id="item-name"
          data-testid="input-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="item-room">Room</label>
        <select
          id="item-room"
          data-testid="select-room"
          value={room}
          onChange={(e) => setRoom(e.target.value as Room)}
        >
          {ROOMS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        <label htmlFor="item-category">Category</label>
        <select
          id="item-category"
          data-testid="select-category"
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <label htmlFor="item-quantity">Quantity</label>
        <input
          id="item-quantity"
          data-testid="input-quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />

        <label htmlFor="item-value">Value ($)</label>
        <input
          id="item-value"
          data-testid="input-value"
          type="number"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
        />

        <button data-testid="btn-add" onClick={handleAdd}>Add Item</button>
      </div>

      <div>
        <label htmlFor="filter-room">Filter by Room</label>
        <select
          id="filter-room"
          data-testid="filter-room"
          value={filterRoom}
          onChange={(e) => setFilterRoom(e.target.value)}
        >
          <option value="All Rooms">All Rooms</option>
          {ROOMS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Room</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Value</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody data-testid="item-list">
          {filteredItems.map((item) => (
            <tr key={item.id} data-testid={`item-row-${item.id}`}>
              <td data-testid={`item-name-${item.id}`}>{item.name}</td>
              <td data-testid={`item-room-${item.id}`}>{item.room}</td>
              <td data-testid={`item-category-${item.id}`}>{item.category}</td>
              <td data-testid={`item-quantity-${item.id}`}>{item.quantity}</td>
              <td data-testid={`item-value-${item.id}`}>${item.value}</td>
              <td>
                <button
                  data-testid={`btn-delete-${item.id}`}
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
