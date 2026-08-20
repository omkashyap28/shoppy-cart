export interface PaginationResponse<T = unknown> {
  content: T[];
  hasMore: boolean;
  nextCursor: number | null;
}
