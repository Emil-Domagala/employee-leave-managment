# GET /api/leave-type

## Description
Fetch all leave types in the system.  
Accessible to any **authenticated user** (employee or manager).  

## Access
- Authentication: Required (session cookie)
- Roles allowed: All authenticated users

## Request

### Path Parameters
_None_

### Headers
| Name   | Type   | Required | Description           |
|--------|--------|----------|----------------------|
| Cookie | string | yes      | Session cookie        |

### Body
_None_

## Responses

### 200 OK
Returned when leave types exist.

```json
[
  {
    "id": "uuid",
    "name": "Vacation",
    "is_paid": true,
    "annual_allowance": 20
  },
  {
    "id": "uuid",
    "name": "Sick",
    "is_paid": true,
    "annual_allowance": 10
  }
]
