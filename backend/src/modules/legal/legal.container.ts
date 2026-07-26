import { LegalController } from './controllers/legal.controller';
import { PrismaActRepository } from './repositories/prisma-act.repository';
import { LegalService } from './services/legal.service';

export const actRepository = new PrismaActRepository();
export const legalService = new LegalService(actRepository);
export const legalController = new LegalController(legalService);
