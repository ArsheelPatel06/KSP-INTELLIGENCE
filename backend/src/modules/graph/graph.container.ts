import { GraphController } from './controllers/graph.controller';
import { PrismaGraphRepository } from './repositories/prisma-graph.repository';
import { GraphService } from './services/graph.service';

export const graphRepository = new PrismaGraphRepository();
export const graphService = new GraphService(graphRepository);
export const graphController = new GraphController(graphService);
