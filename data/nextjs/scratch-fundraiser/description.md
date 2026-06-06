# Fundraiser

## Overview
A single-page React app to manage fundraising campaigns with goal tracking and donor entries.

## Seed Data

### Campaigns
| ID | Name                   | Goal     |
|----|------------------------|----------|
| 1  | School Supplies Drive  | 1000.00  |
| 2  | Community Garden       | 500.00   |

### Donor Entries
| ID | Campaign ID | Donor Name   | Amount | Date       |
|----|-------------|--------------|--------|------------|
| 1  | 1           | Alice Martin | 150.00 | 2024-03-01 |
| 2  | 1           | Bob Lee      | 200.00 | 2024-03-05 |
| 3  | 2           | Carol White  | 100.00 | 2024-03-08 |
| 4  | 2           | Dave Kim     | 75.00  | 2024-03-10 |

## Fields

### Add Campaign Form
- **Campaign Name** (text input)
- **Goal Amount** (number input, min 1, step 1): fundraising goal in USD
- "Add Campaign" button

### Add Donation Form
- **Select Campaign** (select dropdown listing all campaign names)
- **Donor Name** (text input)
- **Amount** (number input, min 0.01, step 0.01)
- **Date** (date input)
- "Add Donation" button

## Behaviors

### Campaigns List
- Display each campaign as a card showing:
  - Campaign name
  - Goal amount (formatted $X.XX)
  - Total raised (sum of all donations for this campaign, formatted $X.XX)
  - Progress percentage: (raised / goal * 100), clamped to 100%, shown as "X%" with one decimal
  - A visual progress bar (data-testid="progress-bar-{id}") whose width% equals the progress percentage
  - "Delete" button to remove the campaign AND all its donations
- Show "No campaigns yet." if empty.

### Add Campaign
- Validate: name not empty, goal > 0. If invalid, do nothing.
- Prepend new campaign to list with $0.00 raised.
- Clear form after submit.

### Add Donation
- Validate: campaign selected, donor name not empty, amount > 0, date filled. If invalid, do nothing.
- Add donation to selected campaign.
- Clear form after submit.

### Summary
- Show total raised across ALL campaigns labeled "Grand Total Raised:".
- Show count of all donor entries labeled "Total Donors:".

## Edge Cases
- Deleting a campaign with donations removes all associated donations from totals.
- Progress capped at 100% even if raised exceeds goal.
- If no campaigns exist, the "Select Campaign" dropdown shows a placeholder option.
- Amounts always formatted with 2 decimal places.
