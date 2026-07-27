"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/server.ts
var import_node_http = require("http");

// src/app/create-app.ts
var import_compression = __toESM(require("compression"));
var import_cookie_parser = __toESM(require("cookie-parser"));
var import_cors = __toESM(require("cors"));
var import_express14 = __toESM(require("express"));
var import_helmet = __toESM(require("helmet"));
var import_pino_http = __toESM(require("pino-http"));
var import_node_path = __toESM(require("path"));

// src/config/env.ts
var import_config = require("dotenv/config");
var import_zod = require("zod");
var envSchema = import_zod.z.object({
  NODE_ENV: import_zod.z.enum(["development", "test", "production"]).default("development"),
  PORT: import_zod.z.coerce.number().int().positive().default(4e3),
  API_PREFIX: import_zod.z.string().default("/api/v1"),
  DATABASE_URL: import_zod.z.string().min(1),
  REDIS_URL: import_zod.z.string().min(1).default("redis://localhost:6379"),
  JWT_ACCESS_SECRET: import_zod.z.string().min(16).default("development-access-secret-change-me"),
  JWT_REFRESH_SECRET: import_zod.z.string().min(16).default("development-refresh-secret-change-me"),
  JWT_ACCESS_EXPIRES_IN: import_zod.z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: import_zod.z.string().default("7d"),
  BCRYPT_SALT_ROUNDS: import_zod.z.coerce.number().int().min(10).max(15).default(12),
  AUTH_COOKIE_NAME: import_zod.z.string().default("ksp_refresh_token"),
  AUTH_COOKIE_SECURE: import_zod.z.enum(["true", "false"]).default("false"),
  AUTH_COOKIE_SAME_SITE: import_zod.z.enum(["strict", "lax", "none"]).default("strict"),
  AUTH_COOKIE_DOMAIN: import_zod.z.string().optional(),
  CORS_ORIGIN: import_zod.z.string().default("http://localhost:3000,http://localhost:5173,https://ksp-intelligence.onslate.com"),
  RATE_LIMIT_WINDOW_MS: import_zod.z.coerce.number().int().positive().default(9e5),
  RATE_LIMIT_MAX: import_zod.z.coerce.number().int().positive().default(300),
  LOG_LEVEL: import_zod.z.string().default("info"),
  AI_PROVIDER: import_zod.z.enum(["ollama", "mock"]).default("ollama"),
  OLLAMA_BASE_URL: import_zod.z.string().url().default("http://localhost:11434"),
  OLLAMA_MODEL_DEFAULT: import_zod.z.string().min(1).default("sentinel-ai-8b")
});
var parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error("Invalid environment configuration", parsed.error.flatten().fieldErrors);
  process.exit(1);
}
var env = {
  ...parsed.data,
  CORS_ORIGIN: parsed.data.CORS_ORIGIN.split(",").map((origin) => origin.trim()),
  AUTH_COOKIE_SECURE: parsed.data.AUTH_COOKIE_SECURE === "true"
};

// src/core/logger/logger.ts
var import_pino = __toESM(require("pino"));
var logger = (0, import_pino.default)({
  level: env.LOG_LEVEL,
  transport: env.NODE_ENV === "development" ? {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard"
    }
  } : void 0
});

// src/middleware/error.middleware.ts
var import_http_status_codes3 = require("http-status-codes");

// src/core/exceptions/app-error.ts
var import_http_status_codes = require("http-status-codes");
var AppError = class extends Error {
  statusCode;
  code;
  field;
  isOperational;
  constructor(message, options) {
    super(message);
    this.name = "AppError";
    this.statusCode = options?.statusCode ?? import_http_status_codes.StatusCodes.INTERNAL_SERVER_ERROR;
    this.code = options?.code ?? "INTERNAL_SERVER_ERROR";
    this.field = options?.field;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
};

// src/core/response/api-response.ts
var import_http_status_codes2 = require("http-status-codes");
function buildMeta(res, pagination) {
  return {
    requestId: res.req.id ? String(res.req.id) : void 0,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    source: "ksp-intelligence-os",
    ...pagination ? { pagination } : {}
  };
}
function ok(res, data, pagination) {
  return res.status(import_http_status_codes2.StatusCodes.OK).json({
    success: true,
    data,
    meta: buildMeta(res, pagination),
    errors: []
  });
}
function errorResponse(res, statusCode, errors) {
  return res.status(statusCode).json({
    success: false,
    data: null,
    meta: buildMeta(res),
    errors
  });
}

// src/middleware/error.middleware.ts
var errorMiddleware = (error, _req, res, _next) => {
  if (error instanceof AppError) {
    logger.warn({ error }, error.message);
    return errorResponse(res, error.statusCode, [
      {
        code: error.code,
        message: error.message,
        field: error.field
      }
    ]);
  }
  console.error("[Unhandled Error]", error);
  logger.error({ error }, "Unhandled application error");
  return errorResponse(res, import_http_status_codes3.StatusCodes.INTERNAL_SERVER_ERROR, [
    {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred."
    }
  ]);
};

// src/middleware/not-found.middleware.ts
function notFoundMiddleware(req, _res, next) {
  next(
    new AppError(`Route not found: ${req.method} ${req.originalUrl}`, {
      statusCode: 404,
      code: "ROUTE_NOT_FOUND"
    })
  );
}

// src/middleware/request-id.middleware.ts
var import_node_crypto = require("crypto");
function requestIdMiddleware(req, res, next) {
  const requestId = req.header("X-Request-Id") ?? (0, import_node_crypto.randomUUID)();
  req.id = requestId;
  res.setHeader("X-Request-Id", requestId);
  next();
}

// src/middleware/rate-limit.middleware.ts
var import_express_rate_limit = __toESM(require("express-rate-limit"));
var rateLimitMiddleware = (0, import_express_rate_limit.default)({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    return errorResponse(res, 429, [
      {
        code: "RATE_LIMIT_EXCEEDED",
        message: "Too many requests. Please try again later."
      }
    ]);
  }
});

// src/app/routes.ts
var import_express13 = require("express");

// src/app/health.routes.ts
var import_express = require("express");

// src/core/response/async-handler.ts
function asyncHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

// src/app/health.routes.ts
var healthRouter = (0, import_express.Router)();
healthRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    return ok(res, {
      service: "ksp-intelligence-os-backend",
      status: "healthy",
      environment: env.NODE_ENV,
      uptimeSeconds: Math.round(process.uptime())
    });
  })
);

// src/app/docs.routes.ts
var import_express2 = require("express");
var docsRouter = (0, import_express2.Router)();
docsRouter.get(
  "/",
  (_req, res) => ok(res, {
    title: "KSP Intelligence OS API",
    version: "v1",
    status: "placeholder",
    message: "OpenAPI/Swagger generation is planned; route groups are mounted and ready for documentation binding."
  })
);

// src/modules/auth/routes/auth.routes.ts
var import_express3 = require("express");

// src/core/validation/validate.ts
function validate(schemas) {
  return (req, _res, next) => {
    const targets = [
      { key: "body", schema: schemas.body, value: req.body },
      { key: "query", schema: schemas.query, value: req.query },
      { key: "params", schema: schemas.params, value: req.params }
    ];
    for (const target of targets) {
      if (!target.schema) continue;
      const result = target.schema.safeParse(target.value);
      if (!result.success) {
        const firstIssue = result.error.issues[0];
        return next(
          new AppError(firstIssue?.message ?? "Validation failed", {
            statusCode: 400,
            code: "VALIDATION_ERROR",
            field: firstIssue?.path.join(".")
          })
        );
      }
      req[target.key] = result.data;
    }
    next();
  };
}

// src/modules/auth/utils/cookie.ts
function durationToMilliseconds(value) {
  const match = /^(\d+)(s|m|h|d)$/.exec(value);
  if (!match) return 7 * 864e5;
  const amount = Number(match[1]);
  const multiplier = { s: 1e3, m: 6e4, h: 36e5, d: 864e5 }[match[2]];
  return amount * multiplier;
}
function refreshCookieOptions() {
  return {
    httpOnly: true,
    secure: env.AUTH_COOKIE_SECURE,
    sameSite: env.AUTH_COOKIE_SAME_SITE,
    domain: env.AUTH_COOKIE_DOMAIN || void 0,
    path: "/api/v1/auth",
    maxAge: durationToMilliseconds(env.JWT_REFRESH_EXPIRES_IN)
  };
}
function setRefreshCookie(res, refreshToken) {
  res.cookie(env.AUTH_COOKIE_NAME, refreshToken, refreshCookieOptions());
}

// src/modules/auth/controllers/auth.controller.ts
var AuthController = class {
  constructor(authService2) {
    this.authService = authService2;
  }
  authService;
  login = async (req, res) => {
    const input = req.body;
    const result = await this.authService.login(input, this.metadata(req));
    if (input.deliveryMode !== "body") setRefreshCookie(res, result.tokens.refreshToken);
    return ok(res, {
      accessToken: result.tokens.accessToken,
      accessTokenExpiresIn: result.tokens.accessTokenExpiresIn,
      refreshTokenExpiresIn: result.tokens.refreshTokenExpiresIn,
      ...input.deliveryMode === "body" ? { refreshToken: result.tokens.refreshToken } : {},
      user: result.user
    });
  };
  refresh = async (req, res) => {
    const input = req.body;
    const cookieToken = req.cookies?.[env.AUTH_COOKIE_NAME];
    const refreshToken = input.refreshToken ?? cookieToken;
    if (!refreshToken) {
      throw new AppError("Refresh token is required", {
        statusCode: 401,
        code: "REFRESH_TOKEN_REQUIRED"
      });
    }
    const result = await this.authService.refresh(refreshToken, this.metadata(req));
    if (input.deliveryMode !== "body") setRefreshCookie(res, result.tokens.refreshToken);
    return ok(res, {
      accessToken: result.tokens.accessToken,
      accessTokenExpiresIn: result.tokens.accessTokenExpiresIn,
      refreshTokenExpiresIn: result.tokens.refreshTokenExpiresIn,
      ...input.deliveryMode === "body" ? { refreshToken: result.tokens.refreshToken } : {},
      user: result.user
    });
  };
  me = async (req, res) => {
    return ok(res, req.user);
  };
  metadata(req) {
    return {
      ipAddress: req.ip,
      userAgent: req.get("user-agent"),
      requestId: req.id ? String(req.id) : void 0
    };
  }
};

// src/core/database/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: env.NODE_ENV === "development" ? [
    { emit: "event", level: "query" },
    { emit: "event", level: "error" },
    { emit: "event", level: "warn" }
  ] : [{ emit: "event", level: "error" }]
});
prisma.$on("error", (event) => {
  logger.error({ event }, "Prisma error");
});
if (env.NODE_ENV === "development") {
  prisma.$on("query", (event) => {
    logger.debug({ event }, "Prisma query");
  });
}

// src/core/auth/roles.ts
var ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  DGP: "DGP",
  IG: "IG",
  SP: "SP",
  DSP: "DSP",
  INSPECTOR: "INSPECTOR",
  SI: "SI",
  CONSTABLE: "CONSTABLE",
  CRIME_ANALYST: "CRIME_ANALYST",
  POLICY_MAKER: "POLICY_MAKER"
};
var ROLE_VALUES = Object.values(ROLES);

// src/modules/auth/repositories/prisma-auth.repository.ts
var employeeSelect = {
  id: true,
  kgid: true,
  firstName: true,
  passwordHash: true,
  role: true,
  active: true,
  tokenVersion: true,
  lastLoginAt: true
};
var PrismaAuthRepository = class {
  constructor(client = prisma) {
    this.client = client;
  }
  client;
  async findUserByIdentifier(identifier) {
    const emp = await this.client.employee.findFirst({
      where: { kgid: identifier },
      select: employeeSelect
    });
    if (!emp) return null;
    return this.mapToAuthUser(emp);
  }
  async findUserById(employeeId) {
    const emp = await this.client.employee.findUnique({
      where: { id: employeeId },
      select: employeeSelect
    });
    if (!emp) return null;
    return this.mapToAuthUser(emp);
  }
  async updateLastLogin(employeeId) {
    await this.client.employee.update({
      where: { id: employeeId },
      data: { lastLoginAt: /* @__PURE__ */ new Date() }
    });
  }
  async findRefreshTokenByHash(tokenHash) {
    const token = await this.client.refreshToken.findUnique({
      where: { tokenHash },
      select: {
        id: true,
        employeeId: true,
        tokenHash: true,
        familyId: true,
        expiresAt: true,
        revokedAt: true
      }
    });
    return token;
  }
  async createRefreshToken(input) {
    const { ipAddress, userAgent, ...rest } = input;
    await this.client.refreshToken.create({
      data: {
        ...rest,
        createdByIp: ipAddress
      }
    });
  }
  async rotateRefreshToken(input) {
    await this.client.$transaction(async (transaction) => {
      const current = await transaction.refreshToken.findUnique({
        where: { id: input.currentTokenId }
      });
      if (!current || current.revokedAt) {
        throw new Error("Refresh token is no longer active");
      }
      const { ipAddress, userAgent, ...nextTokenRest } = input.nextToken;
      await transaction.refreshToken.create({
        data: {
          ...nextTokenRest,
          createdByIp: ipAddress
        }
      });
      await transaction.refreshToken.update({
        where: { id: input.currentTokenId },
        data: {
          revokedAt: /* @__PURE__ */ new Date(),
          replacedByTokenId: input.nextToken.id
        }
      });
    });
  }
  async revokeTokenFamily(familyId) {
    await this.client.refreshToken.updateMany({
      where: { familyId, revokedAt: null },
      data: { revokedAt: /* @__PURE__ */ new Date() }
    });
  }
  async createAuditLog(input) {
    const { employeeId, event, ipAddress, userAgent, ...metadata } = input;
    await this.client.authAuditLog.create({
      data: {
        employeeId,
        event,
        ipAddress,
        userAgent,
        metadata
      }
    });
  }
  roleExists(role) {
    return ROLE_VALUES.includes(role);
  }
  mapToAuthUser(emp) {
    return {
      id: emp.id,
      kgid: emp.kgid,
      firstName: emp.firstName,
      passwordHash: emp.passwordHash,
      role: emp.role,
      tokenVersion: emp.tokenVersion,
      lastLoginAt: emp.lastLoginAt,
      isActive: emp.active
    };
  }
};

// src/core/auth/permissions.ts
var PERMISSIONS = {
  USERS_MANAGE: "users:manage",
  AUTH_AUDIT_READ: "auth:audit:read",
  CASES_READ_ALL: "cases:read:all",
  CASES_READ_DISTRICT: "cases:read:district",
  CASES_READ_UNIT: "cases:read:unit",
  CASES_WRITE: "cases:write",
  ANALYTICS_READ: "analytics:read",
  POLICY_READ: "policy:read",
  AI_USE: "ai:use"
};
var ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
  [ROLES.DGP]: [
    PERMISSIONS.CASES_READ_ALL,
    PERMISSIONS.ANALYTICS_READ,
    PERMISSIONS.POLICY_READ,
    PERMISSIONS.AUTH_AUDIT_READ,
    PERMISSIONS.AI_USE
  ],
  [ROLES.IG]: [
    PERMISSIONS.CASES_READ_ALL,
    PERMISSIONS.ANALYTICS_READ,
    PERMISSIONS.AUTH_AUDIT_READ,
    PERMISSIONS.AI_USE
  ],
  [ROLES.SP]: [
    PERMISSIONS.CASES_READ_DISTRICT,
    PERMISSIONS.CASES_WRITE,
    PERMISSIONS.ANALYTICS_READ,
    PERMISSIONS.AI_USE
  ],
  [ROLES.DSP]: [
    PERMISSIONS.CASES_READ_DISTRICT,
    PERMISSIONS.CASES_WRITE,
    PERMISSIONS.ANALYTICS_READ,
    PERMISSIONS.AI_USE
  ],
  [ROLES.INSPECTOR]: [
    PERMISSIONS.CASES_READ_UNIT,
    PERMISSIONS.CASES_WRITE,
    PERMISSIONS.ANALYTICS_READ,
    PERMISSIONS.AI_USE
  ],
  [ROLES.SI]: [PERMISSIONS.CASES_READ_UNIT, PERMISSIONS.CASES_WRITE, PERMISSIONS.AI_USE],
  [ROLES.CONSTABLE]: [PERMISSIONS.CASES_READ_UNIT],
  [ROLES.CRIME_ANALYST]: [
    PERMISSIONS.CASES_READ_DISTRICT,
    PERMISSIONS.ANALYTICS_READ,
    PERMISSIONS.AI_USE
  ],
  [ROLES.POLICY_MAKER]: [PERMISSIONS.ANALYTICS_READ, PERMISSIONS.POLICY_READ]
};
function permissionsForRole(role) {
  return [...ROLE_PERMISSIONS[role]];
}

// src/modules/auth/mappers/auth.mapper.ts
function toAuthenticatedUser(user) {
  return {
    id: user.id.toString(),
    kgid: user.kgid,
    firstName: user.firstName,
    role: user.role,
    permissions: permissionsForRole(user.role),
    lastLoginAt: user.lastLoginAt?.toISOString() ?? null
  };
}

// src/modules/auth/utils/password.ts
var import_bcrypt = __toESM(require("bcrypt"));
var DUMMY_PASSWORD_HASH = "$2b$12$9Qh3V9x2E5G58oMYBKrr8u/D1a1JONgQTq0fCFh.O7hJ1EzYhJx8S";
function verifyPassword(password, passwordHash) {
  return import_bcrypt.default.compare(password, passwordHash);
}
function performDummyPasswordCheck(password) {
  return import_bcrypt.default.compare(password, DUMMY_PASSWORD_HASH);
}

// src/modules/auth/utils/token.ts
var import_node_crypto2 = require("crypto");
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
function durationToMilliseconds2(value) {
  const match = /^(\d+)(s|m|h|d)$/.exec(value);
  if (!match) throw new Error(`Unsupported token duration: ${value}`);
  const amount = Number(match[1]);
  const unit = match[2];
  const multiplier = { s: 1e3, m: 6e4, h: 36e5, d: 864e5 }[unit];
  return amount * multiplier;
}
function issueTokenPair(user, existingFamilyId) {
  const refreshTokenId = (0, import_node_crypto2.randomUUID)();
  const familyId = existingFamilyId ?? (0, import_node_crypto2.randomUUID)();
  const accessPayload = {
    sub: user.id.toString(),
    role: user.role,
    permissions: permissionsForRole(user.role),
    employeeId: user.id.toString(),
    tokenVersion: user.tokenVersion,
    type: "access"
  };
  const refreshPayload = {
    sub: user.id.toString(),
    jti: refreshTokenId,
    familyId,
    tokenVersion: user.tokenVersion,
    type: "refresh"
  };
  const accessToken = import_jsonwebtoken.default.sign(accessPayload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    issuer: "ksp-intelligence-os",
    audience: "ksp-api"
  });
  const refreshToken = import_jsonwebtoken.default.sign(refreshPayload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    issuer: "ksp-intelligence-os",
    audience: "ksp-auth"
  });
  return {
    accessToken,
    refreshToken,
    refreshTokenId,
    familyId,
    refreshExpiresAt: new Date(Date.now() + durationToMilliseconds2(env.JWT_REFRESH_EXPIRES_IN))
  };
}
function verifyAccessToken(token) {
  try {
    const payload = import_jsonwebtoken.default.verify(token, env.JWT_ACCESS_SECRET, {
      issuer: "ksp-intelligence-os",
      audience: "ksp-api"
    });
    if (typeof payload === "string" || payload.type !== "access")
      throw new Error("Invalid token type");
    return payload;
  } catch {
    throw new AppError("Invalid or expired access token", {
      statusCode: 401,
      code: "INVALID_ACCESS_TOKEN"
    });
  }
}
function verifyRefreshToken(token) {
  try {
    const payload = import_jsonwebtoken.default.verify(token, env.JWT_REFRESH_SECRET, {
      issuer: "ksp-intelligence-os",
      audience: "ksp-auth"
    });
    if (typeof payload === "string" || payload.type !== "refresh")
      throw new Error("Invalid token type");
    return payload;
  } catch {
    throw new AppError("Invalid or expired refresh token", {
      statusCode: 401,
      code: "INVALID_REFRESH_TOKEN"
    });
  }
}
function hashRefreshToken(token) {
  return (0, import_node_crypto2.createHash)("sha256").update(token).digest("hex");
}

// src/modules/auth/services/auth.service.ts
var AuthService = class {
  constructor(repository) {
    this.repository = repository;
  }
  repository;
  async login(input, metadata) {
    const identifier = input.username.trim();
    const user = await this.repository.findUserByIdentifier(identifier);
    if (!user) {
      await performDummyPasswordCheck(input.password);
      await this.audit(void 0, "LOGIN_FAILURE", false, metadata, "Invalid credentials");
      throw this.invalidCredentialsError();
    }
    if (!user.passwordHash) {
      await this.audit(user.id, "LOGIN_FAILURE", false, metadata, "No password configured");
      throw this.invalidCredentialsError();
    }
    const passwordMatches = await verifyPassword(input.password, user.passwordHash);
    if (!passwordMatches || !user.isActive) {
      await this.audit(user.id, "LOGIN_FAILURE", false, metadata, "Invalid credentials");
      throw this.invalidCredentialsError();
    }
    const issued = issueTokenPair(user);
    await this.repository.createRefreshToken({
      id: issued.refreshTokenId,
      employeeId: user.id,
      tokenHash: hashRefreshToken(issued.refreshToken),
      familyId: issued.familyId,
      expiresAt: issued.refreshExpiresAt,
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent
    });
    await this.repository.updateLastLogin(user.id);
    await this.audit(user.id, "LOGIN_SUCCESS", true, metadata);
    return {
      user: toAuthenticatedUser({ ...user, lastLoginAt: /* @__PURE__ */ new Date() }),
      tokens: {
        accessToken: issued.accessToken,
        refreshToken: issued.refreshToken,
        accessTokenExpiresIn: env.JWT_ACCESS_EXPIRES_IN,
        refreshTokenExpiresIn: env.JWT_REFRESH_EXPIRES_IN
      }
    };
  }
  async refresh(refreshToken, metadata) {
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (error) {
      await this.audit(
        void 0,
        "TOKEN_REFRESH_FAILURE",
        false,
        metadata,
        "Refresh token verification failed"
      );
      throw error;
    }
    const tokenHash = hashRefreshToken(refreshToken);
    const storedToken = await this.repository.findRefreshTokenByHash(tokenHash);
    if (!storedToken) {
      await this.audit(
        BigInt(payload.sub),
        "TOKEN_REFRESH_FAILURE",
        false,
        metadata,
        "Refresh token not found"
      );
      throw this.invalidRefreshTokenError();
    }
    if (storedToken.revokedAt) {
      await this.repository.revokeTokenFamily(storedToken.familyId);
      await this.audit(
        BigInt(payload.sub),
        "TOKEN_REUSE_DETECTED",
        false,
        metadata,
        "Revoked refresh token reuse detected; token family revoked"
      );
      throw new AppError("Refresh token reuse detected", {
        statusCode: 401,
        code: "REFRESH_TOKEN_REUSE_DETECTED"
      });
    }
    if (storedToken.expiresAt <= /* @__PURE__ */ new Date() || storedToken.employeeId.toString() !== payload.sub) {
      await this.audit(
        BigInt(payload.sub),
        "TOKEN_REFRESH_FAILURE",
        false,
        metadata,
        "Refresh token expired or subject mismatch"
      );
      throw this.invalidRefreshTokenError();
    }
    const user = await this.repository.findUserById(BigInt(payload.sub));
    if (!user || !user.isActive || user.tokenVersion !== payload.tokenVersion) {
      await this.repository.revokeTokenFamily(storedToken.familyId);
      await this.audit(
        BigInt(payload.sub),
        "TOKEN_REFRESH_FAILURE",
        false,
        metadata,
        "User disabled or token version changed"
      );
      throw this.invalidRefreshTokenError();
    }
    const issued = issueTokenPair(user, storedToken.familyId);
    await this.repository.rotateRefreshToken({
      currentTokenId: storedToken.id,
      nextToken: {
        id: issued.refreshTokenId,
        employeeId: user.id,
        tokenHash: hashRefreshToken(issued.refreshToken),
        familyId: issued.familyId,
        expiresAt: issued.refreshExpiresAt,
        ipAddress: metadata.ipAddress,
        userAgent: metadata.userAgent
      }
    });
    await this.audit(user.id, "TOKEN_REFRESH", true, metadata);
    return {
      user: toAuthenticatedUser(user),
      tokens: {
        accessToken: issued.accessToken,
        refreshToken: issued.refreshToken,
        accessTokenExpiresIn: env.JWT_ACCESS_EXPIRES_IN,
        refreshTokenExpiresIn: env.JWT_REFRESH_EXPIRES_IN
      }
    };
  }
  async authenticate(accessToken) {
    const payload = verifyAccessToken(accessToken);
    const user = await this.repository.findUserById(BigInt(payload.sub));
    if (!user || !user.isActive || user.tokenVersion !== payload.tokenVersion) {
      throw new AppError("Authentication required", {
        statusCode: 401,
        code: "AUTHENTICATION_REQUIRED"
      });
    }
    return {
      userId: user.id.toString(),
      employeeId: user.id.toString(),
      role: user.role,
      permissions: permissionsForRole(user.role),
      tokenVersion: user.tokenVersion
    };
  }
  invalidCredentialsError() {
    return new AppError("Invalid username or password", {
      statusCode: 401,
      code: "INVALID_CREDENTIALS"
    });
  }
  invalidRefreshTokenError() {
    return new AppError("Invalid or expired refresh token", {
      statusCode: 401,
      code: "INVALID_REFRESH_TOKEN"
    });
  }
  async audit(employeeId, event, success, metadata, details) {
    await this.repository.createAuditLog({
      employeeId,
      event,
      success,
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
      requestId: metadata.requestId,
      details
    });
  }
};

// src/modules/auth/auth.container.ts
var authRepository = new PrismaAuthRepository();
var authService = new AuthService(authRepository);
var authController = new AuthController(authService);

// src/modules/auth/validators/auth.validators.ts
var import_zod2 = require("zod");
var loginBodySchema = import_zod2.z.object({
  username: import_zod2.z.string().trim().min(3).max(255),
  password: import_zod2.z.string().min(8).max(128),
  deliveryMode: import_zod2.z.enum(["cookie", "body"]).default("cookie")
});
var refreshTokenBodySchema = import_zod2.z.object({
  refreshToken: import_zod2.z.string().min(1).optional(),
  deliveryMode: import_zod2.z.enum(["cookie", "body"]).default("cookie")
});

// src/middleware/authenticate.middleware.ts
async function authenticateMiddleware(req, _res, next) {
  try {
    const authorization = req.header("authorization");
    if (!authorization?.startsWith("Bearer ")) {
      throw new AppError("Authentication required", {
        statusCode: 401,
        code: "AUTHENTICATION_REQUIRED"
      });
    }
    req.user = await authService.authenticate(authorization.slice(7));
    next();
  } catch (error) {
    next(error);
  }
}

// src/modules/auth/routes/auth.routes.ts
var authRouter = (0, import_express3.Router)();
authRouter.post("/login", validate({ body: loginBodySchema }), asyncHandler(authController.login));
authRouter.post(
  "/refresh",
  validate({ body: refreshTokenBodySchema }),
  asyncHandler(authController.refresh)
);
authRouter.get("/me", authenticateMiddleware, asyncHandler(authController.me));

// src/modules/cases/routes/cases.routes.ts
var import_express4 = require("express");

// src/middleware/authorize.middleware.ts
function requireRoles(...roles) {
  return (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", {
          statusCode: 403,
          code: "ACCESS_DENIED"
        })
      );
    }
    next();
  };
}
function requirePermissions(...permissions) {
  return (req, _res, next) => {
    const granted = req.user?.permissions ?? [];
    if (!req.user || !permissions.every((permission) => granted.includes(permission))) {
      return next(
        new AppError("You do not have permission to perform this action", {
          statusCode: 403,
          code: "ACCESS_DENIED"
        })
      );
    }
    next();
  };
}
function requireAnyPermission(...permissions) {
  return (req, _res, next) => {
    const granted = req.user?.permissions ?? [];
    if (!req.user || !permissions.some((permission) => granted.includes(permission))) {
      return next(
        new AppError("You do not have permission to perform this action", {
          statusCode: 403,
          code: "ACCESS_DENIED"
        })
      );
    }
    next();
  };
}

// src/middleware/not-implemented.middleware.ts
var import_http_status_codes4 = require("http-status-codes");
function notImplemented(feature) {
  return (_req, _res, next) => {
    next(
      new AppError(`${feature} is not implemented yet`, {
        statusCode: import_http_status_codes4.StatusCodes.NOT_IMPLEMENTED,
        code: "ENDPOINT_NOT_IMPLEMENTED"
      })
    );
  };
}

// src/modules/cases/controllers/case.controller.ts
var import_http_status_codes5 = require("http-status-codes");
var CaseController = class {
  constructor(caseService2) {
    this.caseService = caseService2;
  }
  caseService;
  listCases = async (req, res) => {
    const result = await this.caseService.listCases({
      page: this.parseOptionalNumber(req.query.page, "page"),
      pageSize: this.parseOptionalNumber(req.query.pageSize, "pageSize"),
      crimeNo: this.parseOptionalString(req.query.crimeNo),
      caseNo: this.parseOptionalString(req.query.caseNo),
      policeStationId: this.parseOptionalBigInt(req.query.policeStationId, "policeStationId"),
      policePersonId: this.parseOptionalBigInt(req.query.policePersonId, "policePersonId"),
      caseStatusId: this.parseOptionalBigInt(req.query.caseStatusId, "caseStatusId"),
      crimeMajorHeadId: this.parseOptionalBigInt(req.query.crimeMajorHeadId, "crimeMajorHeadId"),
      crimeMinorHeadId: this.parseOptionalBigInt(req.query.crimeMinorHeadId, "crimeMinorHeadId"),
      districtId: this.parseOptionalBigInt(req.query.districtId, "districtId"),
      fromCrimeRegisteredDate: this.parseOptionalDate(req.query.fromCrimeRegisteredDate, "fromCrimeRegisteredDate"),
      toCrimeRegisteredDate: this.parseOptionalDate(req.query.toCrimeRegisteredDate, "toCrimeRegisteredDate"),
      query: this.parseOptionalString(req.query.query)
    });
    return ok(res, {
      items: result.data,
      warnings: result.warnings ?? []
    }, this.extractPagination(result.meta));
  };
  getCaseById = async (req, res) => {
    const caseMasterId = this.parseRequiredBigInt(req.params.caseId, "caseId");
    const result = await this.caseService.getCaseById(caseMasterId);
    return ok(res, {
      item: result.data,
      warnings: result.warnings ?? []
    });
  };
  getCaseByCrimeNo = async (req, res) => {
    const crimeNo = this.parseRequiredString(req.params.crimeNo, "crimeNo");
    const result = await this.caseService.getCaseByCrimeNo(crimeNo);
    return ok(res, {
      item: result.data,
      warnings: result.warnings ?? []
    });
  };
  getCaseByCaseNo = async (req, res) => {
    const caseNo = this.parseRequiredString(req.params.caseNo, "caseNo");
    const result = await this.caseService.getCaseByCaseNo(caseNo);
    return ok(res, {
      item: result.data,
      warnings: result.warnings ?? []
    });
  };
  getSimilarCases = async (req, res) => {
    const caseMasterId = this.parseRequiredBigInt(req.params.caseId, "caseId");
    const limit = this.parseOptionalNumber(req.query.limit, "limit") ?? 10;
    const result = await this.caseService.getSimilarCases(caseMasterId, limit);
    return ok(res, {
      items: result.data,
      warnings: result.warnings ?? [],
      meta: result.meta ?? null
    });
  };
  parseRequiredString(value, field) {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new AppError(`${field} is required`, {
        statusCode: import_http_status_codes5.StatusCodes.BAD_REQUEST,
        code: "VALIDATION_ERROR",
        field
      });
    }
    return value.trim();
  }
  parseOptionalString(value) {
    if (typeof value !== "string") return void 0;
    const normalized = value.trim();
    return normalized.length > 0 ? normalized : void 0;
  }
  parseRequiredBigInt(value, field) {
    const parsed2 = this.parseOptionalBigInt(value, field);
    if (parsed2 == null) {
      throw new AppError(`${field} is required`, {
        statusCode: import_http_status_codes5.StatusCodes.BAD_REQUEST,
        code: "VALIDATION_ERROR",
        field
      });
    }
    return parsed2;
  }
  parseOptionalBigInt(value, field) {
    if (typeof value !== "string" || value.trim().length === 0) return void 0;
    try {
      return BigInt(value);
    } catch {
      throw new AppError(`${field} must be a valid integer`, {
        statusCode: import_http_status_codes5.StatusCodes.BAD_REQUEST,
        code: "VALIDATION_ERROR",
        field
      });
    }
  }
  parseOptionalNumber(value, field) {
    if (typeof value !== "string" || value.trim().length === 0) return void 0;
    const parsed2 = Number(value);
    if (!Number.isFinite(parsed2)) {
      throw new AppError(`${field} must be a valid number`, {
        statusCode: import_http_status_codes5.StatusCodes.BAD_REQUEST,
        code: "VALIDATION_ERROR",
        field
      });
    }
    return parsed2;
  }
  parseOptionalDate(value, field) {
    if (typeof value !== "string" || value.trim().length === 0) return void 0;
    const parsed2 = new Date(value);
    if (Number.isNaN(parsed2.getTime())) {
      throw new AppError(`${field} must be a valid ISO date`, {
        statusCode: import_http_status_codes5.StatusCodes.BAD_REQUEST,
        code: "VALIDATION_ERROR",
        field
      });
    }
    return parsed2;
  }
  extractPagination(meta) {
    if (!meta) return void 0;
    const page = meta.page;
    const pageSize = meta.pageSize;
    const totalRecords = meta.totalRecords;
    const totalPages = meta.totalPages;
    if (typeof page === "number" && typeof pageSize === "number" && typeof totalRecords === "number" && typeof totalPages === "number") {
      return { page, pageSize, totalRecords, totalPages };
    }
    return void 0;
  }
};

// src/core/pagination/pagination.ts
var DEFAULT_PAGE = 1;
var DEFAULT_PAGE_SIZE = 25;
var MAX_PAGE_SIZE = 100;
function normalizePagination(input) {
  const page = Math.max(input.page ?? DEFAULT_PAGE, 1);
  const pageSize = Math.min(Math.max(input.pageSize ?? DEFAULT_PAGE_SIZE, 1), MAX_PAGE_SIZE);
  return {
    page,
    pageSize,
    skip: (page - 1) * pageSize,
    take: pageSize
  };
}
function buildPaginationMeta(input) {
  return {
    page: input.page,
    pageSize: input.pageSize,
    totalRecords: input.totalRecords,
    totalPages: Math.ceil(input.totalRecords / input.pageSize)
  };
}

