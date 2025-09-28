# GET /api/leave-request/manager/:id

## Description

Fetches a single leave request by its ID.

## Access

- Authentication: Required (session cookie)
- Roles allowed: MANAGER

## Request

### Path Parameters

| Name | Type   | Required | Description               |
| ---- | ------ | -------- | ------------------------- |
| id   | string | yes      | UUID of the leave request |

### Headers

| Name   | Type   | Required | Description    |
| ------ | ------ | -------- | -------------- |
| Cookie | string | yes      | Session cookie |

## Response

### 200 OK

```json
{
  "id": "uuid",
  "employee_id": "uuid",
  "leave_type_id": "uuid",
  "start_date": "2025-10-01T00:00:00.000Z",
  "end_date": "2025-10-03T00:00:00.000Z",
  "status": "PENDING" | "APPROVED" | "REJECTED",
  "approver_id": "uuid" | null,
  "request_date": "2025-09-28T12:00:00.000Z",
  "decision_date": "2025-09-30T12:00:00.000Z" | null
}
```
