-- Roles
INSERT INTO roles (name) VALUES 
  ('manager'), 
  ('employee')
ON CONFLICT (name) DO NOTHING;

-- Users
INSERT INTO users (first_name, last_name, email, salary, role_id, status, password)
VALUES
  ('Alice', 'Johnson', 'alice@example.com', 4000.00, (SELECT id FROM roles WHERE name = 'manager'), 'active', 'password'),
  ('Bob', 'Smith', 'bob@example.com', 3000.00, (SELECT id FROM roles WHERE name = 'employee'), 'active', 'password'),
  ('Charlie', 'Brown', 'charlie@example.com', 2800.00, (SELECT id FROM roles WHERE name = 'employee'), 'inactive', 'password')
ON CONFLICT (email) DO NOTHING;

-- Leave Types
INSERT INTO leave_types (name, is_paid, annual_allowance) VALUES
  ('Annual Leave', TRUE, 20),
  ('Sick Leave', TRUE, 10),
  ('Unpaid Leave', FALSE, 0)
ON CONFLICT (name) DO NOTHING;

-- Leave Balances
INSERT INTO leave_balances (employee_id, leave_type_id, year, days_allocated, days_taken, days_remaining)
VALUES (
  (SELECT id FROM users WHERE email = 'alice@example.com'),
  (SELECT id FROM leave_types WHERE name = 'Annual Leave'),
  2025, 20, 5, 15
)
ON CONFLICT DO NOTHING;

INSERT INTO leave_balances (employee_id, leave_type_id, year, days_allocated, days_taken, days_remaining)
VALUES (
  (SELECT id FROM users WHERE email = 'bob@example.com'),
  (SELECT id FROM leave_types WHERE name = 'Sick Leave'),
  2025, 10, 2, 8
)
ON CONFLICT DO NOTHING;

-- Leave Requests
INSERT INTO leave_request (employee_id, leave_type_id, start_date, end_date, total_days, status, approver_id, request_date, decision_date)
VALUES (
  (SELECT id FROM users WHERE email = 'alice@example.com'),
  (SELECT id FROM leave_types WHERE name = 'Annual Leave'),
  '2025-06-01', '2025-06-05', 5, 'approved',
  (SELECT id FROM users WHERE email = 'bob@example.com'),
  NOW() - INTERVAL '10 days',
  NOW() - INTERVAL '8 days'
)
ON CONFLICT DO NOTHING;

INSERT INTO leave_request (employee_id, leave_type_id, start_date, end_date, total_days, status, approver_id, request_date, decision_date)
VALUES (
  (SELECT id FROM users WHERE email = 'bob@example.com'),
  (SELECT id FROM leave_types WHERE name = 'Sick Leave'),
  '2025-07-10', '2025-07-12', 3, 'pending',
  (SELECT id FROM users WHERE email = 'alice@example.com'),
  NOW() - INTERVAL '2 days',
  NULL
)
ON CONFLICT DO NOTHING;

-- Compensation History
INSERT INTO compensation_history (user_id, effective_from, effective_to, base_salary, salary_period, currency)
VALUES
  ((SELECT id FROM users WHERE email = 'alice@example.com'), '2024-01-01', NULL, 4000.00, 'monthly', 'USD'),
  ((SELECT id FROM users WHERE email = 'bob@example.com'), '2024-01-01', NULL, 3000.00, 'monthly', 'USD')
ON CONFLICT DO NOTHING;

-- Leave Payouts
INSERT INTO leave_payouts (leave_request_id, employee_id, calculated_on, amount, currency, compensation_history_id)
VALUES (
  (SELECT id FROM leave_request WHERE status = 'approved' LIMIT 1),
  (SELECT id FROM users WHERE email = 'alice@example.com'),
  NOW(),
  800.00,
  'USD',
  (SELECT id FROM compensation_history WHERE user_id = (SELECT id FROM users WHERE email = 'alice@example.com') LIMIT 1)
)
ON CONFLICT DO NOTHING;
