# QA Playground Framework

TypeScript-based Playwright test framework for UI, API and WebSocket testing with Allure reporting and JSON schema validation.

## Prerequisites
- Node.js (v18+ recommended)
- npm

## Install

```bash
npm install
npx playwright install # optional: installs browser binaries
```

## Available scripts
- npm run test:api
  - Run API tests: `playwright test tests/api`
- npm run test:api:schema
  - Run API tests with schema validation enabled (`SCHEMA=true`)
- npm run test:api:schema:fix
  - Run API tests with schema generation/fix (`SCHEMA=fix`)
- npm run test:smoke:schema
  - Run Smoke tests with schema validation enabled (`SCHEMA=true`)
- npm run allure:generate
  - Generate Allure report from `allure-results`
- npm run allure:serve
  - Serve generated Allure report (runs `allure serve allure-results`)

## Environment configuration
- Primary config: `configs/env.ts` — contains `ENV` object and `CURRENT_ENV` selection.
- By default `CURRENT_ENV` falls back to `dev` if not set.
- To run tests against another environment, set the `ENV` environment variable. Examples:
  - PowerShell: `$env:ENV = 'prod'; npm run test:api`
  - Cross-platform using `cross-env`: `npx cross-env ENV=prod npm run test:api`

Do not commit real secrets or API keys to the repository. Store sensitive values outside source control.

## Project layout (high level)
- configs/ — environment configs
- src/ — API client, endpoints, schema manager, helpers
- tests/ — Playwright tests (api, ui, websocket)
- allure-results/ — raw Allure artifacts produced by tests
- schemas/generated/ — generated JSON schemas for API responses

## Suggestions
- Add a top-level CONTRIBUTING or README section with CI instructions.
- Add ESLint/Prettier for consistent style.
- Consider validating `CURRENT_ENV` at startup to fail fast on typos.

