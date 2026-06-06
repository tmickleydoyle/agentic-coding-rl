# scratch-app-kpi-dashboard

A KPI dashboard for startups to track key performance indicators, set goals, and view historical trends.

## Routes
- `/` — Overview: all KPIs with current value, target, and status (On Track / At Risk / Off Track)
- `/metrics` — Add/edit/delete KPI metrics. Fields: name, category (Growth/Revenue/Engagement/Ops), unit (number/percent/currency), currentValue, targetValue
- `/goals` — Set quarterly goals for each metric. Fields: metricId, quarter (Q1/Q2/Q3/Q4), year, targetValue
- `/history` — Log historical data points for metrics. Fields: metricId, value, date

## Seed Data
Metrics:
1. { id: "1", name: "MRR", category: "Revenue", unit: "currency", currentValue: 45000, targetValue: 60000 }
2. { id: "2", name: "Churn Rate", category: "Revenue", unit: "percent", currentValue: 3.2, targetValue: 2.0 }
3. { id: "3", name: "DAU", category: "Engagement", unit: "number", currentValue: 1200, targetValue: 2000 }
4. { id: "4", name: "NPS", category: "Engagement", unit: "number", currentValue: 42, targetValue: 50 }

Goals:
1. { id: "1", metricId: "1", quarter: "Q2", year: 2024, targetValue: 55000 }
2. { id: "2", metricId: "3", quarter: "Q2", year: 2024, targetValue: 1500 }

## Behaviors
- Status calculation: if unit is "percent" and lower is better (Churn Rate), On Track if currentValue <= targetValue; otherwise On Track if currentValue >= targetValue * 0.9, At Risk if >= 0.7, Off Track otherwise
- Overview shows metric name, current value (formatted by unit), target, and status badge
- Adding metric requires name, category, unit, currentValue, targetValue
- History page shows data points per metric, newest first

## Edge Cases
- Currency values formatted with $ prefix
- Percent values formatted with % suffix
- If no history entries, show "No history"
