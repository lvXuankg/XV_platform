/**
 * Swagger Response Documentation Constants
 * Centralized response schemas for API documentation
 */

import { errorHandling } from './error-handling';
import { validationMessages } from './validation-messages';

// ============ AUTH RESPONSES ============

const authRegisterSuccess = {
  status: 201,
  description: 'User registered successfully',
  schema: {
    example: {
      id: '1',
      email: 'user@example.com',
      username: 'user1731000000',
      createdAt: '2025-11-05T20:30:00Z',
    },
  },
};

const authRegisterBadRequest = {
  status: 400,
  description: 'Validation failed - invalid email or weak password',
  schema: {
    example: {
      statusCode: 400,
      message: [
        validationMessages.isEmail,
        validationMessages.minLength('Mật khẩu', 8),
      ],
      error: 'Bad Request',
    },
  },
};

const authRegisterConflict = {
  status: 409,
  description: 'Email already registered',
  schema: {
    example: {
      statusCode: 409,
      message: 'Email already exists',
      error: 'Conflict',
    },
  },
};

const authRegisterBusy = {
  status: 500,
  description: 'System error - server busy, please try again',
  schema: {
    example: {
      statusCode: 500,
      message: 'System is busy, please try again later',
      error: 'Internal Server Error',
    },
  },
};

const authLoginSuccess = {
  status: 200,
  description: 'Đăng nhập thành công',
  schema: {
    example: {
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      refresh_token: 'abc123def456ghi789...',
      user: {
        id: '1',
        email: 'user@example.com',
        username: 'user1731000000',
      },
    },
  },
};

const authLoginUnauthorized = {
  status: 401,
  description: 'Sai email hoặc mật khẩu',
  schema: {
    example: {
      statusCode: 401,
      message: errorHandling.invalidCredential.message,
      error: 'Unauthorized',
    },
  },
};

const authRefreshSuccess = {
  status: 200,
  description: 'Token refreshed successfully',
  schema: {
    example: {
      access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      refresh_token: 'new_refresh_token_abc123...',
      user: {
        id: '1',
        email: 'user@example.com',
        username: 'user1731000000',
      },
    },
  },
};

const authTokenInvalid = {
  status: 401,
  description: 'Invalid or expired token',
  schema: {
    example: {
      statusCode: 401,
      message: 'Invalid or expired token',
      error: 'Unauthorized',
    },
  },
};

const authLogoutSuccess = {
  status: 200,
  description: 'Logged out successfully',
  schema: {
    example: {
      message: 'Logged out successfully',
    },
  },
};

const authLogoutAllSuccess = {
  status: 200,
  description: 'Logged out from all devices',
  schema: {
    example: {
      message: 'Logged out from all devices',
      devicesLoggedOut: 3,
    },
  },
};

// ============ EXPORT GROUPED BY ENDPOINT ============

export const swaggerResponses = {
  // Register Endpoint
  register: {
    success: authRegisterSuccess,
    badRequest: authRegisterBadRequest,
    conflict: authRegisterConflict,
    busy: authRegisterBusy,
  },

  // Login Endpoint
  login: {
    success: authLoginSuccess,
    badRequest: authRegisterBadRequest,
    unauthorized: authLoginUnauthorized,
  },

  // Refresh Token Endpoint
  refresh: {
    success: authRefreshSuccess,
    unauthorized: authTokenInvalid,
  },

  // Logout Endpoint
  logout: {
    success: authLogoutSuccess,
    unauthorized: authTokenInvalid,
  },

  // Logout All Devices Endpoint
  logoutAll: {
    success: authLogoutAllSuccess,
  },
};
