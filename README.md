#

Health Check : @nestjs/terminus Check all services
Logger : Winston (Global Module)

#
Auth-Service : 
    - Login/ Register/ Refresh Token/ Logout
    - JWT Refresh Token (Hashed and stored in DB)
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
<type>(<scope>): <subject>

ex: feat(auth): add login endpoint
feat: new feature
fix: bug fix
refactor: code refactoring
style: code style changes (formatting, etc)
docs: documentation changes
test: adding or updating tests
chore: other changes that don't modify src or test files

Scope:
- (auth, user, common, etc)

Subject:
- brief description of the change 
    