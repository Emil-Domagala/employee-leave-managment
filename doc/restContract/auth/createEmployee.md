# POST /api/auth/manager/create-employee

## Description

Creates a new employee along with an initial compensation record. Validations include:

- Only MANAGER role can perform this action.
- User email must be unique.
- User data and compensation data must be valid.

## Access

- Authentication: Required (session cookie)
- Roles allowed: MANAGER

## Request

### Headers

| Name   | Type   | Required | Description    |
| ------ | ------ | -------- | -------------- |
| Cookie | string | yes      | Session cookie |

### Body

```json
{
  "user": {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe+unique@example.com",
    "salary": 5000,
    "status": "active"
  },
  "compensation": {
    "effective_from": "2025-09-28T12:00:00.000Z",
    "effective_to": null,
    "base_salary": 5000,
    "salary_period": "monthly",
    "currency": "USD",
    "created_at": "2025-09-28T12:00:00.000Z"
  }
}
```

### Response

```json
{
  "password": "generatedPassword123!"
}
```
