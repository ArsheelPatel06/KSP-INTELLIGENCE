import { logger } from '@core/logger/logger';

/**
 * Dedicated logger for the AI layer.
 *
 * A child logger keeps AI execution logs searchable and separable from the rest
 * of the backend while still using the shared application logger pipeline.
 */
export const aiLogger = logger.child({ subsystem: 'ai' });
