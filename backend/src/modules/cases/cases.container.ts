import { CaseController } from './controllers/case.controller';
import { PrismaCaseRepository } from './repositories/prisma-case.repository';
import { CaseService } from './services/case.service';

export const caseRepository = new PrismaCaseRepository();
export const caseService = new CaseService(caseRepository);
export const caseController = new CaseController(caseService);