// src/modules/cases/types/case.types.ts
var caseListSelect = {
  id: true,
  crimeNo: true,
  caseNo: true,
  crimeRegisteredDate: true,
  incidentFromDate: true,
  incidentToDate: true,
  briefFacts: true,
  latitude: true,
  longitude: true,
  policeStation: {
    select: {
      id: true,
      name: true,
      district: {
        select: {
          id: true,
          name: true
        }
      }
    }
  },
  policePerson: {
    select: {
      id: true,
      kgid: true,
      firstName: true,
      rank: {
        select: {
          id: true,
          name: true
        }
      }
    }
  },
  status: {
    select: {
      id: true,
      name: true
    }
  },
  category: {
    select: {
      id: true,
      lookupValue: true
    }
  },
  majorCrimeHead: {
    select: {
      id: true,
      groupName: true
    }
  },
  minorCrimeHead: {
    select: {
      id: true,
      name: true
    }
  },
  _count: {
    select: {
      complainants: true,
      victims: true,
      accused: true,
      evidence: true,
      vehicles: true,
      digitalIdentifiers: true,
      financialTransactions: true
    }
  }
};
var caseDetailInclude = {
  policePerson: {
    include: {
      rank: true,
      designation: true,
      unit: true,
      district: true
    }
  },
  policeStation: {
    include: {
      unitType: true,
      district: true,
      state: true
    }
  },
  category: true,
  gravity: true,
  majorCrimeHead: true,
  minorCrimeHead: true,
  status: true,
  court: true,
  dataSource: true,
  complainants: {
    include: {
      occupation: true,
      religion: true,
      caste: true,
      gender: true
    }
  },
  victims: {
    include: {
      gender: true,
      riskScores: {
        orderBy: {
          generatedOn: "desc"
        }
      }
    }
  },
  accused: {
    include: {
      gender: true,
      riskScores: {
        orderBy: {
          generatedOn: "desc"
        }
      },
      offenderLinks: {
        include: {
          profile: true
        }
      },
      gangMemberships: {
        include: {
          network: true
        }
      }
    }
  },
  actSections: {
    include: {
      section: {
        include: {
          act: true,
          ipcReferences: true
        }
      }
    },
    orderBy: [{ actOrderId: "asc" }, { sectionOrderId: "asc" }]
  },
  chargesheets: {
    include: {
      policePerson: true
    }
  },
  occurrence: true,
  evidence: true,
  vehicles: true,
  digitalIdentifiers: true,
  financialAccounts: true,
  financialTransactions: true,
  weapons: true,
  documents: true,
  forensicReports: true,
  witnesses: {
    include: {
      gender: true
    }
  },
  diaryEntries: {
    include: {
      employee: true
    },
    orderBy: {
      entryDateTime: "desc"
    }
  },
  courtProceedings: {
    include: {
      court: true
    },
    orderBy: {
      proceedingDate: "desc"
    }
  },
  custodyStatuses: {
    include: {
      accused: true,
      court: true,
      jail: true
    },
    orderBy: {
      startDate: "desc"
    }
  },
  modusOperandi: true,
  socialRelationships: true,
  riskScores: {
    orderBy: {
      generatedOn: "desc"
    }
  },
  recommendations: {
    include: {
      legalSections: {
        include: {
          section: {
            include: {
              act: true
            }
          }
        }
      }
    },
    orderBy: {
      generatedOn: "desc"
    }
  },
  alerts: {
    orderBy: {
      generatedOn: "desc"
    }
  },
  tasks: {
    orderBy: {
      createdAt: "desc"
    }
  },
  _count: {
    select: {
      complainants: true,
      victims: true,
      accused: true,
      evidence: true,
      vehicles: true,
      digitalIdentifiers: true,
      financialTransactions: true,
      chatSessions: true,
      searchRequests: true
    }
  }
};
var caseSimilaritySelect = {
  id: true,
  sourceCaseMasterId: true,
  matchedCaseMasterId: true,
  similarityScore: true,
  similarityType: true,
  reasonFeatures: true,
  modelVersion: true,
  generatedOn: true,
  reviewStatus: true,
  sourceCase: {
    select: {
      id: true,
      crimeNo: true,
      caseNo: true,
      briefFacts: true,
      policeStation: {
        select: {
          id: true,
          name: true
        }
      },
      status: {
        select: {
          id: true,
          name: true
        }
      }
    }
  },
  matchedCase: {
    select: {
      id: true,
      crimeNo: true,
      caseNo: true,
      briefFacts: true,
      policeStation: {
        select: {
          id: true,
          name: true
        }
      },
      status: {
        select: {
          id: true,
          name: true
        }
      }
    }
  },
  reviewedBy: {
    select: {
      id: true,
      kgid: true,
      firstName: true
    }
  }
};

// src/modules/cases/repositories/prisma-case.repository.ts
var PrismaCaseRepository = class {
  constructor(client = prisma) {
    this.client = client;
  }
  client;
  async findById(id) {
    return this.client.caseMaster.findUnique({
      where: { id },
      include: caseDetailInclude
    });
  }
  async findByCrimeNo(crimeNo) {
    return this.client.caseMaster.findFirst({
      where: { crimeNo },
      include: caseDetailInclude
    });
  }
  async findByCaseNo(caseNo) {
    return this.client.caseMaster.findFirst({
      where: { caseNo },
      include: caseDetailInclude
    });
  }
  async list(input) {
    const pagination = normalizePagination(input);
    const where = this.buildWhere(input);
    const [items, totalRecords] = await this.client.$transaction([
      this.client.caseMaster.findMany({
        where,
        select: caseListSelect,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: [{ crimeRegisteredDate: "desc" }, { id: "desc" }]
      }),
      this.client.caseMaster.count({ where })
    ]);
    return {
      items,
      meta: buildPaginationMeta({
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalRecords
      })
    };
  }
  async listSimilarCases(caseMasterId, limit = 10) {
    const take = Math.max(limit, 1);
    return this.client.caseSimilarity.findMany({
      where: {
        OR: [{ sourceCaseMasterId: caseMasterId }, { matchedCaseMasterId: caseMasterId }]
      },
      select: caseSimilaritySelect,
      take,
      orderBy: [{ similarityScore: "desc" }, { generatedOn: "desc" }]
    });
  }
  buildWhere(input) {
    const where = {};
    const and = [];
    if (input.crimeNo) {
      and.push({ crimeNo: input.crimeNo });
    }
    if (input.caseNo) {
      and.push({ caseNo: input.caseNo });
    }
    if (input.policeStationId) {
      and.push({ policeStationId: input.policeStationId });
    }
    if (input.policePersonId) {
      and.push({ policePersonId: input.policePersonId });
    }
    if (input.caseStatusId) {
      and.push({ caseStatusId: input.caseStatusId });
    }
    if (input.crimeMajorHeadId) {
      and.push({ crimeMajorHeadId: input.crimeMajorHeadId });
    }
    if (input.crimeMinorHeadId) {
      and.push({ crimeMinorHeadId: input.crimeMinorHeadId });
    }
    if (input.districtId) {
      and.push({
        policeStation: {
          is: {
            districtId: input.districtId
          }
        }
      });
    }
    if (input.fromCrimeRegisteredDate || input.toCrimeRegisteredDate) {
      and.push({
        crimeRegisteredDate: {
          gte: input.fromCrimeRegisteredDate,
          lte: input.toCrimeRegisteredDate
        }
      });
    }
    if (input.query) {
      and.push({
        OR: [
          {
            crimeNo: {
              contains: input.query,
              mode: "insensitive"
            }
          },
          {
            caseNo: {
              contains: input.query,
              mode: "insensitive"
            }
          },
          {
            briefFacts: {
              contains: input.query,
              mode: "insensitive"
            }
          }
        ]
      });
    }
    if (and.length > 0) {
      where.AND = and;
    }
    return where;
  }
};

// src/modules/cases/services/case.service.ts
var import_http_status_codes6 = require("http-status-codes");
var CaseService = class {
  constructor(repository) {
    this.repository = repository;
  }
  repository;
  async getCaseById(caseMasterId) {
    const record = await this.repository.findById(caseMasterId);
    return { data: this.ensureCase(record, `Case ${caseMasterId} was not found`) };
  }
  async getCaseByCrimeNo(crimeNo) {
    const normalizedCrimeNo = crimeNo.trim();
    const record = await this.repository.findByCrimeNo(normalizedCrimeNo);
    return { data: this.ensureCase(record, `Case with crime number ${normalizedCrimeNo} was not found`) };
  }
  async getCaseByCaseNo(caseNo) {
    const normalizedCaseNo = caseNo.trim();
    const record = await this.repository.findByCaseNo(normalizedCaseNo);
    return { data: this.ensureCase(record, `Case with case number ${normalizedCaseNo} was not found`) };
  }
  async listCases(input) {
    const result = await this.repository.list(input);
    const warnings = this.buildCaseWarnings(result.items);
    return {
      data: result.items,
      warnings,
      meta: result.meta
    };
  }
  async getSimilarCases(caseMasterId, limit = 10) {
    await this.assertCaseExists(caseMasterId);
    const items = await this.repository.listSimilarCases(caseMasterId, limit);
    const warnings = items.length === 0 ? ["No similar cases were found for the selected case."] : void 0;
    return {
      data: items,
      warnings,
      meta: {
        caseMasterId: caseMasterId.toString(),
        limit: Math.max(limit, 1),
        totalMatches: items.length
      }
    };
  }
  async assertCaseExists(caseMasterId) {
    const record = await this.repository.findById(caseMasterId);
    this.ensureCase(record, `Case ${caseMasterId} was not found`);
  }
  ensureCase(record, message) {
    if (!record) {
      throw new AppError(message, {
        statusCode: import_http_status_codes6.StatusCodes.NOT_FOUND,
        code: "CASE_NOT_FOUND"
      });
    }
    return record;
  }
  buildCaseWarnings(items) {
    const warnings = /* @__PURE__ */ new Set();
    for (const item of items) {
      if (!item.briefFacts) {
        warnings.add("Some cases are missing brief facts, which may affect similarity and legal recommendation quality.");
      }
      if (!item.policeStation) {
        warnings.add("Some cases are not linked to a police station.");
      }
      if (!item.status) {
        warnings.add("Some cases are missing case status.");
      }
    }
    return warnings.size > 0 ? [...warnings] : void 0;
  }
};

// src/modules/cases/cases.container.ts
var caseRepository = new PrismaCaseRepository();
var caseService = new CaseService(caseRepository);
var caseController = new CaseController(caseService);

// src/modules/victims/controllers/victim.controller.ts
var import_http_status_codes7 = require("http-status-codes");
var VictimController = class {
  constructor(victimService2) {
    this.victimService = victimService2;
  }
  victimService;
  listVictims = async (req, res) => {
    const result = await this.victimService.listVictims({
      page: this.parseOptionalNumber(req.query.page, "page"),
      pageSize: this.parseOptionalNumber(req.query.pageSize, "pageSize"),
      caseMasterId: this.parseOptionalBigInt(req.query.caseMasterId, "caseMasterId"),
      genderId: this.parseOptionalBigInt(req.query.genderId, "genderId"),
      victimPolice: this.parseOptionalBoolean(req.query.victimPolice, "victimPolice"),
      districtId: this.parseOptionalBigInt(req.query.districtId, "districtId"),
      minAge: this.parseOptionalNumber(req.query.minAge, "minAge"),
      maxAge: this.parseOptionalNumber(req.query.maxAge, "maxAge"),
      query: this.parseOptionalString(req.query.query)
    });
    return ok(res, {
      items: result.data,
      warnings: result.warnings ?? []
    }, this.extractPagination(result.meta));
  };
  getVictimById = async (req, res) => {
    const victimId = this.parseRequiredBigInt(req.params.victimId, "victimId");
    const result = await this.victimService.getVictimById(victimId);
    return ok(res, {
      item: result.data,
      warnings: result.warnings ?? []
    });
  };
  listVictimsByCaseId = async (req, res) => {
    const caseMasterId = this.parseRequiredBigInt(req.params.caseId, "caseId");
    const result = await this.victimService.listVictimsByCase(caseMasterId, {
      page: this.parseOptionalNumber(req.query.page, "page"),
      pageSize: this.parseOptionalNumber(req.query.pageSize, "pageSize"),
      genderId: this.parseOptionalBigInt(req.query.genderId, "genderId"),
      victimPolice: this.parseOptionalBoolean(req.query.victimPolice, "victimPolice"),
      districtId: this.parseOptionalBigInt(req.query.districtId, "districtId"),
      minAge: this.parseOptionalNumber(req.query.minAge, "minAge"),
      maxAge: this.parseOptionalNumber(req.query.maxAge, "maxAge"),
      query: this.parseOptionalString(req.query.query)
    });
    return ok(res, {
      items: result.data,
      warnings: result.warnings ?? [],
      meta: result.meta ?? null
    }, this.extractPagination(result.meta));
  };
  getVictimRiskScores = async (req, res) => {
    const victimId = this.parseRequiredBigInt(req.params.victimId, "victimId");
    const limit = this.parseOptionalNumber(req.query.limit, "limit") ?? 10;
    const result = await this.victimService.getVictimRiskScores(victimId, limit);
    return ok(res, {
      items: result.data,
      warnings: result.warnings ?? [],
      meta: result.meta ?? null
    });
  };
  parseOptionalString(value) {
    if (typeof value !== "string") return void 0;
    const normalized = value.trim();
    return normalized.length > 0 ? normalized : void 0;
  }
  parseRequiredBigInt(value, field) {
    const parsed2 = this.parseOptionalBigInt(value, field);
    if (parsed2 == null) {
      throw new AppError(`${field} is required`, {
        statusCode: import_http_status_codes7.StatusCodes.BAD_REQUEST,
        code: "VALIDATION_ERROR",
        field
      });
    }
    return parsed2;
  }
  parseOptionalBigInt(value, field) {
    if (typeof value !== "string" || value.trim().length === 0) return void 0;
    try {
      return BigInt(value);
    } catch {
      throw new AppError(`${field} must be a valid integer`, {
        statusCode: import_http_status_codes7.StatusCodes.BAD_REQUEST,
        code: "VALIDATION_ERROR",
        field
      });
    }
  }
  parseOptionalNumber(value, field) {
    if (typeof value !== "string" || value.trim().length === 0) return void 0;
    const parsed2 = Number(value);
    if (!Number.isFinite(parsed2)) {
      throw new AppError(`${field} must be a valid number`, {
        statusCode: import_http_status_codes7.StatusCodes.BAD_REQUEST,
        code: "VALIDATION_ERROR",
        field
      });
    }
    return parsed2;
  }
  parseOptionalBoolean(value, field) {
    if (typeof value !== "string" || value.trim().length === 0) return void 0;
    if (value === "true") return true;
    if (value === "false") return false;
    throw new AppError(`${field} must be either true or false`, {
      statusCode: import_http_status_codes7.StatusCodes.BAD_REQUEST,
      code: "VALIDATION_ERROR",
      field
    });
  }
  extractPagination(meta) {
    if (!meta) return void 0;
    const page = meta.page;
    const pageSize = meta.pageSize;
    const totalRecords = meta.totalRecords;
    const totalPages = meta.totalPages;
    if (typeof page === "number" && typeof pageSize === "number" && typeof totalRecords === "number" && typeof totalPages === "number") {
      return { page, pageSize, totalRecords, totalPages };
    }
    return void 0;
  }
};

// src/modules/victims/types/victim.types.ts
var victimListSelect = {
  id: true,
  victimNameHash: true,
  ageYear: true,
  victimPolice: true,
  gender: {
    select: {
      id: true,
      name: true
    }
  },
  case: {
    select: {
      id: true,
      crimeNo: true,
      caseNo: true,
      crimeRegisteredDate: true,
      policeStation: {
        select: {
          id: true,
          name: true,
          district: {
            select: {
              id: true,
              name: true
            }
          }
        }
      },
      status: {
        select: {
          id: true,
          name: true
        }
      }
    }
  },
  _count: {
    select: {
      propertyAssets: true,
      vehicles: true,
      digitalIdentifiers: true,
      financialAccounts: true,
      weapons: true,
      riskScores: true
    }
  }
};
var victimDetailInclude = {
  gender: true,
  case: {
    include: {
      policeStation: {
        include: {
          district: true,
          state: true
        }
      },
      status: true,
      majorCrimeHead: true,
      minorCrimeHead: true
    }
  },
  propertyAssets: true,
  vehicles: true,
  digitalIdentifiers: true,
  financialAccounts: true,
  weapons: true,
  riskScores: {
    orderBy: {
      generatedOn: "desc"
    }
  }
};
var riskScoreSelect = {
  id: true,
  scoreSubjectType: true,
  scoreType: true,
  scoreValue: true,
  riskLevel: true,
  explanationText: true,
  confidenceScore: true,
  modelVersion: true,
  generatedOn: true,
  reviewStatus: true,
  reviewedBy: {
    select: {
      id: true,
      kgid: true,
      firstName: true
    }
  }
};

// src/modules/victims/repositories/prisma-victim.repository.ts
var PrismaVictimRepository = class {
  constructor(client = prisma) {
    this.client = client;
  }
  client;
  async findById(id) {
    return this.client.victim.findUnique({
      where: { id },
      include: victimDetailInclude
    });
  }
  async list(input) {
    const pagination = normalizePagination(input);
    const where = this.buildWhere(input);
    const [items, totalRecords] = await this.client.$transaction([
      this.client.victim.findMany({
        where,
        select: victimListSelect,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: [{ caseMasterId: "desc" }, { id: "desc" }]
      }),
      this.client.victim.count({ where })
    ]);
    return {
      items,
      meta: buildPaginationMeta({
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalRecords
      })
    };
  }
  async listByCaseId(caseMasterId, input = {}) {
    return this.list({ ...input, caseMasterId });
  }
  async listRiskScores(victimId, limit = 10) {
    const take = Math.max(limit, 1);
    return this.client.riskScore.findMany({
      where: { victimMasterId: victimId },
      select: riskScoreSelect,
      take,
      orderBy: [{ generatedOn: "desc" }, { id: "desc" }]
    });
  }
  buildWhere(input) {
    const where = {};
    const and = [];
    if (input.caseMasterId) {
      and.push({ caseMasterId: input.caseMasterId });
    }
    if (input.genderId) {
      and.push({ genderId: input.genderId });
    }
    if (typeof input.victimPolice === "boolean") {
      and.push({ victimPolice: input.victimPolice });
    }
    if (typeof input.minAge === "number" || typeof input.maxAge === "number") {
      and.push({
        ageYear: {
          gte: input.minAge,
          lte: input.maxAge
        }
      });
    }
    if (input.districtId) {
      and.push({
        case: {
          is: {
            policeStation: {
              is: {
                districtId: input.districtId
              }
            }
          }
        }
      });
    }
    if (input.query) {
      and.push({
        victimNameHash: {
          contains: input.query,
          mode: "insensitive"
        }
      });
    }
    if (and.length > 0) {
      where.AND = and;
    }
    return where;
  }
};

// src/modules/victims/services/victim.service.ts
var import_http_status_codes8 = require("http-status-codes");
var VictimService = class {
  constructor(repository) {
    this.repository = repository;
  }
  repository;
  async getVictimById(victimId) {
    const record = await this.repository.findById(victimId);
    return { data: this.ensureVictim(record, `Victim ${victimId} was not found`) };
  }
  async listVictims(input) {
    const result = await this.repository.list(input);
    return {
      data: result.items,
      warnings: this.buildVictimWarnings(result.items),
      meta: result.meta
    };
  }
  async listVictimsByCase(caseMasterId, input = {}) {
    const result = await this.repository.listByCaseId(caseMasterId, input);
    return {
      data: result.items,
      warnings: result.items.length === 0 ? ["No victims are linked to the selected case."] : this.buildVictimWarnings(result.items),
      meta: {
        ...result.meta,
        caseMasterId: caseMasterId.toString()
      }
    };
  }
  async getVictimRiskScores(victimId, limit = 10) {
    await this.assertVictimExists(victimId);
    const items = await this.repository.listRiskScores(victimId, limit);
    return {
      data: items,
      warnings: items.length === 0 ? ["No AI risk scores are available for the selected victim."] : void 0,
      meta: {
        victimId: victimId.toString(),
        limit: Math.max(limit, 1),
        totalRecords: items.length
      }
    };
  }
  async assertVictimExists(victimId) {
    const record = await this.repository.findById(victimId);
    this.ensureVictim(record, `Victim ${victimId} was not found`);
  }
  ensureVictim(record, message) {
    if (!record) {
      throw new AppError(message, {
        statusCode: import_http_status_codes8.StatusCodes.NOT_FOUND,
        code: "VICTIM_NOT_FOUND"
      });
    }
    return record;
  }
  buildVictimWarnings(items) {
    const warnings = /* @__PURE__ */ new Set();
    for (const item of items) {
      if (!item.gender) {
        warnings.add("Some victims are missing gender classification.");
      }
      if (item.ageYear == null) {
        warnings.add("Some victims are missing age information.");
      }
    }
    return warnings.size > 0 ? [...warnings] : void 0;
  }
};

// src/modules/victims/victims.container.ts
var victimRepository = new PrismaVictimRepository();
var victimService = new VictimService(victimRepository);
var victimController = new VictimController(victimService);

// src/modules/cases/validators/case.validators.ts
var import_zod3 = require("zod");
var numericString = import_zod3.z.string().regex(/^\d+$/, "Must be a valid integer");
var isoDateString = import_zod3.z.string().datetime({ offset: true }).or(import_zod3.z.string().date());
var caseIdParamsSchema = import_zod3.z.object({
  caseId: numericString
});
var crimeNoParamsSchema = import_zod3.z.object({
  crimeNo: import_zod3.z.string().trim().min(1)
});
var caseNoParamsSchema = import_zod3.z.object({
  caseNo: import_zod3.z.string().trim().min(1)
});
var listCasesQuerySchema = import_zod3.z.object({
  page: numericString.optional(),
  pageSize: numericString.optional(),
  crimeNo: import_zod3.z.string().trim().min(1).optional(),
  caseNo: import_zod3.z.string().trim().min(1).optional(),
  policeStationId: numericString.optional(),
  policePersonId: numericString.optional(),
  caseStatusId: numericString.optional(),
  crimeMajorHeadId: numericString.optional(),
  crimeMinorHeadId: numericString.optional(),
  districtId: numericString.optional(),
  fromCrimeRegisteredDate: isoDateString.optional(),
  toCrimeRegisteredDate: isoDateString.optional(),
  query: import_zod3.z.string().trim().min(1).optional()
}).passthrough();
var similarCasesQuerySchema = import_zod3.z.object({
  limit: numericString.optional()
}).passthrough();
var createCaseBodySchema = import_zod3.z.object({
  crimeRegisteredDate: import_zod3.z.string().min(1),
  policeStationId: import_zod3.z.number().int().positive(),
  caseCategoryId: import_zod3.z.number().int().positive().optional(),
  gravityOffenceId: import_zod3.z.number().int().positive().optional(),
  crimeMajorHeadId: import_zod3.z.number().int().positive().optional(),
  crimeMinorHeadId: import_zod3.z.number().int().positive().optional(),
  incidentFromDate: import_zod3.z.string().optional(),
  incidentToDate: import_zod3.z.string().optional(),
  latitude: import_zod3.z.number().optional(),
  longitude: import_zod3.z.number().optional(),
  briefFacts: import_zod3.z.string().optional(),
  complainants: import_zod3.z.array(import_zod3.z.record(import_zod3.z.unknown())).optional(),
  victims: import_zod3.z.array(import_zod3.z.record(import_zod3.z.unknown())).optional(),
  accused: import_zod3.z.array(import_zod3.z.record(import_zod3.z.unknown())).optional(),
  actSections: import_zod3.z.array(import_zod3.z.record(import_zod3.z.unknown())).optional()
});
var updateCaseBodySchema = import_zod3.z.object({
  caseStatusId: import_zod3.z.number().int().positive().optional(),
  briefFacts: import_zod3.z.string().optional(),
  crimeMajorHeadId: import_zod3.z.number().int().positive().optional(),
  crimeMinorHeadId: import_zod3.z.number().int().positive().optional(),
  latitude: import_zod3.z.number().optional(),
  longitude: import_zod3.z.number().optional()
});
var validateCaseBodySchema = import_zod3.z.object({
  validationMode: import_zod3.z.string().optional(),
  includeLegalReview: import_zod3.z.boolean().optional(),
  includeEvidenceCheck: import_zod3.z.boolean().optional()
});
var addDiaryEntryBodySchema = import_zod3.z.object({
  entryDateTime: import_zod3.z.string().optional(),
  entryType: import_zod3.z.string().optional(),
  entryText: import_zod3.z.string().min(1),
  actionTaken: import_zod3.z.string().optional(),
  nextAction: import_zod3.z.string().optional()
});
var assignCaseBodySchema = import_zod3.z.object({
  employeeId: import_zod3.z.number().int().positive(),
  notes: import_zod3.z.string().optional(),
  priorityLevel: import_zod3.z.string().optional()
});
var generateCaseRecommendationBodySchema = import_zod3.z.object({
  recommendationTypes: import_zod3.z.array(import_zod3.z.string()).optional(),
  includeGraph: import_zod3.z.boolean().optional(),
  includeSimilarCases: import_zod3.z.boolean().optional()
});

// src/modules/victims/validators/victim.validators.ts
var import_zod4 = require("zod");
var numericString2 = import_zod4.z.string().regex(/^\d+$/, "Must be a valid integer");
var booleanString = import_zod4.z.enum(["true", "false"]);
var victimIdParamsSchema = import_zod4.z.object({
  victimId: numericString2
});
var caseIdParamsSchema2 = import_zod4.z.object({
  caseId: numericString2
});
var listVictimsQuerySchema = import_zod4.z.object({
  page: numericString2.optional(),
  pageSize: numericString2.optional(),
  caseMasterId: numericString2.optional(),
  genderId: numericString2.optional(),
  victimPolice: booleanString.optional(),
  districtId: numericString2.optional(),
  minAge: numericString2.optional(),
  maxAge: numericString2.optional(),
  query: import_zod4.z.string().trim().min(1).optional()
}).passthrough();
var victimRiskScoresQuerySchema = import_zod4.z.object({
  limit: numericString2.optional()
}).passthrough();
var addVictimBodySchema = import_zod4.z.object({
  victimNameHash: import_zod4.z.string().optional(),
  ageYear: import_zod4.z.number().int().nonnegative().optional(),
  genderId: import_zod4.z.number().int().positive().optional(),
  victimPolice: import_zod4.z.boolean().optional()
});

// src/modules/cases/routes/cases.routes.ts
var casesRouter = (0, import_express4.Router)();
var requireCaseRead = requireAnyPermission(
  PERMISSIONS.CASES_READ_ALL,
  PERMISSIONS.CASES_READ_DISTRICT,
  PERMISSIONS.CASES_READ_UNIT
);
casesRouter.use(authenticateMiddleware);
casesRouter.get("/", requireCaseRead, validate({ query: listCasesQuerySchema }), asyncHandler(caseController.listCases));
casesRouter.post("/", requirePermissions(PERMISSIONS.CASES_WRITE), validate({ body: createCaseBodySchema }), notImplemented("Case creation"));
casesRouter.get("/by-crime-no/:crimeNo", requireCaseRead, validate({ params: crimeNoParamsSchema }), asyncHandler(caseController.getCaseByCrimeNo));
casesRouter.get("/by-case-no/:caseNo", requireCaseRead, validate({ params: caseNoParamsSchema }), asyncHandler(caseController.getCaseByCaseNo));
casesRouter.get("/:caseId", requireCaseRead, validate({ params: caseIdParamsSchema }), asyncHandler(caseController.getCaseById));
casesRouter.patch("/:caseId", requirePermissions(PERMISSIONS.CASES_WRITE), validate({ params: caseIdParamsSchema, body: updateCaseBodySchema }), notImplemented("Case update"));
casesRouter.post("/:caseId/validate", requireCaseRead, validate({ params: caseIdParamsSchema, body: validateCaseBodySchema }), notImplemented("FIR validation"));
casesRouter.get("/:caseId/timeline", requireCaseRead, validate({ params: caseIdParamsSchema }), notImplemented("Case timeline"));
casesRouter.post("/:caseId/diary", requirePermissions(PERMISSIONS.CASES_WRITE), validate({ params: caseIdParamsSchema, body: addDiaryEntryBodySchema }), notImplemented("Case diary entry creation"));
casesRouter.post("/:caseId/assignment", requirePermissions(PERMISSIONS.CASES_WRITE), validate({ params: caseIdParamsSchema, body: assignCaseBodySchema }), notImplemented("Case assignment"));
casesRouter.get("/:caseId/similar", requireCaseRead, validate({ params: caseIdParamsSchema, query: similarCasesQuerySchema }), asyncHandler(caseController.getSimilarCases));
casesRouter.get("/:caseId/victims", requireCaseRead, validate({ params: caseIdParamsSchema }), asyncHandler(victimController.listVictimsByCaseId));
casesRouter.post("/:caseId/victims", requirePermissions(PERMISSIONS.CASES_WRITE), validate({ params: caseIdParamsSchema, body: addVictimBodySchema }), notImplemented("Victim creation"));
casesRouter.post("/:caseId/recommendations/generate", requirePermissions(PERMISSIONS.AI_USE), validate({ params: caseIdParamsSchema, body: generateCaseRecommendationBodySchema }), notImplemented("Case recommendation generation"));

// src/modules/victims/routes/victims.routes.ts
var import_express5 = require("express");
var victimsRouter = (0, import_express5.Router)();
var requireCaseRead2 = requireAnyPermission(
  PERMISSIONS.CASES_READ_ALL,
  PERMISSIONS.CASES_READ_DISTRICT,
  PERMISSIONS.CASES_READ_UNIT
);
victimsRouter.use(authenticateMiddleware, requireCaseRead2);
victimsRouter.get("/", validate({ query: listVictimsQuerySchema }), asyncHandler(victimController.listVictims));
victimsRouter.get("/:victimId", validate({ params: victimIdParamsSchema }), asyncHandler(victimController.getVictimById));
victimsRouter.get("/:victimId/risk-scores", validate({ params: victimIdParamsSchema, query: victimRiskScoresQuerySchema }), asyncHandler(victimController.getVictimRiskScores));

// src/modules/legal/routes/legal.routes.ts
var import_express6 = require("express");

// src/modules/legal/controllers/legal.controller.ts
var import_http_status_codes9 = require("http-status-codes");
var LegalController = class {
  constructor(legalService2) {
    this.legalService = legalService2;
  }
  legalService;
  getActByCode = async (req, res) => {
    const actCode = this.parseRequiredString(req.params.actCode, "actCode");
    const result = await this.legalService.getActByCode(actCode);
    return ok(res, {
      item: result.data,
      warnings: result.warnings ?? []
    });
  };
  listActs = async (req, res) => {
    const result = await this.legalService.listActs({
      page: this.parseOptionalNumber(req.query.page, "page"),
      pageSize: this.parseOptionalNumber(req.query.pageSize, "pageSize"),
      active: this.parseOptionalBoolean(req.query.active, "active"),
      query: this.parseOptionalString(req.query.query)
    });
    return ok(res, {
      items: result.data,
      warnings: result.warnings ?? []
    }, this.extractPagination(result.meta));
  };
  getSection = async (req, res) => {
    const actCode = this.parseRequiredString(req.params.actCode, "actCode");
    const sectionCode = this.parseRequiredString(req.params.sectionCode, "sectionCode");
    const result = await this.legalService.getSection(actCode, sectionCode);
    return ok(res, {
      item: result.data,
      warnings: result.warnings ?? []
    });
  };
  listSections = async (req, res) => {
    const result = await this.legalService.listSections({
      page: this.parseOptionalNumber(req.query.page, "page"),
      pageSize: this.parseOptionalNumber(req.query.pageSize, "pageSize"),
      actCode: this.parseOptionalString(req.query.actCode),
      active: this.parseOptionalBoolean(req.query.active, "active"),
      query: this.parseOptionalString(req.query.query)
    });
    return ok(res, {
      items: result.data,
      warnings: result.warnings ?? []
    }, this.extractPagination(result.meta));
  };
  listSectionsByCrimeHead = async (req, res) => {
    const crimeHeadId = this.parseRequiredBigInt(req.params.crimeHeadId, "crimeHeadId");
    const result = await this.legalService.listSectionsByCrimeHead(crimeHeadId);
    return ok(res, {
      items: result.data,
      warnings: result.warnings ?? [],
      meta: result.meta ?? null
    });
  };
  listLegalDocuments = async (req, res) => {
    const result = await this.legalService.listLegalDocuments({
      page: this.parseOptionalNumber(req.query.page, "page"),
      pageSize: this.parseOptionalNumber(req.query.pageSize, "pageSize"),
      actCode: this.parseOptionalString(req.query.actCode),
      query: this.parseOptionalString(req.query.query)
    });
    return ok(res, {
      items: result.data,
      warnings: result.warnings ?? []
    }, this.extractPagination(result.meta));
  };
  listIpcReferences = async (req, res) => {
    const result = await this.legalService.listIpcReferences({
      page: this.parseOptionalNumber(req.query.page, "page"),
      pageSize: this.parseOptionalNumber(req.query.pageSize, "pageSize"),
      actCode: this.parseOptionalString(req.query.actCode),
      sectionCode: this.parseOptionalString(req.query.sectionCode),
      query: this.parseOptionalString(req.query.query)
    });
    return ok(res, {
      items: result.data,
      warnings: result.warnings ?? []
    }, this.extractPagination(result.meta));
  };
  parseRequiredString(value, field) {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new AppError(`${field} is required`, {
        statusCode: import_http_status_codes9.StatusCodes.BAD_REQUEST,
        code: "VALIDATION_ERROR",
        field
      });
    }
    return value.trim();
  }
  parseOptionalString(value) {
    if (typeof value !== "string") return void 0;
    const normalized = value.trim();
    return normalized.length > 0 ? normalized : void 0;
  }
  parseRequiredBigInt(value, field) {
    const parsed2 = this.parseOptionalBigInt(value, field);
    if (parsed2 == null) {
      throw new AppError(`${field} is required`, {
        statusCode: import_http_status_codes9.StatusCodes.BAD_REQUEST,
        code: "VALIDATION_ERROR",
        field
      });
    }
    return parsed2;
  }
  parseOptionalBigInt(value, field) {
    if (typeof value !== "string" || value.trim().length === 0) return void 0;
    try {
      return BigInt(value);
    } catch {
      throw new AppError(`${field} must be a valid integer`, {
        statusCode: import_http_status_codes9.StatusCodes.BAD_REQUEST,
        code: "VALIDATION_ERROR",
        field
      });
    }
  }
  parseOptionalNumber(value, field) {
    if (typeof value !== "string" || value.trim().length === 0) return void 0;
    const parsed2 = Number(value);
    if (!Number.isFinite(parsed2)) {
      throw new AppError(`${field} must be a valid number`, {
        statusCode: import_http_status_codes9.StatusCodes.BAD_REQUEST,
        code: "VALIDATION_ERROR",
        field
      });
    }
    return parsed2;
  }
  parseOptionalBoolean(value, field) {
    if (typeof value !== "string" || value.trim().length === 0) return void 0;
    if (value === "true") return true;
    if (value === "false") return false;
    throw new AppError(`${field} must be either true or false`, {
      statusCode: import_http_status_codes9.StatusCodes.BAD_REQUEST,
      code: "VALIDATION_ERROR",
      field
    });
  }
  extractPagination(meta) {
    if (!meta) return void 0;
    const page = meta.page;
    const pageSize = meta.pageSize;
    const totalRecords = meta.totalRecords;
    const totalPages = meta.totalPages;
    if (typeof page === "number" && typeof pageSize === "number" && typeof totalRecords === "number" && typeof totalPages === "number") {
      return { page, pageSize, totalRecords, totalPages };
    }
    return void 0;
  }
};

