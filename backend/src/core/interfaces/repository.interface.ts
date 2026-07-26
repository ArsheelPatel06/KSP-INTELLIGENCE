export interface BaseRepository<TEntity, TId = number> {
  findById(id: TId): Promise<TEntity | null>;
}

export interface PaginatedRepositoryResult<TItem> {
  items: TItem[];
  meta: {
    page: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
  };
}
