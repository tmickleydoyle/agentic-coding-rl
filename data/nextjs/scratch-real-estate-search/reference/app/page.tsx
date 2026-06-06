import React, { useState } from "react";

interface Listing {
  id: number;
  address: string;
  city: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  type: string;
}

const LISTINGS: Listing[] = [
  { id: 1, address: "123 Maple St", city: "Austin", price: 450000, bedrooms: 3, bathrooms: 2, sqft: 1800, type: "House" },
  { id: 2, address: "456 Oak Ave", city: "Denver", price: 320000, bedrooms: 2, bathrooms: 1, sqft: 1100, type: "Condo" },
  { id: 3, address: "789 Pine Rd", city: "Austin", price: 675000, bedrooms: 4, bathrooms: 3, sqft: 2600, type: "House" },
  { id: 4, address: "101 Elm Blvd", city: "Seattle", price: 540000, bedrooms: 3, bathrooms: 2, sqft: 1950, type: "Townhouse" },
  { id: 5, address: "202 Cedar Ln", city: "Denver", price: 280000, bedrooms: 1, bathrooms: 1, sqft: 750, type: "Condo" },
  { id: 6, address: "303 Birch Way", city: "Seattle", price: 890000, bedrooms: 5, bathrooms: 4, sqft: 3400, type: "House" },
];

function formatPrice(price: number): string {
  return "$" + price.toLocaleString("en-US");
}

export default function App() {
  const [city, setCity] = useState("All Cities");
  const [minBedrooms, setMinBedrooms] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const filtered = LISTINGS.filter((l) => {
    if (city !== "All Cities" && l.city !== city) return false;
    if (minBedrooms !== "" && l.bedrooms < parseInt(minBedrooms, 10)) return false;
    if (maxPrice !== "" && l.price > parseInt(maxPrice, 10)) return false;
    return true;
  });

  return (
    <div>
      <h1>Real Estate Search</h1>

      <div>
        <label htmlFor="city-filter">City</label>
        <select
          id="city-filter"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          data-testid="city-filter"
        >
          <option value="All Cities">All Cities</option>
          <option value="Austin">Austin</option>
          <option value="Denver">Denver</option>
          <option value="Seattle">Seattle</option>
        </select>
      </div>

      <div>
        <label htmlFor="min-bedrooms">Min Bedrooms</label>
        <input
          id="min-bedrooms"
          type="number"
          value={minBedrooms}
          onChange={(e) => setMinBedrooms(e.target.value)}
          data-testid="min-bedrooms"
          placeholder="Any"
        />
      </div>

      <div>
        <label htmlFor="max-price">Max Price</label>
        <input
          id="max-price"
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          data-testid="max-price"
          placeholder="Any"
        />
      </div>

      <div data-testid="listing-count">{filtered.length} listings</div>

      {filtered.length === 0 && (
        <div data-testid="no-results">No listings found</div>
      )}

      <div>
        {filtered.map((listing) => (
          <div key={listing.id} data-testid="listing-card">
            <h2>{listing.address}</h2>
            <p>{listing.city}</p>
            <p data-testid={`price-${listing.id}`}>{formatPrice(listing.price)}</p>
            <p>{listing.bedrooms} bed | {listing.bathrooms} bath | {listing.sqft} sqft</p>
            <p>{listing.type}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
