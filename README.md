# Employee Leave Management System

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Tech Stack](#tech-stack)
5. [Setup Instructions](#setup-instructions)
6. [Usage](#usage)
7. [REST API Contract](#rest-api-contract)
8. [Database Schema](#database-schema)
9. [Testing](#testing)
10. [License](#license)

---

## Overview

The Employee Leave Management System is designed to help companies efficiently manage employee leave requests and balances. It enables employees to submit vacation requests, tracks available leave days, and calculates any applicable payouts for unused leave.

The project provides a user-friendly interface for employees and managers, along with a robust backend for leave calculations, validations, and data persistence.

---

## Features

- Employee leave request submission
- Leave approval/rejection by managers
- Leave balance tracking
- Overlapping leave detection
- Role-based access control (Employee / Manager)
- Authentication with session cookies
- Compensation calculations (optional for unused leave)

---

## Architecture

- **Backend**: Node.js + Express.js + TypeScript
- **Database**: PostgreSQL
- **Session management**: Redis
- **Authentication**: Session cookie + role-based authorization
- **Testing**: Vitest + Supertest

---

## Tech Stack

- **Node.js** with **TypeScript**
- **Express.js v5** as the web framework
- **Redis** for session management
- **cookie-parser** for reading cookies
- **dotenv** for environment variable management
- **tsx** / **ts-node** for running TypeScript directly
- **Vitest** for unit and integration tests
- **Supertest** for HTTP testing
- **bcrypt** for password hashing
- **uuid** for unique identifiers
- **zod** for schema validation
- **TypeScript** for development support

---

## Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org/) (v23+ recommended)
- [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/)

### Steps

1. **Clone the repository**

2. **Install dependencies**

3. **Run the application with Docker Compose**

4. **Run the app locally in development mode**

---

## License

This project is licensed under the terms specified in the [LICENSE](./LICENSE) file.

## REST API Contract

See the full REST API documentation in REST_API_CONTRACT.md.

## Testing

npm run test


## Database Schema
he database schema is visualized in the [doc](./dbSchema) file