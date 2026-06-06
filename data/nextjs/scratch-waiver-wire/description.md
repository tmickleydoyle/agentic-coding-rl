# Waiver Wire

A single-page app for managing fantasy sports waiver wire claims. Users can submit waiver claims for available players, view their pending claims, and cancel claims.

## Seed Data

### Available Players (waiver pool)
| id | name | position | team | ownership | waiverOrder |
|----|------|----------|------|-----------|-------------|
| 1 | Miles Sanders | RB | CAR | 12% | 1 |
| 2 | Gus Edwards | RB | BAL | 8% | 2 |
| 3 | Rashod Bateman | WR | BAL | 22% | 3 |
| 4 | Kadarius Toney | WR | KC | 18% | 4 |
| 5 | Cole Kmet | TE | CHI | 31% | 5 |
| 6 | Sam LaPorta | TE | DET | 45% | 6 |
| 7 | Malik Willis | QB | TEN | 5% | 7 |

### My Current Claims (pending)
| id | playerId | playerName | dropPlayer | priority |
|----|----------|------------|------------|----------|
| 1 | 3 | Rashod Bateman | Diontae Johnson | 1 |
| 2 | 6 | Sam LaPorta | Irv Smith Jr | 2 |

## Fields
- Player: name, position, NFL team, ownership percentage, waiver order
- Claim: target player name, player to drop (from roster), priority order

## Behaviors
1. Display heading "Waiver Wire" at the top.
2. Show available players list with each player's name, position, team, ownership %, and waiver order.
3. Each available player has a "Claim" button.
4. Clicking "Claim" opens an inline claim form showing: a text input for "Drop Player" and a "Submit Claim" button.
5. Submitting a claim adds it to "My Claims" section and hides the inline form for that player.
6. My Claims section shows each claim with: player to add, player to drop, and a "Cancel" button.
7. Canceling a claim removes it from My Claims.
8. My Claims count shown as "My Claims ({N})".
9. Claims are displayed in priority order (ascending).
10. The drop player field is required — empty submission does not add the claim.

## Edge Cases
- After claiming a player they should remain in the available list (waiver, not instant add).
- Canceling all claims shows "No pending claims".
- Ownership is displayed with a percent sign.
