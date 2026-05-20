# Rollback-System

NestJS application with a GitHub Actions rollback workflow.

## Project setup

```bash
npm install
```

## Compile and run

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Test

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Rollback workflow

The rollback workflow is defined in `.github/rollback.yaml` and can be triggered manually with:

- `branch`: target branch name.
- `sha`: commit SHA to check out and deploy.
