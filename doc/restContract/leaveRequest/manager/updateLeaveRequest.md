# PATCH /api/leave-request/manager/:id

## Description
Updates the **status** of a leave request. Only `PENDING` leave requests can be updated.  
The manager performing the update is recorded as the approver.

## Access
- Authentication: Required (session cookie)
- Roles allowed: MANAGER

## Request

### Path Parameters
| Name | Type   | Required | Description          |
|------|--------|----------|--------------------|
| id   | string | yes      | UUID of the leave request |

### Headers
| Name   | Type   | Required | Description     |
|--------|--------|----------|----------------|
| Cookie | string | yes      | Session cookie |

### Body
```json
{
  "status": "APPROVED" | "REJECTED"
}
