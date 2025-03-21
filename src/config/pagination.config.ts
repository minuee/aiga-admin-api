import { registerAs } from '@nestjs/config';

export default registerAs('pagination', () => ({
  customLabels: {
    docs: 'items',
    meta: 'meta',
    // 검색된 전체갯수
    totalDocs: 'totalItems',
    // 페이지당 아이템 갯수
    limit: 'itemsPerPage',
    // 전체 페이지 수
    totalPages: 'totalPages',
    // 현재 페이지
    page: 'currentPage',
    // The starting index/serial/chronological number of first document in current page
    // (Eg: if page=2 and limit=10, then pagingCounter will be 11)
    pagingCounter: 'pagingCounter',
    // 다음 페이지 번호
    nextPage: 'nextPage',
    // 이전 페이지 번호
    prevPage: 'prevPage',
  },
}));
