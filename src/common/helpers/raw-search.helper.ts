import { Raw } from 'typeorm';

export const RawSearch = (searchQuery) =>
  Raw((alias) => `LOWER(${alias}) Like '${searchQuery.toLowerCase()}'`);
