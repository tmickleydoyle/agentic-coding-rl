# palindrome-check

An API route that checks whether a given string is a palindrome.

## Endpoint

`GET /api/palindrome-check?text=<value>`

## Query Parameters

- `text` (string, required): The string to check.

## Response

Returns a JSON object:

```json
{ "text": "<input>", "isPalindrome": true | false }
```

- `text`: the original input string
- `isPalindrome`: `true` if the string reads the same forwards and backwards (case-insensitive, ignoring non-alphanumeric characters)

## Palindrome Rules

- Comparison is case-insensitive.
- Only alphanumeric characters are considered (letters and digits); spaces, punctuation, and other characters are ignored.
- An empty string (after stripping non-alphanumeric chars) is considered a palindrome (`true`).

## Error Cases

If the `text` query parameter is missing, return HTTP 400:
```json
{ "error": "text query parameter is required" }
```

## Examples

- `?text=racecar` → `{ "text": "racecar", "isPalindrome": true }`
- `?text=hello` → `{ "text": "hello", "isPalindrome": false }`
- `?text=A+man+a+plan+a+canal+Panama` → `{ "text": "A man a plan a canal Panama", "isPalindrome": true }`
- `?text=` → `{ "text": "", "isPalindrome": true }`