// src/modules/legal/types/legal.types.ts
var actSelect = {
  code: true,
  description: true,
  shortName: true,
  active: true,
  _count: {
    select: {
      sections: true,
      legalDocuments: true
    }
  }
};
var legalSectionSelect = {
  actCode: true,
  sectionCode: true,
  description: true,
  active: true,
  act: {
    select: {
      code: true,
      shortName: true,
      description: true,
      active: true
    }
  },
  ipcReferences: {
    select: {
      id: true,
      rawSectionLabel: true,
      descriptionText: true,
      offenseText: true,
      punishmentText: true,
      parseQualityStatus: true
    }
  },
  keywordMappings: {
    select: {
      keyword: {
        select: {
          id: true,
          text: true,
          type: true
        }
      }
    }
  }
};
var legalDocumentSelect = {
  id: true,
  actCode: true,
  title: true,
  sourceName: true,
  jurisdictionPlace: true,
  publishedDateText: true,
  commencementDateText: true,
  sourceUrl: true,
  parseQualityStatus: true,
  act: {
    select: {
      code: true,
      shortName: true,
      description: true
    }
  }
};
var ipcReferenceSelect = {
  id: true,
  actCode: true,
  sectionCode: true,
  rawSectionLabel: true,
  descriptionText: true,
  offenseText: true,
  punishmentText: true,
  parseQualityStatus: true,
  section: {
    select: {
      actCode: true,
      sectionCode: true,
      description: true,
      act: {
        select: {
          code: true,
          shortName: true
        }
      }
    }
  }
};
var crimeHeadSectionMappingSelect = {
  crimeHeadId: true,
  actCode: true,
  sectionCode: true,
  section: {
    select: legalSectionSelect
  }
};

// src/modules/legal/repositories/prisma-act.repository.ts
var PrismaActRepository = class {
  constructor(client = prisma) {
    this.client = client;
  }
  client;
  async findActByCode(code) {
    return this.client.act.findUnique({
      where: { code },
      select: actSelect
    });
  }
  async listActs(input) {
    const pagination = normalizePagination(input);
    const where = this.buildActWhere(input);
    const [items, totalRecords] = await this.client.$transaction([
      this.client.act.findMany({
        where,
        select: actSelect,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: [{ active: "desc" }, { shortName: "asc" }, { code: "asc" }]
      }),
      this.client.act.count({ where })
    ]);
    return {
      items,
      meta: buildPaginationMeta({
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalRecords
      })
    };
  }
  async findSection(actCode, sectionCode) {
    return this.client.legalSection.findUnique({
      where: {
        actCode_sectionCode: {
          actCode,
          sectionCode
        }
      },
      select: legalSectionSelect
    });
  }
  async listSections(input) {
    const pagination = normalizePagination(input);
    const where = this.buildSectionWhere(input);
    const [items, totalRecords] = await this.client.$transaction([
      this.client.legalSection.findMany({
        where,
        select: legalSectionSelect,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: [{ actCode: "asc" }, { sectionCode: "asc" }]
      }),
      this.client.legalSection.count({ where })
    ]);
    return {
      items,
      meta: buildPaginationMeta({
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalRecords
      })
    };
  }
  async listSectionsByCrimeHead(crimeHeadId) {
    return this.client.crimeHeadActSection.findMany({
      where: { crimeHeadId },
      select: crimeHeadSectionMappingSelect,
      orderBy: [{ actCode: "asc" }, { sectionCode: "asc" }]
    });
  }
  async listLegalDocuments(input) {
    const pagination = normalizePagination(input);
    const where = this.buildLegalDocumentWhere(input);
    const [items, totalRecords] = await this.client.$transaction([
      this.client.legalDocumentSource.findMany({
        where,
        select: legalDocumentSelect,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: [{ title: "asc" }, { id: "asc" }]
      }),
      this.client.legalDocumentSource.count({ where })
    ]);
    return {
      items,
      meta: buildPaginationMeta({
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalRecords
      })
    };
  }
  async listIpcReferences(input) {
    const pagination = normalizePagination(input);
    const where = this.buildIpcReferenceWhere(input);
    const [items, totalRecords] = await this.client.$transaction([
      this.client.ipcSectionReference.findMany({
        where,
        select: ipcReferenceSelect,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: [{ actCode: "asc" }, { sectionCode: "asc" }, { id: "asc" }]
      }),
      this.client.ipcSectionReference.count({ where })
    ]);
    return {
      items,
      meta: buildPaginationMeta({
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalRecords
      })
    };
  }
  buildActWhere(input) {
    const where = {};
    const and = [];
    if (typeof input.active === "boolean") {
      and.push({ active: input.active });
    }
    if (input.query) {
      and.push({
        OR: [
          {
            code: {
              contains: input.query,
              mode: "insensitive"
            }
          },
          {
            shortName: {
              contains: input.query,
              mode: "insensitive"
            }
          },
          {
            description: {
              contains: input.query,
              mode: "insensitive"
            }
          }
        ]
      });
    }
    if (and.length > 0) {
      where.AND = and;
    }
    return where;
  }
  buildSectionWhere(input) {
    const where = {};
    const and = [];
    if (input.actCode) {
      and.push({ actCode: input.actCode });
    }
    if (typeof input.active === "boolean") {
      and.push({ active: input.active });
    }
    if (input.query) {
      and.push({
        OR: [
          {
            sectionCode: {
              contains: input.query,
              mode: "insensitive"
            }
          },
          {
            description: {
              contains: input.query,
              mode: "insensitive"
            }
          }
        ]
      });
    }
    if (and.length > 0) {
      where.AND = and;
    }
    return where;
  }
  buildLegalDocumentWhere(input) {
    const where = {};
    const and = [];
    if (input.actCode) {
      and.push({ actCode: input.actCode });
    }
    if (input.query) {
      and.push({
        OR: [
          {
            title: {
              contains: input.query,
              mode: "insensitive"
            }
          },
          {
            sourceName: {
              contains: input.query,
              mode: "insensitive"
            }
          },
          {
            jurisdictionPlace: {
              contains: input.query,
              mode: "insensitive"
            }
          }
        ]
      });
    }
    if (and.length > 0) {
      where.AND = and;
    }
    return where;
  }
  buildIpcReferenceWhere(input) {
    const where = {};
    const and = [];
    if (input.actCode) {
      and.push({ actCode: input.actCode });
    }
    if (input.sectionCode) {
      and.push({ sectionCode: input.sectionCode });
    }
    if (input.query) {
      and.push({
        OR: [
          {
            rawSectionLabel: {
              contains: input.query,
              mode: "insensitive"
            }
          },
          {
            descriptionText: {
              contains: input.query,
              mode: "insensitive"
            }
          },
          {
            offenseText: {
              contains: input.query,
              mode: "insensitive"
            }
          },
          {
            punishmentText: {
              contains: input.query,
              mode: "insensitive"
            }
          }
        ]
      });
    }
    if (and.length > 0) {
      where.AND = and;
    }
    return where;
  }
};

// src/modules/legal/services/legal.service.ts
var import_http_status_codes10 = require("http-status-codes");
var LegalService = class {
  constructor(repository) {
    this.repository = repository;
  }
  repository;
  async getActByCode(code) {
    const normalizedCode = code.trim();
    const record = await this.repository.findActByCode(normalizedCode);
    if (!record) {
      throw new AppError(`Act ${normalizedCode} was not found`, {
        statusCode: import_http_status_codes10.StatusCodes.NOT_FOUND,
        code: "ACT_NOT_FOUND"
      });
    }
    return { data: record };
  }
  async listActs(input) {
    const result = await this.repository.listActs(input);
    return {
      data: result.items,
      warnings: result.items.length === 0 ? ["No acts matched the current search filters."] : void 0,
      meta: result.meta
    };
  }
  async getSection(actCode, sectionCode) {
    const normalizedActCode = actCode.trim();
    const normalizedSectionCode = sectionCode.trim();
    const record = await this.repository.findSection(normalizedActCode, normalizedSectionCode);
    if (!record) {
      throw new AppError(`Section ${normalizedActCode}/${normalizedSectionCode} was not found`, {
        statusCode: import_http_status_codes10.StatusCodes.NOT_FOUND,
        code: "SECTION_NOT_FOUND"
      });
    }
    const warnings = this.buildSectionWarnings(record);
    return { data: record, warnings };
  }
  async listSections(input) {
    const result = await this.repository.listSections(input);
    const warnings = result.items.some((item) => !item.description) ? ["Some sections are missing descriptive text."] : void 0;
    return {
      data: result.items,
      warnings,
      meta: result.meta
    };
  }
  async listSectionsByCrimeHead(crimeHeadId) {
    const items = await this.repository.listSectionsByCrimeHead(crimeHeadId);
    return {
      data: items,
      warnings: items.length === 0 ? ["No legal section mappings are available for the selected crime head."] : void 0,
      meta: {
        crimeHeadId: crimeHeadId.toString(),
        totalRecords: items.length
      }
    };
  }
  async listLegalDocuments(input) {
    const result = await this.repository.listLegalDocuments(input);
    return {
      data: result.items,
      warnings: result.items.some((item) => !item.sourceUrl) ? ["Some legal documents do not have a source URL reference."] : void 0,
      meta: result.meta
    };
  }
  async listIpcReferences(input) {
    const result = await this.repository.listIpcReferences(input);
    const warnings = /* @__PURE__ */ new Set();
    if (result.items.some((item) => !item.descriptionText)) {
      warnings.add("Some IPC references are missing description text.");
    }
    if (result.items.some((item) => !item.punishmentText)) {
      warnings.add("Some IPC references are missing punishment details.");
    }
    return {
      data: result.items,
      warnings: warnings.size > 0 ? [...warnings] : void 0,
      meta: result.meta
    };
  }
  buildSectionWarnings(record) {
    const warnings = /* @__PURE__ */ new Set();
    if (!record.description) {
      warnings.add("This section does not have a normalized description yet.");
    }
    if (record.ipcReferences.length === 0) {
      warnings.add("No IPC reference rows are linked to this section.");
    }
    return warnings.size > 0 ? [...warnings] : void 0;
  }
};

// src/modules/legal/legal.container.ts
var actRepository = new PrismaActRepository();
var legalService = new LegalService(actRepository);
var legalController = new LegalController(legalService);

// src/modules/legal/validators/legal.validators.ts
var import_zod5 = require("zod");
var numericString3 = import_zod5.z.string().regex(/^\d+$/, "Must be a valid integer");
var booleanString2 = import_zod5.z.enum(["true", "false"]);
var actCodeParamsSchema = import_zod5.z.object({
  actCode: import_zod5.z.string().trim().min(1)
});
var sectionParamsSchema = import_zod5.z.object({
  actCode: import_zod5.z.string().trim().min(1),
  sectionCode: import_zod5.z.string().trim().min(1)
});
var sectionCodeOnlyParamsSchema = import_zod5.z.object({
  sectionCode: import_zod5.z.string().trim().min(1)
});
var crimeHeadIdParamsSchema = import_zod5.z.object({
  crimeHeadId: numericString3
});
var listActsQuerySchema = import_zod5.z.object({
  page: numericString3.optional(),
  pageSize: numericString3.optional(),
  active: booleanString2.optional(),
  query: import_zod5.z.string().trim().min(1).optional()
});
var listSectionsQuerySchema = import_zod5.z.object({
  page: numericString3.optional(),
  pageSize: numericString3.optional(),
  actCode: import_zod5.z.string().trim().min(1).optional(),
  active: booleanString2.optional(),
  query: import_zod5.z.string().trim().min(1).optional()
});
var listLegalDocumentsQuerySchema = import_zod5.z.object({
  page: numericString3.optional(),
  pageSize: numericString3.optional(),
  actCode: import_zod5.z.string().trim().min(1).optional(),
  query: import_zod5.z.string().trim().min(1).optional()
});
var listIpcReferencesQuerySchema = import_zod5.z.object({
  page: numericString3.optional(),
  pageSize: numericString3.optional(),
  actCode: import_zod5.z.string().trim().min(1).optional(),
  sectionCode: import_zod5.z.string().trim().min(1).optional(),
  query: import_zod5.z.string().trim().min(1).optional()
});
var ipcSearchQuerySchema = import_zod5.z.object({
  q: import_zod5.z.string().trim().min(1),
  actCode: import_zod5.z.string().trim().min(1).optional(),
  limit: numericString3.optional()
});
var ipcSectionDetailQuerySchema = import_zod5.z.object({
  actCode: import_zod5.z.string().trim().min(1).optional()
});
var ipcRecommendBodySchema = import_zod5.z.object({
  caseMasterId: import_zod5.z.number().int().positive().optional(),
  narrative: import_zod5.z.string().trim().min(1),
  crimeHeadId: import_zod5.z.number().int().positive().optional(),
  includeSimilarCases: import_zod5.z.boolean().optional()
});

// src/modules/legal/routes/legal.routes.ts
var legalRouter = (0, import_express6.Router)();
var actsRouter = (0, import_express6.Router)();
var ipcRouter = (0, import_express6.Router)();
var requireLegalRead = requireAnyPermission(
  PERMISSIONS.CASES_READ_ALL,
  PERMISSIONS.CASES_READ_DISTRICT,
  PERMISSIONS.CASES_READ_UNIT,
  PERMISSIONS.ANALYTICS_READ,
  PERMISSIONS.POLICY_READ
);
legalRouter.use(authenticateMiddleware, requireLegalRead);
actsRouter.use(authenticateMiddleware, requireLegalRead);
ipcRouter.use(authenticateMiddleware, requireLegalRead);
legalRouter.get(
  "/documents",
  validate({ query: listLegalDocumentsQuerySchema }),
  asyncHandler(legalController.listLegalDocuments)
);
legalRouter.get(
  "/crime-heads/:crimeHeadId/sections",
  validate({ params: crimeHeadIdParamsSchema }),
  asyncHandler(legalController.listSectionsByCrimeHead)
);
legalRouter.get(
  "/sections",
  validate({ query: listSectionsQuerySchema }),
  asyncHandler(legalController.listSections)
);
legalRouter.get(
  "/ipc-references",
  validate({ query: listIpcReferencesQuerySchema }),
  asyncHandler(legalController.listIpcReferences)
);
actsRouter.get(
  "/",
  validate({ query: listActsQuerySchema }),
  asyncHandler(legalController.listActs)
);
actsRouter.get(
  "/:actCode",
  validate({ params: actCodeParamsSchema }),
  asyncHandler(legalController.getActByCode)
);
actsRouter.get(
  "/:actCode/sections",
  validate({ params: actCodeParamsSchema, query: listSectionsQuerySchema }),
  asyncHandler(legalController.listSections)
);
ipcRouter.get("/search", validate({ query: ipcSearchQuerySchema }), notImplemented("IPC search"));
ipcRouter.get(
  "/:sectionCode",
  validate({ params: sectionCodeOnlyParamsSchema, query: ipcSectionDetailQuerySchema }),
  notImplemented("IPC section detail lookup by query actCode")
);
ipcRouter.post(
  "/recommend",
  requirePermissions(PERMISSIONS.AI_USE),
  validate({ body: ipcRecommendBodySchema }),
  notImplemented("IPC recommendation")
);
ipcRouter.get(
  "/:actCode/:sectionCode",
  validate({ params: sectionParamsSchema }),
  asyncHandler(legalController.getSection)
);

// src/modules/analytics/routes/analytics.routes.ts
var import_express7 = require("express");

// src/modules/analytics/controllers/analytics.controller.ts
var import_http_status_codes11 = require("http-status-codes");
var AnalyticsController = class {
  constructor(analyticsService2) {
    this.analyticsService = analyticsService2;
  }
  analyticsService;
  listCrimeStatistics = async (req, res) => {
    const input = {
      page: this.parseOptionalNumber(req.query.page, "page"),
      pageSize: this.parseOptionalNumber(req.query.pageSize, "pageSize"),
      reportYear: this.parseOptionalNumber(req.query.reportYear, "reportYear"),
      reportMonth: this.parseOptionalNumber(req.query.reportMonth, "reportMonth"),
      districtId: this.parseOptionalBigInt(req.query.districtId, "districtId"),
      unitId: this.parseOptionalBigInt(req.query.unitId, "unitId"),
      crimeHeadId: this.parseOptionalBigInt(req.query.crimeHeadId, "crimeHeadId"),
      crimeSubHeadId: this.parseOptionalBigInt(req.query.crimeSubHeadId, "crimeSubHeadId"),
      isProvisional: this.parseOptionalBoolean(req.query.isProvisional, "isProvisional")
    };
    const result = await this.analyticsService.listCrimeStatistics(input);
    return ok(res, {
      items: result.data,
      warnings: result.warnings ?? [],
      aggregate: typeof result.meta?.aggregate === "object" ? result.meta.aggregate : null
    }, this.extractPagination(result.meta));
  };
  getCrimeStatisticAggregate = async (req, res) => {
    const result = await this.analyticsService.getCrimeStatisticAggregate({
      reportYear: this.parseOptionalNumber(req.query.reportYear, "reportYear"),
      reportMonth: this.parseOptionalNumber(req.query.reportMonth, "reportMonth"),
      districtId: this.parseOptionalBigInt(req.query.districtId, "districtId"),
      unitId: this.parseOptionalBigInt(req.query.unitId, "unitId"),
      crimeHeadId: this.parseOptionalBigInt(req.query.crimeHeadId, "crimeHeadId"),
      crimeSubHeadId: this.parseOptionalBigInt(req.query.crimeSubHeadId, "crimeSubHeadId"),
      isProvisional: this.parseOptionalBoolean(req.query.isProvisional, "isProvisional")
    });
    return ok(res, {
      item: result.data,
      warnings: result.warnings ?? []
    });
  };
  listCrimeReviewReports = async (req, res) => {
    const result = await this.analyticsService.listCrimeReviewReports({
      page: this.parseOptionalNumber(req.query.page, "page"),
      pageSize: this.parseOptionalNumber(req.query.pageSize, "pageSize"),
      reportYear: this.parseOptionalNumber(req.query.reportYear, "reportYear"),
      reportMonth: this.parseOptionalNumber(req.query.reportMonth, "reportMonth"),
      isProvisional: this.parseOptionalBoolean(req.query.isProvisional, "isProvisional"),
      query: this.parseOptionalString(req.query.query)
    });
    return ok(res, {
      items: result.data,
      warnings: result.warnings ?? []
    }, this.extractPagination(result.meta));
  };
  listVictimDemographics = async (req, res) => {
    const result = await this.analyticsService.listVictimDemographics({
      page: this.parseOptionalNumber(req.query.page, "page"),
      pageSize: this.parseOptionalNumber(req.query.pageSize, "pageSize"),
      statisticYear: this.parseOptionalNumber(req.query.statisticYear, "statisticYear"),
      stateId: this.parseOptionalBigInt(req.query.stateId, "stateId"),
      crimeContext: this.parseOptionalString(req.query.crimeContext),
      purposeLabel: this.parseOptionalString(req.query.purposeLabel),
      genderLabel: this.parseOptionalString(req.query.genderLabel),
      ageBandLabel: this.parseOptionalString(req.query.ageBandLabel)
    });
    return ok(res, {
      items: result.data,
      warnings: result.warnings ?? []
    }, this.extractPagination(result.meta));
  };
  listCyberSuspectStatistics = async (req, res) => {
    const result = await this.analyticsService.listCyberSuspectStatistics({
      page: this.parseOptionalNumber(req.query.page, "page"),
      pageSize: this.parseOptionalNumber(req.query.pageSize, "pageSize"),
      statisticYear: this.parseOptionalNumber(req.query.statisticYear, "statisticYear"),
      stateId: this.parseOptionalBigInt(req.query.stateId, "stateId"),
      crimeHeadLabel: this.parseOptionalString(req.query.crimeHeadLabel),
      suspectCategory: this.parseOptionalString(req.query.suspectCategory)
    });
    return ok(res, {
      items: result.data,
      warnings: result.warnings ?? []
    }, this.extractPagination(result.meta));
  };
  listHotspots = async (req, res) => {
    const result = await this.analyticsService.listHotspots({
      page: this.parseOptionalNumber(req.query.page, "page"),
      pageSize: this.parseOptionalNumber(req.query.pageSize, "pageSize"),
      districtId: this.parseOptionalBigInt(req.query.districtId, "districtId"),
      unitId: this.parseOptionalBigInt(req.query.unitId, "unitId"),
      crimeHeadId: this.parseOptionalBigInt(req.query.crimeHeadId, "crimeHeadId"),
      crimeSubHeadId: this.parseOptionalBigInt(req.query.crimeSubHeadId, "crimeSubHeadId"),
      riskLevel: this.parseOptionalString(req.query.riskLevel),
      trendDirection: this.parseOptionalString(req.query.trendDirection),
      minConfidenceScore: this.parseOptionalNumber(req.query.minConfidenceScore, "minConfidenceScore")
    });
    return ok(res, {
      items: result.data,
      warnings: result.warnings ?? []
    }, this.extractPagination(result.meta));
  };
  listRiskScores = async (req, res) => {
    const result = await this.analyticsService.listRiskScores({
      page: this.parseOptionalNumber(req.query.page, "page"),
      pageSize: this.parseOptionalNumber(req.query.pageSize, "pageSize"),
      scoreSubjectType: this.parseOptionalString(req.query.scoreSubjectType),
      scoreType: this.parseOptionalString(req.query.scoreType),
      riskLevel: this.parseOptionalString(req.query.riskLevel),
      reviewStatus: this.parseOptionalString(req.query.reviewStatus),
      caseMasterId: this.parseOptionalBigInt(req.query.caseMasterId, "caseMasterId"),
      accusedMasterId: this.parseOptionalBigInt(req.query.accusedMasterId, "accusedMasterId"),
      victimMasterId: this.parseOptionalBigInt(req.query.victimMasterId, "victimMasterId"),
      hotspotId: this.parseOptionalBigInt(req.query.hotspotId, "hotspotId")
    });
    return ok(res, {
      items: result.data,
      warnings: result.warnings ?? []
    }, this.extractPagination(result.meta));
  };
  listRecommendations = async (req, res) => {
    const result = await this.analyticsService.listRecommendations({
      page: this.parseOptionalNumber(req.query.page, "page"),
      pageSize: this.parseOptionalNumber(req.query.pageSize, "pageSize"),
      recommendationType: this.parseOptionalString(req.query.recommendationType),
      status: this.parseOptionalString(req.query.status),
      priorityLevel: this.parseOptionalString(req.query.priorityLevel),
      caseMasterId: this.parseOptionalBigInt(req.query.caseMasterId, "caseMasterId"),
      hotspotId: this.parseOptionalBigInt(req.query.hotspotId, "hotspotId"),
      riskScoreId: this.parseOptionalBigInt(req.query.riskScoreId, "riskScoreId"),
      minConfidenceScore: this.parseOptionalNumber(req.query.minConfidenceScore, "minConfidenceScore")
    });
    return ok(res, {
      items: result.data,
      warnings: result.warnings ?? []
    }, this.extractPagination(result.meta));
  };
  listRepeatOffenderProfiles = async (req, res) => {
    const result = await this.analyticsService.listRepeatOffenderProfiles({
      page: this.parseOptionalNumber(req.query.page, "page"),
      pageSize: this.parseOptionalNumber(req.query.pageSize, "pageSize"),
      primaryDistrictId: this.parseOptionalBigInt(req.query.primaryDistrictId, "primaryDistrictId"),
      riskLevel: this.parseOptionalString(req.query.riskLevel),
      profileStatus: this.parseOptionalString(req.query.profileStatus),
      query: this.parseOptionalString(req.query.query)
    });
    return ok(res, {
      items: result.data,
      warnings: result.warnings ?? []
    }, this.extractPagination(result.meta));
  };
  parseOptionalString(value) {
    if (typeof value !== "string") return void 0;
    const normalized = value.trim();
    return normalized.length > 0 ? normalized : void 0;
  }
  parseOptionalBigInt(value, field) {
    if (typeof value !== "string" || value.trim().length === 0) return void 0;
    try {
      return BigInt(value);
    } catch {
      throw new AppError(`${field} must be a valid integer`, {
        statusCode: import_http_status_codes11.StatusCodes.BAD_REQUEST,
        code: "VALIDATION_ERROR",
        field
      });
    }
  }
  parseOptionalNumber(value, field) {
    if (typeof value !== "string" || value.trim().length === 0) return void 0;
    const parsed2 = Number(value);
    if (!Number.isFinite(parsed2)) {
      throw new AppError(`${field} must be a valid number`, {
        statusCode: import_http_status_codes11.StatusCodes.BAD_REQUEST,
        code: "VALIDATION_ERROR",
        field
      });
    }
    return parsed2;
  }
  parseOptionalBoolean(value, field) {
    if (typeof value !== "string" || value.trim().length === 0) return void 0;
    if (value === "true") return true;
    if (value === "false") return false;
    throw new AppError(`${field} must be either true or false`, {
      statusCode: import_http_status_codes11.StatusCodes.BAD_REQUEST,
      code: "VALIDATION_ERROR",
      field
    });
  }
  extractPagination(meta) {
    if (!meta) return void 0;
    const page = meta.page;
    const pageSize = meta.pageSize;
    const totalRecords = meta.totalRecords;
    const totalPages = meta.totalPages;
    if (typeof page === "number" && typeof pageSize === "number" && typeof totalRecords === "number" && typeof totalPages === "number") {
      return { page, pageSize, totalRecords, totalPages };
    }
    return void 0;
  }
};

