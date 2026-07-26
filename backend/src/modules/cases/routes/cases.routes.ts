import { Router } from 'express';
import { PERMISSIONS } from '@core/auth/permissions';
import { asyncHandler } from '@core/response/async-handler';
import { validate } from '@core/validation/validate';
import { authenticateMiddleware } from '@middleware/authenticate.middleware';
import { requireAnyPermission, requirePermissions } from '@middleware/authorize.middleware';
import { notImplemented } from '@middleware/not-implemented.middleware';
import { caseController } from '../cases.container';
import { victimController } from '@modules/victims/victims.container';
import {
  addDiaryEntryBodySchema,
  assignCaseBodySchema,
  caseIdParamsSchema,
  caseNoParamsSchema,
  createCaseBodySchema,
  crimeNoParamsSchema,
  generateCaseRecommendationBodySchema,
  listCasesQuerySchema,
  similarCasesQuerySchema,
  updateCaseBodySchema,
  validateCaseBodySchema,
} from '../validators/case.validators';
import { addVictimBodySchema } from '@modules/victims/validators/victim.validators';

export const casesRouter = Router();

const requireCaseRead = requireAnyPermission(
  PERMISSIONS.CASES_READ_ALL,
  PERMISSIONS.CASES_READ_DISTRICT,
  PERMISSIONS.CASES_READ_UNIT,
);

casesRouter.use(authenticateMiddleware);

casesRouter.get('/', requireCaseRead, validate({ query: listCasesQuerySchema }), asyncHandler(caseController.listCases));
casesRouter.post('/', requirePermissions(PERMISSIONS.CASES_WRITE), validate({ body: createCaseBodySchema }), notImplemented('Case creation'));

casesRouter.get('/by-crime-no/:crimeNo', requireCaseRead, validate({ params: crimeNoParamsSchema }), asyncHandler(caseController.getCaseByCrimeNo));
casesRouter.get('/by-case-no/:caseNo', requireCaseRead, validate({ params: caseNoParamsSchema }), asyncHandler(caseController.getCaseByCaseNo));

casesRouter.get('/:caseId', requireCaseRead, validate({ params: caseIdParamsSchema }), asyncHandler(caseController.getCaseById));
casesRouter.patch('/:caseId', requirePermissions(PERMISSIONS.CASES_WRITE), validate({ params: caseIdParamsSchema, body: updateCaseBodySchema }), notImplemented('Case update'));
casesRouter.post('/:caseId/validate', requireCaseRead, validate({ params: caseIdParamsSchema, body: validateCaseBodySchema }), notImplemented('FIR validation'));
casesRouter.get('/:caseId/timeline', requireCaseRead, validate({ params: caseIdParamsSchema }), notImplemented('Case timeline'));
casesRouter.post('/:caseId/diary', requirePermissions(PERMISSIONS.CASES_WRITE), validate({ params: caseIdParamsSchema, body: addDiaryEntryBodySchema }), notImplemented('Case diary entry creation'));
casesRouter.post('/:caseId/assignment', requirePermissions(PERMISSIONS.CASES_WRITE), validate({ params: caseIdParamsSchema, body: assignCaseBodySchema }), notImplemented('Case assignment'));
casesRouter.get('/:caseId/similar', requireCaseRead, validate({ params: caseIdParamsSchema, query: similarCasesQuerySchema }), asyncHandler(caseController.getSimilarCases));

casesRouter.get('/:caseId/victims', requireCaseRead, validate({ params: caseIdParamsSchema }), asyncHandler(victimController.listVictimsByCaseId));
casesRouter.post('/:caseId/victims', requirePermissions(PERMISSIONS.CASES_WRITE), validate({ params: caseIdParamsSchema, body: addVictimBodySchema }), notImplemented('Victim creation'));

casesRouter.post('/:caseId/recommendations/generate', requirePermissions(PERMISSIONS.AI_USE), validate({ params: caseIdParamsSchema, body: generateCaseRecommendationBodySchema }), notImplemented('Case recommendation generation'));
