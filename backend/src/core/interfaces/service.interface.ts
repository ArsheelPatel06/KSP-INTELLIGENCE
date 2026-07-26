export interface ServiceResult<T> {
  data: T;
  warnings?: string[];
  meta?: Record<string, unknown>;
}
