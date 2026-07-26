import { VictimController } from './controllers/victim.controller';
import { PrismaVictimRepository } from './repositories/prisma-victim.repository';
import { VictimService } from './services/victim.service';

export const victimRepository = new PrismaVictimRepository();
export const victimService = new VictimService(victimRepository);
export const victimController = new VictimController(victimService);
