# POST /api/auth/logout

## Description

Logs out the authenticated user by deleting their session in Redis and clearing the session cookie.

## Access

- Authentication: Optional (endpoint returns success even if user is not logged in)
- Roles allowed: Any

## Request

### Headers

| Name   | Type   | Required | Description    |
| ------ | ------ | -------- | -------------- |
| Cookie | string | optional | Session cookie |

### Body

_No body required_

### Response

```json
{
  "message": "logout successful"
}
```
