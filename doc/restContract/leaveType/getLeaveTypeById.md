# GET /api/leave-type/:id

## Description
Fetch a specific leave type by its ID.  
Accessible to any **authenticated user** (employee or manager).  

## Access
- Authentication: Required (session cookie)
- Roles allowed: All authenticated users

## Request

### Path Parameters
| Name | Type   | Required | Description         |
|------|--------|----------|-------------------|
| id   | string | yes      | ID of the leave type |

### Headers
| Name   | Type   | Required | Description           |
|--------|--------|----------|----------------------|
| Cookie | string | yes      | Session cookie        |

### Body
_None_

## Responses

### 200 OK
Returned when the leave type exists.

```json
{
  "id": "uuid",
  "name": "Vacation",
  "is_paid": true,
  "annual_allowance": 20
}
