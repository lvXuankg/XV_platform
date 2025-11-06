#

Prisma : ORM for database management<br>
Health Check : @nestjs/terminus Check all services<br>
Logger : Winston (Global Module)<br>
Wrapper Microservice Request : send request to microservice and handle response/ error in a standard way<br>
Swagger Documentation : Auto-generate API docs with Swagger module<br>
Exception Filter : Global exception filter to catch unhandled exceptions and return proper response<br>

#
Auth-Service : 
    - Login/ Register/ Refresh Token/ Logout<br>
    - JWT Refresh Token (Hashed and stored in DB)<br>
    - BigInt Serializer Interceptor (to handle BigInt in JSON responses)

    [OK] : 
        - secret, expiry (15m)
        - bcrypt hasing password + refresh tokens       
        - multiple device login support
        - custom error handling with exceptions
        - input validation with class-validator
        - logout all devices
    [MISSING/IMPROVE] :
        - rate limiting 
        - loggin and monitoring
        - cors and security headers
        - email verification
        - password reset
        - 2FA
        - Audit logging
        - global exception handling 
        - Input sanitization

# Commit Guidelines
`<type>(<scope>): <subject>`

ex: feat(auth): add login endpoint<br>
feat: new feature<br>
fix: bug fix<br>
refactor: code refactoring<br>
style: code style changes (formatting, etc)<br>
docs: documentation changes<br>
test: adding or updating tests<br>
chore: other changes that don't modify src or test files<br>

Scope:
- (auth, user, common, etc)

Subject:
- brief description of the change 

# 
- Api Gateway: 
    - route requests to microservices<br>
    - handle authentication and authorization<br>
    - aggregate responses from multiple services<br>

- Auth Service: 
    - login<br>
    - register<br>
    - refreshToken<br>
    - logout<br>
    - logoutAllDevices<br>

# [Dev] : Setup 
`DotEnv`: <br>
    - pnpm add dotenv<br>
    - create .env file in root directory<br>
    - load env variables in main.ts 'import 'dotenv/config';'<br>

`Prisma`: <br>
    - pnpm add prisma @prisma/client<br>
    - pnpm prisma init<br>
    - configure datasource in .env<br>
    - pnpm prisma db pull --schema src/prisma/schema.prisma<br>
    - pnpm prisma generate --schema src/prisma/schema.prisma<br>

`Health Check`:<br>
    - pnpm add @nestjs/terminus @nestjs/axios<br>
    - create HealthModule and healthInficators : rabbitmq, database, etc...<br>
    - add HealthController with /health endpoint<br>

`Microservice`: <br>
    - pnpm add @nestjs/microservices amqplib amqp-connection-manager<br>
    - if service config main.ts with microservice options<br>
    - create api gateway to route requests to microservices<br>

`Logger` : <br>
    - pnpm add winston winston-daily-rotate-file<br>
    - pnpm add -D @types/winston <br>
    - create LoggerModule as global module<br>