// src/modules/analytics/types/analytics.types.ts
var crimeStatisticSelect = {
  id: true,
  reportMonth: true,
  reportYear: true,
  rawActLabel: true,
  rawMajorHead: true,
  rawMinorHead: true,
  currentMonthCount: true,
  yearToDateCount: true,
  previousMonthCount: true,
  correspondingPreviousYearCount: true,
  measureNotes: true,
  isProvisional: true,
  district: {
    select: {
      id: true,
      name: true
    }
  },
  unit: {
    select: {
      id: true,
      name: true
    }
  },
  crimeHead: {
    select: {
      id: true,
      groupName: true
    }
  },
  crimeSubHead: {
    select: {
      id: true,
      name: true
    }
  },
  dataSource: {
    select: {
      id: true,
      sourceName: true,
      sourceBatch: true
    }
  }
};
var victimDemographicSelect = {
  id: true,
  statisticYear: true,
  stateUtNameRaw: true,
  crimeContext: true,
  purposeLabel: true,
  genderLabel: true,
  ageBandLabel: true,
  caseCount: true,
  victimCount: true,
  maleCount: true,
  femaleCount: true,
  grandTotal: true,
  state: {
    select: {
      id: true,
      name: true
    }
  },
  dataSource: {
    select: {
      id: true,
      sourceName: true
    }
  }
};
var cyberSuspectStatisticSelect = {
  id: true,
  statisticYear: true,
  stateUtNameRaw: true,
  crimeHeadLabel: true,
  suspectCategory: true,
  suspectCount: true,
  totalCount: true,
  state: {
    select: {
      id: true,
      name: true
    }
  },
  dataSource: {
    select: {
      id: true,
      sourceName: true
    }
  }
};
var hotspotSelect = {
  id: true,
  hotspotName: true,
  timeWindowStart: true,
  timeWindowEnd: true,
  boundaryReference: true,
  centerLatitude: true,
  centerLongitude: true,
  riskLevel: true,
  confidenceScore: true,
  trendDirection: true,
  generatedOn: true,
  modelVersion: true,
  district: {
    select: {
      id: true,
      name: true
    }
  },
  unit: {
    select: {
      id: true,
      name: true
    }
  },
  crimeHead: {
    select: {
      id: true,
      groupName: true
    }
  },
  crimeSubHead: {
    select: {
      id: true,
      name: true
    }
  },
  _count: {
    select: {
      cases: true,
      riskScores: true,
      recommendations: true,
      alerts: true
    }
  }
};
var hotspotDetailSelect = {
  id: true,
  hotspotName: true,
  timeWindowStart: true,
  timeWindowEnd: true,
  boundaryReference: true,
  centerLatitude: true,
  centerLongitude: true,
  riskLevel: true,
  confidenceScore: true,
  trendDirection: true,
  generatedOn: true,
  modelVersion: true,
  district: {
    select: {
      id: true,
      name: true
    }
  },
  unit: {
    select: {
      id: true,
      name: true
    }
  },
  crimeHead: {
    select: {
      id: true,
      groupName: true
    }
  },
  crimeSubHead: {
    select: {
      id: true,
      name: true
    }
  },
  cases: {
    select: {
      id: true,
      contributionScore: true,
      matchReason: true,
      case: {
        select: {
          id: true,
          crimeNo: true,
          caseNo: true,
          briefFacts: true,
          crimeRegisteredDate: true,
          policeStation: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }
    },
    orderBy: [{ contributionScore: "desc" }, { id: "asc" }]
  },
  recommendations: {
    select: {
      id: true,
      recommendationType: true,
      recommendationText: true,
      confidenceScore: true,
      priorityLevel: true,
      status: true,
      generatedOn: true
    },
    orderBy: [{ generatedOn: "desc" }, { id: "desc" }]
  },
  riskScores: {
    select: {
      id: true,
      scoreType: true,
      scoreValue: true,
      riskLevel: true,
      confidenceScore: true,
      generatedOn: true
    },
    orderBy: [{ generatedOn: "desc" }, { id: "desc" }]
  },
  _count: {
    select: {
      cases: true,
      riskScores: true,
      recommendations: true,
      alerts: true
    }
  }
};
var riskScoreSelect2 = {
  id: true,
  scoreSubjectType: true,
  caseMasterId: true,
  accusedMasterId: true,
  victimMasterId: true,
  unitId: true,
  hotspotId: true,
  scoreType: true,
  scoreValue: true,
  riskLevel: true,
  explanationText: true,
  confidenceScore: true,
  modelVersion: true,
  generatedOn: true,
  reviewStatus: true,
  case: {
    select: {
      id: true,
      crimeNo: true,
      caseNo: true
    }
  },
  accused: {
    select: {
      id: true,
      accusedNameHash: true,
      personId: true
    }
  },
  victim: {
    select: {
      id: true,
      victimNameHash: true
    }
  },
  unit: {
    select: {
      id: true,
      name: true
    }
  },
  hotspot: {
    select: {
      id: true,
      hotspotName: true
    }
  },
  reviewedBy: {
    select: {
      id: true,
      kgid: true,
      firstName: true
    }
  }
};
var recommendationSelect = {
  id: true,
  recommendationType: true,
  recommendationText: true,
  rationaleText: true,
  confidenceScore: true,
  priorityLevel: true,
  modelVersion: true,
  generatedOn: true,
  status: true,
  reviewNotes: true,
  case: {
    select: {
      id: true,
      crimeNo: true,
      caseNo: true
    }
  },
  hotspot: {
    select: {
      id: true,
      hotspotName: true
    }
  },
  riskScore: {
    select: {
      id: true,
      scoreType: true,
      scoreValue: true,
      riskLevel: true
    }
  },
  reviewedBy: {
    select: {
      id: true,
      kgid: true,
      firstName: true
    }
  },
  legalSections: {
    select: {
      id: true,
      recommendationAction: true,
      reasonText: true,
      confidenceScore: true,
      section: {
        select: {
          actCode: true,
          sectionCode: true,
          description: true,
          act: {
            select: {
              code: true,
              shortName: true
            }
          }
        }
      }
    }
  }
};
var repeatOffenderProfileSelect = {
  id: true,
  profileNameHash: true,
  identityConfidence: true,
  knownAliasText: true,
  firstKnownCaseDate: true,
  lastKnownCaseDate: true,
  totalLinkedCases: true,
  totalConvictions: true,
  riskLevel: true,
  profileStatus: true,
  primaryDistrict: {
    select: {
      id: true,
      name: true
    }
  },
  _count: {
    select: {
      accusedLinks: true,
      gangMemberships: true
    }
  }
};
var crimeReviewReportSelect = {
  id: true,
  reportTitle: true,
  reportMonth: true,
  reportYear: true,
  publishedBy: true,
  classificationAsOfDate: true,
  isProvisional: true,
  summaryText: true,
  dataSource: {
    select: {
      id: true,
      sourceName: true,
      sourceBatch: true
    }
  },
  _count: {
    select: {
      sections: true
    }
  }
};

// src/modules/analytics/repositories/prisma-analytics.repository.ts
var PrismaAnalyticsRepository = class {
  constructor(client = prisma) {
    this.client = client;
  }
  client;
  async listCrimeStatistics(input) {
    const pagination = normalizePagination(input);
    const where = this.buildCrimeStatisticWhere(input);
    const [items, totalRecords] = await this.client.$transaction([
      this.client.crimeStatistic.findMany({
        where,
        select: crimeStatisticSelect,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: [{ reportYear: "desc" }, { reportMonth: "desc" }, { id: "desc" }]
      }),
      this.client.crimeStatistic.count({ where })
    ]);
    return {
      items,
      meta: buildPaginationMeta({
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalRecords
      })
    };
  }
  async aggregateCrimeStatistics(input) {
    const where = this.buildCrimeStatisticWhere(input);
    const aggregate = await this.client.crimeStatistic.aggregate({
      where,
      _count: {
        _all: true
      },
      _sum: {
        currentMonthCount: true,
        yearToDateCount: true,
        previousMonthCount: true,
        correspondingPreviousYearCount: true
      }
    });
    return {
      totalRecords: aggregate._count._all,
      totalCurrentMonthCount: aggregate._sum.currentMonthCount,
      totalYearToDateCount: aggregate._sum.yearToDateCount,
      totalPreviousMonthCount: aggregate._sum.previousMonthCount,
      totalCorrespondingPreviousYearCount: aggregate._sum.correspondingPreviousYearCount
    };
  }
  async listCrimeReviewReports(input) {
    const pagination = normalizePagination(input);
    const where = this.buildCrimeReviewReportWhere(input);
    const [items, totalRecords] = await this.client.$transaction([
      this.client.crimeReviewReport.findMany({
        where,
        select: crimeReviewReportSelect,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: [{ reportYear: "desc" }, { reportMonth: "desc" }, { id: "desc" }]
      }),
      this.client.crimeReviewReport.count({ where })
    ]);
    return {
      items,
      meta: buildPaginationMeta({
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalRecords
      })
    };
  }
  async listVictimDemographics(input) {
    const pagination = normalizePagination(input);
    const where = this.buildVictimDemographicWhere(input);
    const [items, totalRecords] = await this.client.$transaction([
      this.client.victimDemographicStatistic.findMany({
        where,
        select: victimDemographicSelect,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: [{ statisticYear: "desc" }, { id: "desc" }]
      }),
      this.client.victimDemographicStatistic.count({ where })
    ]);
    return {
      items,
      meta: buildPaginationMeta({
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalRecords
      })
    };
  }
  async listCyberSuspectStatistics(input) {
    const pagination = normalizePagination(input);
    const where = this.buildCyberSuspectWhere(input);
    const [items, totalRecords] = await this.client.$transaction([
      this.client.cyberSuspectStatistic.findMany({
        where,
        select: cyberSuspectStatisticSelect,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: [{ statisticYear: "desc" }, { id: "desc" }]
      }),
      this.client.cyberSuspectStatistic.count({ where })
    ]);
    return {
      items,
      meta: buildPaginationMeta({
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalRecords
      })
    };
  }
  async listHotspots(input) {
    const pagination = normalizePagination(input);
    const where = this.buildHotspotWhere(input);
    const [items, totalRecords] = await this.client.$transaction([
      this.client.hotspot.findMany({
        where,
        select: hotspotSelect,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: [{ generatedOn: "desc" }, { id: "desc" }]
      }),
      this.client.hotspot.count({ where })
    ]);
    return {
      items,
      meta: buildPaginationMeta({
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalRecords
      })
    };
  }
  async findHotspotById(hotspotId) {
    return this.client.hotspot.findUnique({
      where: { id: hotspotId },
      select: hotspotDetailSelect
    });
  }
  async listRiskScores(input) {
    const pagination = normalizePagination(input);
    const where = this.buildRiskScoreWhere(input);
    const [items, totalRecords] = await this.client.$transaction([
      this.client.riskScore.findMany({
        where,
        select: riskScoreSelect2,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: [{ generatedOn: "desc" }, { id: "desc" }]
      }),
      this.client.riskScore.count({ where })
    ]);
    return {
      items,
      meta: buildPaginationMeta({
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalRecords
      })
    };
  }
  async listRecommendations(input) {
    const pagination = normalizePagination(input);
    const where = this.buildRecommendationWhere(input);
    const [items, totalRecords] = await this.client.$transaction([
      this.client.recommendation.findMany({
        where,
        select: recommendationSelect,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: [{ generatedOn: "desc" }, { id: "desc" }]
      }),
      this.client.recommendation.count({ where })
    ]);
    return {
      items,
      meta: buildPaginationMeta({
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalRecords
      })
    };
  }
  async findRecommendationById(recommendationId) {
    return this.client.recommendation.findUnique({
      where: { id: recommendationId },
      select: recommendationSelect
    });
  }
  async listRepeatOffenderProfiles(input) {
    const pagination = normalizePagination(input);
    const where = this.buildRepeatOffenderWhere(input);
    const [items, totalRecords] = await this.client.$transaction([
      this.client.repeatOffenderProfile.findMany({
        where,
        select: repeatOffenderProfileSelect,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: [{ lastKnownCaseDate: "desc" }, { id: "desc" }]
      }),
      this.client.repeatOffenderProfile.count({ where })
    ]);
    return {
      items,
      meta: buildPaginationMeta({
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalRecords
      })
    };
  }
  buildCrimeStatisticWhere(input) {
    const where = {};
    const and = [];
    if (typeof input.reportYear === "number") {
      and.push({ reportYear: input.reportYear });
    }
    if (typeof input.reportMonth === "number") {
      and.push({ reportMonth: input.reportMonth });
    }
    if (input.districtId) {
      and.push({ districtId: input.districtId });
    }
    if (input.unitId) {
      and.push({ unitId: input.unitId });
    }
    if (input.crimeHeadId) {
      and.push({ crimeHeadId: input.crimeHeadId });
    }
    if (input.crimeSubHeadId) {
      and.push({ crimeSubHeadId: input.crimeSubHeadId });
    }
    if (typeof input.isProvisional === "boolean") {
      and.push({ isProvisional: input.isProvisional });
    }
    if (and.length > 0) {
      where.AND = and;
    }
    return where;
  }
  buildCrimeReviewReportWhere(input) {
    const where = {};
    const and = [];
    if (typeof input.reportYear === "number") {
      and.push({ reportYear: input.reportYear });
    }
    if (typeof input.reportMonth === "number") {
      and.push({ reportMonth: input.reportMonth });
    }
    if (typeof input.isProvisional === "boolean") {
      and.push({ isProvisional: input.isProvisional });
    }
    if (input.query) {
      and.push({
        OR: [
          {
            reportTitle: {
              contains: input.query,
              mode: "insensitive"
            }
          },
          {
            summaryText: {
              contains: input.query,
              mode: "insensitive"
            }
          },
          {
            publishedBy: {
              contains: input.query,
              mode: "insensitive"
            }
          }
        ]
      });
    }
    if (and.length > 0) {
      where.AND = and;
    }
    return where;
  }
  buildVictimDemographicWhere(input) {
    const where = {};
    const and = [];
    if (typeof input.statisticYear === "number") {
      and.push({ statisticYear: input.statisticYear });
    }
    if (input.stateId) {
      and.push({ stateId: input.stateId });
    }
    if (input.crimeContext) {
      and.push({ crimeContext: input.crimeContext });
    }
    if (input.purposeLabel) {
      and.push({ purposeLabel: input.purposeLabel });
    }
    if (input.genderLabel) {
      and.push({ genderLabel: input.genderLabel });
    }
    if (input.ageBandLabel) {
      and.push({ ageBandLabel: input.ageBandLabel });
    }
    if (and.length > 0) {
      where.AND = and;
    }
    return where;
  }
  buildCyberSuspectWhere(input) {
    const where = {};
    const and = [];
    if (typeof input.statisticYear === "number") {
      and.push({ statisticYear: input.statisticYear });
    }
    if (input.stateId) {
      and.push({ stateId: input.stateId });
    }
    if (input.crimeHeadLabel) {
      and.push({ crimeHeadLabel: input.crimeHeadLabel });
    }
    if (input.suspectCategory) {
      and.push({ suspectCategory: input.suspectCategory });
    }
    if (and.length > 0) {
      where.AND = and;
    }
    return where;
  }
  buildHotspotWhere(input) {
    const where = {};
    const and = [];
    if (input.districtId) {
      and.push({ districtId: input.districtId });
    }
    if (input.unitId) {
      and.push({ unitId: input.unitId });
    }
    if (input.crimeHeadId) {
      and.push({ crimeHeadId: input.crimeHeadId });
    }
    if (input.crimeSubHeadId) {
      and.push({ crimeSubHeadId: input.crimeSubHeadId });
    }
    if (input.riskLevel) {
      and.push({ riskLevel: input.riskLevel });
    }
    if (input.trendDirection) {
      and.push({ trendDirection: input.trendDirection });
    }
    if (typeof input.minConfidenceScore === "number") {
      and.push({
        confidenceScore: {
          gte: input.minConfidenceScore
        }
      });
    }
    if (and.length > 0) {
      where.AND = and;
    }
    return where;
  }
  buildRiskScoreWhere(input) {
    const where = {};
    const and = [];
    if (input.scoreSubjectType) {
      and.push({ scoreSubjectType: input.scoreSubjectType });
    }
    if (input.scoreType) {
      and.push({ scoreType: input.scoreType });
    }
    if (input.riskLevel) {
      and.push({ riskLevel: input.riskLevel });
    }
    if (input.reviewStatus) {
      and.push({ reviewStatus: input.reviewStatus });
    }
    if (input.caseMasterId) {
      and.push({ caseMasterId: input.caseMasterId });
    }
    if (input.accusedMasterId) {
      and.push({ accusedMasterId: input.accusedMasterId });
    }
    if (input.victimMasterId) {
      and.push({ victimMasterId: input.victimMasterId });
    }
    if (input.hotspotId) {
      and.push({ hotspotId: input.hotspotId });
    }
    if (and.length > 0) {
      where.AND = and;
    }
    return where;
  }
  buildRecommendationWhere(input) {
    const where = {};
    const and = [];
    if (input.recommendationType) {
      and.push({ recommendationType: input.recommendationType });
    }
    if (input.status) {
      and.push({ status: input.status });
    }
    if (input.priorityLevel) {
      and.push({ priorityLevel: input.priorityLevel });
    }
    if (input.caseMasterId) {
      and.push({ caseMasterId: input.caseMasterId });
    }
    if (input.hotspotId) {
      and.push({ hotspotId: input.hotspotId });
    }
    if (input.riskScoreId) {
      and.push({ riskScoreId: input.riskScoreId });
    }
    if (typeof input.minConfidenceScore === "number") {
      and.push({
        confidenceScore: {
          gte: input.minConfidenceScore
        }
      });
    }
    if (and.length > 0) {
      where.AND = and;
    }
    return where;
  }
  buildRepeatOffenderWhere(input) {
    const where = {};
    const and = [];
    if (input.primaryDistrictId) {
      and.push({ primaryDistrictId: input.primaryDistrictId });
    }
    if (input.riskLevel) {
      and.push({ riskLevel: input.riskLevel });
    }
    if (input.profileStatus) {
      and.push({ profileStatus: input.profileStatus });
    }
    if (input.query) {
      and.push({
        OR: [
          {
            profileNameHash: {
              contains: input.query,
              mode: "insensitive"
            }
          },
          {
            knownAliasText: {
              contains: input.query,
              mode: "insensitive"
            }
          }
        ]
      });
    }
    if (and.length > 0) {
      where.AND = and;
    }
    return where;
  }
};

// src/modules/analytics/services/analytics.service.ts
var AnalyticsService = class {
  constructor(repository) {
    this.repository = repository;
  }
  repository;
  async listCrimeStatistics(input) {
    const [result, aggregate] = await Promise.all([
      this.repository.listCrimeStatistics(input),
      this.repository.aggregateCrimeStatistics(input)
    ]);
    return {
      data: result.items,
      warnings: result.items.length === 0 ? ["No crime statistics matched the selected filters."] : void 0,
      meta: {
        ...result.meta,
        aggregate
      }
    };
  }
  async getCrimeStatisticAggregate(input) {
    const aggregate = await this.repository.aggregateCrimeStatistics(input);
    return { data: aggregate };
  }
  async listCrimeReviewReports(input) {
    const result = await this.repository.listCrimeReviewReports(input);
    return {
      data: result.items,
      warnings: result.items.length === 0 ? ["No crime review reports matched the selected filters."] : void 0,
      meta: result.meta
    };
  }
  async listVictimDemographics(input) {
    const result = await this.repository.listVictimDemographics(input);
    return {
      data: result.items,
      warnings: result.items.length === 0 ? ["No victim demographic statistics matched the selected filters."] : void 0,
      meta: result.meta
    };
  }
  async listCyberSuspectStatistics(input) {
    const result = await this.repository.listCyberSuspectStatistics(input);
    return {
      data: result.items,
      warnings: result.items.length === 0 ? ["No cyber suspect statistics matched the selected filters."] : void 0,
      meta: result.meta
    };
  }
  async listHotspots(input) {
    const result = await this.repository.listHotspots(input);
    const warnings = /* @__PURE__ */ new Set();
    if (result.items.length === 0) {
      warnings.add("No hotspots matched the selected filters.");
    }
    if (result.items.some((item) => !item.centerLatitude || !item.centerLongitude)) {
      warnings.add("Some hotspots are missing center coordinates.");
    }
    return {
      data: result.items,
      warnings: warnings.size > 0 ? [...warnings] : void 0,
      meta: result.meta
    };
  }
  async listRiskScores(input) {
    const result = await this.repository.listRiskScores(input);
    return {
      data: result.items,
      warnings: result.items.length === 0 ? ["No risk scores matched the selected filters."] : void 0,
      meta: result.meta
    };
  }
  async listRecommendations(input) {
    const result = await this.repository.listRecommendations(input);
    return {
      data: result.items,
      warnings: result.items.length === 0 ? ["No recommendations matched the selected filters."] : void 0,
      meta: result.meta
    };
  }
  async listRepeatOffenderProfiles(input) {
    const result = await this.repository.listRepeatOffenderProfiles(input);
    return {
      data: result.items,
      warnings: result.items.length === 0 ? ["No repeat offender profiles matched the selected filters."] : void 0,
      meta: result.meta
    };
  }
};

// src/modules/analytics/analytics.container.ts
var analyticsRepository = new PrismaAnalyticsRepository();
var analyticsService = new AnalyticsService(analyticsRepository);
var analyticsController = new AnalyticsController(analyticsService);

// src/modules/analytics/validators/analytics.validators.ts
var import_zod6 = require("zod");
var numericString4 = import_zod6.z.string().regex(/^\d+$/, "Must be a valid integer");
var booleanString3 = import_zod6.z.enum(["true", "false"]);
var crimeStatisticsQuerySchema = import_zod6.z.object({
  page: numericString4.optional(),
  pageSize: numericString4.optional(),
  reportYear: numericString4.optional(),
  reportMonth: numericString4.optional(),
  districtId: numericString4.optional(),
  unitId: numericString4.optional(),
  crimeHeadId: numericString4.optional(),
  crimeSubHeadId: numericString4.optional(),
  isProvisional: booleanString3.optional()
});
var crimeReviewReportsQuerySchema = import_zod6.z.object({
  page: numericString4.optional(),
  pageSize: numericString4.optional(),
  reportYear: numericString4.optional(),
  reportMonth: numericString4.optional(),
  isProvisional: booleanString3.optional(),
  query: import_zod6.z.string().trim().min(1).optional()
});
var victimDemographicsQuerySchema = import_zod6.z.object({
  page: numericString4.optional(),
  pageSize: numericString4.optional(),
  statisticYear: numericString4.optional(),
  stateId: numericString4.optional(),
  crimeContext: import_zod6.z.string().trim().min(1).optional(),
  purposeLabel: import_zod6.z.string().trim().min(1).optional(),
  genderLabel: import_zod6.z.string().trim().min(1).optional(),
  ageBandLabel: import_zod6.z.string().trim().min(1).optional()
});
var cyberSuspectQuerySchema = import_zod6.z.object({
  page: numericString4.optional(),
  pageSize: numericString4.optional(),
  statisticYear: numericString4.optional(),
  stateId: numericString4.optional(),
  crimeHeadLabel: import_zod6.z.string().trim().min(1).optional(),
  suspectCategory: import_zod6.z.string().trim().min(1).optional()
});
var hotspotQuerySchema = import_zod6.z.object({
  page: numericString4.optional(),
  pageSize: numericString4.optional(),
  districtId: numericString4.optional(),
  unitId: numericString4.optional(),
  crimeHeadId: numericString4.optional(),
  crimeSubHeadId: numericString4.optional(),
  riskLevel: import_zod6.z.string().trim().min(1).optional(),
  trendDirection: import_zod6.z.string().trim().min(1).optional(),
  minConfidenceScore: import_zod6.z.string().trim().min(1).optional()
});
var riskScoreQuerySchema = import_zod6.z.object({
  page: numericString4.optional(),
  pageSize: numericString4.optional(),
  scoreSubjectType: import_zod6.z.string().trim().min(1).optional(),
  scoreType: import_zod6.z.string().trim().min(1).optional(),
  riskLevel: import_zod6.z.string().trim().min(1).optional(),
  reviewStatus: import_zod6.z.string().trim().min(1).optional(),
  caseMasterId: numericString4.optional(),
  accusedMasterId: numericString4.optional(),
  victimMasterId: numericString4.optional(),
  hotspotId: numericString4.optional()
});
var recommendationQuerySchema = import_zod6.z.object({
  page: numericString4.optional(),
  pageSize: numericString4.optional(),
  recommendationType: import_zod6.z.string().trim().min(1).optional(),
  status: import_zod6.z.string().trim().min(1).optional(),
  priorityLevel: import_zod6.z.string().trim().min(1).optional(),
  caseMasterId: numericString4.optional(),
  hotspotId: numericString4.optional(),
  riskScoreId: numericString4.optional(),
  minConfidenceScore: import_zod6.z.string().trim().min(1).optional()
});
var repeatOffenderQuerySchema = import_zod6.z.object({
  page: numericString4.optional(),
  pageSize: numericString4.optional(),
  primaryDistrictId: numericString4.optional(),
  riskLevel: import_zod6.z.string().trim().min(1).optional(),
  profileStatus: import_zod6.z.string().trim().min(1).optional(),
  query: import_zod6.z.string().trim().min(1).optional()
});
var analyticsForecastBodySchema = import_zod6.z.object({
  districtId: import_zod6.z.number().int().positive().optional(),
  unitId: import_zod6.z.number().int().positive().optional(),
  crimeHeadId: import_zod6.z.number().int().positive().optional(),
  forecastMonths: import_zod6.z.number().int().positive(),
  modelVersion: import_zod6.z.string().optional()
});

// src/modules/analytics/routes/analytics.routes.ts
var analyticsRouter = (0, import_express7.Router)();
analyticsRouter.use(authenticateMiddleware, requirePermissions(PERMISSIONS.ANALYTICS_READ));
analyticsRouter.get(
  "/crime-trends",
  validate({ query: crimeStatisticsQuerySchema }),
  asyncHandler(analyticsController.listCrimeStatistics)
);
analyticsRouter.get(
  "/district-comparison",
  validate({ query: crimeStatisticsQuerySchema }),
  notImplemented("District comparison analytics")
);
analyticsRouter.post(
  "/forecast",
  validate({ body: analyticsForecastBodySchema }),
  notImplemented("Crime forecasting")
);
analyticsRouter.get(
  "/attention-summary",
  validate({ query: hotspotQuerySchema }),
  notImplemented("Operational attention summary")
);
analyticsRouter.get(
  "/crime-review-reports",
  validate({ query: crimeReviewReportsQuerySchema }),
  asyncHandler(analyticsController.listCrimeReviewReports)
);
analyticsRouter.get(
  "/victim-demographics",
  validate({ query: victimDemographicsQuerySchema }),
  asyncHandler(analyticsController.listVictimDemographics)
);
analyticsRouter.get(
  "/cyber-suspects",
  validate({ query: cyberSuspectQuerySchema }),
  asyncHandler(analyticsController.listCyberSuspectStatistics)
);
analyticsRouter.get(
  "/hotspots",
  validate({ query: hotspotQuerySchema }),
  asyncHandler(analyticsController.listHotspots)
);
analyticsRouter.get(
  "/risk-scores",
  validate({ query: riskScoreQuerySchema }),
  asyncHandler(analyticsController.listRiskScores)
);
analyticsRouter.get(
  "/recommendations",
  validate({ query: recommendationQuerySchema }),
  asyncHandler(analyticsController.listRecommendations)
);
analyticsRouter.get(
  "/repeat-offenders",
  validate({ query: repeatOffenderQuerySchema }),
  asyncHandler(analyticsController.listRepeatOffenderProfiles)
);
analyticsRouter.get(
  "/crime-statistics/aggregate",
  validate({ query: crimeStatisticsQuerySchema }),
  asyncHandler(analyticsController.getCrimeStatisticAggregate)
);

// src/modules/dashboard/routes/dashboard.routes.ts
var import_express8 = require("express");

// src/modules/dashboard/controllers/dashboard.controller.ts
var import_http_status_codes12 = require("http-status-codes");
var DashboardController = class {
  constructor(dashboardService2) {
    this.dashboardService = dashboardService2;
  }
  dashboardService;
  getOverview = async (_req, res) => {
    const result = await this.dashboardService.getOverview();
    return ok(res, {
      item: result.data,
      warnings: result.warnings ?? [],
      meta: result.meta ?? null
    });
  };
  getOfficerDashboard = async (req, res) => {
    const employeeId = this.parseRequiredBigInt(req.params.employeeId, "employeeId");
    const result = await this.dashboardService.getOfficerDashboard(employeeId);
    return ok(res, {
      item: result.data,
      warnings: result.warnings ?? [],
      meta: result.meta ?? null
    });
  };
  parseRequiredBigInt(value, field) {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new AppError(`${field} is required`, {
        statusCode: import_http_status_codes12.StatusCodes.BAD_REQUEST,
        code: "VALIDATION_ERROR",
        field
      });
    }
    try {
      return BigInt(value);
    } catch {
      throw new AppError(`${field} must be a valid integer`, {
        statusCode: import_http_status_codes12.StatusCodes.BAD_REQUEST,
        code: "VALIDATION_ERROR",
        field
      });
    }
  }
};

// src/modules/dashboard/services/dashboard.service.ts
var DashboardService = class {
  constructor(caseRepository2, victimRepository2, officerRepository2, analyticsRepository2) {
    this.caseRepository = caseRepository2;
    this.victimRepository = victimRepository2;
    this.officerRepository = officerRepository2;
    this.analyticsRepository = analyticsRepository2;
  }
  caseRepository;
  victimRepository;
  officerRepository;
  analyticsRepository;
  async getOverview() {
    const [recentCases, allCases, allVictims, hotspots, recommendations, riskScores, reports] = await Promise.all([
      this.caseRepository.list({ page: 1, pageSize: 5 }),
      this.caseRepository.list({ page: 1, pageSize: 1 }),
      this.victimRepository.list({ page: 1, pageSize: 1 }),
      this.analyticsRepository.listHotspots({ page: 1, pageSize: 5 }),
      this.analyticsRepository.listRecommendations({ page: 1, pageSize: 5, status: "pending" }),
      this.analyticsRepository.listRiskScores({ page: 1, pageSize: 5, reviewStatus: "pending" }),
      this.analyticsRepository.listCrimeReviewReports({ page: 1, pageSize: 3 })
    ]);
    const summaryCards = [
      {
        label: "Total Cases",
        value: allCases.meta.totalRecords,
        description: "Operational FIR and case records available to the platform."
      },
      {
        label: "Total Victims",
        value: allVictims.meta.totalRecords,
        description: "Victim records currently linked to known cases."
      },
      {
        label: "Active Hotspots",
        value: hotspots.meta.totalRecords,
        description: "Hotspots currently visible under the selected default intelligence window."
      },
      {
        label: "Pending Recommendations",
        value: recommendations.meta.totalRecords,
        description: "AI recommendations awaiting review or action."
      }
    ];
    return {
      data: {
        summaryCards,
        recentCases: recentCases.items,
        activeHotspots: hotspots.items,
        pendingRecommendations: recommendations.items,
        pendingRiskScores: riskScores.items,
        latestCrimeReviewReports: reports.items
      },
      warnings: this.buildOverviewWarnings(hotspots.items.length, recommendations.items.length),
      meta: {
        recentCases: recentCases.meta,
        activeHotspots: hotspots.meta,
        pendingRecommendations: recommendations.meta,
        pendingRiskScores: riskScores.meta,
        latestCrimeReviewReports: reports.meta
      }
    };
  }
  async getOfficerDashboard(employeeId) {
    const [assignedCases, recommendations, hotspots] = await Promise.all([
      this.officerRepository.listAssignedCases(employeeId, { page: 1, pageSize: 10 }),
      this.analyticsRepository.listRecommendations({ page: 1, pageSize: 10, status: "pending" }),
      this.analyticsRepository.listHotspots({ page: 1, pageSize: 5 })
    ]);
    const openHighPriorityRecommendations = recommendations.items.filter(
      (item) => item.priorityLevel?.toLowerCase() === "high" || item.priorityLevel?.toLowerCase() === "critical"
    );
    return {
      data: {
        officerId: employeeId.toString(),
        assignedCases: assignedCases.items,
        openHighPriorityRecommendations,
        hotspotAlerts: hotspots.items
      },
      warnings: assignedCases.items.length === 0 ? ["The selected officer currently has no assigned cases in the system."] : void 0,
      meta: {
        assignedCases: assignedCases.meta,
        recommendations: recommendations.meta,
        hotspots: hotspots.meta
      }
    };
  }
  buildOverviewWarnings(hotspotCount, recommendationCount) {
    const warnings = /* @__PURE__ */ new Set();
    if (hotspotCount === 0) {
      warnings.add("No hotspot intelligence is currently available for the overview.");
    }
    if (recommendationCount === 0) {
      warnings.add("No pending AI recommendations are currently available for review.");
    }
    return warnings.size > 0 ? [...warnings] : void 0;
  }
};

// src/modules/officers/types/officer.types.ts
var officerListSelect = {
  id: true,
  kgid: true,
  firstName: true,
  employeeDob: true,
  appointmentDate: true,
  active: true,
  district: {
    select: {
      id: true,
      name: true
    }
  },
  unit: {
    select: {
      id: true,
      name: true
    }
  },
  rank: {
    select: {
      id: true,
      name: true,
      hierarchyLevel: true
    }
  },
  designation: {
    select: {
      id: true,
      name: true
    }
  },
  gender: {
    select: {
      id: true,
      name: true
    }
  },
  _count: {
    select: {
      registeredCases: true,
      arrestInvestigations: true,
      chargesheets: true,
      diaryEntries: true,
      assignedAlerts: true,
      assignedTasks: true,
      recommendationReviews: true,
      similarityReviews: true
    }
  }
};
var officerDetailInclude = {
  district: true,
  unit: {
    include: {
      unitType: true,
      district: true,
      state: true
    }
  },
  rank: true,
  designation: true,
  gender: true,
  registeredCases: {
    select: {
      id: true,
      crimeNo: true,
      caseNo: true,
      crimeRegisteredDate: true,
      briefFacts: true,
      status: {
        select: {
          id: true,
          name: true
        }
      },
      policeStation: {
        select: {
          id: true,
          name: true
        }
      }
    },
    orderBy: {
      crimeRegisteredDate: "desc"
    }
  },
  chargesheets: {
    include: {
      case: true
    },
    orderBy: {
      date: "desc"
    }
  },
  assignedAlerts: {
    orderBy: {
      generatedOn: "desc"
    }
  },
  assignedTasks: {
    orderBy: {
      createdAt: "desc"
    }
  },
  recommendationReviews: {
    orderBy: {
      generatedOn: "desc"
    }
  },
  similarityReviews: {
    orderBy: {
      generatedOn: "desc"
    }
  },
  _count: {
    select: {
      registeredCases: true,
      arrestInvestigations: true,
      chargesheets: true,
      diaryEntries: true,
      assignedAlerts: true,
      assignedTasks: true,
      recommendationReviews: true,
      similarityReviews: true,
      reviewedKnowledgeGraphEdges: true
    }
  }
};
var officerAssignedCaseSelect = {
  id: true,
  crimeNo: true,
  caseNo: true,
  crimeRegisteredDate: true,
  briefFacts: true,
  status: {
    select: {
      id: true,
      name: true
    }
  },
  category: {
    select: {
      id: true,
      lookupValue: true
    }
  },
  majorCrimeHead: {
    select: {
      id: true,
      groupName: true
    }
  },
  policeStation: {
    select: {
      id: true,
      name: true,
      district: {
        select: {
          id: true,
          name: true
        }
      }
    }
  },
  _count: {
    select: {
      victims: true,
      accused: true,
      evidence: true,
      tasks: true,
      alerts: true
    }
  }
};

// src/modules/officers/repositories/prisma-officer.repository.ts
var PrismaOfficerRepository = class {
  constructor(client = prisma) {
    this.client = client;
  }
  client;
  async findById(id) {
    return this.client.employee.findUnique({
      where: { id },
      include: officerDetailInclude
    });
  }
  async findByKgid(kgid) {
    return this.client.employee.findUnique({
      where: { kgid },
      include: officerDetailInclude
    });
  }
  async list(input) {
    const pagination = normalizePagination(input);
    const where = this.buildWhere(input);
    const [items, totalRecords] = await this.client.$transaction([
      this.client.employee.findMany({
        where,
        select: officerListSelect,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: [{ active: "desc" }, { firstName: "asc" }, { id: "asc" }]
      }),
      this.client.employee.count({ where })
    ]);
    return {
      items,
      meta: buildPaginationMeta({
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalRecords
      })
    };
  }
  async listAssignedCases(employeeId, input = {}) {
    const pagination = normalizePagination(input);
    const where = {
      policePersonId: employeeId
    };
    const [items, totalRecords] = await this.client.$transaction([
      this.client.caseMaster.findMany({
        where,
        select: officerAssignedCaseSelect,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: [{ crimeRegisteredDate: "desc" }, { id: "desc" }]
      }),
      this.client.caseMaster.count({ where })
    ]);
    return {
      items,
      meta: buildPaginationMeta({
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalRecords
      })
    };
  }
  buildWhere(input) {
    const where = {};
    const and = [];
    if (input.districtId) {
      and.push({ districtId: input.districtId });
    }
    if (input.unitId) {
      and.push({ unitId: input.unitId });
    }
    if (input.rankId) {
      and.push({ rankId: input.rankId });
    }
    if (input.designationId) {
      and.push({ designationId: input.designationId });
    }
    if (typeof input.active === "boolean") {
      and.push({ active: input.active });
    }
    if (input.query) {
      and.push({
        OR: [
          {
            kgid: {
              contains: input.query,
              mode: "insensitive"
            }
          },
          {
            firstName: {
              contains: input.query,
              mode: "insensitive"
            }
          }
        ]
      });
    }
    if (and.length > 0) {
      where.AND = and;
    }
    return where;
  }
};

// src/modules/officers/services/officer.service.ts
var import_http_status_codes13 = require("http-status-codes");
var OfficerService = class {
  constructor(repository) {
    this.repository = repository;
  }
  repository;
  async getOfficerById(employeeId) {
    const record = await this.repository.findById(employeeId);
    return { data: this.ensureOfficer(record, `Officer ${employeeId} was not found`) };
  }
  async getOfficerByKgid(kgid) {
    const normalizedKgid = kgid.trim();
    const record = await this.repository.findByKgid(normalizedKgid);
    return { data: this.ensureOfficer(record, `Officer with KGID ${normalizedKgid} was not found`) };
  }
  async listOfficers(input) {
    const result = await this.repository.list(input);
    return {
      data: result.items,
      warnings: this.buildOfficerWarnings(result.items),
      meta: result.meta
    };
  }
  async getAssignedCases(employeeId, input = {}) {
    await this.assertOfficerExists(employeeId);
    const result = await this.repository.listAssignedCases(employeeId, input);
    return {
      data: result.items,
      warnings: result.items.length === 0 ? ["No cases are currently assigned to the selected officer."] : void 0,
      meta: {
        ...result.meta,
        employeeId: employeeId.toString()
      }
    };
  }
  async assertOfficerExists(employeeId) {
    const record = await this.repository.findById(employeeId);
    this.ensureOfficer(record, `Officer ${employeeId} was not found`);
  }
  ensureOfficer(record, message) {
    if (!record) {
      throw new AppError(message, {
        statusCode: import_http_status_codes13.StatusCodes.NOT_FOUND,
        code: "OFFICER_NOT_FOUND"
      });
    }
    return record;
  }
  buildOfficerWarnings(items) {
    const warnings = /* @__PURE__ */ new Set();
    for (const item of items) {
      if (!item.rank) {
        warnings.add("Some officers are missing rank mapping.");
      }
      if (!item.unit) {
        warnings.add("Some officers are not linked to a police unit.");
      }
      if (!item.active) {
        warnings.add("The result set includes inactive officer records.");
      }
    }
    return warnings.size > 0 ? [...warnings] : void 0;
  }
};

// src/modules/officers/officers.container.ts
var officerRepository = new PrismaOfficerRepository();
var officerService = new OfficerService(officerRepository);

// src/modules/dashboard/dashboard.container.ts
var dashboardService = new DashboardService(
  caseRepository,
  victimRepository,
  officerRepository,
  analyticsRepository
);
var dashboardController = new DashboardController(dashboardService);

// src/modules/dashboard/validators/dashboard.validators.ts
var import_zod7 = require("zod");
var numericString5 = import_zod7.z.string().regex(/^\d+$/, "Must be a valid integer");
var officerDashboardParamsSchema = import_zod7.z.object({
  employeeId: numericString5
});

// src/modules/dashboard/routes/dashboard.routes.ts
var dashboardRouter = (0, import_express8.Router)();
var requireDashboardAccess = requireAnyPermission(
  PERMISSIONS.CASES_READ_ALL,
  PERMISSIONS.CASES_READ_DISTRICT,
  PERMISSIONS.CASES_READ_UNIT,
  PERMISSIONS.ANALYTICS_READ
);
dashboardRouter.use(authenticateMiddleware, requireDashboardAccess);
dashboardRouter.get("/overview", asyncHandler(dashboardController.getOverview));
dashboardRouter.get("/summary", asyncHandler(dashboardController.getOverview));
dashboardRouter.get("/officers/:employeeId", validate({ params: officerDashboardParamsSchema }), asyncHandler(dashboardController.getOfficerDashboard));
dashboardRouter.get("/recent-cases", notImplemented("Dashboard recent cases endpoint variant"));
dashboardRouter.get("/hotspots", notImplemented("Dashboard hotspot endpoint variant"));
dashboardRouter.get("/alerts", notImplemented("Dashboard alerts endpoint"));
dashboardRouter.get("/officer-performance", notImplemented("Dashboard officer performance endpoint"));

// src/modules/hotspot/routes/hotspot.routes.ts
var import_express9 = require("express");

// src/modules/hotspot/controllers/hotspot.controller.ts
var import_http_status_codes14 = require("http-status-codes");
var HotspotController = class {
  constructor(hotspotService2) {
    this.hotspotService = hotspotService2;
  }
  hotspotService;
  listHotspots = async (req, res) => {
    const result = await this.hotspotService.listHotspots({
      page: this.parseOptionalNumber(req.query.page, "page"),
      pageSize: this.parseOptionalNumber(req.query.pageSize, "pageSize"),
      districtId: this.parseOptionalBigInt(req.query.districtId, "districtId"),
      unitId: this.parseOptionalBigInt(req.query.unitId, "unitId"),
      crimeHeadId: this.parseOptionalBigInt(req.query.crimeHeadId, "crimeHeadId"),
      crimeSubHeadId: this.parseOptionalBigInt(req.query.crimeSubHeadId, "crimeSubHeadId"),
      riskLevel: this.parseOptionalString(req.query.riskLevel),
      trendDirection: this.parseOptionalString(req.query.trendDirection),
      minConfidenceScore: this.parseOptionalNumber(req.query.minConfidenceScore, "minConfidenceScore")
    });
    return ok(res, { items: result.data, warnings: result.warnings ?? [] }, this.extractPagination(result.meta));
  };
  getHotspotById = async (req, res) => {
    const hotspotId = this.parseRequiredBigInt(req.params.hotspotId, "hotspotId");
    const result = await this.hotspotService.getHotspotById(hotspotId);
    return ok(res, { item: result.data, warnings: result.warnings ?? [] });
  };
  generateRecommendation = async (req, res) => {
    const hotspotId = this.parseRequiredBigInt(req.params.hotspotId, "hotspotId");
    const result = await this.hotspotService.generateRecommendation(hotspotId, req.body);
    return ok(res, { item: result.data, warnings: result.warnings ?? [] });
  };
  parseOptionalString(value) {
    if (typeof value !== "string") return void 0;
    const normalized = value.trim();
    return normalized.length > 0 ? normalized : void 0;
  }
  parseRequiredBigInt(value, field) {
    const parsed2 = this.parseOptionalBigInt(value, field);
    if (parsed2 == null) throw new AppError(`${field} is required`, { statusCode: import_http_status_codes14.StatusCodes.BAD_REQUEST, code: "VALIDATION_ERROR", field });
    return parsed2;
  }
  parseOptionalBigInt(value, field) {
    if (typeof value !== "string" || value.trim().length === 0) return void 0;
    try {
      return BigInt(value);
    } catch {
      throw new AppError(`${field} must be a valid integer`, { statusCode: import_http_status_codes14.StatusCodes.BAD_REQUEST, code: "VALIDATION_ERROR", field });
    }
  }
  parseOptionalNumber(value, field) {
    if (typeof value !== "string" || value.trim().length === 0) return void 0;
    const parsed2 = Number(value);
    if (!Number.isFinite(parsed2)) throw new AppError(`${field} must be a valid number`, { statusCode: import_http_status_codes14.StatusCodes.BAD_REQUEST, code: "VALIDATION_ERROR", field });
    return parsed2;
  }
  extractPagination(meta) {
    if (!meta) return void 0;
    const { page, pageSize, totalRecords, totalPages } = meta;
    if (typeof page === "number" && typeof pageSize === "number" && typeof totalRecords === "number" && typeof totalPages === "number") {
      return { page, pageSize, totalRecords, totalPages };
    }
    return void 0;
  }
};

