# Product Browser - CodeVector Labs Take Home Assignment

## Overview

This project implements a scalable product browsing backend capable of handling a catalog of approximately **200,000 products** while maintaining correct pagination behavior when data changes during user navigation.

The primary goal of the assignment was to ensure that users do not experience duplicate or missing products when new products are inserted or existing products are updated while browsing.

## Tech Stack

### Backend

* Node.js
* Express.js
* TypeScript
* PostgreSQL (Supabase)
* Prisma ORM

### Frontend

* Next.js
* TypeScript
* Tailwind CSS

### Infrastructure

* Supabase (Hosted PostgreSQL)
* Render (Backend Hosting)
* Vercel (Frontend Hosting)


# Architecture

```text
Client (Next.js)
        │
        ▼
Express API
        │
        ▼
Prisma ORM
        │
        ▼
PostgreSQL (Supabase)
```

The frontend consumes a cursor-based pagination API exposed by the backend.


# Product Schema

| Field      | Type      |
| ---------- | --------- |
| id         | BigInt    |
| name       | String    |
| category   | String    |
| price      | Decimal   |
| created_at | Timestamp |
| updated_at | Timestamp |


# Database Indexes

```sql
(created_at DESC, id DESC)

(category, created_at DESC, id DESC)
```

These indexes support:

* newest-first browsing
* category filtering
* efficient cursor pagination
* stable ordering


# Seed Data

A seed script generates **200,000 products** using Faker.

Characteristics:

* realistic product names
* multiple categories
* randomized prices
* randomized creation timestamps

The seed process inserts records in batches to avoid excessive memory consumption and improve insertion performance.


# API Endpoints

## Health Check

```http
GET /health
```

Response:

```json
{
  "status": "ok"
}
```


## Browse Products

```http
GET /api/products
```

### Query Parameters

| Parameter | Description                 |
| --------- | --------------------------- |
| limit     | Number of products to fetch |
| category  | Optional category filter    |
| cursor    | Pagination cursor           |

### Example

```http
GET /api/products?limit=20
```

```http
GET /api/products?limit=20&category=Gaming
```

```http
GET /api/products?limit=20&cursor=<cursor>
```


# Pagination Strategy

## Why OFFSET Pagination Was Rejected

A common implementation is:

```sql
LIMIT 20 OFFSET 40
```

However, OFFSET pagination is vulnerable when data changes between requests.

Example:

1. User loads page 1.
2. New products are inserted.
3. User requests page 2.
4. Row positions shift.
5. Products may be skipped or repeated.

This violates the assignment requirement.


## Cursor-Based Pagination

Products are ordered by:

```sql
ORDER BY created_at DESC, id DESC
```

The cursor stores:

```json
{
  "createdAt": "...",
  "id": "..."
}
```

For the next request, records are fetched using the cursor boundary instead of row position.

Conceptually:

```sql
WHERE
created_at < cursor_created_at

OR

(
  created_at = cursor_created_at
  AND id < cursor_id
)
```

This guarantees that pagination remains stable even when new products are inserted while a user is browsing.


# Handling Inserts While Browsing

Scenario:

1. User loads page 1.
2. A cursor is generated from the last item on that page.
3. New products are inserted.
4. User requests page 2 using the cursor.

Because pagination is based on a stable boundary rather than row offsets:

* no duplicates are returned
* no products are skipped
* newly inserted products appear only in future browsing sessions


# Handling Product Updates

Pagination order is based on:

```sql
created_at DESC
id DESC
```

and not on:

```sql
updated_at
```

This ensures that updating a product does not move it between pages during active browsing sessions.

As a result, pagination remains deterministic and stable.


# Frontend Features

* Product listing
* Category filtering
* Cursor-based "Load More"
* Loading states
* Responsive layout

The frontend intentionally remains simple and focuses on demonstrating the backend pagination behavior.


# Running Locally

## Backend

```bash
cd server

pnpm install

pnpm prisma migrate deploy

pnpm prisma generate

pnpm dev
```


## Seed Database

```bash
pnpm tsx prisma/seed.ts
```


## Frontend

```bash
cd client

pnpm install

pnpm dev
```


# Future Improvements

Given additional time, I would consider:

* Product search
* Infinite scrolling
* Server-side caching
* Query performance benchmarking
* Automated tests
* Dockerized deployment
* API rate limiting
* Better UI/UX polish
* Observability and monitoring


# Key Design Decision

The most important design decision in this project was choosing **cursor-based pagination over OFFSET pagination**.

This approach directly addresses the assignment's core requirement:

> Users must not see duplicates or miss products while data is changing.

The implementation prioritizes correctness, stable ordering, and scalability over simpler but less reliable pagination strategies.
