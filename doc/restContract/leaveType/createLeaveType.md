# POST /api/leave-type

## Description

Creates a new leave type.  
Only accessible by users with **MANAGER** role.

## Access

- Authentication: Required (session cookie)
- Roles allowed: MANAGER

## Request

### Path Parameters

_None_

### Headers

| Name   | Type   | Required | Description    |
| ------ | ------ | -------- | -------------- |
| Cookie | string | yes      | Session cookie |

### Body

| Field            | Type    | Required | Description                   |
| ---------------- | ------- | -------- | ----------------------------- |
| name             | string  | yes      | Unique name of the leave type |
| is_paid          | boolean | yes      | Indicates if leave is paid    |
| annual_allowance | number  | yes      | Max number of days per year   |

Example:

```json
{
  "name": "Annual Leave",
  "is_paid": true,
  "annual_allowance": 20
}
```
