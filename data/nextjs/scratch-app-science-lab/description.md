# scratch-app-science-lab

A science lab management system for tracking experiments, lab equipment, and recorded measurements.

## Routes
- **Home** (`home`): Dashboard with experiment count, running count, available equipment count, measurement count.
- **Experiments** (`experiments`): List experiments with title, subject, status; add new; change status via dropdown.
- **Equipment** (`equipment`): Inventory with name, category, quantity, status, location; add new; update status; show available count.
- **Results** (`results`): Log measurements (experiment, measurement name, value, unit); delete results; show total count.

## Seed Data
- Experiments: Photosynthesis Rate (Biology, running), Acid-Base Reactions (Chemistry, completed), Pendulum Period (Physics, planned)
- Equipment: Microscope (Optics, qty 5, available, Lab A), Bunsen Burner (Heating, qty 8, in-use, Lab B), pH Meter (Measurement, qty 3, available, Lab A), Centrifuge (Separation, qty 2, maintenance, Storage)
- Results: O2 production 2.4 mL/min (Photosynthesis Rate), CO2 volume 150 mL (Acid-Base)

## Behaviors
- Adding experiment requires title, hypothesis, subject, startDate
- Adding equipment requires name, category, location; quantity >= 1
- Adding result requires experiment, measurement name, numeric value, unit
- Status dropdowns update immediately in state
- Available equipment count reflects only status="available" items

## API (app/api/experiments/route.ts)
- GET /api/experiments — returns all
- POST /api/experiments — creates (title, hypothesis, subject, startDate required); 400 if missing
