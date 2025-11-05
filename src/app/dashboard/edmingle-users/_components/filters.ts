// types/filter.ts
export interface IFilterState {
  categories: string[];
  types: Array<'b2i' | 'b2b' | 'b2c' | 'b2g'>;
  status: Array<'pending' | 'enrolled' | 'failed'>;
  isPaid: boolean | null;
}

export const defaultFilters: IFilterState = {
  categories: [],
  types: [],
  status: [],
  isPaid: null,
};
