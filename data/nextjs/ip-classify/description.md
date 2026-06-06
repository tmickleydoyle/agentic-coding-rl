# ip-classify

An API route that classifies an IPv4 address by its class and whether it is private or public.

## Endpoint

`GET /api/ip-classify`

### Query Parameters

| Parameter | Type   | Required | Description           |
|-----------|--------|----------|-----------------------|
| ip        | string | yes      | IPv4 address string   |

### Response (200)

```json
{
  "ip": "192.168.1.1",
  "class": "C",
  "private": true
}
```

### Error Cases

- Missing `ip`: `400 { "error": "ip is required" }`
- Invalid IPv4 format: `400 { "error": "invalid IPv4 address" }`

## Behavior

### IPv4 Class (based on first octet)

| First octet range | Class |
|-------------------|-------|
| 0 – 127           | A     |
| 128 – 191         | B     |
| 192 – 223         | C     |
| 224 – 239         | D     |
| 240 – 255         | E     |

### Private Ranges (RFC 1918 + loopback)

- `10.0.0.0/8` — first octet = 10
- `172.16.0.0/12` — first octet = 172, second octet 16–31
- `192.168.0.0/16` — first octet = 192, second octet = 168
- `127.0.0.0/8` — loopback (first octet = 127)

All other addresses are public (`"private": false`).

### Validation

- Must be exactly 4 octets separated by dots
- Each octet must be an integer in [0, 255]
