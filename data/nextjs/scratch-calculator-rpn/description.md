# RPN Calculator

Build a Reverse Polish Notation (RPN) calculator with a stack display and computation history.

## RPN Evaluation Rules
In RPN (postfix notation), operands are pushed onto a stack, and operators pop operands and push results.
- Supported operators: + (add), - (subtract), * (multiply), / (divide)
- Division by zero → push "Error" onto the stack and record as error.
- Operators require at least 2 values on the stack; if not, show error message.

## Seed Data
Start with an empty stack and empty history.

## UI Layout

### Input
- A labeled text input (label: "Token") for entering a single number or operator.
- A "Push" button: if the token is a number, push it onto the stack. If it is one of +, -, *, /, apply the operator.
- A "Clear Stack" button: empties the entire stack.

### Stack Display
- Show the current stack with each value in its own element with data-testid="stack-item".
- The topmost stack item (last pushed) should be at the top visually (displayed first or last — either order is acceptable, but data-testid="stack-top" marks the top value).
- Show the stack depth in data-testid="stack-depth".

### Result / Error Display
- After each Push operation, show the result of the last operation in data-testid="last-result":
  - For a number push: show the number that was pushed.
  - For an operator: show the result value (or "Error" on division by zero or insufficient operands).
- Show any error message in data-testid="error-message". Clear it on a successful push.

### History
- Each successful Push (number or operator that did not error) appends to history with data-testid="history-entry".
- Error operations do NOT add to history.
- Each history entry shows the token and resulting stack state (e.g., "3 → [3]", "+ → [5]").
- A "Clear History" button removes all history entries.

## Behavior Details
- Evaluate: "3", "4", "+": stack ends as [7], last-result = 7.
- Evaluate: "10", "2", "/": stack ends as [5], last-result = 5.
- Evaluate: "5", "0", "/": stack ends as ["Error"], last-result = "Error", adds no history.
- Evaluate "+" with < 2 items: show error, do not modify stack, do not add history.
- Numbers can be integers or decimals (e.g., 3.14).
- Negative numbers (e.g., -5) should be accepted as number tokens.
- Empty token input → do nothing on Push.

## Edge Cases
- Pushing a non-numeric, non-operator token → show error "Invalid token".
- Stack shows all current values including intermediate results.
- Clearing stack resets stack-depth to 0.
