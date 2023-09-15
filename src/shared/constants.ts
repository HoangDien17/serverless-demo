export const TOTAL_COUNT_HEADER_NAME = 'x-total-count';
export const NEXT_PAGE_HEADER_NAME = 'x-next-page';
export const PAGE_HEADER_NAME = 'x-page';
export const PAGES_COUNT_HEADER_NAME = 'x-pages-count';
export const PER_PAGE_HEADER_NAME = 'x-per-page';

export const ACCESS_TOKEN_HEADER_NAME = 'access-token';

export const CORS_EXPOSED_HEADERS = [
  TOTAL_COUNT_HEADER_NAME,
  NEXT_PAGE_HEADER_NAME,
  PAGE_HEADER_NAME,
  PER_PAGE_HEADER_NAME,
  PAGES_COUNT_HEADER_NAME,
].join(',');
