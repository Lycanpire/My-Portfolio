---
title: "AIDLC in Practice: E‑commerce Modules with AI‑Assisted Dev"
description: "Concrete e‑commerce examples applying the AI‑Driven Development Lifecycle (AIDLC): from product catalog to checkout and inventory, with Cursor prompts and CodeRabbit reviews."
date: 2025-10-16
draft: false
slug: /pensieve/aidlc-ecommerce
tags:
  - AI Engineering
  - AIDLC
  - E-commerce
  - DevTools
  - Cursor
  - CodeRabbit
---

AI isn’t just an add‑on — it reshapes how we plan, code, review, and ship. Here are focused e‑commerce module examples using AIDLC with Cursor (agentic coding) and CodeRabbit (PR reviews).

## Module 1: Product Catalog

Goal: Add faceted search and pagination for products
Scope: GET /v1/products?query=&page=&pageSize=&filters=brand:Apple,color:Black
Constraints: p95 < 150ms @ 100 rps; indexable fields; stable sort
Acceptance: Deterministic cursor pagination; correct facet counts; unit + integration tests
Artifacts: OpenAPI snippet, Elasticsearch schema or Postgres indexes, seed dataset

Cursor task prompt:
```text
Implement faceted search + cursor pagination for products (Express + TypeScript).
Use Postgres with GIN indexes. Return items[], nextCursor, facets[]. Provide tests.
```

Sample route sketch:
```ts
// src/routes/products.ts
router.get('/v1/products', validate(qSchema), async (req, res) => {
  const { query, pageSize = 24, cursor, filters } = parseQuery(req);
  const { items, nextCursor, facets } = await productSearch({ query, pageSize, cursor, filters });
  return res.json({ items, nextCursor, facets });
});
```

## Module 2: Cart & Checkout

Goal: Implement inventory reservation during checkout
Scope: Reserve on POST /v1/checkout/start; confirm on /v1/checkout/confirm; auto‑release on TTL
Constraints: p95 < 200ms, reservation TTL 10m (Redis), idempotent by cartId
Acceptance: No oversell at 100 rps; 409 on conflict; metrics + audit log
Artifacts: OpenAPI, Redis keys (RESERVE:{sku}:{cartId}), sequence diagram, K6 script

Cursor task prompt:
```text
Create reservation service using Redis (Lua or transactions).
Expose start/confirm APIs, enforce TTL, idempotency, and emit metrics.
```

Example middleware (sketch):
```ts
// src/services/reservation.ts
export async function reserveItems(cartId: string, lines: Array<{ sku: string; qty: number }>) {
  // Atomically decrement available and record RESERVE keys with TTL
}
```

## Module 3: Payments Webhooks

Goal: Idempotent Stripe webhook handling
Scope: POST /webhooks/stripe; verify signature; store events; replay‑safe
Constraints: Process < 1s; exactly‑once effects (orders, invoices)
Acceptance: Duplicate events ignored; failed events retried; dashboards show lag
Artifacts: Stripe event samples, verification secret, ERD for orders

Cursor task prompt:
```text
Implement Stripe webhook with signature verification, idempotency keying by event.id,
transactional updates to orders, and retries with exponential backoff.
```

## CodeRabbit PR Review (CI)

Example GitHub Action:
```yaml
name: CodeRabbit PR Review
on: { pull_request: { types: [opened, synchronize, reopened] } }
permissions: { contents: read, pull-requests: write }
jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: coderabbitai/ai-pr-reviewer@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          openai-api-key: ${{ secrets.OPENAI_API_KEY }}
          review-level: strict
          fail-on-high-severity: true
```

## Efficiency Impact

- Throughput: +30–200% depending on seniority and context quality
- PR cycle time: −25–50% with automated review + suggested diffs
- Defects: −10–20% with strict policies and tests generated from briefs

Bring AIDLC to your shop by templating these briefs and wiring Cursor + CodeRabbit into your daily flow.


