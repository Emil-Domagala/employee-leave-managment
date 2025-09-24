CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enums
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_status') THEN
        CREATE TYPE user_status AS ENUM ('active','inactive');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role_name') THEN
        CREATE TYPE role_name AS ENUM ('manager','employee','administrator');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'leave_status') THEN
        CREATE TYPE leave_status AS ENUM ('pending','approved','rejected','cancelled');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'salary_period') THEN
        CREATE TYPE salary_period AS ENUM ('monthly','annual');
    END IF;
END $$;

-- Tables
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name role_name NOT NULL UNIQUE 
);

CREATE TABLE IF NOT EXISTS compensations_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    effective_from DATE NOT NULL,
    effective_to DATE NULL,
    base_salary DECIMAL(12,2) NOT NULL,
    salary_period salary_period NOT NULL,
    currency CHAR(3) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE, 
    role_id UUID REFERENCES roles(id),
    status user_status NOT NULL,
    compensation_history_id UUID REFERENCES compensations_history(id),
    password VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS leave_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE, 
    is_paid BOOLEAN NOT NULL,
    annual_allowance INT NOT NULL
);

CREATE TABLE IF NOT EXISTS leave_balances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES users(id),
    leave_type_id UUID REFERENCES leave_types(id),
    year INT NOT NULL,
    days_allocated INT NOT NULL,
    days_taken INT NOT NULL,
    UNIQUE(employee_id, leave_type_id, year) 
);

CREATE TABLE IF NOT EXISTS leave_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES users(id),
    leave_type_id UUID REFERENCES leave_types(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status leave_status NOT NULL,
    approver_id UUID REFERENCES users(id),
    request_date TIMESTAMP NOT NULL DEFAULT now(),
    decision_date TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS leave_payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    leave_request_id UUID UNIQUE REFERENCES leave_requests(id),
    employee_id UUID REFERENCES users(id),
    calculated_on TIMESTAMP NOT NULL DEFAULT now(),
    amount DECIMAL(12,2) NOT NULL,
    currency CHAR(3) NOT NULL,
    compensation_history_id UUID REFERENCES compensations_history(id)
);
