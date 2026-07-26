import { Router } from 'express';
import { PERMISSIONS } from '@core/auth/permissions';
import { asyncHandler } from '@core/response/async-handler';
import { validate } from '@core/validation/validate';
import { authenticateMiddleware } from '@middleware/authenticate.middleware';
import { requireAnyPermission, requirePermissions } from '@middleware/authorize.middleware';
import { notImplemented } from '@middleware/not-implemented.middleware';
import { legalController } from '../legal.container';
import {
  actCodeParamsSchema,
  crimeHeadIdParamsSchema,
  ipcRecommendBodySchema,
  ipcSearchQuerySchema,
  ipcSectionDetailQuerySchema,
  listActsQuerySchema,
  listIpcReferencesQuerySchema,
  listLegalDocumentsQuerySchema,
  listSectionsQuerySchema,
  sectionCodeOnlyParamsSchema,
  sectionParamsSchema,
} from '../validators/legal.validators';

export const legalRouter = Router();
export const actsRouter = Router();
export const ipcRouter = Router();

const requireLegalRead = requireAnyPermission(
  PERMISSIONS.CASES_READ_ALL,
  PERMISSIONS.CASES_READ_DISTRICT,
  PERMISSIONS.CASES_READ_UNIT,
  PERMISSIONS.ANALYTICS_READ,
  PERMISSIONS.POLICY_READ,
);

legalRouter.use(authenticateMiddleware, requireLegalRead);
actsRouter.use(authenticateMiddleware, requireLegalRead);
ipcRouter.use(authenticateMiddleware, requireLegalRead);

legalRouter.get(
  '/documents',
  validate({ query: listLegalDocumentsQuerySchema }),
  asyncHandler(legalController.listLegalDocuments),
);
legalRouter.get(
  '/crime-heads/:crimeHeadId/sections',
  validate({ params: crimeHeadIdParamsSchema }),
  asyncHandler(legalController.listSectionsByCrimeHead),
);
legalRouter.get(
  '/sections',
  validate({ query: listSectionsQuerySchema }),
  asyncHandler(legalController.listSections),
);
legalRouter.get(
  '/ipc-references',
  validate({ query: listIpcReferencesQuerySchema }),
  asyncHandler(legalController.listIpcReferences),
);

actsRouter.get(
  '/',
  validate({ query: listActsQuerySchema }),
  asyncHandler(legalController.listActs),
);
actsRouter.get(
  '/:actCode',
  validate({ params: actCodeParamsSchema }),
  asyncHandler(legalController.getActByCode),
);
actsRouter.get(
  '/:actCode/sections',
  validate({ params: actCodeParamsSchema, query: listSectionsQuerySchema }),
  asyncHandler(legalController.listSections),
);

ipcRouter.get('/search', validate({ query: ipcSearchQuerySchema }), notImplemented('IPC search'));
ipcRouter.get(
  '/:sectionCode',
  validate({ params: sectionCodeOnlyParamsSchema, query: ipcSectionDetailQuerySchema }),
  notImplemented('IPC section detail lookup by query actCode'),
);
ipcRouter.post(
  '/recommend',
  requirePermissions(PERMISSIONS.AI_USE),
  validate({ body: ipcRecommendBodySchema }),
  notImplemented('IPC recommendation'),
);
ipcRouter.get(
  '/:actCode/:sectionCode',
  validate({ params: sectionParamsSchema }),
  asyncHandler(legalController.getSection),
);
