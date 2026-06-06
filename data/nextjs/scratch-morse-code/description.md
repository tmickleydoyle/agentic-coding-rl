# Morse Code Translator

A two-way Morse code translator that converts text to Morse code and Morse code back to text.

## Layout
- Page title: "Morse Code Translator"
- Two mode buttons (or radio/toggle): "Text to Morse" and "Morse to Text" — selecting a mode changes which translation runs
- A `<textarea>` for input: aria-label "Input"
- A "Translate" button
- Output display: `data-testid="output"` showing the translation result
- A "Clear" button that resets input and output

## Morse Code Table
Use this mapping (A–Z, 0–9 only):
```
A .-    B -...  C -.-.  D -..   E .     F ..-.
G --.   H ....  I ..    J .---  K -.-   L .-..
M --    N -.    O ---   P .--.  Q --.-  R .-.
S ...   T -     U ..-   V ...-  W .--   X -..-
Y -.--  Z --..
0 ----- 1 .---- 2 ..--- 3 ...-- 4 ....- 5 .....
6 -.... 7 --... 8 ---.. 9 ----.
```

## Text to Morse
- Convert uppercase/lowercase letters and digits 0-9
- Each character separated by a single space
- Each word separated by " / " (space-slash-space)
- Unknown characters are skipped (no output for that character)
- Example: "SOS" → "... --- ..."
- Example: "Hello World" → ".... . .-.. .-.. --- / .-- --- .-. .-.. -.."

## Morse to Text
- Input is space-separated Morse symbols; words separated by " / "
- Convert each symbol back to its letter/digit
- Unknown symbols produce "?" in output
- Example: "... --- ..." → "SOS"
- Result is uppercase

## Seed Data
- Default mode: "Text to Morse"
- Default input: "Hello World"
- On mount, automatically compute and display the translation.

## Interactions
1. User can switch mode using the "Text to Morse" / "Morse to Text" buttons.
2. Switching mode clears the input and output.
3. User types in the Input textarea.
4. User clicks "Translate" — output updates.
5. User clicks "Clear" — input and output both reset to empty.

## Data-testids
- `data-testid="mode-text-to-morse"` on the Text to Morse button
- `data-testid="mode-morse-to-text"` on the Morse to Text button
- `data-testid="output"` on the output display element
- `data-testid="clear-btn"` on the Clear button
