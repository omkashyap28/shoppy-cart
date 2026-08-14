export interface InfiniteRespone<T = unknown> {
  content: T[];
  hasMore: boolean;
  nextCursor: number | null;
}
