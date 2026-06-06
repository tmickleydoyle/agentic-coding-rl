import React, { useState } from "react";

interface AuctionItem {
  id: number;
  title: string;
  description: string;
  startingBid: number;
  currentBid: number;
  status: "open" | "closed";
  bidCount: number;
}

const SEED_ITEMS: AuctionItem[] = [
  { id: 1, title: "Antique Pocket Watch", description: "Gold-plated 1890s timepiece", startingBid: 200, currentBid: 200, status: "open", bidCount: 0 },
  { id: 2, title: "Oil Painting Landscape", description: "18th century pastoral scene", startingBid: 500, currentBid: 650, status: "open", bidCount: 3 },
  { id: 3, title: "Silver Candelabra", description: "Victorian 5-arm candelabra", startingBid: 150, currentBid: 310, status: "closed", bidCount: 7 },
  { id: 4, title: "Ceramic Tea Set", description: "Ming dynasty reproduction", startingBid: 100, currentBid: 100, status: "open", bidCount: 0 },
  { id: 5, title: "Mahogany Writing Desk", description: "Early 1900s roll-top desk", startingBid: 800, currentBid: 950, status: "open", bidCount: 4 },
];

export default function App() {
  const [items, setItems] = useState<AuctionItem[]>(SEED_ITEMS);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startingBid, setStartingBid] = useState("");
  const [formError, setFormError] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [bidInputs, setBidInputs] = useState<Record<number, string>>({});
  const [bidErrors, setBidErrors] = useState<Record<number, string>>({});

  const handleAdd = () => {
    if (!title.trim()) { setFormError("Title is required"); return; }
    const sbNum = Number(startingBid);
    if (!startingBid || sbNum <= 0) { setFormError("Starting bid must be greater than 0"); return; }
    setFormError("");
    const newId = items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;
    setItems([...items, { id: newId, title: title.trim(), description: description.trim(), startingBid: sbNum, currentBid: sbNum, status: "open", bidCount: 0 }]);
    setTitle(""); setDescription(""); setStartingBid("");
  };

  const handleBid = (id: number) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const bidVal = Number(bidInputs[id] || 0);
    if (bidVal <= item.currentBid) {
      setBidErrors({ ...bidErrors, [id]: "Bid must exceed current bid" });
      return;
    }
    setBidErrors({ ...bidErrors, [id]: "" });
    setItems(items.map((i) => i.id === id ? { ...i, currentBid: bidVal, bidCount: i.bidCount + 1 } : i));
    setBidInputs({ ...bidInputs, [id]: "" });
  };

  const handleClose = (id: number) => {
    setItems(items.map((i) => i.id === id ? { ...i, status: "closed" } : i));
  };

  const handleRemove = (id: number) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const filteredItems = items.filter((i) => {
    if (filterStatus !== "All" && i.status !== filterStatus) return false;
    return true;
  });

  const openCount = items.filter((i) => i.status === "open").length;
  const closedCount = items.filter((i) => i.status === "closed").length;
  const highestBid = items.length > 0 ? Math.max(...items.map((i) => i.currentBid)) : 0;

  return (
    <div>
      <h1 data-testid="heading">Auction Tracker</h1>

      <div data-testid="add-form">
        <input data-testid="input-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <input data-testid="input-description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
        <input data-testid="input-starting-bid" type="number" value={startingBid} onChange={(e) => setStartingBid(e.target.value)} placeholder="Starting bid" />
        <button data-testid="btn-add" onClick={handleAdd}>Add Item</button>
        {formError && <span data-testid="form-error">{formError}</span>}
      </div>

      <div>
        <select data-testid="filter-status" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="All">All</option>
          <option value="open">open</option>
          <option value="closed">closed</option>
        </select>
      </div>

      <div data-testid="item-list">
        {filteredItems.map((item) => (
          <div key={item.id} data-testid={`auction-${item.id}`}>
            <span data-testid={`auction-title-${item.id}`}>{item.title}</span>
            <span>{item.description}</span>
            <span>Starting: ${item.startingBid}</span>
            <span>Current: ${item.currentBid}</span>
            <span data-testid={`auction-bid-count-${item.id}`}>{item.bidCount}</span>
            <span data-testid={`auction-status-${item.id}`}>{item.status === "open" ? "OPEN" : "CLOSED"}</span>
            {item.status === "open" && (
              <>
                <input
                  data-testid={`bid-input-${item.id}`}
                  type="number"
                  value={bidInputs[item.id] || ""}
                  onChange={(e) => setBidInputs({ ...bidInputs, [item.id]: e.target.value })}
                  placeholder="Your bid"
                />
                <button data-testid={`btn-bid-${item.id}`} onClick={() => handleBid(item.id)}>
                  Place Bid
                </button>
                {bidErrors[item.id] && <span data-testid={`bid-error-${item.id}`}>{bidErrors[item.id]}</span>}
                <button data-testid={`btn-close-${item.id}`} onClick={() => handleClose(item.id)}>
                  Close Auction
                </button>
              </>
            )}
            <button data-testid={`btn-remove-${item.id}`} onClick={() => handleRemove(item.id)}>
              Remove
            </button>
          </div>
        ))}
      </div>

      <div data-testid="summary">
        <span data-testid="count-open">Open: {openCount}</span>
        <span data-testid="count-closed">Closed: {closedCount}</span>
        <span data-testid="highest-bid">Highest bid: ${highestBid}</span>
      </div>
    </div>
  );
}
