export type Column<T> = {
    title: string;
    accessor: keyof T;
};