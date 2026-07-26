export interface PaginationInput {
  page?: number;
  pageSize?: number;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}

export interface PaginationResult {
  skip: number;
  take: number;
  page: number;
  pageSize: number;
}

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 25;
const MAX_PAGE_SIZE = 100;

export function normalizePagination(input: PaginationInput): PaginationResult {
  const page = Math.max(input.page ?? DEFAULT_PAGE, 1);
  const pageSize = Math.min(Math.max(input.pageSize ?? DEFAULT_PAGE_SIZE, 1), MAX_PAGE_SIZE);

  return {
    page,
    pageSize,
    skip: (page - 1) * pageSize,
    take: pageSize,
  };
}

export function buildPaginationMeta(input: {
  page: number;
  pageSize: number;
  totalRecords: number;
}): PaginationMeta {
  return {
    page: input.page,
    pageSize: input.pageSize,
    totalRecords: input.totalRecords,
    totalPages: Math.ceil(input.totalRecords / input.pageSize),
  };
}