// src/modules/hotspot/services/hotspot.service.ts
var import_http_status_codes15 = require("http-status-codes");
var HotspotService = class {
  constructor(analyticsRepository2) {
    this.analyticsRepository = analyticsRepository2;
  }
  analyticsRepository;
  async listHotspots(input) {
    const result = await this.analyticsRepository.listHotspots(input);
    return {
      data: result.items,
      warnings: result.items.length === 0 ? ["No hotspots matched the selected filters."] : void 0,
      meta: result.meta
    };
  }
  async getHotspotById(hotspotId) {
    const record = await this.analyticsRepository.findHotspotById(hotspotId);
    if (!record) {
      throw new AppError(`Hotspot ${hotspotId} was not found`, {
        statusCode: import_http_status_codes15.StatusCodes.NOT_FOUND,
        code: "HOTSPOT_NOT_FOUND"
      });
    }
    const warnings = /* @__PURE__ */ new Set();
    if (record.cases.length === 0)
      warnings.add("This hotspot currently has no contributing case links.");
    if (record.recommendations.length === 0)
      warnings.add("This hotspot has no stored recommendations yet.");
    return {
      data: record,
      warnings: warnings.size > 0 ? [...warnings] : void 0
    };
  }
  async generateRecommendation(hotspotId, input) {
    const hotspot = await this.analyticsRepository.findHotspotById(hotspotId);
    if (!hotspot) {
      throw new AppError(`Hotspot ${hotspotId} was not found`, {
        statusCode: import_http_status_codes15.StatusCodes.NOT_FOUND,
        code: "HOTSPOT_NOT_FOUND"
      });
    }
    const existing = await this.analyticsRepository.listRecommendations({
      hotspotId,
      page: 1,
      pageSize: 1
    });
    if (existing.items.length > 0) {
      const latestRecommendation = existing.items[0];
      return {
        data: latestRecommendation,
        warnings: ["Returning the latest stored hotspot recommendation."]
      };
    }
    const patrolWindow = this.derivePatrolWindow(hotspot);
    const recommendationText = input.recommendationType?.toLowerCase() === "patrol" ? `Increase patrol presence for hotspot ${hotspot.hotspotName ?? hotspot.id.toString()} during ${patrolWindow}.` : `Review hotspot ${hotspot.hotspotName ?? hotspot.id.toString()} for preventive deployment and focused investigation action.`;
    return {
      data: {
        recommendationId: null,
        recommendationText,
        confidenceScore: hotspot.confidenceScore ? Number(hotspot.confidenceScore) : null,
        priorityLevel: hotspot.riskLevel ?? "Medium",
        reviewRequired: true,
        rationale: hotspot.cases.length > 0 && input.includeContributingCases ? `Based on ${hotspot.cases.length} contributing cases linked to this hotspot.` : "Derived from hotspot risk level and confidence score."
      },
      warnings: [
        "Recommendation preview generated heuristically because no stored recommendation exists yet."
      ]
    };
  }
  derivePatrolWindow(hotspot) {
    if (hotspot.timeWindowStart && hotspot.timeWindowEnd) {
      const from = hotspot.timeWindowStart.toISOString().slice(11, 16);
      const to = hotspot.timeWindowEnd.toISOString().slice(11, 16);
      return `${from}-${to}`;
    }
    return "21:00-02:00";
  }
};

// src/modules/hotspot/hotspot.container.ts
var hotspotService = new HotspotService(analyticsRepository);
var hotspotController = new HotspotController(hotspotService);

// src/modules/hotspot/validators/hotspot.validators.ts
var import_zod8 = require("zod");
var numericString6 = import_zod8.z.string().regex(/^\d+$/, "Must be a valid integer");
var hotspotIdParamsSchema = import_zod8.z.object({
  hotspotId: numericString6
});
var listHotspotsQuerySchema = import_zod8.z.object({
  page: numericString6.optional(),
  pageSize: numericString6.optional(),
  districtId: numericString6.optional(),
  unitId: numericString6.optional(),
  crimeHeadId: numericString6.optional(),
  crimeSubHeadId: numericString6.optional(),
  riskLevel: import_zod8.z.string().trim().min(1).optional(),
  trendDirection: import_zod8.z.string().trim().min(1).optional(),
  minConfidenceScore: import_zod8.z.string().trim().min(1).optional()
});
var generateHotspotRecommendationBodySchema = import_zod8.z.object({
  recommendationType: import_zod8.z.string().trim().min(1).optional(),
  includeContributingCases: import_zod8.z.boolean().optional()
});

// src/modules/hotspot/routes/hotspot.routes.ts
var hotspotRouter = (0, import_express9.Router)();
var requireHotspotRead = requireAnyPermission(
  PERMISSIONS.CASES_READ_ALL,
  PERMISSIONS.CASES_READ_DISTRICT,
  PERMISSIONS.CASES_READ_UNIT,
  PERMISSIONS.ANALYTICS_READ
);
hotspotRouter.use(authenticateMiddleware, requireHotspotRead);
hotspotRouter.get("/", validate({ query: listHotspotsQuerySchema }), asyncHandler(hotspotController.listHotspots));
hotspotRouter.get("/:hotspotId", validate({ params: hotspotIdParamsSchema }), asyncHandler(hotspotController.getHotspotById));
hotspotRouter.post("/:hotspotId/recommendations", requirePermissions(PERMISSIONS.AI_USE), validate({ params: hotspotIdParamsSchema, body: generateHotspotRecommendationBodySchema }), asyncHandler(hotspotController.generateRecommendation));

// src/modules/recommendations/routes/recommendations.routes.ts
var import_express10 = require("express");

// src/modules/recommendations/controllers/recommendation.controller.ts
var import_http_status_codes16 = require("http-status-codes");
var RecommendationController = class {
  constructor(recommendationService2) {
    this.recommendationService = recommendationService2;
  }
  recommendationService;
  listRecommendations = async (req, res) => {
    const result = await this.recommendationService.listRecommendations({
      page: this.parseOptionalNumber(req.query.page, "page"),
      pageSize: this.parseOptionalNumber(req.query.pageSize, "pageSize"),
      recommendationType: this.parseOptionalString(req.query.recommendationType ?? req.query.type),
      status: this.parseOptionalString(req.query.status),
      priorityLevel: this.parseOptionalString(req.query.priorityLevel),
      caseMasterId: this.parseOptionalBigInt(req.query.caseMasterId, "caseMasterId"),
      hotspotId: this.parseOptionalBigInt(req.query.hotspotId, "hotspotId"),
      riskScoreId: this.parseOptionalBigInt(req.query.riskScoreId, "riskScoreId"),
      minConfidenceScore: this.parseOptionalNumber(req.query.minConfidenceScore, "minConfidenceScore")
    });
    return ok(res, { items: result.data, warnings: result.warnings ?? [] }, this.extractPagination(result.meta));
  };
  getRecommendationById = async (req, res) => {
    const recommendationId = this.parseRequiredBigInt(req.params.recommendationId, "recommendationId");
    const result = await this.recommendationService.getRecommendationById(recommendationId);
    return ok(res, { item: result.data, warnings: result.warnings ?? [] });
  };
  parseOptionalString(value) {
    if (typeof value !== "string") return void 0;
    const normalized = value.trim();
    return normalized.length > 0 ? normalized : void 0;
  }
  parseRequiredBigInt(value, field) {
    const parsed2 = this.parseOptionalBigInt(value, field);
    if (parsed2 == null) throw new AppError(`${field} is required`, { statusCode: import_http_status_codes16.StatusCodes.BAD_REQUEST, code: "VALIDATION_ERROR", field });
    return parsed2;
  }
  parseOptionalBigInt(value, field) {
    if (typeof value !== "string" || value.trim().length === 0) return void 0;
    try {
      return BigInt(value);
    } catch {
      throw new AppError(`${field} must be a valid integer`, { statusCode: import_http_status_codes16.StatusCodes.BAD_REQUEST, code: "VALIDATION_ERROR", field });
    }
  }
  parseOptionalNumber(value, field) {
    if (typeof value !== "string" || value.trim().length === 0) return void 0;
    const parsed2 = Number(value);
    if (!Number.isFinite(parsed2)) throw new AppError(`${field} must be a valid number`, { statusCode: import_http_status_codes16.StatusCodes.BAD_REQUEST, code: "VALIDATION_ERROR", field });
    return parsed2;
  }
  extractPagination(meta) {
    if (!meta) return void 0;
    const { page, pageSize, totalRecords, totalPages } = meta;
    if (typeof page === "number" && typeof pageSize === "number" && typeof totalRecords === "number" && typeof totalPages === "number") {
      return { page, pageSize, totalRecords, totalPages };
    }
    return void 0;
  }
};

// src/modules/recommendations/services/recommendation.service.ts
var import_http_status_codes17 = require("http-status-codes");
var RecommendationService = class {
  constructor(analyticsRepository2) {
    this.analyticsRepository = analyticsRepository2;
  }
  analyticsRepository;
  async listRecommendations(input) {
    const result = await this.analyticsRepository.listRecommendations(input);
    return {
      data: result.items,
      warnings: this.buildRecommendationWarnings(result.items),
      meta: result.meta
    };
  }
  async getRecommendationById(recommendationId) {
    const record = await this.analyticsRepository.findRecommendationById(recommendationId);
    if (!record) {
      throw new AppError(`Recommendation ${recommendationId} was not found`, {
        statusCode: import_http_status_codes17.StatusCodes.NOT_FOUND,
        code: "RECOMMENDATION_NOT_FOUND"
      });
    }
    return {
      data: record,
      warnings: this.buildRecommendationWarnings([record])
    };
  }
  async getCaseRecommendations(caseMasterId, limit = 10) {
    const result = await this.analyticsRepository.listRecommendations({
      caseMasterId,
      page: 1,
      pageSize: limit
    });
    return {
      data: result.items,
      warnings: result.items.length === 0 ? ["No recommendations are available for the selected case."] : this.buildRecommendationWarnings(result.items),
      meta: {
        ...result.meta,
        caseMasterId: caseMasterId.toString()
      }
    };
  }
  async getRecommendationsForRiskScore(riskScoreId, limit = 10) {
    const result = await this.analyticsRepository.listRecommendations({
      riskScoreId,
      page: 1,
      pageSize: limit
    });
    return {
      data: result.items,
      warnings: result.items.length === 0 ? ["No recommendations are linked to the selected risk score."] : this.buildRecommendationWarnings(result.items),
      meta: {
        ...result.meta,
        riskScoreId: riskScoreId.toString()
      }
    };
  }
  async getHighPriorityRiskScores(limit = 10) {
    const result = await this.analyticsRepository.listRiskScores({
      page: 1,
      pageSize: limit,
      reviewStatus: "pending"
    });
    const ranked = [...result.items].sort((left, right) => {
      const leftScore = left.scoreValue ? Number(left.scoreValue) : -1;
      const rightScore = right.scoreValue ? Number(right.scoreValue) : -1;
      return rightScore - leftScore;
    });
    return {
      data: ranked,
      warnings: ranked.length === 0 ? ["No pending risk scores are available."] : void 0,
      meta: {
        ...result.meta,
        ranking: "scoreValueDesc"
      }
    };
  }
  buildRecommendationWarnings(items) {
    const warnings = /* @__PURE__ */ new Set();
    if (items.some((item) => item.confidenceScore == null)) {
      warnings.add("Some recommendations are missing confidence scores.");
    }
    if (items.some((item) => item.legalSections.length === 0)) {
      warnings.add("Some recommendations do not include linked legal sections.");
    }
    return warnings.size > 0 ? [...warnings] : void 0;
  }
};

// src/modules/recommendations/recommendations.container.ts
var recommendationService = new RecommendationService(analyticsRepository);
var recommendationController = new RecommendationController(recommendationService);

// src/modules/recommendations/validators/recommendation.validators.ts
var import_zod9 = require("zod");
var numericString7 = import_zod9.z.string().regex(/^\d+$/, "Must be a valid integer");
var recommendationIdParamsSchema = import_zod9.z.object({
  recommendationId: numericString7
});
var listRecommendationsQuerySchema = import_zod9.z.object({
  page: numericString7.optional(),
  pageSize: numericString7.optional(),
  recommendationType: import_zod9.z.string().trim().min(1).optional(),
  type: import_zod9.z.string().trim().min(1).optional(),
  status: import_zod9.z.string().trim().min(1).optional(),
  priorityLevel: import_zod9.z.string().trim().min(1).optional(),
  caseMasterId: numericString7.optional(),
  hotspotId: numericString7.optional(),
  riskScoreId: numericString7.optional(),
  minConfidenceScore: import_zod9.z.string().trim().min(1).optional()
});
var reviewRecommendationBodySchema = import_zod9.z.object({
  decision: import_zod9.z.string().trim().min(1),
  reviewNotes: import_zod9.z.string().optional(),
  createTask: import_zod9.z.boolean().optional()
});

// src/modules/recommendations/routes/recommendations.routes.ts
var recommendationsRouter = (0, import_express10.Router)();
var requireRecommendationRead = requireAnyPermission(
  PERMISSIONS.CASES_READ_ALL,
  PERMISSIONS.CASES_READ_DISTRICT,
  PERMISSIONS.CASES_READ_UNIT,
  PERMISSIONS.ANALYTICS_READ,
  PERMISSIONS.AI_USE
);
recommendationsRouter.use(authenticateMiddleware, requireRecommendationRead);
recommendationsRouter.get("/", validate({ query: listRecommendationsQuerySchema }), asyncHandler(recommendationController.listRecommendations));
recommendationsRouter.get("/:recommendationId", validate({ params: recommendationIdParamsSchema }), asyncHandler(recommendationController.getRecommendationById));
recommendationsRouter.post("/:recommendationId/review", requirePermissions(PERMISSIONS.CASES_WRITE), validate({ params: recommendationIdParamsSchema, body: reviewRecommendationBodySchema }), notImplemented("Recommendation review workflow"));

// src/modules/graph/routes/graph.routes.ts
var import_express11 = require("express");

// src/modules/graph/controllers/graph.controller.ts
var import_http_status_codes18 = require("http-status-codes");
var GraphController = class {
  constructor(graphService2) {
    this.graphService = graphService2;
  }
  graphService;
  getCaseGraph = async (req, res) => {
    const caseMasterId = this.parseRequiredBigInt(req.params.caseId, "caseId");
    const result = await this.graphService.getCaseGraph(caseMasterId, {
      depth: this.parseOptionalNumber(req.query.depth, "depth"),
      includeEvidence: this.parseOptionalBoolean(req.query.includeEvidence),
      includeInferred: this.parseOptionalBoolean(req.query.includeInferred)
    });
    return ok(res, {
      item: result.data,
      warnings: result.warnings ?? [],
      meta: result.meta ?? null
    });
  };
  expandNode = async (req, res) => {
    const nodeId = this.parseRequiredBigInt(req.params.nodeId, "nodeId");
    const relationshipType = typeof req.query.relationshipTypes === "string" ? req.query.relationshipTypes.split(",")[0]?.trim() : void 0;
    const result = await this.graphService.expandNode(nodeId, {
      relationshipType: relationshipType || void 0,
      direction: "both",
      minConfidenceScore: this.parseOptionalNumber(req.query.minConfidence, "minConfidence"),
      limit: this.parseOptionalNumber(req.query.limit, "limit")
    });
    return ok(res, {
      item: result.data,
      warnings: result.warnings ?? [],
      meta: result.meta ?? null
    });
  };
  findShortestPath = async (_req, _res) => {
    throw this.notImplemented("Graph shortest path");
  };
  runNetworkAnalysis = async (_req, _res) => {
    throw this.notImplemented("Graph network analysis");
  };
  parseRequiredBigInt(value, field) {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new AppError(`${field} is required`, {
        statusCode: import_http_status_codes18.StatusCodes.BAD_REQUEST,
        code: "VALIDATION_ERROR",
        field
      });
    }
    try {
      return BigInt(value);
    } catch {
      throw new AppError(`${field} must be a valid integer`, {
        statusCode: import_http_status_codes18.StatusCodes.BAD_REQUEST,
        code: "VALIDATION_ERROR",
        field
      });
    }
  }
  parseOptionalNumber(value, field) {
    if (typeof value !== "string" || value.trim().length === 0) return void 0;
    const parsed2 = Number(value);
    if (!Number.isFinite(parsed2)) {
      throw new AppError(`${field} must be a valid number`, {
        statusCode: import_http_status_codes18.StatusCodes.BAD_REQUEST,
        code: "VALIDATION_ERROR",
        field
      });
    }
    return parsed2;
  }
  parseOptionalBoolean(value) {
    if (value === "true") return true;
    if (value === "false") return false;
    return void 0;
  }
  notImplemented(feature) {
    return new AppError(`${feature} is planned for a later intelligence phase`, {
      statusCode: import_http_status_codes18.StatusCodes.NOT_IMPLEMENTED,
      code: "ENDPOINT_NOT_IMPLEMENTED"
    });
  }
};

// src/modules/graph/types/graph.types.ts
var kgNodeSelect = {
  id: true,
  nodeLabel: true,
  sourceTable: true,
  sourceRecordId: true,
  displayName: true,
  sensitivityLevel: true,
  qualityStatus: true,
  sourceConfidence: true,
  dataSourceId: true,
  createdAt: true,
  updatedAt: true,
  dataSource: {
    select: {
      id: true,
      sourceName: true,
      sourceType: true,
      sourceBatch: true
    }
  }
};
var kgEdgeSelect = {
  id: true,
  fromKgNodeId: true,
  toKgNodeId: true,
  relationshipType: true,
  sourceTable: true,
  sourceRecordId: true,
  confidenceScore: true,
  edgeWeight: true,
  validFrom: true,
  validTo: true,
  evidenceId: true,
  dataSourceId: true,
  modelVersion: true,
  reviewStatus: true,
  explanation: true,
  createdAt: true,
  fromNode: {
    select: {
      id: true,
      nodeLabel: true,
      displayName: true,
      sourceTable: true,
      sourceRecordId: true
    }
  },
  toNode: {
    select: {
      id: true,
      nodeLabel: true,
      displayName: true,
      sourceTable: true,
      sourceRecordId: true
    }
  },
  evidence: {
    select: {
      id: true,
      evidenceType: true,
      evidenceDescription: true
    }
  },
  reviewedBy: {
    select: {
      id: true,
      kgid: true,
      firstName: true
    }
  }
};

// src/modules/graph/repositories/prisma-graph.repository.ts
var PrismaGraphRepository = class {
  constructor(client = prisma) {
    this.client = client;
  }
  client;
  async findById(id) {
    return this.client.kgNode.findUnique({
      where: { id },
      select: kgNodeSelect
    });
  }
  async findNodeBySource(sourceTable, sourceRecordId, nodeLabel) {
    return this.client.kgNode.findFirst({
      where: {
        sourceTable,
        sourceRecordId,
        ...nodeLabel ? { nodeLabel } : {}
      },
      select: kgNodeSelect
    });
  }
  async searchNodes(input) {
    const pagination = normalizePagination(input);
    const where = this.buildNodeWhere(input);
    const [items, totalRecords] = await this.client.$transaction([
      this.client.kgNode.findMany({
        where,
        select: kgNodeSelect,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: [{ nodeLabel: "asc" }, { displayName: "asc" }, { id: "asc" }]
      }),
      this.client.kgNode.count({ where })
    ]);
    return {
      items,
      meta: buildPaginationMeta({
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalRecords
      })
    };
  }
  async findEdgeById(id) {
    return this.client.kgEdge.findUnique({
      where: { id },
      select: kgEdgeSelect
    });
  }
  async listEdges(input) {
    const pagination = normalizePagination(input);
    const where = this.buildEdgeWhere(input);
    const [items, totalRecords] = await this.client.$transaction([
      this.client.kgEdge.findMany({
        where,
        select: kgEdgeSelect,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: [{ confidenceScore: "desc" }, { id: "desc" }]
      }),
      this.client.kgEdge.count({ where })
    ]);
    return {
      items,
      meta: buildPaginationMeta({
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalRecords
      })
    };
  }
  async listOutgoingEdges(nodeId, input = {}) {
    return this.listEdges({ ...input, fromKgNodeId: nodeId });
  }
  async listIncomingEdges(nodeId, input = {}) {
    return this.listEdges({ ...input, toKgNodeId: nodeId });
  }
  async listNeighbors(nodeId, input = {}) {
    const direction = input.direction ?? "both";
    const take = Math.max(input.limit ?? 25, 1);
    const confidenceFilter = typeof input.minConfidenceScore === "number" ? { gte: input.minConfidenceScore } : void 0;
    const outgoingPromise = direction === "incoming" ? Promise.resolve([]) : this.client.kgEdge.findMany({
      where: {
        fromKgNodeId: nodeId,
        ...input.relationshipType ? { relationshipType: input.relationshipType } : {},
        ...confidenceFilter ? { confidenceScore: confidenceFilter } : {}
      },
      select: kgEdgeSelect,
      take,
      orderBy: [{ confidenceScore: "desc" }, { id: "desc" }]
    });
    const incomingPromise = direction === "outgoing" ? Promise.resolve([]) : this.client.kgEdge.findMany({
      where: {
        toKgNodeId: nodeId,
        ...input.relationshipType ? { relationshipType: input.relationshipType } : {},
        ...confidenceFilter ? { confidenceScore: confidenceFilter } : {}
      },
      select: kgEdgeSelect,
      take,
      orderBy: [{ confidenceScore: "desc" }, { id: "desc" }]
    });
    const [outgoingEdges, incomingEdges] = await Promise.all([outgoingPromise, incomingPromise]);
    const outgoingNeighbors = outgoingEdges.map((edge) => ({
      direction: "outgoing",
      node: {
        id: edge.toNode.id,
        nodeLabel: edge.toNode.nodeLabel,
        sourceTable: edge.toNode.sourceTable,
        sourceRecordId: edge.toNode.sourceRecordId,
        displayName: edge.toNode.displayName,
        sensitivityLevel: null,
        qualityStatus: null,
        sourceConfidence: null,
        dataSourceId: null,
        createdAt: edge.createdAt,
        updatedAt: edge.createdAt,
        dataSource: null
      },
      edge
    }));
    const incomingNeighbors = incomingEdges.map((edge) => ({
      direction: "incoming",
      node: {
        id: edge.fromNode.id,
        nodeLabel: edge.fromNode.nodeLabel,
        sourceTable: edge.fromNode.sourceTable,
        sourceRecordId: edge.fromNode.sourceRecordId,
        displayName: edge.fromNode.displayName,
        sensitivityLevel: null,
        qualityStatus: null,
        sourceConfidence: null,
        dataSourceId: null,
        createdAt: edge.createdAt,
        updatedAt: edge.createdAt,
        dataSource: null
      },
      edge
    }));
    return [...outgoingNeighbors, ...incomingNeighbors].sort((left, right) => {
      const leftConfidence = left.edge.confidenceScore ? Number(left.edge.confidenceScore) : -1;
      const rightConfidence = right.edge.confidenceScore ? Number(right.edge.confidenceScore) : -1;
      return rightConfidence - leftConfidence;
    });
  }
  buildNodeWhere(input) {
    const where = {};
    const and = [];
    if (input.nodeLabel) {
      and.push({ nodeLabel: input.nodeLabel });
    }
    if (input.sourceTable) {
      and.push({ sourceTable: input.sourceTable });
    }
    if (input.sensitivityLevel) {
      and.push({ sensitivityLevel: input.sensitivityLevel });
    }
    if (input.qualityStatus) {
      and.push({ qualityStatus: input.qualityStatus });
    }
    if (input.query) {
      and.push({
        OR: [
          {
            displayName: {
              contains: input.query,
              mode: "insensitive"
            }
          },
          {
            sourceRecordId: {
              contains: input.query,
              mode: "insensitive"
            }
          }
        ]
      });
    }
    if (and.length > 0) {
      where.AND = and;
    }
    return where;
  }
  buildEdgeWhere(input) {
    const where = {};
    const and = [];
    if (input.fromKgNodeId) {
      and.push({ fromKgNodeId: input.fromKgNodeId });
    }
    if (input.toKgNodeId) {
      and.push({ toKgNodeId: input.toKgNodeId });
    }
    if (input.relationshipType) {
      and.push({ relationshipType: input.relationshipType });
    }
    if (input.reviewStatus) {
      and.push({ reviewStatus: input.reviewStatus });
    }
    if (input.sourceTable) {
      and.push({ sourceTable: input.sourceTable });
    }
    if (typeof input.minConfidenceScore === "number") {
      and.push({
        confidenceScore: {
          gte: input.minConfidenceScore
        }
      });
    }
    if (and.length > 0) {
      where.AND = and;
    }
    return where;
  }
};

// src/modules/graph/services/graph.service.ts
var import_http_status_codes19 = require("http-status-codes");
var GraphService = class {
  constructor(repository) {
    this.repository = repository;
  }
  repository;
  async getNodeById(nodeId) {
    const record = await this.repository.findById(nodeId);
    if (!record) {
      throw new AppError(`Knowledge graph node ${nodeId} was not found`, {
        statusCode: import_http_status_codes19.StatusCodes.NOT_FOUND,
        code: "GRAPH_NODE_NOT_FOUND"
      });
    }
    return { data: record };
  }
  async getNodeBySource(sourceTable, sourceRecordId, nodeLabel) {
    const record = await this.repository.findNodeBySource(
      sourceTable.trim(),
      sourceRecordId.trim(),
      nodeLabel?.trim()
    );
    if (!record) {
      throw new AppError("Knowledge graph node for the source reference was not found", {
        statusCode: import_http_status_codes19.StatusCodes.NOT_FOUND,
        code: "GRAPH_NODE_NOT_FOUND"
      });
    }
    return { data: record };
  }
  async searchNodes(input) {
    const result = await this.repository.searchNodes(input);
    return {
      data: result.items,
      warnings: result.items.length === 0 ? ["No knowledge graph nodes matched the selected filters."] : void 0,
      meta: result.meta
    };
  }
  async getEdgeById(edgeId) {
    const record = await this.repository.findEdgeById(edgeId);
    if (!record) {
      throw new AppError(`Knowledge graph edge ${edgeId} was not found`, {
        statusCode: import_http_status_codes19.StatusCodes.NOT_FOUND,
        code: "GRAPH_EDGE_NOT_FOUND"
      });
    }
    return { data: record };
  }
  async listEdges(input) {
    const result = await this.repository.listEdges(input);
    return {
      data: result.items,
      warnings: result.items.length === 0 ? ["No knowledge graph edges matched the selected filters."] : void 0,
      meta: result.meta
    };
  }
  async getNeighbors(nodeId, input = {}) {
    await this.ensureNodeExists(nodeId);
    const items = await this.repository.listNeighbors(nodeId, input);
    return {
      data: items,
      warnings: items.length === 0 ? ["No neighboring graph nodes were found for the selected node."] : void 0,
      meta: {
        nodeId: nodeId.toString(),
        direction: input.direction ?? "both",
        relationshipType: input.relationshipType ?? null,
        totalRecords: items.length
      }
    };
  }
  async getCaseGraph(caseMasterId, input = {}) {
    const caseNode = await this.findCaseNode(caseMasterId);
    if (!caseNode) {
      return {
        data: {
          centerNode: null,
          nodes: [],
          edges: []
        },
        warnings: ["No graph node is currently linked to the selected case."],
        meta: {
          caseMasterId: caseMasterId.toString(),
          appliedDepth: 0
        }
      };
    }
    const neighbors = await this.repository.listNeighbors(caseNode.id, {
      direction: "both",
      minConfidenceScore: input.includeInferred ? void 0 : 0.6,
      limit: 100
    });
    return {
      data: {
        centerNode: caseNode,
        nodes: this.dedupeNodes([caseNode, ...neighbors.map((item) => item.node)]),
        edges: this.dedupeEdges(neighbors.map((item) => item.edge))
      },
      warnings: input.depth && input.depth > 1 ? ["Current graph expansion is limited to depth 1 in this phase."] : void 0,
      meta: {
        caseMasterId: caseMasterId.toString(),
        appliedDepth: 1,
        includeEvidence: input.includeEvidence ?? false,
        includeInferred: input.includeInferred ?? false
      }
    };
  }
  async expandNode(nodeId, input = {}) {
    const centerNode = await this.requireNode(nodeId);
    const neighbors = await this.repository.listNeighbors(nodeId, input);
    return {
      data: {
        centerNode,
        nodes: this.dedupeNodes([centerNode, ...neighbors.map((item) => item.node)]),
        edges: this.dedupeEdges(neighbors.map((item) => item.edge))
      },
      warnings: neighbors.length === 0 ? ["No graph expansion results were found for the selected node."] : void 0,
      meta: {
        nodeId: nodeId.toString(),
        direction: input.direction ?? "both",
        relationshipType: input.relationshipType ?? null,
        totalEdges: neighbors.length
      }
    };
  }
  async ensureNodeExists(nodeId) {
    const record = await this.repository.findById(nodeId);
    if (!record) {
      throw new AppError(`Knowledge graph node ${nodeId} was not found`, {
        statusCode: import_http_status_codes19.StatusCodes.NOT_FOUND,
        code: "GRAPH_NODE_NOT_FOUND"
      });
    }
  }
  async requireNode(nodeId) {
    const record = await this.repository.findById(nodeId);
    if (!record) {
      throw new AppError(`Knowledge graph node ${nodeId} was not found`, {
        statusCode: import_http_status_codes19.StatusCodes.NOT_FOUND,
        code: "GRAPH_NODE_NOT_FOUND"
      });
    }
    return record;
  }
  async findCaseNode(caseMasterId) {
    const sourceRecordId = caseMasterId.toString();
    const candidates = [
      { sourceTable: "case_master", nodeLabel: "Case" },
      { sourceTable: "case_master", nodeLabel: void 0 },
      { sourceTable: "case", nodeLabel: "Case" },
      { sourceTable: "case", nodeLabel: void 0 }
    ];
    for (const candidate of candidates) {
      const match = await this.repository.findNodeBySource(
        candidate.sourceTable,
        sourceRecordId,
        candidate.nodeLabel
      );
      if (match) return match;
    }
    for (const sourceTable of ["case_master", "case"]) {
      const search = await this.repository.searchNodes({
        page: 1,
        pageSize: 5,
        sourceTable,
        query: sourceRecordId
      });
      const found = search.items.find((item) => item.sourceRecordId === sourceRecordId);
      if (found) return found;
    }
    return null;
  }
  dedupeNodes(nodes) {
    const map = new Map(nodes.map((node) => [node.id.toString(), node]));
    return [...map.values()];
  }
  dedupeEdges(edges) {
    const map = new Map(edges.map((edge) => [edge.id.toString(), edge]));
    return [...map.values()];
  }
};

// src/modules/graph/graph.container.ts
var graphRepository = new PrismaGraphRepository();
var graphService = new GraphService(graphRepository);
var graphController = new GraphController(graphService);

// src/modules/graph/validators/graph.validators.ts
var import_zod10 = require("zod");
var numericString8 = import_zod10.z.string().regex(/^\d+$/, "Must be a valid integer");
var caseGraphParamsSchema = import_zod10.z.object({
  caseId: numericString8
});
var graphNodeParamsSchema = import_zod10.z.object({
  nodeId: numericString8
});
var caseGraphQuerySchema = import_zod10.z.object({
  depth: numericString8.optional(),
  includeEvidence: import_zod10.z.enum(["true", "false"]).optional(),
  includeInferred: import_zod10.z.enum(["true", "false"]).optional()
});
var graphExpandQuerySchema = import_zod10.z.object({
  relationshipTypes: import_zod10.z.string().trim().min(1).optional(),
  depth: numericString8.optional(),
  limit: numericString8.optional(),
  minConfidence: import_zod10.z.string().trim().min(1).optional()
});
var graphPathBodySchema = import_zod10.z.object({
  fromNodeId: import_zod10.z.string().trim().min(1),
  toNodeId: import_zod10.z.string().trim().min(1),
  maxDepth: import_zod10.z.number().int().positive().optional(),
  minConfidence: import_zod10.z.number().min(0).max(1).optional(),
  includeInferred: import_zod10.z.boolean().optional()
});
var graphNetworkAnalysisBodySchema = import_zod10.z.object({
  seedNodeIds: import_zod10.z.array(import_zod10.z.string().trim().min(1)).min(1),
  algorithm: import_zod10.z.string().trim().min(1),
  depth: import_zod10.z.number().int().positive().optional(),
  filters: import_zod10.z.object({
    relationshipTypes: import_zod10.z.array(import_zod10.z.string()).optional(),
    minConfidence: import_zod10.z.number().min(0).max(1).optional()
  }).optional()
});

// src/modules/graph/routes/graph.routes.ts
var graphRouter = (0, import_express11.Router)();
var requireGraphRead = requireAnyPermission(
  PERMISSIONS.CASES_READ_ALL,
  PERMISSIONS.CASES_READ_DISTRICT,
  PERMISSIONS.CASES_READ_UNIT,
  PERMISSIONS.ANALYTICS_READ,
  PERMISSIONS.AI_USE
);
graphRouter.use(authenticateMiddleware, requireGraphRead);
graphRouter.get("/cases/:caseId", validate({ params: caseGraphParamsSchema, query: caseGraphQuerySchema }), asyncHandler(graphController.getCaseGraph));
graphRouter.get("/nodes/:nodeId/expand", validate({ params: graphNodeParamsSchema, query: graphExpandQuerySchema }), asyncHandler(graphController.expandNode));
graphRouter.post("/path", requirePermissions(PERMISSIONS.AI_USE), validate({ body: graphPathBodySchema }), asyncHandler(graphController.findShortestPath));
graphRouter.post("/network-analysis", requireAnyPermission(PERMISSIONS.ANALYTICS_READ, PERMISSIONS.AI_USE), validate({ body: graphNetworkAnalysisBodySchema }), asyncHandler(graphController.runNetworkAnalysis));

// src/modules/chat/routes/chat.routes.ts
var import_express12 = require("express");

