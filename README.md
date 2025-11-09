# 

## Technologies

- **Prisma**: ORM for database management
- **Health Check**: @nestjs/terminus - Check all services
- **Logger**: Winston (Global Module)
- **Wrapper Microservice Request**: Send request to microservice and handle response/error in a standard way
- **Swagger Documentation**: Auto-generate API docs with Swagger module
- **Exception Filter**: Global exception filter to catch unhandled exceptions and return proper response

---

## Features

### Cursor-Based Pagination
Implement cursor-based pagination for efficient data retrieval
- No need for SKIP operations
- Takes advantage of indexed columns
- Better performance for large datasets

---

## Services

### Auth Service
- Login / Register / Refresh Token / Logout
- JWT Refresh Token (Hashed and stored in DB)
- BigInt Serializer Interceptor (to handle BigInt in JSON responses)

**Status:**
- ✅ Secret and expiry (15m)
- ✅ Bcrypt hashing password + refresh tokens
- ✅ Multiple device login support
- ✅ Custom error handling with exceptions
- ✅ Input validation with class-validator
- ✅ Logout all devices

**Missing/Improvements:**
- Rate limiting
- Logging and monitoring
- CORS and security headers
- Email verification
- Password reset
- 2FA
- Audit logging
- Global exception handling
- Input sanitization

### API Gateway
- Route requests to microservices
- Handle authentication and authorization
- Aggregate responses from multiple services

### User Service
- User profile management (CRUD operations)
- Cursor-based pagination for user search
- Follow/Unfollow functionality
- Block/Unblock users
- Report/Unreport users
- Comprehensive DTOs with validation
- Production-grade error handling

---

## Commit Guidelines

Format: `<type>(<scope>): <subject>`

**Example:** `feat(auth): add login endpoint`

### Types:
- `feat` - New feature
- `fix` - Bug fix
- `refactor` - Code refactoring
- `style` - Code style changes (formatting, etc)
- `docs` - Documentation changes
- `test` - Adding or updating tests
- `chore` - Other changes that don't modify src or test files

### Scopes:
- auth, user, common, gateway, prisma, etc

### Subject:
- Brief description of the change

---

## Development Setup

### DotEnv
```bash
pnpm add dotenv
# Create .env file in root directory
# Load env variables in main.ts: import 'dotenv/config';
```

### Prisma
```bash
pnpm add prisma @prisma/client
pnpm prisma init
# Configure datasource in .env
pnpm prisma db pull --schema src/prisma/schema.prisma
pnpm prisma generate --schema src/prisma/schema.prisma
```

### Health Check
```bash
pnpm add @nestjs/terminus @nestjs/axios
# Create HealthModule and healthIndicators: rabbitmq, database, etc...
# Add HealthController with /health endpoint
```

### Microservice
```bash
pnpm add @nestjs/microservices amqplib amqp-connection-manager
# Configure microservice options in main.ts
# Create api gateway to route requests to microservices
```

### Logger
```bash
pnpm add winston winston-daily-rotate-file
pnpm add -D @types/winston
# Create LoggerModule as global module
```


