#

Health Check : @nestjs/terminus Check all services<br>
Logger : Winston (Global Module)

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
    