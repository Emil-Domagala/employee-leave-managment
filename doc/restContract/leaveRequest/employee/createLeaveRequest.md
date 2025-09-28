# POST /api/leave-request/

## Description

Creates a new leave request for the authenticated user. Validations include:

- User must be active
- Leave dates must not overlap existing requests
- Leave type must exist
- Requested days must not exceed the remaining allowance

## Access

- Authentication: Required (session cookie)
- Roles allowed: EMPLOYEE

## Request

### Headers

| Name   | Type   | Required | Description    |
| ------ | ------ | -------- | -------------- |
| Cookie | string | yes      | Session cookie |

### Body

```json
{
  "leave_type_id": "uuid",
  "start_date": "2025-10-01T00:00:00.000Z",
  "end_date": "2025-10-03T00:00:00.000Z"
}
```

### Response

```json
{
  "id": "uuid",
  "employee_id": "uuid",
  "leave_type_id": "uuid",
  "start_date": "2025-10-01T00:00:00.000Z",
  "end_date": "2025-10-03T00:00:00.000Z",
  "status": "PENDING",
  "approver_id": null,
  "request_date": "2025-09-28T12:00:00.000Z",
  "decision_date": null
}
```
