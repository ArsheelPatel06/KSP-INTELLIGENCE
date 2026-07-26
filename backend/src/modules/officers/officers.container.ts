import { PrismaOfficerRepository } from './repositories/prisma-officer.repository';
import { OfficerService } from './services/officer.service';

export const officerRepository = new PrismaOfficerRepository();
export const officerService = new OfficerService(officerRepository);