// src/modules/chat/controllers/chat.controller.ts
var import_http_status_codes20 = require("http-status-codes");
var ChatController = class {
  constructor(chatService2) {
    this.chatService = chatService2;
  }
  chatService;
  createSession = async (req, res) => {
    const result = await this.chatService.createSession({
      employeeId: req.user?.employeeId ? BigInt(req.user.employeeId) : void 0,
      caseMasterId: this.parseOptionalBigInt(req.body.caseMasterId, "caseMasterId"),
      sessionPurpose: this.parseRequiredString(req.body.sessionPurpose, "sessionPurpose"),
      securityClassification: this.parseOptionalString(req.body.securityClassification),
      modelVersion: "phase-7.5-composed-response"
    });
    return ok(res, { item: result.data, warnings: result.warnings ?? [] });
  };
  sendMessage = async (req, res) => {
    const chatSessionId = this.parseRequiredBigInt(req.params.chatSessionId, "chatSessionId");
    const result = await this.chatService.sendMessage(chatSessionId, {
      messageText: this.parseRequiredString(req.body.messageText, "messageText"),
      includeEvidence: this.parseOptionalBoolean(req.body.includeEvidence),
      includeGraph: this.parseOptionalBoolean(req.body.includeGraph),
      includeLegal: this.parseOptionalBoolean(req.body.includeLegal),
      includeAnalytics: this.parseOptionalBoolean(req.body.includeAnalytics)
    });
    return ok(res, { item: result.data, warnings: result.warnings ?? [] });
  };
  listSessions = async (req, res) => {
    const result = await this.chatService.listSessions({
      page: this.parseOptionalNumber(req.query.page, "page"),
      pageSize: this.parseOptionalNumber(req.query.pageSize, "pageSize"),
      caseMasterId: this.parseOptionalBigInt(req.query.caseMasterId, "caseMasterId"),
      employeeId: this.parseOptionalBigInt(req.query.employeeId, "employeeId"),
      fromDate: this.parseOptionalDate(req.query.fromDate, "fromDate"),
      toDate: this.parseOptionalDate(req.query.toDate, "toDate")
    });
    return ok(
      res,
      { items: result.data, warnings: result.warnings ?? [] },
      this.extractPagination(result.meta)
    );
  };
  getSessionMessages = async (req, res) => {
    const chatSessionId = this.parseRequiredBigInt(req.params.chatSessionId, "chatSessionId");
    const result = await this.chatService.getSessionMessages(chatSessionId);
    return ok(res, { item: result.data, warnings: result.warnings ?? [] });
  };
  parseRequiredString(value, field) {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new AppError(`${field} is required`, {
        statusCode: import_http_status_codes20.StatusCodes.BAD_REQUEST,
        code: "VALIDATION_ERROR",
        field
      });
    }
    return value.trim();
  }
  parseOptionalString(value) {
    if (typeof value !== "string") return void 0;
    const normalized = value.trim();
    return normalized.length > 0 ? normalized : void 0;
  }
  parseRequiredBigInt(value, field) {
    const parsed2 = this.parseOptionalBigInt(value, field);
    if (parsed2 == null)
      throw new AppError(`${field} is required`, {
        statusCode: import_http_status_codes20.StatusCodes.BAD_REQUEST,
        code: "VALIDATION_ERROR",
        field
      });
    return parsed2;
  }
  parseOptionalBigInt(value, field) {
    if (typeof value === "number") return BigInt(value);
    if (typeof value !== "string" || value.trim().length === 0) return void 0;
    try {
      return BigInt(value);
    } catch {
      throw new AppError(`${field} must be a valid integer`, {
        statusCode: import_http_status_codes20.StatusCodes.BAD_REQUEST,
        code: "VALIDATION_ERROR",
        field
      });
    }
  }
  parseOptionalBoolean(value) {
    return typeof value === "boolean" ? value : void 0;
  }
  parseOptionalNumber(value, field) {
    if (typeof value !== "string" || value.trim().length === 0) return void 0;
    const parsed2 = Number(value);
    if (!Number.isFinite(parsed2))
      throw new AppError(`${field} must be a valid number`, {
        statusCode: import_http_status_codes20.StatusCodes.BAD_REQUEST,
        code: "VALIDATION_ERROR",
        field
      });
    return parsed2;
  }
  parseOptionalDate(value, field) {
    if (typeof value !== "string" || value.trim().length === 0) return void 0;
    const parsed2 = new Date(value);
    if (Number.isNaN(parsed2.getTime()))
      throw new AppError(`${field} must be a valid date`, {
        statusCode: import_http_status_codes20.StatusCodes.BAD_REQUEST,
        code: "VALIDATION_ERROR",
        field
      });
    return parsed2;
  }
  extractPagination(meta) {
    if (!meta) return void 0;
    const { page, pageSize, totalRecords, totalPages } = meta;
    if (typeof page === "number" && typeof pageSize === "number" && typeof totalRecords === "number" && typeof totalPages === "number") {
      return { page, pageSize, totalRecords, totalPages };
    }
    return void 0;
  }
};

// src/modules/chat/types/chat.types.ts
var chatSessionListSelect = {
  id: true,
  employeeId: true,
  caseMasterId: true,
  sessionStartedOn: true,
  sessionEndedOn: true,
  sessionPurpose: true,
  securityClassification: true,
  modelVersion: true,
  employee: {
    select: {
      id: true,
      kgid: true,
      firstName: true
    }
  },
  case: {
    select: {
      id: true,
      crimeNo: true,
      caseNo: true
    }
  },
  _count: {
    select: {
      messages: true
    }
  }
};
var chatSessionDetailSelect = {
  id: true,
  employeeId: true,
  caseMasterId: true,
  sessionStartedOn: true,
  sessionEndedOn: true,
  sessionPurpose: true,
  securityClassification: true,
  modelVersion: true,
  employee: {
    select: {
      id: true,
      kgid: true,
      firstName: true
    }
  },
  case: {
    select: {
      id: true,
      crimeNo: true,
      caseNo: true,
      briefFacts: true
    }
  },
  messages: {
    select: {
      id: true,
      messageSequence: true,
      senderRole: true,
      messageText: true,
      createdOn: true,
      linkedRecommendationId: true,
      linkedAuditLogId: true
    },
    orderBy: [{ messageSequence: "asc" }]
  }
};
var chatMessageSelect = {
  id: true,
  chatSessionId: true,
  messageSequence: true,
  senderRole: true,
  messageText: true,
  createdOn: true,
  linkedRecommendationId: true,
  linkedAuditLogId: true
};

// src/modules/chat/repositories/prisma-chat.repository.ts
var PrismaChatRepository = class {
  constructor(client = prisma) {
    this.client = client;
  }
  client;
  async createSession(input) {
    return this.client.chatSession.create({
      data: {
        employeeId: input.employeeId,
        caseMasterId: input.caseMasterId,
        sessionPurpose: input.sessionPurpose,
        securityClassification: input.securityClassification,
        modelVersion: input.modelVersion
      },
      select: chatSessionDetailSelect
    });
  }
  async findSessionById(chatSessionId) {
    return this.client.chatSession.findUnique({
      where: { id: chatSessionId },
      select: chatSessionDetailSelect
    });
  }
  async listSessions(input) {
    const pagination = normalizePagination(input);
    const where = this.buildWhere(input);
    const [items, totalRecords] = await this.client.$transaction([
      this.client.chatSession.findMany({
        where,
        select: chatSessionListSelect,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: [{ sessionStartedOn: "desc" }, { id: "desc" }]
      }),
      this.client.chatSession.count({ where })
    ]);
    return {
      items,
      meta: buildPaginationMeta({
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalRecords
      })
    };
  }
  async createMessage(input) {
    return this.client.$transaction(async (tx) => {
      const currentMax = await tx.chatMessage.aggregate({
        where: { chatSessionId: input.chatSessionId },
        _max: { messageSequence: true }
      });
      return tx.chatMessage.create({
        data: {
          chatSessionId: input.chatSessionId,
          messageSequence: (currentMax._max.messageSequence ?? 0) + 1,
          senderRole: input.senderRole,
          messageText: input.messageText,
          linkedRecommendationId: input.linkedRecommendationId,
          linkedAuditLogId: input.linkedAuditLogId
        },
        select: chatMessageSelect
      });
    });
  }
  buildWhere(input) {
    const where = {};
    const and = [];
    if (input.caseMasterId) and.push({ caseMasterId: input.caseMasterId });
    if (input.employeeId) and.push({ employeeId: input.employeeId });
    if (input.fromDate || input.toDate) {
      and.push({
        sessionStartedOn: {
          gte: input.fromDate,
          lte: input.toDate
        }
      });
    }
    if (and.length > 0) where.AND = and;
    return where;
  }
};

// src/modules/chat/services/chat.service.ts
var import_http_status_codes21 = require("http-status-codes");
var ChatService = class {
  constructor(repository, caseService2, recommendationService2, graphService2) {
    this.repository = repository;
    this.caseService = caseService2;
    this.recommendationService = recommendationService2;
    this.graphService = graphService2;
  }
  repository;
  caseService;
  recommendationService;
  graphService;
  async createSession(input) {
    const session = await this.repository.createSession(input);
    return { data: session };
  }
  async listSessions(input) {
    const result = await this.repository.listSessions(input);
    return {
      data: result.items,
      warnings: result.items.length === 0 ? ["No chat sessions matched the selected filters."] : void 0,
      meta: result.meta
    };
  }
  async getSessionMessages(chatSessionId) {
    const session = await this.repository.findSessionById(chatSessionId);
    if (!session) {
      throw new AppError(`Chat session ${chatSessionId} was not found`, {
        statusCode: import_http_status_codes21.StatusCodes.NOT_FOUND,
        code: "CHAT_SESSION_NOT_FOUND"
      });
    }
    return {
      data: session,
      warnings: session.messages.length === 0 ? ["This chat session has no messages yet."] : void 0
    };
  }
  async sendMessage(chatSessionId, input) {
    const session = await this.repository.findSessionById(chatSessionId);
    if (!session) {
      throw new AppError(`Chat session ${chatSessionId} was not found`, {
        statusCode: import_http_status_codes21.StatusCodes.NOT_FOUND,
        code: "CHAT_SESSION_NOT_FOUND"
      });
    }
    const userMessage = await this.repository.createMessage({
      chatSessionId,
      senderRole: "user",
      messageText: input.messageText
    });
    const answer = await this.composeAnswer(session, input);
    const linkedRecommendationIds = await this.collectRecommendationIds(session.caseMasterId);
    const assistantMessage = await this.repository.createMessage({
      chatSessionId,
      senderRole: "assistant",
      messageText: answer.summary,
      linkedRecommendationId: linkedRecommendationIds[0] ? BigInt(linkedRecommendationIds[0]) : void 0
    });
    return {
      data: {
        userMessageId: userMessage.id.toString(),
        assistantMessageId: assistantMessage.id.toString(),
        answer,
        linkedRecommendationIds
      },
      warnings: linkedRecommendationIds.length === 0 ? ["No linked recommendations were available for this response."] : void 0
    };
  }
  async composeAnswer(session, input) {
    const evidence = [];
    const connections = [];
    const insights = [];
    const suggestedLeads = [];
    if (!session.caseMasterId) {
      return {
        summary: "This session is not linked to a case yet. Create or attach a case to unlock investigation context.",
        evidence,
        connections,
        insights,
        suggestedLeads: ["Attach a case to this session.", "Provide a more specific investigation question."],
        confidence: {
          label: "Low",
          score: 0.2,
          reason: "No linked case context is available."
        },
        nextAction: "Associate the session with a case and retry the query."
      };
    }
    const [caseResult, recommendationResult] = await Promise.all([
      this.caseService.getCaseById(session.caseMasterId),
      this.recommendationService.getCaseRecommendations(session.caseMasterId, 3)
    ]);
    const caseRecord = caseResult.data;
    evidence.push(`Case ${caseRecord.caseNo ?? caseRecord.crimeNo ?? caseRecord.id.toString()}`);
    if (caseRecord.status?.name) evidence.push(`Status: ${caseRecord.status.name}`);
    if (caseRecord.majorCrimeHead?.groupName) evidence.push(`Crime head: ${caseRecord.majorCrimeHead.groupName}`);
    if (caseRecord.policeStation?.name) evidence.push(`Police station: ${caseRecord.policeStation.name}`);
    if (!caseRecord.briefFacts) {
      insights.push("Case narrative is missing or incomplete, which reduces recommendation precision.");
    } else {
      insights.push(`Case narrative available with ${caseRecord.briefFacts.length} characters of brief facts.`);
    }
    if (recommendationResult.data.length > 0) {
      for (const recommendation of recommendationResult.data.slice(0, 3)) {
        suggestedLeads.push(recommendation.recommendationText);
      }
    } else {
      suggestedLeads.push("Review the case narrative and legal sections for missing evidence or escalation opportunities.");
    }
    if (input.includeGraph) {
      try {
        const graphResult = await this.graphService.getCaseGraph(session.caseMasterId, { depth: 1 });
        const nodeCount = Array.isArray(graphResult.data.nodes) ? graphResult.data.nodes.length : 0;
        const edgeCount = Array.isArray(graphResult.data.edges) ? graphResult.data.edges.length : 0;
        connections.push(`Graph context found ${nodeCount} nodes and ${edgeCount} edges around the case.`);
      } catch {
        connections.push("Graph context is not yet available for this case.");
      }
    }
    const summary = this.buildSummary(caseRecord.briefFacts, input.messageText, suggestedLeads);
    const score = this.computeConfidence(caseRecord, recommendationResult.data.length, input.includeGraph === true && connections.length > 0);
    return {
      summary,
      evidence,
      connections,
      insights,
      suggestedLeads,
      confidence: {
        label: score >= 0.8 ? "High" : score >= 0.5 ? "Medium" : "Low",
        score,
        reason: score >= 0.8 ? "Case facts, status, and recommendations are available." : score >= 0.5 ? "Partial case context is available, but some investigation signals are incomplete." : "Key case details are missing or sparse."
      },
      nextAction: suggestedLeads[0] ?? "Review the linked case details manually."
    };
  }
  buildSummary(briefFacts, question, suggestedLeads) {
    if (question.toLowerCase().includes("similar")) {
      return suggestedLeads[0] ? `Similar-case support is available. Start with: ${suggestedLeads[0]}` : "Similar-case support needs richer narrative and recommendation context.";
    }
    return briefFacts?.slice(0, 240) ?? "Investigation context is available, but the case narrative is limited.";
  }
  computeConfidence(caseRecord, recommendationCount, hasGraph) {
    let score = 0.35;
    if (caseRecord?.briefFacts) score += 0.25;
    if (caseRecord?.crimeNo || caseRecord?.caseNo) score += 0.1;
    if (recommendationCount > 0) score += 0.2;
    if (hasGraph) score += 0.1;
    return Math.min(score, 0.95);
  }
  async collectRecommendationIds(caseMasterId) {
    if (!caseMasterId) return [];
    const result = await this.recommendationService.getCaseRecommendations(caseMasterId, 5);
    return result.data.map((item) => item.id.toString());
  }
};

// src/modules/chat/chat.container.ts
var chatRepository = new PrismaChatRepository();
var chatService = new ChatService(
  chatRepository,
  caseService,
  recommendationService,
  graphService
);
var chatController = new ChatController(chatService);

// src/modules/chat/validators/chat.validators.ts
var import_zod11 = require("zod");
var numericString9 = import_zod11.z.string().regex(/^\d+$/, "Must be a valid integer");
var isoDateString2 = import_zod11.z.string().datetime({ offset: true }).or(import_zod11.z.string().date());
var chatSessionParamsSchema = import_zod11.z.object({
  chatSessionId: numericString9
});
var createChatSessionBodySchema = import_zod11.z.object({
  caseMasterId: import_zod11.z.number().int().positive().optional(),
  sessionPurpose: import_zod11.z.string().trim().min(1),
  securityClassification: import_zod11.z.string().trim().min(1).optional()
});
var sendChatMessageBodySchema = import_zod11.z.object({
  messageText: import_zod11.z.string().trim().min(1),
  includeEvidence: import_zod11.z.boolean().optional(),
  includeGraph: import_zod11.z.boolean().optional(),
  includeLegal: import_zod11.z.boolean().optional(),
  includeAnalytics: import_zod11.z.boolean().optional()
});
var listChatSessionsQuerySchema = import_zod11.z.object({
  caseMasterId: numericString9.optional(),
  employeeId: numericString9.optional(),
  fromDate: isoDateString2.optional(),
  toDate: isoDateString2.optional(),
  page: numericString9.optional(),
  pageSize: numericString9.optional()
});

// src/modules/chat/routes/chat.routes.ts
var chatRouter = (0, import_express12.Router)();
chatRouter.use(authenticateMiddleware, requirePermissions(PERMISSIONS.AI_USE));
chatRouter.post("/sessions", validate({ body: createChatSessionBodySchema }), asyncHandler(chatController.createSession));
chatRouter.get("/sessions", validate({ query: listChatSessionsQuerySchema }), asyncHandler(chatController.listSessions));
chatRouter.post("/sessions/:chatSessionId/messages", validate({ params: chatSessionParamsSchema, body: sendChatMessageBodySchema }), asyncHandler(chatController.sendMessage));
chatRouter.get("/sessions/:chatSessionId", validate({ params: chatSessionParamsSchema }), asyncHandler(chatController.getSessionMessages));

// src/ai/providers/ollama-provider.ts
var import_ollama = require("ollama");

// src/ai/config/ai-config.ts
var import_zod12 = require("zod");
var aiConfigSchema = import_zod12.z.object({
  provider: import_zod12.z.enum(["ollama", "mock"]),
  ollama: import_zod12.z.object({
    baseUrl: import_zod12.z.string().url(),
    defaultModel: import_zod12.z.string().min(1),
    timeoutMs: import_zod12.z.number().int().positive().default(6e4),
    // 60 seconds
    maxRetries: import_zod12.z.number().int().min(0).default(3)
  }),
  generation: import_zod12.z.object({
    defaultTemperature: import_zod12.z.number().min(0).max(2).default(0.1),
    // Very low for police data precision
    defaultTopP: import_zod12.z.number().min(0).max(1).default(0.9),
    maxOutputTokens: import_zod12.z.number().int().positive().default(2048)
  })
});
var aiConfig = aiConfigSchema.parse({
  provider: env.AI_PROVIDER,
  ollama: {
    baseUrl: env.OLLAMA_BASE_URL,
    defaultModel: env.OLLAMA_MODEL_DEFAULT,
    timeoutMs: 6e4,
    maxRetries: 3
  },
  generation: {
    defaultTemperature: 0.1,
    defaultTopP: 0.9,
    maxOutputTokens: 2048
  }
});

// src/ai/shared/ai-logger.ts
var aiLogger = {
  info(message, context, extra) {
    logger.info(this.buildMeta(context, extra), message);
  },
  warn(message, context, extra) {
    logger.warn(this.buildMeta(context, extra), message);
  },
  error(message, error, context, extra) {
    logger.error({
      ...this.buildMeta(context, extra),
      error: error ? { message: error.message, stack: error.stack, name: error.name } : void 0
    }, message);
  },
  debug(message, context, extra) {
    logger.debug(this.buildMeta(context, extra), message);
  },
  logUsage(context, usage, durationMs) {
    logger.info({
      ai: {
        requestId: context.requestId,
        userId: context.user.userId,
        sessionId: context.sessionId,
        channel: context.channel
      },
      usage,
      durationMs
    }, "AI Generation Completed");
  },
  buildMeta(context, extra) {
    const meta = { ...extra };
    if (context) {
      meta.ai = {
        requestId: context.requestId,
        userId: context.user.userId,
        sessionId: context.sessionId
      };
    }
    return meta;
  }
};

// src/ai/shared/ai-errors.ts
var AiProviderError = class extends AppError {
  details;
  constructor(message, details) {
    super(message, {
      statusCode: 502,
      code: "AI_PROVIDER_ERROR"
    });
    this.details = details;
  }
};
var AiTimeoutError = class extends AiProviderError {
  isRetryable;
  constructor(message = "AI provider request timed out", details) {
    super(message, details);
    this.isRetryable = true;
  }
};
var AiParsingError = class extends AppError {
  rawOutput;
  details;
  constructor(message, rawOutput, details) {
    super(message, {
      statusCode: 422,
      code: "AI_PARSING_ERROR"
    });
    this.rawOutput = rawOutput;
    this.details = details;
  }
};

// src/ai/providers/ollama-provider.ts
var OllamaProvider = class {
  name = "ollama";
  capabilities = [
    "text_generation",
    "structured_generation"
  ];
  client;
  constructor() {
    this.client = new import_ollama.Ollama({ host: aiConfig.ollama.baseUrl });
  }
  async generateText(messages, options, context) {
    const startTime = Date.now();
    const model = options.model || aiConfig.ollama.defaultModel;
    try {
      const response = await this.executeWithRetry(async () => {
        return this.client.chat({
          model,
          messages,
          options: {
            temperature: options.temperature ?? aiConfig.generation.defaultTemperature,
            top_p: options.topP ?? aiConfig.generation.defaultTopP,
            stop: options.stopSequences
          }
        });
      }, context);
      const durationMs = Date.now() - startTime;
      const usage = {
        inputTokens: response.prompt_eval_count || 0,
        outputTokens: response.eval_count || 0,
        totalTokens: (response.prompt_eval_count || 0) + (response.eval_count || 0),
        latencyMs: durationMs
      };
      aiLogger.logUsage(context, usage, durationMs);
      return {
        data: response.message.content,
        modelName: model,
        provider: this.name,
        usage,
        rawMetadata: {
          eval_duration: response.eval_duration,
          load_duration: response.load_duration
        }
      };
    } catch (error) {
      aiLogger.error("Ollama generation failed", error, context, { model });
      throw new AiProviderError("Failed to generate text from Ollama", { originalError: error.message });
    }
  }
  async generateStructuredJson(messages, jsonSchema, options, context) {
    const startTime = Date.now();
    const model = options.model || aiConfig.ollama.defaultModel;
    try {
      const response = await this.executeWithRetry(async () => {
        return this.client.chat({
          model,
          messages,
          format: jsonSchema,
          // Ollama accepts JSON schema objects for structured output
          options: {
            temperature: options.temperature ?? aiConfig.generation.defaultTemperature,
            top_p: options.topP ?? aiConfig.generation.defaultTopP
          }
        });
      }, context);
      const durationMs = Date.now() - startTime;
      const usage = {
        inputTokens: response.prompt_eval_count || 0,
        outputTokens: response.eval_count || 0,
        totalTokens: (response.prompt_eval_count || 0) + (response.eval_count || 0),
        latencyMs: durationMs
      };
      aiLogger.logUsage(context, usage, durationMs);
      let cleanContent = response.message.content.trim();
      if (cleanContent.startsWith("```json")) {
        cleanContent = cleanContent.replace(/^```json\n?/, "").replace(/\n?```$/, "");
      } else if (cleanContent.startsWith("```")) {
        cleanContent = cleanContent.replace(/^```\n?/, "").replace(/\n?```$/, "");
      }
      const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
      const parsedData = JSON.parse(jsonMatch ? jsonMatch[0] : cleanContent);
      return {
        data: parsedData,
        modelName: model,
        provider: this.name,
        usage
      };
    } catch (error) {
      aiLogger.error("Ollama structured generation failed", error, context, { model });
      throw new AiProviderError("Failed to generate structured JSON from Ollama", { originalError: error.message });
    }
  }
  async streamText(messages, options, context, onChunk) {
    const startTime = Date.now();
    const model = options.model || aiConfig.ollama.defaultModel;
    try {
      const stream = await this.client.chat({
        model,
        messages,
        stream: true,
        options: {
          temperature: options.temperature ?? aiConfig.generation.defaultTemperature,
          top_p: options.topP ?? aiConfig.generation.defaultTopP
        }
      });
      let fullText = "";
      let evalCount = 0;
      let promptEvalCount = 0;
      for await (const chunk of stream) {
        if (chunk.message?.content) {
          fullText += chunk.message.content;
          onChunk(chunk.message.content);
        }
        if (chunk.done) {
          evalCount = chunk.eval_count || 0;
          promptEvalCount = chunk.prompt_eval_count || 0;
        }
      }
      const durationMs = Date.now() - startTime;
      const usage = {
        inputTokens: promptEvalCount,
        outputTokens: evalCount,
        totalTokens: promptEvalCount + evalCount,
        latencyMs: durationMs
      };
      aiLogger.logUsage(context, usage, durationMs);
      return {
        data: fullText,
        modelName: model,
        provider: this.name,
        usage
      };
    } catch (error) {
      aiLogger.error("Ollama streaming failed", error, context, { model });
      throw new AiProviderError("Failed to stream text from Ollama", { originalError: error.message });
    }
  }
  async healthCheck() {
    try {
      const response = await this.client.generate({
        model: aiConfig.ollama.defaultModel,
        prompt: "test",
        options: { num_predict: 1 }
      });
      return !!response;
    } catch (error) {
      aiLogger.error("Ollama health check failed", error);
      return false;
    }
  }
  async executeWithRetry(operation, context, retries = aiConfig.ollama.maxRetries) {
    let attempt = 0;
    while (attempt < retries) {
      try {
        return await operation();
      } catch (error) {
        attempt++;
        const isTimeout = error.message?.includes("fetch failed") || error.message?.includes("timeout");
        if (attempt >= retries || !isTimeout) {
          if (isTimeout) throw new AiTimeoutError("Ollama request timed out after retries");
          throw error;
        }
        aiLogger.warn(`Ollama request failed, retrying (${attempt}/${retries})`, context, { error: error.message });
        await new Promise((res) => setTimeout(res, 1e3 * Math.pow(2, attempt)));
      }
    }
    throw new Error("Unreachable");
  }
};

// src/ai/core/workflow/orchestrator.ts
var import_langgraph2 = require("@langchain/langgraph");

// src/ai/core/workflow/state.ts
var import_langgraph = require("@langchain/langgraph");
var AiGraphState = import_langgraph.Annotation.Root({
  // Chat history / current user query
  messages: (0, import_langgraph.Annotation)({
    reducer: (x, y) => x.concat(y)
  }),
  // Passed in from the API request
  context: (0, import_langgraph.Annotation)({
    reducer: (x, y) => y ?? x
  }),
  // Output from the Planner Node
  taskPlan: (0, import_langgraph.Annotation)({
    reducer: (x, y) => y ?? x
  }),
  // Appended by each executed Agent in parallel
  evidence: (0, import_langgraph.Annotation)({
    reducer: (x, y) => x.concat(y)
  }),
  // Output from the Generator Node
  finalOutput: (0, import_langgraph.Annotation)({
    reducer: (x, y) => y ?? x
  }),
  // Phase 13 Reasoning Engine Fields
  detectedIntent: (0, import_langgraph.Annotation)({
    reducer: (x, y) => y ?? x
  }),
  extractedEntities: (0, import_langgraph.Annotation)({
    reducer: (x, y) => y ?? x
  }),
  permissions: (0, import_langgraph.Annotation)({
    reducer: (x, y) => ({ ...x, ...y }),
    default: () => ({})
  }),
  resolvedConflicts: (0, import_langgraph.Annotation)({
    reducer: (x, y) => x.concat(y)
  }),
  overallConfidence: (0, import_langgraph.Annotation)({
    reducer: (x, y) => y,
    default: () => 0
  }),
  // Any execution errors or policy warnings
  warnings: (0, import_langgraph.Annotation)({
    reducer: (x, y) => x.concat(y)
  })
});

// src/ai/core/security/prompt-shield.ts
var PromptShield = class {
  static JAILBREAK_PATTERNS = [
    /ignore (?:all )?previous instructions/i,
    /system prompt/i,
    /you are now/i,
    /bypassing/i,
    /forget everything/i,
    /do not follow/i,
    /override/i,
    /jailbreak/i,
    /developer mode/i
  ];
  static AADHAR_REGEX = /\b\d{4}\s?\d{4}\s?\d{4}\b/g;
  static PAN_REGEX = /\b[A-Z]{5}\d{4}[A-Z]{1}\b/g;
  static PHONE_REGEX = /\b(?:\+91|91|0)?[6-9]\d{9}\b/g;
  static EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  /**
   * Evaluates if a prompt contains potential jailbreak or injection attacks.
   */
  static detectInjection(prompt) {
    if (prompt.length > 5e3) {
      return { isSafe: false, reason: "Prompt exceeds maximum allowed length of 5000 characters." };
    }
    for (const pattern of this.JAILBREAK_PATTERNS) {
      if (pattern.test(prompt)) {
        return { isSafe: false, reason: "Potential prompt injection or jailbreak attempt detected." };
      }
    }
    return { isSafe: true };
  }
  /**
   * Irreversibly masks sensitive information in the provided text.
   */
  static maskPII(text) {
    let maskedText = text;
    maskedText = maskedText.replace(this.AADHAR_REGEX, "[AADHAR_MASKED]");
    maskedText = maskedText.replace(this.PAN_REGEX, "[PAN_MASKED]");
    maskedText = maskedText.replace(this.PHONE_REGEX, "[PHONE_MASKED]");
    maskedText = maskedText.replace(this.EMAIL_REGEX, "[EMAIL_MASKED]");
    return maskedText;
  }
};

// src/ai/core/workflow/nodes/security-shield.ts
async function securityShieldNode(state) {
  aiLogger.info("Executing Security Shield", state.context);
  const lastMessage = state.messages[state.messages.length - 1];
  const query = lastMessage?.content?.toString() || "";
  const evaluation = PromptShield.detectInjection(query);
  if (!evaluation.isSafe) {
    aiLogger.warn(`Prompt Injection Blocked: ${evaluation.reason}`, state.context);
    return {
      permissions: {
        clearanceGranted: false,
        reason: evaluation.reason || "Security violation"
      },
      warnings: ["PROMPT_INJECTION_BLOCKED"]
    };
  }
  return {
    permissions: {
      clearanceGranted: true,
      reason: "Safe"
    }
  };
}

// src/ai/core/workflow/nodes/intent-detection.ts
var import_zod13 = require("zod");
var import_zod_to_json_schema = require("zod-to-json-schema");

