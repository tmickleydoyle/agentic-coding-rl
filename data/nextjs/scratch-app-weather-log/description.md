# Weather Log App

A multi-route app for recording daily weather observations and viewing summaries.

## Routes
- **Home** (`/`): Shows total entries, average temperature, and hottest/coldest recorded days.
- **Log** (`/log`): Add and delete weather entries. Each entry: id, date (ISO string), temperature (number), condition ("sunny"|"cloudy"|"rainy"|"snowy"|"windy"), humidity (0-100), notes.
- **Charts** (`/charts`): Summary stats — average temp by condition, min/max overall temp, most common condition.
- **Settings** (`/settings`): Unit preference ("celsius"|"fahrenheit"). Temperatures display in chosen unit (conversion: F = C * 9/5 + 32). Default: celsius.

## Seed Data
Entries: `[{ id: "w1", date: "2024-01-01", temperature: 22, condition: "sunny", humidity: 45, notes: "Clear morning" }, { id: "w2", date: "2024-01-02", temperature: 15, condition: "cloudy", humidity: 70, notes: "Overcast" }, { id: "w3", date: "2024-01-03", temperature: 8, condition: "rainy", humidity: 90, notes: "Heavy rain" }]`

## Behaviors
- Adding an entry requires a date and valid temperature.
- Cannot add duplicate dates (same date ISO string).
- Settings persist across navigation.
- Average temperature rounded to 1 decimal.
- Charts page shows condition stats sorted alphabetically.

## API
`GET /api/entries` → returns `{ entries: WeatherEntry[] }`
`POST /api/entries` body `{ date, temperature, condition, humidity, notes }` → returns `{ entry: WeatherEntry }`
`DELETE /api/entries?id=<id>` → returns `{ ok: true }`

## Edge Cases
- Humidity must be 0-100.
- Duplicate date: show error "Entry for this date already exists".
- Empty log: show "No entries yet" on home page.
