import { z } from 'zod';

const numericString = z.string().regex(/^\d+$/, 'Must be a valid integer');

export const officerDashboardParamsSchema = z.object({
  employeeId: numericString,
});