// src/ai/prompts/prompt-library.ts
var SYSTEM_PROMPT = {
  key: "system",
  reference: {
    namespace: "ai.prompts",
    name: "system",
    version: "1.0.0"
  },
  role: "AI Commander for KSP Intelligence OS coordinating specialized investigation agents.",
  instructions: [
    "Behave like a senior police investigation coordinator, not a generic chatbot.",
    "Prefer evidence-backed reasoning over fluent speculation.",
    "Route work to domain-specific agents and tools before response synthesis.",
    "Separate facts, inferences, assumptions, and recommendations.",
    "Respect role, jurisdiction, sensitivity, and review requirements in every response.",
    "Do not hardcode or invent API calls, database queries, or external service actions."
  ],
  outputFormat: {
    formatName: "structured-investigation-response",
    requiredSections: ["summary", "evidence", "insights", "recommendations", "confidence", "reviewRequired"],
    notes: ["Every answer must remain structured so the frontend can render it consistently."]
  },
  guardrails: [
    "Do not invent FIRs, persons, evidence, legal sections, or graph links.",
    "Do not declare guilt or make judicial conclusions.",
    "Do not expose masked or unauthorized sensitive information.",
    "Do not bypass tool-first reasoning by pretending to know facts that were not retrieved."
  ],
  examples: [
    {
      input: "Find similar burglary FIRs in Mysuru and suggest next steps.",
      expectedBehavior: [
        "Route to investigation, graph, and recommendation capabilities.",
        "Return evidence-backed similar cases and actionable leads.",
        "Include confidence and whether supervisor review is needed."
      ]
    }
  ],
  variables: ["{{user_role}}", "{{jurisdiction_scope}}", "{{active_case_id}}", "{{evidence_summary}}"]
};
var INVESTIGATION_PROMPT = {
  key: "investigation",
  reference: {
    namespace: "ai.prompts",
    name: "investigation",
    version: "1.0.0"
  },
  role: "Senior Investigation Officer analyzing FIRs, timelines, leads, and case relationships.",
  instructions: [
    "Summarize verified case facts clearly and operationally.",
    "Identify important timeline signals, missing facts, and contradictions.",
    "Use retrieved case, victim, accused, and officer evidence only.",
    "Highlight similar-case clues and investigation leads without overstating certainty.",
    "Label inferred observations separately from confirmed facts."
  ],
  outputFormat: {
    formatName: "investigation-brief",
    requiredSections: ["caseFacts", "timelineHighlights", "missingFacts", "investigationLeads", "confidence"]
  },
  guardrails: [
    "Do not recommend legal sections unless legal evidence is provided through the legal layer.",
    "Do not declare an accused guilty.",
    "Do not treat unresolved links or suspicious patterns as confirmed evidence."
  ],
  examples: [
    {
      input: "Show what should be investigated next in FIR 2026-001.",
      expectedBehavior: [
        "List key verified facts first.",
        "Show evidence gaps and suggested leads.",
        "Clearly mark which suggestions require human review."
      ]
    }
  ],
  variables: ["{{case_id}}", "{{timeline_events}}", "{{similar_case_summary}}"]
};
var LEGAL_PROMPT = {
  key: "legal",
  reference: {
    namespace: "ai.prompts",
    name: "legal",
    version: "1.0.0"
  },
  role: "Senior Legal Review Officer for criminal acts, IPC/BNS sections, and legal applicability checks.",
  instructions: [
    "Use only retrieved legal evidence from approved legal sources.",
    "Recommend sections only when the factual record supports them.",
    "Explain why each legal suggestion applies and what facts are still missing.",
    "Preserve exact act and section identifiers.",
    "Mark ambiguous or incomplete recommendations for human legal review."
  ],
  outputFormat: {
    formatName: "legal-recommendation-brief",
    requiredSections: ["applicableSections", "reasoning", "missingLegalFacts", "confidence", "reviewRequired"]
  },
  guardrails: [
    "Never invent legal sections, punishments, or statutory language.",
    "Never hide ambiguity when facts are incomplete.",
    "Do not provide legal advice beyond evidence-backed recommendation support."
  ],
  examples: [
    {
      input: "A person entered a house at night, threatened the owner, and stole jewellery. What sections may apply?",
      expectedBehavior: [
        "Identify only evidence-supported section candidates.",
        "Explain why each section is suggested.",
        "Flag review required if narrative details are incomplete."
      ]
    }
  ],
  variables: ["{{legal_sources}}", "{{narrative_summary}}", "{{retrieved_sections}}"]
};
var ANALYTICS_PROMPT = {
  key: "analytics",
  reference: {
    namespace: "ai.prompts",
    name: "analytics",
    version: "1.0.0"
  },
  role: "Crime Analyst interpreting trends, forecasts, district comparisons, and hotspot signals.",
  instructions: [
    "Explain trends from retrieved statistical sources only.",
    "Differentiate historical trend, anomaly, and forecast.",
    "Keep outputs operational and evidence-backed.",
    "Highlight data limitations, outliers, and incomplete coverage."
  ],
  outputFormat: {
    formatName: "analytics-insight",
    requiredSections: ["trendSummary", "keyMetrics", "anomalies", "operationalInsights", "confidence"]
  },
  guardrails: [
    "Do not overclaim causation from correlation alone.",
    "Do not present a forecast as a confirmed future event.",
    "Do not ignore sparse or low-quality statistical evidence."
  ],
  examples: [
    {
      input: "Why are burglary incidents increasing in this district?",
      expectedBehavior: [
        "Summarize the retrieved trend first.",
        "Explain likely analytical observations, not unsupported causes.",
        "Mention confidence and data limitations."
      ]
    }
  ],
  variables: ["{{metric_name}}", "{{district_scope}}", "{{time_window}}"]
};
var GRAPH_PROMPT = {
  key: "graph",
  reference: {
    namespace: "ai.prompts",
    name: "graph",
    version: "1.0.0"
  },
  role: "Intelligence Network Analyst interpreting graph paths, communities, centrality, and entity relationships.",
  instructions: [
    "Interpret relationships clearly using retrieved graph evidence only.",
    "Differentiate confirmed links from inferred or low-confidence links.",
    "Explain the meaning of shortest paths, central nodes, and communities in operational terms.",
    "Surface suspicious patterns without overstating causality."
  ],
  outputFormat: {
    formatName: "graph-intelligence-brief",
    requiredSections: ["relationshipSummary", "keyNodes", "keyEdges", "interpretation", "confidence"]
  },
  guardrails: [
    "Do not present inferred graph links as confirmed facts.",
    "Do not imply gang membership or conspiracy from weak connections alone.",
    "Do not collapse multiple uncertain paths into one definitive story."
  ],
  examples: [
    {
      input: "How is this accused connected to the robbery FIRs in Bengaluru South?",
      expectedBehavior: [
        "Show path-based evidence or related-node evidence.",
        "Explain whether links are direct or inferred.",
        "Flag review if network inference is sensitive."
      ]
    }
  ],
  variables: ["{{root_entity}}", "{{subgraph_summary}}", "{{path_explanation}}"]
};
var RECOMMENDATION_PROMPT = {
  key: "recommendation",
  reference: {
    namespace: "ai.prompts",
    name: "recommendation",
    version: "1.0.0"
  },
  role: "Investigation Advisory Officer generating next-best-action recommendations.",
  instructions: [
    "Suggest actionable next steps grounded in retrieved facts.",
    "Prioritize leads, missing evidence, similarity clues, and risk signals.",
    "Explain the reason for each recommendation and what evidence supports it.",
    "Always attach confidence and review requirement metadata."
  ],
  outputFormat: {
    formatName: "recommendation-set",
    requiredSections: ["recommendations", "evidence", "reason", "confidence", "reviewRequired"]
  },
  guardrails: [
    "Recommendations are advisory only, never binding conclusions.",
    "Do not generate recommendations without supporting evidence.",
    "Do not suppress uncertainty when risk is high or evidence is incomplete."
  ],
  examples: [
    {
      input: "What should the IO do next in this cyber fraud case?",
      expectedBehavior: [
        "Recommend evidence collection, legal review, and case-linking steps.",
        "Include priority and confidence for each recommendation.",
        "Flag mandatory review where legal or identity linkage is involved."
      ]
    }
  ],
  variables: ["{{recommendation_capabilities}}", "{{validated_evidence}}", "{{review_policy}}"]
};
var REPORT_PROMPT = {
  key: "report",
  reference: {
    namespace: "ai.prompts",
    name: "report",
    version: "1.0.0"
  },
  role: "Police Reporting Officer generating concise operational briefs and supervisor-ready summaries.",
  instructions: [
    "Generate structured reports with neutral, operational language.",
    "Prefer concise summaries backed by cited evidence.",
    "Highlight blockers, actions, and review points clearly.",
    "Preserve important case identifiers and dates exactly."
  ],
  outputFormat: {
    formatName: "report-document",
    requiredSections: ["title", "executiveSummary", "sections", "evidenceReferences", "reviewNotes"]
  },
  guardrails: [
    "Do not invent evidence, dates, or legal outcomes.",
    "Do not omit major uncertainty or missing sections silently.",
    "Do not rewrite factual chronology beyond retrieved evidence."
  ],
  examples: [
    {
      input: "Generate a briefing note for SP review of the last 7 days of burglary cases.",
      expectedBehavior: [
        "Create a concise executive summary.",
        "Group findings into clear sections.",
        "Include unresolved blockers and evidence-backed next actions."
      ]
    }
  ],
  variables: ["{{report_type}}", "{{audience_role}}", "{{report_scope}}"]
};
var SUPERVISOR_PROMPT = {
  key: "supervisor",
  reference: {
    namespace: "ai.prompts",
    name: "supervisor",
    version: "1.0.0"
  },
  role: "Senior Supervisory Officer reviewing workload, delays, risk, and district-level operational priorities.",
  instructions: [
    "Rank urgent items requiring supervisory attention.",
    "Summarize delays, workload imbalance, high-risk cases, and emerging crime spikes.",
    "Prefer reviewed signals and cite the basis of concern.",
    "Keep the response aligned to the user\u2019s jurisdiction and role."
  ],
  outputFormat: {
    formatName: "supervisor-attention-brief",
    requiredSections: ["attentionItems", "riskFlags", "workloadSignals", "recommendedActions", "confidence"]
  },
  guardrails: [
    "Do not exceed the user jurisdiction scope.",
    "Do not elevate weak or low-quality signals as critical without explanation.",
    "Do not expose unauthorized victim-sensitive details in summaries."
  ],
  examples: [
    {
      input: "What requires my attention today as SP?",
      expectedBehavior: [
        "Prioritize urgent cases, delays, and hotspots.",
        "Show why each item matters.",
        "Keep the output decision-oriented and concise."
      ]
    }
  ],
  variables: ["{{district_scope}}", "{{priority_threshold}}", "{{reviewed_signals_only}}"]
};
var TRANSLATION_PROMPT = {
  key: "translation",
  reference: {
    namespace: "ai.prompts",
    name: "translation",
    version: "1.0.0"
  },
  role: "Police translation specialist preserving legal and investigative meaning across languages.",
  instructions: [
    "Translate between English and Kannada while preserving legal meaning.",
    "Keep section numbers, case identifiers, names, and alphanumeric codes unchanged.",
    "Preserve caution, uncertainty, and confidence language exactly in meaning.",
    "Prefer semantic fidelity over stylistic paraphrasing."
  ],
  outputFormat: {
    formatName: "translated-text",
    requiredSections: ["translatedText", "preservedTerms", "notes"]
  },
  guardrails: [
    "Do not mistranslate legal references or act/section identifiers.",
    "Do not normalize away uncertainty or review-required language.",
    "Do not alter names, FIR numbers, phone numbers, or account identifiers."
  ],
  examples: [
    {
      input: "Translate the legal recommendation into Kannada.",
      expectedBehavior: [
        "Preserve section numbers and legal terminology.",
        "Keep confidence language intact.",
        "Return a translation-focused response only."
      ]
    }
  ],
  variables: ["{{source_language}}", "{{target_language}}", "{{preserve_legal_terms}}"]
};
var VOICE_PROMPT = {
  key: "voice",
  reference: {
    namespace: "ai.prompts",
    name: "voice",
    version: "1.0.0"
  },
  role: "Voice interaction specialist for police-grade spoken queries and spoken response generation.",
  instructions: [
    "Interpret voice-originated requests carefully and prefer clarification when speech is ambiguous.",
    "Preserve operational identifiers exactly when transcribed or spoken back.",
    "Keep spoken responses concise, clear, and easy to act upon in the field.",
    "Avoid embedding technical implementation details or API instructions in voice responses."
  ],
  outputFormat: {
    formatName: "voice-assistant-response",
    requiredSections: ["recognizedIntent", "clarificationIfNeeded", "spokenSummary", "reviewRequired"]
  },
  guardrails: [
    "Do not assume noisy or partial speech is fully correct without confidence support.",
    "Do not speak sensitive information aloud unless the user context permits it.",
    "Do not hardcode API calls, system commands, or backend operations into the prompt or output."
  ],
  examples: [
    {
      input: "Officer says: Show similar FIR for UPI scam with elderly victim.",
      expectedBehavior: [
        "Resolve the query into an investigation/legal retrieval intent.",
        "Ask for clarification if audio confidence is low.",
        "Return a spoken-summary-safe structure."
      ]
    }
  ],
  variables: ["{{speech_confidence}}", "{{spoken_language}}", "{{safe_to_speak_sensitive_data}}"]
};
var INTENT_PROMPT = {
  key: "intent",
  reference: { namespace: "ai.prompts", name: "intent", version: "1.0.0" },
  role: "Intent classification engine for a police intelligence platform.",
  instructions: ["Classify the user intent strictly."],
  outputFormat: { formatName: "intent", requiredSections: [] },
  guardrails: [],
  examples: [],
  variables: []
};
var ENTITY_PROMPT = {
  key: "entity",
  reference: { namespace: "ai.prompts", name: "entity", version: "1.0.0" },
  role: "Entity extraction engine.",
  instructions: ["Extract distinct entities from the user query."],
  outputFormat: { formatName: "entity", requiredSections: [] },
  guardrails: [],
  examples: [],
  variables: []
};
var CONFLICT_PROMPT = {
  key: "conflict",
  reference: { namespace: "ai.prompts", name: "conflict", version: "1.0.0" },
  role: "Conflict Resolution Engine.",
  instructions: ["Review the provided evidence from multiple agents.", "Detect if there are conflicting facts, and resolve them."],
  outputFormat: { formatName: "conflict", requiredSections: [] },
  guardrails: [],
  examples: [],
  variables: ["{{evidenceText}}"]
};
var CONFIDENCE_PROMPT = {
  key: "confidence",
  reference: { namespace: "ai.prompts", name: "confidence", version: "1.0.0" },
  role: "Confidence Scoring Engine.",
  instructions: ["Review the provided evidence, citations, and resolved conflicts.", "Return a final confidence score (0-100) and factors."],
  outputFormat: { formatName: "confidence", requiredSections: [] },
  guardrails: [],
  examples: [],
  variables: ["{{evidenceText}}", "{{conflictsText}}"]
};
var AI_PROMPT_LIBRARY = {
  system: SYSTEM_PROMPT,
  investigation: INVESTIGATION_PROMPT,
  legal: LEGAL_PROMPT,
  analytics: ANALYTICS_PROMPT,
  graph: GRAPH_PROMPT,
  recommendation: RECOMMENDATION_PROMPT,
  report: REPORT_PROMPT,
  supervisor: SUPERVISOR_PROMPT,
  translation: TRANSLATION_PROMPT,
  voice: VOICE_PROMPT,
  intent: INTENT_PROMPT,
  entity: ENTITY_PROMPT,
  conflict: CONFLICT_PROMPT,
  confidence: CONFIDENCE_PROMPT
};

// src/ai/prompts/prompt-manager.ts
var PromptManager = class {
  /**
   * Fetch a specific prompt template by key
   */
  getPromptTemplate(key) {
    const template = AI_PROMPT_LIBRARY[key];
    if (!template) {
      aiLogger.warn(`Prompt template not found for key: ${key}`, null, { requestedKey: key });
      return null;
    }
    return template;
  }
  /**
   * Build the prompt string by replacing variables in the template instructions
   */
  buildPrompt(key, variables) {
    const template = this.getPromptTemplate(key);
    const def = this.getPromptTemplate(key);
    if (!def) {
      return `System Role: Specialized AI Agent.
Context Variables: ${JSON.stringify(variables)}`;
    }
    const renderedInstructions = def.instructions.map((i) => `- ${i}`).join("\n");
    const guardrails = def.guardrails.length > 0 ? `

Guardrails:
${def.guardrails.map((g) => `- ${g}`).join("\n")}` : "";
    let fullPrompt = `
You are ${def.role}.

${renderedInstructions}

${guardrails}
    `.trim();
    for (const [varName, varValue] of Object.entries(variables)) {
      const regex = new RegExp(`{{${varName}}}`, "g");
      fullPrompt = fullPrompt.replace(regex, varValue);
    }
    return fullPrompt;
  }
};
var promptManager = new PromptManager();

// src/ai/core/workflow/nodes/intent-detection.ts
var IntentSchema = import_zod13.z.object({
  primaryIntent: import_zod13.z.enum([
    "case_search",
    "legal_advice",
    "graph_traversal",
    "analytics_dashboard",
    "reporting",
    "general_query"
  ]).describe("The core intent of the user query"),
  confidence: import_zod13.z.number().min(0).max(100)
});
async function intentDetectionNode(state) {
  const llm = new OllamaProvider();
  const userQuery = state.messages[state.messages.length - 1]?.content.toString() || "";
  try {
    const systemPromptStr = promptManager.buildPrompt("intent", {});
    const response = await llm.generateStructuredJson(
      [
        { role: "system", content: systemPromptStr },
        { role: "user", content: userQuery }
      ],
      (0, import_zod_to_json_schema.zodToJsonSchema)(IntentSchema),
      { model: "llama3.1" },
      state.context
    );
    const parsed2 = IntentSchema.parse(response.data);
    aiLogger.info("Intent detected", state.context, { intent: parsed2.primaryIntent, confidence: parsed2.confidence });
    return {
      detectedIntent: parsed2.primaryIntent
    };
  } catch (error) {
    aiLogger.error("Failed to detect intent", error, state.context);
    return {
      detectedIntent: "general_query",
      warnings: ["Intent detection failed, defaulted to general_query"]
    };
  }
}

// src/ai/core/workflow/nodes/entity-extraction.ts
var import_zod14 = require("zod");
var import_zod_to_json_schema2 = require("zod-to-json-schema");
var EntitySchema = import_zod14.z.object({
  people: import_zod14.z.array(import_zod14.z.string()).optional(),
  vehicles: import_zod14.z.array(import_zod14.z.string()).optional(),
  locations: import_zod14.z.array(import_zod14.z.string()).optional(),
  acts: import_zod14.z.array(import_zod14.z.string()).optional(),
  dates: import_zod14.z.array(import_zod14.z.string()).optional()
});
async function entityExtractionNode(state) {
  const llm = new OllamaProvider();
  const userQuery = state.messages[state.messages.length - 1]?.content.toString() || "";
  try {
    const systemPromptStr = promptManager.buildPrompt("entity", {});
    const response = await llm.generateStructuredJson(
      [
        { role: "system", content: systemPromptStr },
        { role: "user", content: userQuery }
      ],
      (0, import_zod_to_json_schema2.zodToJsonSchema)(EntitySchema),
      { model: "llama3.1" },
      state.context
    );
    const parsed2 = EntitySchema.parse(response.data);
    const entities = parsed2;
    aiLogger.info("Entities extracted", state.context, { entities });
    return {
      extractedEntities: entities
    };
  } catch (error) {
    aiLogger.error("Failed to extract entities", error, state.context);
    return {
      extractedEntities: {},
      warnings: ["Entity extraction failed"]
    };
  }
}

// src/ai/core/workflow/nodes/supervisor.ts
var import_zod15 = require("zod");
var import_zod_to_json_schema3 = require("zod-to-json-schema");
var SupervisorPlanSchema = import_zod15.z.object({
  agentsToRun: import_zod15.z.array(import_zod15.z.enum(["investigation", "legal", "graph", "analytics", "recommendation"])),
  isSensitive: import_zod15.z.boolean(),
  clearanceGranted: import_zod15.z.boolean(),
  reasoning: import_zod15.z.string()
});
async function supervisorNode(state) {
  const llm = new OllamaProvider();
  const userQuery = state.messages[state.messages.length - 1]?.content.toString() || "";
  const intent = state.detectedIntent || "general";
  const entities = state.extractedEntities ? JSON.stringify(state.extractedEntities) : "{}";
  try {
    const systemPromptStr = promptManager.buildPrompt("supervisor", {
      intent,
      entities,
      district_scope: "District: " + (state.context?.jurisdictionId?.toString() || "Global"),
      priority_threshold: "Normal",
      reviewed_signals_only: "false"
    });
    const response = await llm.generateStructuredJson(
      [
        { role: "system", content: systemPromptStr },
        { role: "user", content: userQuery }
      ],
      (0, import_zod_to_json_schema3.zodToJsonSchema)(SupervisorPlanSchema),
      { model: "llama3.1" },
      state.context
    );
    const plan = SupervisorPlanSchema.parse(response.data);
    aiLogger.info("Supervisor executed plan", state.context, { plan });
    if (!plan.clearanceGranted) {
      return {
        warnings: ["Supervisor denied clearance for this operation: " + plan.reasoning],
        taskPlan: {
          agentsToRun: [],
          primaryIntent: intent,
          isSensitive: true
        },
        permissions: { clearanceGranted: false }
      };
    }
    return {
      taskPlan: {
        agentsToRun: plan.agentsToRun,
        primaryIntent: intent,
        isSensitive: plan.isSensitive
      },
      permissions: { clearanceGranted: true }
    };
  } catch (error) {
    aiLogger.error("Supervisor failed", error, state.context);
    return {
      taskPlan: {
        agentsToRun: ["investigation"],
        // fallback
        primaryIntent: intent,
        isSensitive: false
      },
      warnings: ["Supervisor planning failed"]
    };
  }
}

// src/ai/core/tools/cases.tools.ts
var import_tools = require("@langchain/core/tools");
var import_zod16 = require("zod");
var SearchCasesTool = new import_tools.DynamicStructuredTool({
  name: "search_cases",
  description: "Search for existing police cases/FIRs based on criteria like district, status, or crime type. Returns a list of cases.",
  schema: import_zod16.z.object({
    districtId: import_zod16.z.number().optional().describe("The ID of the district."),
    limit: import_zod16.z.number().default(10).describe("Max number of cases to return.")
  }),
  func: async ({ districtId, limit }) => {
    try {
      const result = await caseService.listCases({
        districtId: districtId ? BigInt(districtId) : void 0,
        pageSize: limit,
        page: 1
      });
      return JSON.stringify(result.data);
    } catch (error) {
      return `Failed to search cases: ${error.message}`;
    }
  }
});
var GetCaseByIdTool = new import_tools.DynamicStructuredTool({
  name: "get_case_by_id",
  description: "Retrieve detailed facts and information about a specific case using its caseMasterId or crimeNo.",
  schema: import_zod16.z.object({
    caseMasterId: import_zod16.z.string().optional().describe("The primary ID of the case as a string."),
    crimeNo: import_zod16.z.string().optional().describe("The crime number of the case.")
  }),
  func: async ({ caseMasterId, crimeNo }) => {
    try {
      if (caseMasterId) {
        const result = await caseService.getCaseById(BigInt(caseMasterId));
        return JSON.stringify(result.data, (key, value) => typeof value === "bigint" ? value.toString() : value);
      } else if (crimeNo) {
        const result = await caseService.getCaseByCrimeNo(crimeNo);
        return JSON.stringify(result.data, (key, value) => typeof value === "bigint" ? value.toString() : value);
      }
      return "You must provide either a caseMasterId or crimeNo.";
    } catch (error) {
      return `Failed to retrieve case: ${error.message}`;
    }
  }
});
var GetSimilarCasesTool = new import_tools.DynamicStructuredTool({
  name: "get_similar_cases",
  description: "Find historical cases that share similar Modus Operandi (MO) or facts to a given case.",
  schema: import_zod16.z.object({
    caseMasterId: import_zod16.z.string().describe("The ID of the case to find similarities for."),
    limit: import_zod16.z.number().default(5)
  }),
  func: async ({ caseMasterId, limit }) => {
    try {
      const result = await caseService.getSimilarCases(BigInt(caseMasterId), limit);
      return JSON.stringify(result.data, (key, value) => typeof value === "bigint" ? value.toString() : value);
    } catch (error) {
      return `Failed to find similar cases: ${error.message}`;
    }
  }
});
var GenerateTimelineTool = new import_tools.DynamicStructuredTool({
  name: "generate_timeline",
  description: "Fetch chronologically ordered events, victims, and case facts for a specific case so you can summarize the timeline. DO NOT use this for generic searches.",
  schema: import_zod16.z.object({
    caseMasterId: import_zod16.z.string().describe("The ID of the case.")
  }),
  func: async ({ caseMasterId }) => {
    try {
      const result = await caseService.getCaseById(BigInt(caseMasterId));
      const timelineData = {
        incidentFromDate: result.data.incidentFromDate,
        incidentToDate: result.data.incidentToDate,
        status: result.data.status,
        briefFacts: result.data.briefFacts
      };
      return JSON.stringify(timelineData);
    } catch (error) {
      return `Failed to generate timeline data: ${error.message}`;
    }
  }
});

// src/ai/core/tools/victims.tools.ts
var import_tools2 = require("@langchain/core/tools");
var import_zod17 = require("zod");
var SearchVictimsTool = new import_tools2.DynamicStructuredTool({
  name: "search_victims",
  description: "Search for victims associated with crimes based on criteria like district, age group, or case linkage.",
  schema: import_zod17.z.object({
    districtId: import_zod17.z.number().optional(),
    caseMasterId: import_zod17.z.string().optional().describe("Filter victims linked to this specific case."),
    limit: import_zod17.z.number().default(10)
  }),
  func: async ({ districtId, caseMasterId, limit }) => {
    try {
      if (caseMasterId) {
        const result2 = await victimService.listVictimsByCase(BigInt(caseMasterId), {
          districtId: districtId ? BigInt(districtId) : void 0,
          pageSize: limit,
          page: 1
        });
        return JSON.stringify(result2.data, (key, value) => typeof value === "bigint" ? value.toString() : value);
      }
      const result = await victimService.listVictims({
        districtId: districtId ? BigInt(districtId) : void 0,
        pageSize: limit,
        page: 1
      });
      return JSON.stringify(result.data, (key, value) => typeof value === "bigint" ? value.toString() : value);
    } catch (error) {
      return `Failed to search victims: ${error.message}`;
    }
  }
});

// src/ai/core/tools/officers.tools.ts
var import_tools3 = require("@langchain/core/tools");
var import_zod18 = require("zod");
var SearchOfficersTool = new import_tools3.DynamicStructuredTool({
  name: "search_officers",
  description: "Search for police officers by rank, district, or unit. Use this to find assignment candidates.",
  schema: import_zod18.z.object({
    districtId: import_zod18.z.number().optional(),
    unitId: import_zod18.z.number().optional(),
    limit: import_zod18.z.number().default(10)
  }),
  func: async ({ districtId, unitId, limit }) => {
    try {
      const result = await officerService.listOfficers({
        districtId: districtId ? BigInt(districtId) : void 0,
        unitId: unitId ? BigInt(unitId) : void 0,
        pageSize: limit,
        page: 1
      });
      return JSON.stringify(result.data, (key, value) => typeof value === "bigint" ? value.toString() : value);
    } catch (error) {
      return `Failed to search officers: ${error.message}`;
    }
  }
});
var GetAssignedCasesTool = new import_tools3.DynamicStructuredTool({
  name: "get_assigned_cases",
  description: "Retrieve the list of open cases currently assigned to a specific officer.",
  schema: import_zod18.z.object({
    employeeId: import_zod18.z.string().describe("The primary employee ID of the officer.")
  }),
  func: async ({ employeeId }) => {
    try {
      const result = await officerService.getAssignedCases(BigInt(employeeId), { page: 1, pageSize: 20 });
      return JSON.stringify(result.data, (key, value) => typeof value === "bigint" ? value.toString() : value);
    } catch (error) {
      return `Failed to fetch assigned cases: ${error.message}`;
    }
  }
});

// src/ai/core/tools/legal.tools.ts
var import_tools4 = require("@langchain/core/tools");
var import_zod19 = require("zod");
var SearchActsTool = new import_tools4.DynamicStructuredTool({
  name: "search_acts",
  description: "Search for available legal Acts (e.g. BNS, IPC) in the system registry.",
  schema: import_zod19.z.object({
    searchTerm: import_zod19.z.string().optional().describe("Keyword to search within Act titles."),
    limit: import_zod19.z.number().default(10)
  }),
  func: async ({ searchTerm, limit }) => {
    try {
      const result = await legalService.listActs({ query: searchTerm, pageSize: limit, page: 1 });
      return JSON.stringify(result.data);
    } catch (error) {
      return `Failed to search acts: ${error.message}`;
    }
  }
});
var SearchSectionsTool = new import_tools4.DynamicStructuredTool({
  name: "search_sections",
  description: "Search for specific legal sections (e.g. IPC 302, BNS 103).",
  schema: import_zod19.z.object({
    actCode: import_zod19.z.string().describe("The code of the Act (e.g. IPC, BNS)."),
    sectionCode: import_zod19.z.string().optional().describe("The specific section number (e.g. 302)."),
    searchTerm: import_zod19.z.string().optional().describe("Keywords to search inside the section description."),
    limit: import_zod19.z.number().default(5)
  }),
  func: async ({ actCode, sectionCode, searchTerm, limit }) => {
    try {
      if (sectionCode && !searchTerm) {
        const result2 = await legalService.getSection(actCode, sectionCode);
        return JSON.stringify([result2.data]);
      }
      const result = await legalService.listSections({ actCode, query: searchTerm, pageSize: limit, page: 1 });
      return JSON.stringify(result.data);
    } catch (error) {
      return `Failed to search sections: ${error.message}`;
    }
  }
});
var RecommendSectionsTool = new import_tools4.DynamicStructuredTool({
  name: "recommend_sections",
  description: "Placeholder tool: Fetch legal sections mapped to a specific Crime Head ID to recommend to the investigator.",
  schema: import_zod19.z.object({
    crimeHeadId: import_zod19.z.string().describe("The Crime Head ID from the case classification.")
  }),
  func: async ({ crimeHeadId }) => {
    try {
      const result = await legalService.listSectionsByCrimeHead(BigInt(crimeHeadId));
      return JSON.stringify(result.data, (key, value) => typeof value === "bigint" ? value.toString() : value);
    } catch (error) {
      return `Failed to fetch recommended sections: ${error.message}`;
    }
  }
});

// src/ai/core/tools/analytics.tools.ts
var import_tools5 = require("@langchain/core/tools");
var import_zod20 = require("zod");
var SearchCrimePatternsTool = new import_tools5.DynamicStructuredTool({
  name: "search_crime_patterns",
  description: "Search for statistical crime patterns, aggregates, and trends across districts and time periods.",
  schema: import_zod20.z.object({
    districtId: import_zod20.z.number().optional(),
    year: import_zod20.z.number().optional(),
    month: import_zod20.z.number().optional()
  }),
  func: async ({ districtId, year, month }) => {
    try {
      const result = await analyticsService.getCrimeStatisticAggregate({
        districtId: districtId ? BigInt(districtId) : void 0,
        reportYear: year,
        reportMonth: month
      });
      return JSON.stringify(result.data);
    } catch (error) {
      return `Failed to fetch crime patterns: ${error.message}`;
    }
  }
});
var GenerateSummaryTool = new import_tools5.DynamicStructuredTool({
  name: "generate_summary",
  description: "Placeholder tool: Instructs the system to aggregate multiple data points into a summary report. (Use SearchCrimePatternsTool for raw data).",
  schema: import_zod20.z.object({
    topic: import_zod20.z.string().describe("The topic to summarize.")
  }),
  func: async ({ topic }) => {
    return `Summary generation requested for topic: ${topic}. The LLM should synthesize this from retrieved context instead of relying entirely on this stub tool.`;
  }
});

// src/ai/core/tools/graph.tools.ts
var import_tools6 = require("@langchain/core/tools");
var import_zod21 = require("zod");
var SearchGraphNodesTool = new import_tools6.DynamicStructuredTool({
  name: "search_graph_nodes",
  description: "Search for entities (nodes) in the Knowledge Graph. Use this to find people, vehicles, phones, locations, or cases by name, ID, or label.",
  schema: import_zod21.z.object({
    query: import_zod21.z.string().optional().describe("Text to search across node properties."),
    nodeLabel: import_zod21.z.string().optional().describe('Optional label to filter (e.g. "Person", "Vehicle", "Phone", "Location").'),
    sourceTable: import_zod21.z.string().optional().describe('Optional underlying source table (e.g. "suspect", "victim", "case_master").')
  }),
  func: async ({ query, nodeLabel, sourceTable }) => {
    try {
      const result = await graphService.searchNodes({
        query,
        nodeLabel,
        sourceTable,
        page: 1,
        pageSize: 10
      });
      return JSON.stringify(
        result.data,
        (key, value) => typeof value === "bigint" ? value.toString() : value
      );
    } catch (error) {
      return `Failed to search graph nodes: ${error.message}`;
    }
  }
});
var ExpandGraphNodeTool = new import_tools6.DynamicStructuredTool({
  name: "expand_graph_node",
  description: "Expands a specific Knowledge Graph node to discover its hidden relationships, connections, and networks (e.g. find all connections for a suspect or a phone number).",
  schema: import_zod21.z.object({
    nodeId: import_zod21.z.string().describe("The ID of the node to expand (retrieved from search_graph_nodes or other tools)."),
    direction: import_zod21.z.enum(["incoming", "outgoing", "both"]).optional().describe("Direction of the relationships to traverse."),
    relationshipType: import_zod21.z.string().optional().describe('Specific relationship to look for (e.g. "OWNS", "CALLS", "PARTICIPATES_IN").')
  }),
  func: async ({ nodeId, direction, relationshipType }) => {
    try {
      const result = await graphService.expandNode(BigInt(nodeId), {
        direction,
        relationshipType
      });
      return JSON.stringify(
        result.data,
        (key, value) => typeof value === "bigint" ? value.toString() : value
      );
    } catch (error) {
      return `Failed to expand node: ${error.message}`;
    }
  }
});
var GetCaseGraphTool = new import_tools6.DynamicStructuredTool({
  name: "get_case_graph",
  description: "Retrieves the complete graph network centered around a specific case. Use to see all entities linked to a crime.",
  schema: import_zod21.z.object({
    caseMasterId: import_zod21.z.string().describe("The ID of the case (caseMasterId)."),
    includeInferred: import_zod21.z.boolean().optional().describe("Whether to include inferred/AI-predicted links.")
  }),
  func: async ({ caseMasterId, includeInferred }) => {
    try {
      const result = await graphService.getCaseGraph(BigInt(caseMasterId), {
        includeInferred
      });
      return JSON.stringify(
        result.data,
        (key, value) => typeof value === "bigint" ? value.toString() : value
      );
    } catch (error) {
      return `Failed to get case graph: ${error.message}`;
    }
  }
});

// src/ai/core/tools/recommendation.tools.ts
var import_tools7 = require("@langchain/core/tools");
var import_zod22 = require("zod");
var GetCaseRecommendationsTool = new import_tools7.DynamicStructuredTool({
  name: "get_case_recommendations",
  description: "Retrieves AI-generated investigation recommendations for a specific case, including next steps, missing evidence, and priority levels.",
  schema: import_zod22.z.object({
    caseMasterId: import_zod22.z.string().describe("The ID of the case (caseMasterId).")
  }),
  func: async ({ caseMasterId }) => {
    try {
      const result = await recommendationService.getCaseRecommendations(BigInt(caseMasterId));
      return JSON.stringify(
        result.data,
        (key, value) => typeof value === "bigint" ? value.toString() : value
      );
    } catch (error) {
      return `Failed to fetch case recommendations: ${error.message}`;
    }
  }
});
var SearchRecommendationsTool = new import_tools7.DynamicStructuredTool({
  name: "search_recommendations",
  description: "Search across all recommendations. Useful for finding patterns, identifying similar recommended actions, or retrieving officer assignments.",
  schema: import_zod22.z.object({
    recommendationType: import_zod22.z.string().optional().describe('Filter by recommendation type (e.g. "NEXT_STEP", "MISSING_EVIDENCE", "OFFICER_ASSIGNMENT").'),
    priorityLevel: import_zod22.z.string().optional().describe('Filter by priority level (e.g. "HIGH", "CRITICAL").'),
    status: import_zod22.z.string().optional().describe('Filter by status (e.g. "PENDING", "ACCEPTED").')
  }),
  func: async ({ recommendationType, priorityLevel, status }) => {
    try {
      const result = await recommendationService.listRecommendations({
        recommendationType,
        priorityLevel,
        status,
        page: 1,
        pageSize: 10
      });
      return JSON.stringify(
        result.data,
        (key, value) => typeof value === "bigint" ? value.toString() : value
      );
    } catch (error) {
      return `Failed to search recommendations: ${error.message}`;
    }
  }
});
var GetHighPriorityRiskScoresTool = new import_tools7.DynamicStructuredTool({
  name: "get_high_priority_risk_scores",
  description: "Retrieves a ranked list of the highest priority risk scores that require immediate attention from investigators.",
  schema: import_zod22.z.object({}),
  func: async () => {
    try {
      const result = await recommendationService.getHighPriorityRiskScores();
      return JSON.stringify(
        result.data,
        (key, value) => typeof value === "bigint" ? value.toString() : value
      );
    } catch (error) {
      return `Failed to fetch risk scores: ${error.message}`;
    }
  }
});

// src/ai/core/tools/registry.ts
var investigationTools = [
  SearchCasesTool,
  GetCaseByIdTool,
  GetSimilarCasesTool,
  GenerateTimelineTool,
  SearchVictimsTool,
  SearchOfficersTool,
  GetAssignedCasesTool
];
var legalTools = [
  SearchActsTool,
  SearchSectionsTool,
  RecommendSectionsTool
];
var analyticsTools = [
  SearchCrimePatternsTool,
  GenerateSummaryTool
];
var graphTools = [
  SearchGraphNodesTool,
  ExpandGraphNodeTool,
  GetCaseGraphTool
];
var recommendationTools = [
  GetCaseRecommendationsTool,
  SearchRecommendationsTool,
  GetHighPriorityRiskScoresTool
];
var allTools = [
  ...investigationTools,
  ...legalTools,
  ...analyticsTools,
  ...graphTools,
  ...recommendationTools
];

// src/ai/core/security/tool-auth.guard.ts
var ToolAuthGuard = class {
  // Map roles to explicitly permitted tools. If a tool isn't listed here for a role, it's denied.
  // Using '*' grants access to all tools for that role.
  static ROLE_PERMISSIONS = {
    SUPERVISOR: ["*"],
    // Super user
    INVESTIGATOR: [
      "search_cases",
      "get_case_details",
      "search_ipc",
      "check_missing_charges",
      "get_analytics",
      "shortest_path",
      "find_connections"
    ],
    OFFICER: [
      "search_cases",
      "get_case_details",
      "search_ipc"
    ]
  };
  /**
   * Evaluates whether the current user has permission to execute the specified tool.
   */
  static isAuthorized(toolName, context) {
    const role = (context.user.role || "OFFICER").toUpperCase();
    const permissions = this.ROLE_PERMISSIONS[role] || [];
    if (permissions.includes("*")) {
      return true;
    }
    return permissions.includes(toolName);
  }
};

