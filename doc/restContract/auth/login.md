# POST /api/auth/login

## Description

Authenticates a user using email and password. On success, sets a session cookie for future authenticated requests.

## Access

- Authentication: Not required
- Roles allowed: Any

## Request

### Headers

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| —    | —    | —        | None        |

### Body

```json
{
  "email": "user@example.com",
  "password": "YourPassword123!"
}
```

### Response

```json
{
  "email": "user@example.com",
  "password": "YourPassword123!"
}
```