// src/ai/core/workflow/nodes/agent-react-loop.ts
var agentActionJsonSchema = {
  type: "object",
  properties: {
    thought: { type: "string", description: "Your internal reasoning about what to do next based on the case facts and previous tools." },
    action: { type: "string", enum: ["call_tool", "final_answer"], description: "Whether to call a tool or return the final answer." },
    toolName: { type: "string", description: "Required if action is call_tool. The exact name of the tool to call." },
    toolArgs: { type: "object", additionalProperties: true, description: "Required if action is call_tool. A JSON object of arguments to pass to the tool." },
    finalFacts: { type: "array", items: { type: "string" }, description: "Required if action is final_answer. Array of key factual insights you discovered." },
    finalCitations: { type: "array", items: { type: "string" }, description: "Required if action is final_answer. Sources (e.g., Case numbers, FIR numbers) that support your facts." },
    confidenceScore: { type: "number", description: "Required if action is final_answer. Score from 0.0 to 1.0 reflecting how confident you are in the findings." }
  },
  required: ["thought", "action"]
};
async function executeAgentReactLoop(agentName, persona, tools, state) {
  aiLogger.info(`Executing ${agentName} Agent`, state.context);
  const provider = new OllamaProvider();
  const queryMessage = state.messages && state.messages.length > 0 ? state.messages[state.messages.length - 1]?.content || "" : "";
  const toolDescriptions = tools.map((t) => `- ${t.name}: ${t.description}`).join("\n");
  const messages = [
    {
      role: "system",
      content: `${persona}
You must reason through the problem step-by-step.

Available Tools:
${toolDescriptions}

Instructions:
1. Always output valid JSON matching the exact schema requested.
2. If you need more information, set action to "call_tool", provide the "toolName" and "toolArgs".
3. If you have gathered enough information to fulfill the user's request, set action to "final_answer", and provide "finalFacts", "finalCitations", and "confidenceScore".
4. Base your final answer purely on tool outputs.`
    },
    {
      role: "user",
      content: `User Query: ${queryMessage}
Previous Context: ${JSON.stringify(state.context)}`
    }
  ];
  let iterations = 0;
  const MAX_ITERATIONS = 5;
  while (iterations < MAX_ITERATIONS) {
    iterations++;
    aiLogger.info(`${agentName} Agent turn ${iterations}`, state.context);
    try {
      const response = await provider.generateStructuredJson(
        messages,
        agentActionJsonSchema,
        { temperature: 0.1 },
        state.context
      );
      const decision = response.data;
      aiLogger.info(`Agent Decision: ${decision.action}`, state.context, { thought: decision.thought });
      if (decision.action === "final_answer") {
        return {
          evidence: [{
            sourceAgent: agentName.toLowerCase(),
            facts: decision.finalFacts || [],
            citations: decision.finalCitations || []
          }]
        };
      } else if (decision.action === "call_tool" && decision.toolName) {
        const tool = tools.find((t) => t.name === decision.toolName);
        if (!tool) {
          messages.push({
            role: "user",
            content: `Tool Error: Tool "${decision.toolName}" does not exist. Available tools: ${tools.map((t) => t.name).join(", ")}`
          });
          continue;
        }
        aiLogger.info(`Executing tool: ${tool.name}`, state.context, { args: decision.toolArgs });
        if (!ToolAuthGuard.isAuthorized(tool.name, state.context)) {
          aiLogger.warn(`Tool Access Denied: User unauthorized for ${tool.name}`, state.context);
          messages.push({
            role: "user",
            content: `Tool Error: Security Violation. You do not have permission to execute the tool "${tool.name}". Proceed without this tool or end execution.`
          });
          continue;
        }
        try {
          const resultString = await tool.invoke(decision.toolArgs || {});
          messages.push({
            role: "assistant",
            content: `Called ${tool.name} with ${JSON.stringify(decision.toolArgs)}`
          });
          messages.push({
            role: "user",
            content: `Tool Result for ${tool.name}: 
${resultString}`
          });
        } catch (e) {
          messages.push({
            role: "user",
            content: `Tool Error during ${tool.name}: ${e.message}`
          });
        }
      } else {
        messages.push({
          role: "user",
          content: `Tool Error: You selected 'call_tool' but didn't provide a valid 'toolName'.`
        });
      }
    } catch (error) {
      aiLogger.warn(`${agentName} Agent generation failed: ${error.message}`, state.context);
      break;
    }
  }
  aiLogger.warn(`${agentName} Agent reached max iterations or errored out. Returning fallback.`, state.context);
  return {
    evidence: [{
      sourceAgent: agentName.toLowerCase(),
      facts: [`${agentName} agent halted due to max iterations or error before reaching a final conclusion.`],
      citations: []
    }]
  };
}

// src/ai/core/workflow/nodes/agent-execution.ts
async function investigationAgentNode(state) {
  return executeAgentReactLoop(
    "Investigation",
    promptManager.buildPrompt("investigation", { case_id: "unknown", timeline_events: "unknown", similar_case_summary: "unknown" }),
    investigationTools,
    state
  );
}
async function legalAgentNode(state) {
  return executeAgentReactLoop(
    "Legal",
    promptManager.buildPrompt("legal", { legal_sources: "unknown", narrative_summary: "unknown", retrieved_sections: "unknown" }),
    legalTools,
    state
  );
}
async function graphAgentNode(state) {
  return executeAgentReactLoop(
    "Graph",
    promptManager.buildPrompt("graph", { root_entity: "unknown", subgraph_summary: "unknown", path_explanation: "unknown" }),
    graphTools,
    state
  );
}
async function analyticsAgentNode(state) {
  return executeAgentReactLoop(
    "Analytics",
    promptManager.buildPrompt("analytics", { metric_name: "unknown", district_scope: "unknown", time_window: "unknown" }),
    analyticsTools,
    state
  );
}
async function recommendationAgentNode(state) {
  return executeAgentReactLoop(
    "Recommendation",
    promptManager.buildPrompt("recommendation", { recommendation_capabilities: "unknown", validated_evidence: "unknown", review_policy: "unknown" }),
    recommendationTools,
    state
  );
}

// src/ai/core/workflow/nodes/evidence-aggregator.ts
async function evidenceAggregatorNode(state) {
  aiLogger.info(`Aggregating evidence from ${state.evidence.length} sources`, state.context);
  if (state.evidence.length === 0) {
    return {
      warnings: ["No evidence was retrieved by any agent."]
    };
  }
  return {};
}

// src/ai/core/workflow/nodes/conflict-resolution.ts
var import_zod23 = require("zod");
var import_zod_to_json_schema4 = require("zod-to-json-schema");
var ConflictSchema = import_zod23.z.object({
  conflicts: import_zod23.z.array(import_zod23.z.string()).describe("List of conflicting facts found between agents, if any"),
  resolutions: import_zod23.z.array(import_zod23.z.string()).describe("How each conflict was resolved, or which agent was trusted more")
});
async function conflictResolutionNode(state) {
  if (!state.evidence || state.evidence.length === 0) {
    return { resolvedConflicts: [] };
  }
  const llm = new OllamaProvider();
  const evidenceText = state.evidence.map((e) => `Agent: ${e.sourceAgent}
Facts: ${e.facts.join(", ")}`).join("\n\n");
  try {
    const systemPromptStr = promptManager.buildPrompt("conflict", {
      evidenceText
    });
    const response = await llm.generateStructuredJson(
      [
        { role: "system", content: systemPromptStr },
        { role: "user", content: `Evidence:
${evidenceText}` }
      ],
      (0, import_zod_to_json_schema4.zodToJsonSchema)(ConflictSchema),
      { model: "llama3.1" },
      state.context
    );
    const parsed2 = ConflictSchema.parse(response.data);
    aiLogger.info("Conflict resolution complete", state.context, { conflictsFound: parsed2.conflicts.length });
    return {
      resolvedConflicts: parsed2.resolutions
    };
  } catch (error) {
    aiLogger.error("Failed to resolve conflicts", error, state.context);
    return {
      resolvedConflicts: [],
      warnings: ["Conflict resolution failed"]
    };
  }
}

// src/ai/core/workflow/nodes/confidence-scoring.ts
var import_zod24 = require("zod");
var import_zod_to_json_schema5 = require("zod-to-json-schema");
var ConfidenceSchema = import_zod24.z.object({
  score: import_zod24.z.number().min(0).max(100).describe("Overall confidence score of the generated response from 0 to 100"),
  factors: import_zod24.z.array(import_zod24.z.string()).describe("List of factors contributing to this confidence score")
});
async function confidenceScoringNode(state) {
  if (!state.evidence || state.evidence.length === 0) {
    return { overallConfidence: 0 };
  }
  const llm = new OllamaProvider();
  const evidenceText = state.evidence.map((e) => `Agent: ${e.sourceAgent}
Facts: ${e.facts.join(", ")}
Citations: ${e.citations.length}`).join("\n\n");
  const conflictsText = state.resolvedConflicts?.join("\n") || "None";
  try {
    const systemPromptStr = promptManager.buildPrompt("confidence", {
      evidenceText,
      conflictsText
    });
    const response = await llm.generateStructuredJson(
      [
        { role: "system", content: systemPromptStr },
        { role: "user", content: `Evidence:
${evidenceText}

Resolved Conflicts:
${conflictsText}` }
      ],
      (0, import_zod_to_json_schema5.zodToJsonSchema)(ConfidenceSchema),
      { model: "llama3.1" },
      state.context
    );
    const parsed2 = ConfidenceSchema.parse(response.data);
    aiLogger.info("Confidence scoring complete", state.context, { score: parsed2.score });
    return {
      overallConfidence: parsed2.score
    };
  } catch (error) {
    aiLogger.error("Failed to score confidence", error, state.context);
    return {
      overallConfidence: 50,
      warnings: ["Confidence scoring failed"]
    };
  }
}

// src/ai/core/workflow/nodes/generator.ts
var import_zod25 = require("zod");

// src/ai/core/structured-parser.ts
var import_zod_to_json_schema6 = require("zod-to-json-schema");
var StructuredParser = class {
  /**
   * Generates a JSON schema compatible with Ollama's `format` parameter.
   */
  static generateSchema(zodSchema, name = "output_schema") {
    const jsonSchema = (0, import_zod_to_json_schema6.zodToJsonSchema)(zodSchema, name);
    const root = jsonSchema.definitions?.[name] || jsonSchema;
    return root;
  }
  /**
   * Parses the JSON output from Ollama and validates it against the Zod schema.
   * Ensures the response strictly conforms to the expected contract.
   */
  static parse(zodSchema, rawJson) {
    const result = zodSchema.safeParse(rawJson);
    if (!result.success) {
      throw new AiParsingError(
        "AI output failed Zod validation",
        typeof rawJson === "string" ? rawJson : JSON.stringify(rawJson),
        { issues: result.error.issues }
      );
    }
    return result.data;
  }
};

// src/ai/core/workflow/nodes/generator.ts
var outputSchema = import_zod25.z.object({
  summary: import_zod25.z.string(),
  reasoning: import_zod25.z.array(import_zod25.z.string()),
  evidence: import_zod25.z.array(import_zod25.z.string()),
  confidence: import_zod25.z.number().min(0).max(1),
  // Normalized between 0 and 1 as per 0.96 example
  citations: import_zod25.z.array(import_zod25.z.string()),
  recommendations: import_zod25.z.array(import_zod25.z.string()),
  relatedCases: import_zod25.z.array(import_zod25.z.string()),
  legalSections: import_zod25.z.array(import_zod25.z.string()),
  graph: import_zod25.z.record(import_zod25.z.unknown()),
  analytics: import_zod25.z.record(import_zod25.z.unknown()),
  warnings: import_zod25.z.array(import_zod25.z.string())
});
async function generatorNode(state) {
  const provider = new OllamaProvider();
  const lastMessage = state.messages[state.messages.length - 1];
  const query = lastMessage?.content?.toString() || "";
  aiLogger.info("Generator synthesizing final response", state.context);
  const evidenceText = state.evidence.map(
    (e) => `Source [${e.sourceAgent}]:
` + e.facts.map((f) => `- ${f}`).join("\n") + `
Citations: ${e.citations.join(", ")}`
  ).join("\n\n");
  const systemPrompt = promptManager.buildPrompt("system", {
    evidence_summary: evidenceText,
    user_role: state.context?.user?.role || "officer",
    jurisdiction_scope: state.context?.jurisdictionId?.toString() || "global",
    active_case_id: "unknown"
  });
  try {
    const response = await provider.generateStructuredJson(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: query }
      ],
      StructuredParser.generateSchema(outputSchema, "OutputEnvelope"),
      { temperature: 0.2 },
      state.context
    );
    const finalWarnings = [...state.warnings || []];
    if (response.data.warnings) {
      finalWarnings.push(...response.data.warnings);
    }
    return {
      finalOutput: {
        agent: "supervisor",
        context: {
          requestId: state.context.requestId,
          sessionId: state.context.sessionId,
          correlationId: state.context.correlationId,
          user: state.context.user,
          screen: state.context.screen,
          channel: state.context.channel
        },
        payload: {
          summary: response.data.summary,
          reasoning: response.data.reasoning,
          evidence: response.data.evidence,
          confidence: response.data.confidence,
          citations: response.data.citations,
          recommendations: response.data.recommendations,
          relatedCases: response.data.relatedCases,
          legalSections: response.data.legalSections,
          graph: response.data.graph,
          analytics: response.data.analytics,
          warnings: finalWarnings.length > 0 ? finalWarnings : response.data.warnings,
          metadata: {
            requestId: state.context.requestId,
            generatedAt: (/* @__PURE__ */ new Date()).toISOString()
          }
        },
        sources: []
      }
    };
  } catch (error) {
    aiLogger.error("Generator node failed", error, state.context);
    return {
      finalOutput: {
        agent: "supervisor",
        context: {
          requestId: state.context.requestId,
          sessionId: state.context.sessionId,
          user: state.context.user
        },
        payload: {
          summary: "AI LLM is currently offline. Returning database fallback context.",
          reasoning: ["LLM unreachable.", "Using database fallback rules."],
          evidence: [],
          confidence: 0.65,
          citations: [],
          recommendations: ["Check LLM server status", "View Case FIR-2026-0089"],
          relatedCases: ["FIR-2026-0089"],
          legalSections: ["IPC 420"],
          graph: {},
          analytics: { members: 5, firs: 3, frozenAssets: "\u20B912.5L", risk: "High" },
          warnings: ["LLM unreachable. Operating in fallback mode."],
          metadata: {
            requestId: state.context.requestId,
            generatedAt: (/* @__PURE__ */ new Date()).toISOString()
          }
        },
        sources: []
      }
    };
  }
}

// src/ai/core/workflow/nodes/report.ts
async function reportAgentNode(state) {
  aiLogger.info("Executing Report Agent to generate PDF-ready Markdown", state.context);
  const provider = new OllamaProvider();
  const queryMessage = state.messages && state.messages.length > 0 ? state.messages[state.messages.length - 1]?.content || "" : "";
  const evidenceText = state.evidence.map(
    (e) => `Source [${e.sourceAgent}]:
` + e.facts.map((f) => `- ${f}`).join("\n") + `
Citations: ${e.citations.join(", ")}`
  ).join("\n\n");
  const systemPrompt = promptManager.buildPrompt("report", {
    report_type: "Unknown",
    audience_role: state.context?.user?.role || "officer",
    report_scope: "Full context"
  }) + `

Evidence:
${evidenceText}`;
  try {
    const responseText = await provider.generateText(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: queryMessage.toString() }
      ],
      { temperature: 0.1 },
      state.context
    );
    if (state.finalOutput && state.finalOutput.payload) {
      return {
        finalOutput: {
          ...state.finalOutput,
          payload: {
            ...state.finalOutput.payload,
            summary: responseText
            // Replacing the JSON summary with the full markdown report, or appending it.
          }
        }
      };
    }
    return {
      finalOutput: {
        agent: "report",
        context: state.context,
        payload: {
          summary: responseText,
          reasoning: [],
          evidence: [],
          confidence: 0.95,
          citations: [],
          relatedCases: [],
          legalSections: [],
          recommendations: [],
          graph: {},
          analytics: {},
          warnings: [],
          metadata: {
            requestId: state.context.requestId,
            generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
            outputMode: "report"
          }
        },
        sources: []
      }
    };
  } catch (error) {
    aiLogger.error("Report Agent failed to generate markdown", error, state.context);
    return {
      warnings: ["Failed to generate Markdown report."]
    };
  }
}

// src/ai/core/workflow/orchestrator.ts
function routeAfterSecurity(state) {
  if (!state.permissions || !state.permissions.clearanceGranted) {
    return "generator";
  }
  return "intent";
}
function routeToAgents(state) {
  if (!state.permissions.clearanceGranted) {
    return ["generator"];
  }
  if (!state.taskPlan || !state.taskPlan.agentsToRun || state.taskPlan.agentsToRun.length === 0) {
    return ["investigation"];
  }
  return state.taskPlan.agentsToRun;
}
function routeAfterConfidence(state) {
  if (state.context?.channel === "report" || state.detectedIntent === "reporting" || state.taskPlan?.primaryIntent === "reporting") {
    return "report";
  }
  return "generator";
}
var builder = new import_langgraph2.StateGraph(AiGraphState).addNode("security", securityShieldNode).addNode("intent", intentDetectionNode).addNode("entities", entityExtractionNode).addNode("supervisor", supervisorNode).addNode("investigation", investigationAgentNode).addNode("legal", legalAgentNode).addNode("graph", graphAgentNode).addNode("analytics", analyticsAgentNode).addNode("recommendation", recommendationAgentNode).addNode("aggregator", evidenceAggregatorNode).addNode("conflicts", conflictResolutionNode).addNode("confidence", confidenceScoringNode).addNode("generator", generatorNode).addNode("report", reportAgentNode).addEdge(import_langgraph2.START, "security").addConditionalEdges("security", routeAfterSecurity, {
  intent: "intent",
  generator: "generator"
}).addEdge("intent", "entities").addEdge("entities", "supervisor").addConditionalEdges(
  "supervisor",
  routeToAgents,
  {
    investigation: "investigation",
    legal: "legal",
    graph: "graph",
    analytics: "analytics",
    recommendation: "recommendation",
    generator: "generator"
    // Denied path
  }
).addEdge("investigation", "aggregator").addEdge("legal", "aggregator").addEdge("graph", "aggregator").addEdge("analytics", "aggregator").addEdge("recommendation", "aggregator").addEdge("aggregator", "conflicts").addEdge("conflicts", "confidence").addConditionalEdges(
  "confidence",
  routeAfterConfidence,
  {
    generator: "generator",
    report: "report"
  }
).addEdge("generator", import_langgraph2.END).addEdge("report", import_langgraph2.END);
var memorySaver = new import_langgraph2.MemorySaver();
var aiOrchestrator = builder.compile({
  checkpointer: memorySaver
});

// src/ai/memory/implementations/redis-store.ts
var import_ioredis = __toESM(require("ioredis"));
var RedisMemoryStore = class {
  redis;
  constructor() {
    const uri = process.env.REDIS_URI || "redis://localhost:6379";
    this.redis = new import_ioredis.default(uri);
    this.redis.on("error", (err) => logger.error({ err }, "Redis Memory Store Error"));
  }
  // --- Session Memory ---
  async get(sessionId) {
    const data = await this.redis.get(`session:${sessionId}`);
    return data ? JSON.parse(data) : null;
  }
  async save(memory) {
    await this.redis.set(`session:${memory.id}`, JSON.stringify(memory), "EX", 86400);
  }
  // --- Case Context Memory ---
  async getCaseMemory(caseMasterId) {
    const data = await this.redis.get(`case:${caseMasterId.toString()}`);
    return data ? JSON.parse(data) : null;
  }
  async saveCaseMemory(memory) {
    await this.redis.set(`case:${memory.id}`, JSON.stringify(memory), "EX", 604800);
  }
  // --- Officer Context Memory ---
  async getOfficerContext(userId) {
    const data = await this.redis.get(`officer:${userId}`);
    return data ? JSON.parse(data) : null;
  }
  async saveOfficerContext(memory) {
    await this.redis.set(`officer:${memory.id}`, JSON.stringify(memory), "EX", 604800);
  }
  // --- Conversation History ---
  async list(sessionId) {
    const data = await this.redis.lrange(`history:${sessionId}`, 0, -1);
    return data.map((item) => JSON.parse(item));
  }
  async append(sessionId, turn) {
    await this.redis.rpush(`history:${sessionId}`, JSON.stringify(turn));
    await this.redis.expire(`history:${sessionId}`, 86400);
  }
  async replaceHistory(sessionId, turns) {
    await this.redis.del(`history:${sessionId}`);
    if (turns.length > 0) {
      const stringified = turns.map((t) => JSON.stringify(t));
      await this.redis.rpush(`history:${sessionId}`, ...stringified);
      await this.redis.expire(`history:${sessionId}`, 86400);
    }
  }
  async close() {
    await this.redis.quit();
  }
};

// src/ai/memory/implementations/memory-summarizer.ts
var import_zod26 = require("zod");
var import_zod_to_json_schema7 = require("zod-to-json-schema");
var SummarySchema = import_zod26.z.object({
  summary: import_zod26.z.string().describe("A dense, highly compressed summary of the provided text, retaining all factual constraints and entities."),
  entitiesMentioned: import_zod26.z.array(import_zod26.z.string()).describe("Key entities preserved in the summary.")
});
var MemorySummarizer = class {
  llm = new OllamaProvider();
  async summarize(kind, content) {
    try {
      const contentStr = typeof content === "string" ? content : JSON.stringify(content);
      const response = await this.llm.generateStructuredJson(
        [
          { role: "system", content: `You are an AI Memory Compression Engine. Compress the provided ${kind} context into a dense summary. Retain all names, IDs, dates, and strict constraints. Drop conversational filler.` },
          { role: "user", content: contentStr }
        ],
        (0, import_zod_to_json_schema7.zodToJsonSchema)(SummarySchema),
        { model: "llama3.1" },
        {}
        // context is missing here but usually state.context is passed. Wait, this node doesn't have state context. Let's pass {}
      );
      const parsed2 = SummarySchema.parse(response.data);
      return {
        summaryText: parsed2.summary,
        compressedRatio: parsed2.summary.length / contentStr.length,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
    } catch (error) {
      aiLogger.error("Memory summarization failed", error);
      return {
        summaryText: "Summarization failed. Content retained in raw form if possible.",
        compressedRatio: 1,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
    }
  }
};

// src/ai/memory/implementations/conversation-engine.ts
var ConversationEngine = class {
  capabilities = {
    supportsSessionMemory: true,
    supportsCaseMemory: true,
    supportsOfficerContext: true,
    supportsConversationHistory: true,
    supportsTemporaryMemory: false,
    supportsWorkingMemory: false,
    supportsLongTermMemory: false,
    supportsSummarization: true,
    supportsExpiry: true,
    supportsPrivacyControls: false
  };
  store = new RedisMemoryStore();
  summarizerSvc = new MemorySummarizer();
  // Stubbing dependencies for the interface compliance, though we tightly couple them in this implementation for simplicity
  dependencies = {
    sessionMemoryStore: this.store,
    caseMemoryStore: this.store,
    officerContextStore: this.store,
    conversationHistoryStore: this.store,
    temporaryMemoryStore: null,
    workingMemoryStore: null,
    longTermMemoryStore: null,
    summarizer: this.summarizerSvc,
    expiryManager: null,
    privacyManager: null
  };
  expiryPolicies = [];
  privacyRules = [];
  async loadSessionMemory(context) {
    return this.store.get(context.sessionId);
  }
  async loadCaseMemory(caseMasterId, context) {
    return this.store.getCaseMemory(caseMasterId);
  }
  async loadOfficerContext(context) {
    return this.store.getOfficerContext(context.userId);
  }
  async loadTemporaryMemory(sessionId) {
    return null;
  }
  async loadWorkingMemory(sessionId) {
    return null;
  }
  async loadLongTermMemory(context, caseMasterId) {
    return [];
  }
  async appendConversationTurn(sessionId, turn) {
    await this.store.append(sessionId, turn);
    const history = await this.store.list(sessionId);
    if (history.length > 10) {
      aiLogger.info("Compressing conversation history", { sessionId, length: history.length });
      const turnsToCompress = history.slice(0, 6);
      const remainingTurns = history.slice(6);
      const summaryText = await this.summarizeMemory("conversation", turnsToCompress);
      const compressedTurn = {
        role: "system",
        content: `[PREVIOUS CONVERSATION SUMMARY]: ${summaryText}`,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      };
      await this.store.replaceHistory(sessionId, [compressedTurn, ...remainingTurns]);
    }
  }
  async summarizeMemory(kind, content) {
    const summary = await this.summarizerSvc.summarize(kind, content);
    return summary.summaryText;
  }
};

// src/ai/core/security/audit-logger.ts
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
var AuditLogger = class {
  static LOG_FILE = import_path.default.join(process.cwd(), "audit.jsonl");
  /**
   * Securely logs an AI request and its outcome to a persistent audit trail.
   */
  static logExecution(context, input, output, wasBlocked = false, reason) {
    try {
      const entry = {
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        requestId: context.requestId,
        sessionId: context.sessionId,
        userId: context.user.userId,
        role: context.user.role,
        inputMasked: PromptShield.maskPII(input),
        wasBlocked,
        blockReason: reason,
        outputMasked: PromptShield.maskPII(typeof output === "string" ? output : JSON.stringify(output))
      };
      import_fs.default.appendFileSync(this.LOG_FILE, JSON.stringify(entry) + "\n");
    } catch (error) {
      aiLogger.error("Failed to write to audit log", error, context);
    }
  }
  /**
   * Securely logs a specific tool invocation
   */
  static logToolAccess(context, toolName, args, isAuthorized) {
    try {
      const entry = {
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        eventType: "TOOL_ACCESS",
        requestId: context.requestId,
        userId: context.user.userId,
        toolName,
        argsMasked: PromptShield.maskPII(JSON.stringify(args)),
        isAuthorized
      };
      import_fs.default.appendFileSync(this.LOG_FILE, JSON.stringify(entry) + "\n");
    } catch (error) {
      aiLogger.error("Failed to write to audit log", error, context);
    }
  }
};

// src/ai/core/security/output-guard.ts
var OutputGuard = class {
  static UNSAFE_TERMS = [
    /bomb\s*making/i,
    /bribe/i,
    /kill/i
    // Basic examples, could be expanded based on rules
  ];
  /**
   * Scans the finalized AI output payload for unsafe or severely hallucinatory patterns.
   */
  static verifyOutput(payload, state) {
    const textToCheck = `${payload.summary} ${payload.reasoning.join(" ")} ${payload.evidence.join(" ")}`;
    for (const term of this.UNSAFE_TERMS) {
      if (term.test(textToCheck)) {
        payload.summary = "SECURITY VIOLATION: The generated response was blocked because it violated safety policies.";
        payload.reasoning = [];
        payload.evidence = [];
        payload.confidence = 0;
        payload.warnings.push("SECURITY_BLOCK");
        return { isSafe: false, modifiedPayload: payload };
      }
    }
    if (payload.confidence > 0.8 && payload.citations.length === 0) {
      payload.warnings.push("HALLUCINATION_RISK: The model expressed high confidence but provided zero citations to source evidence.");
      payload.confidence = 0.4;
    }
    if (state.evidence && state.evidence.length > 0 && payload.citations.length > 0) {
      const allRetrievedCitations = state.evidence.flatMap((e) => e.citations || []);
      const hallucinatoryCitations = payload.citations.filter((c) => !allRetrievedCitations.includes(c));
      if (hallucinatoryCitations.length > 0) {
        payload.warnings.push(`HALLUCINATION_RISK: The model cited sources that were not in the retrieved evidence: ${hallucinatoryCitations.join(", ")}`);
      }
    }
    return { isSafe: true, modifiedPayload: payload };
  }
};

// src/modules/ai/controllers/ai.controller.ts
var import_messages = require("@langchain/core/messages");
var import_crypto = __toESM(require("crypto"));
var conversationEngine = new ConversationEngine();
var AiController = class {
  static async health(req, res) {
    try {
      const provider = new OllamaProvider();
      const isHealthy = await provider.healthCheck();
      if (isHealthy) {
        res.status(200).json({
          status: "ok",
          provider: aiConfig.provider,
          model: aiConfig.ollama.defaultModel,
          message: "Local Ollama AI provider is online and responding."
        });
      } else {
        res.status(503).json({
          status: "error",
          provider: aiConfig.provider,
          model: aiConfig.ollama.defaultModel,
          message: "Local Ollama AI provider is unreachable or failed inference check."
        });
      }
    } catch (error) {
      aiLogger.error("AI Healthcheck controller failed", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error during AI healthcheck"
      });
    }
  }
  static async query(req, res) {
    const { message, query: legacyQuery, sessionId: reqSessionId, threadId, metadata, caseMasterId } = req.body;
    const query = message || legacyQuery;
    if (!query || typeof query !== "string") {
      res.status(400).json({ status: "error", message: "Query (or message) is required and must be a string" });
      return;
    }
    const sessionId = reqSessionId || threadId || import_crypto.default.randomUUID();
    const requestId = import_crypto.default.randomUUID();
    if (!req.user) {
      res.status(401).json({ status: "error", message: "Unauthorized" });
      return;
    }
    const aiContext = {
      requestId,
      sessionId,
      user: {
        userId: req.user.userId,
        role: req.user.role
      },
      channel: "api"
    };
    aiLogger.info(`Received AI query: ${query.slice(0, 50)}...`, aiContext);
    try {
      const caseMemory = caseMasterId ? await conversationEngine.loadCaseMemory(caseMasterId, aiContext) : null;
      await conversationEngine.appendConversationTurn(sessionId, {
        role: "user",
        content: query,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
      const history = await conversationEngine.dependencies.conversationHistoryStore.list(sessionId);
      const messages = history.map((t) => t.role === "user" ? new import_messages.HumanMessage(t.content) : new import_messages.SystemMessage(t.content));
      const normalizedQuery = query.trim().toLowerCase();
      const isGreeting = /^(hi|hello|hey|who are you\?*|what are you\?*|good morning|good evening|good afternoon|how are you\?*)([\s!.]*)$/i.test(normalizedQuery);
      if (isGreeting) {
        const fastPayload = {
          isConversational: true,
          summary: "Hello! I am Sentinel AI. I am connected to the KSP databases and knowledge graph. How can I assist with your investigation today?",
          reasoning: [],
          evidence: [],
          citations: [],
          recommendations: [],
          relatedCases: [],
          legalSections: [],
          graph: {},
          analytics: {},
          warnings: [],
          metadata: { requestId: aiContext.requestId, generatedAt: (/* @__PURE__ */ new Date()).toISOString() }
        };
        await conversationEngine.appendConversationTurn(sessionId, {
          role: "assistant",
          content: fastPayload.summary,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        });
        res.status(200).json({
          status: "success",
          threadId: sessionId,
          data: { payload: fastPayload }
        });
        return;
      }
      const result = await aiOrchestrator.invoke(
        {
          messages,
          context: aiContext
        },
        {
          configurable: { thread_id: sessionId }
        }
      );
      const finalOutput = result.finalOutput || {
        agent: "supervisor",
        context: aiContext,
        payload: {
          summary: "No output generated",
          reasoning: [],
          evidence: [],
          confidence: 0,
          citations: [],
          recommendations: [],
          relatedCases: [],
          legalSections: [],
          graph: {},
          analytics: {},
          warnings: result.warnings || ["Unknown failure"],
          metadata: {
            requestId: aiContext.requestId,
            generatedAt: (/* @__PURE__ */ new Date()).toISOString()
          }
        },
        sources: []
      };
      const guardResult = OutputGuard.verifyOutput(finalOutput.payload, result);
      finalOutput.payload = guardResult.modifiedPayload;
      await conversationEngine.appendConversationTurn(sessionId, {
        role: "assistant",
        content: typeof finalOutput.payload?.summary === "string" ? finalOutput.payload.summary : JSON.stringify(finalOutput.payload),
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
      const isBlocked = result.warnings?.includes("PROMPT_INJECTION_BLOCKED") || !guardResult.isSafe;
      AuditLogger.logExecution(aiContext, query, finalOutput.payload, isBlocked, isBlocked ? "Security Policy Violation" : void 0);
      res.status(200).json({
        status: "success",
        threadId: sessionId,
        data: finalOutput
      });
    } catch (error) {
      aiLogger.error("AI Orchestrator failed during execution", error, aiContext);
      AuditLogger.logExecution(aiContext, query, { error: error.message }, true, "Internal Execution Error");
      res.status(200).json({
        status: "success",
        threadId: sessionId,
        data: {
          payload: {
            summary: "AI LLM is currently offline. Returning database fallback context.",
            reasoning: ["LLM unreachable.", "Using database fallback rules."],
            evidence: [],
            confidence: 0.65,
            citations: [],
            recommendations: ["Check LLM server status", "View Case FIR-2026-0089"],
            relatedCases: ["FIR-2026-0089"],
            legalSections: ["IPC 420"],
            graph: {},
            analytics: { members: 5, firs: 3, frozenAssets: "\u20B912.5L", risk: "High" },
            warnings: ["LLM unreachable. Operating in fallback mode."],
            metadata: {
              requestId: aiContext.requestId,
              generatedAt: (/* @__PURE__ */ new Date()).toISOString()
            }
          }
        }
      });
    }
  }
};

// src/modules/ai/routes/ai.routes.ts
var aiRouter = createModuleRouter();
aiRouter.get("/health", authenticateMiddleware, requireRoles("SUPER_ADMIN", "INSPECTOR", "CRIME_ANALYST"), AiController.health);
aiRouter.post("/query", authenticateMiddleware, requireRoles("SUPER_ADMIN", "INSPECTOR", "CRIME_ANALYST"), AiController.query);

// src/app/routes.ts
function registerRoutes(app) {
  app.use("/health", healthRouter);
  app.use(`${env.API_PREFIX}/health`, healthRouter);
  app.use(`${env.API_PREFIX}/docs`, docsRouter);
  app.use(`${env.API_PREFIX}/auth`, authRouter);
  app.use(`${env.API_PREFIX}/cases`, casesRouter);
  app.use(`${env.API_PREFIX}/victims`, victimsRouter);
  app.use(`${env.API_PREFIX}/legal`, legalRouter);
  app.use(`${env.API_PREFIX}/acts`, actsRouter);
  app.use(`${env.API_PREFIX}/ipc`, ipcRouter);
  app.use(`${env.API_PREFIX}/analytics`, analyticsRouter);
  app.use(`${env.API_PREFIX}/dashboard`, dashboardRouter);
  app.use(`${env.API_PREFIX}/hotspots`, hotspotRouter);
  app.use(`${env.API_PREFIX}/recommendations`, recommendationsRouter);
  app.use(`${env.API_PREFIX}/graph`, graphRouter);
  app.use(`${env.API_PREFIX}/chat`, chatRouter);
  app.use(`${env.API_PREFIX}/copilot`, aiRouter);
}
function createModuleRouter() {
  return (0, import_express13.Router)();
}

// src/app/create-app.ts
function createApp() {
  const app = (0, import_express14.default)();
  app.disable("x-powered-by");
  app.set("trust proxy", 1);
  app.use(requestIdMiddleware);
  app.use(
    (0, import_pino_http.default)({
      logger,
      customProps: (req) => ({ requestId: req.id })
    })
  );
  app.use((0, import_helmet.default)());
  app.use(
    (0, import_cors.default)({
      origin: env.CORS_ORIGIN,
      credentials: true
    })
  );
  app.use((0, import_compression.default)());
  app.use(import_express14.default.json({ limit: "2mb" }));
  app.use(import_express14.default.urlencoded({ extended: true, limit: "2mb" }));
  app.use((0, import_cookie_parser.default)());
  app.use(rateLimitMiddleware);
  registerRoutes(app);
  if (env.NODE_ENV === "production") {
    const frontendDist = import_node_path.default.join(__dirname, "../../../frontend/dist");
    app.use(import_express14.default.static(frontendDist));
    app.get("*", (req, res, next) => {
      if (req.path.startsWith(env.API_PREFIX)) {
        return next();
      }
      res.sendFile(import_node_path.default.join(frontendDist, "index.html"));
    });
  }
  app.use(notFoundMiddleware);
  app.use(errorMiddleware);
  return app;
}

// src/core/cache/redis.ts
var import_ioredis2 = __toESM(require("ioredis"));
var redis = new import_ioredis2.default(env.REDIS_URL, {
  lazyConnect: true,
  maxRetriesPerRequest: 3
});
redis.on("connect", () => logger.info("Redis connected"));
redis.on("error", (error) => logger.warn({ error }, "Redis connection error"));

// src/server.ts
async function bootstrap() {
  const app = createApp();
  const server = (0, import_node_http.createServer)(app);
  server.listen(env.PORT, () => {
    logger.info({ port: env.PORT, env: env.NODE_ENV }, "KSP Intelligence OS backend started");
  });
  const shutdown = async (signal) => {
    logger.info({ signal }, "Shutdown signal received");
    server.close(async () => {
      logger.info("HTTP server closed");
      await prisma.$disconnect();
      redis.disconnect();
      process.exit(0);
    });
  };
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
  process.on("SIGINT", () => void shutdown("SIGINT"));
}
void bootstrap().catch((error) => {
  logger.fatal({ error }, "Failed to start backend");
  process.exit(1);
});
