'use client';
import { useState, useEffect } from 'react';
import { Column } from "@/app/types/global";
type Props<T> = {
    column: Column<T>[],
    columnDatas: T[]
}


export default function Table<T>({ column, columnDatas }: Props<T>) {

    const [sortedColumnsDatas, setSortedColumnsData] = useState<T[]>([]);
    const [sortConfig, setSortConfig] = useState<{ column: keyof T | null, order: 'asc' | 'desc' }>({
        column: null,
        order: 'asc'
    });
    useEffect(() => {
        setSortedColumnsData(columnDatas)
    }, [])
    function sort(column: keyof T) {
        const _columnDatas = Array.from(columnDatas);
        if (sortConfig.order == "asc" && sortConfig.column == column) {
            const sorted = _columnDatas.sort((a, b) => {
                const aValue = a[column]
                const bValue = b[column]
                if (typeof (aValue) === 'string' && typeof (bValue) === 'string') {
                    return aValue.localeCompare(bValue);
                }
                else if (typeof (aValue) === 'number' && typeof (bValue) === 'number') {
                    return aValue - bValue;
                }
                else {
                    return 0;
                }
            });
            setSortConfig({ column: column, order: "desc" })
            setSortedColumnsData(sorted)
        }
        else {
            const sorted = _columnDatas.sort((a, b) => {
                const aValue = a[column]
                const bValue = b[column]
                if (typeof (aValue) === 'string' && typeof (bValue) === 'string') {
                    return bValue.localeCompare(aValue);
                }
                else if (typeof (aValue) === 'number' && typeof (bValue) === 'number') {
                    return bValue - aValue;
                }
                else {
                    return 0;
                }
            });
            setSortConfig({ column: column, order: "asc" })
            setSortedColumnsData(sorted)
        }
    }
    return (
        <table className="min-w-full bg-white border">
            <thead>
                <tr className="bg-gray-100">
                    {column.map((data) => (
                        <th className="border px-4 py-2" onClick={() => sort(data.accessor)}>{data.title}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {sortedColumnsDatas.map((data: T, rowIndex) => (
                    <tr key={rowIndex}>
                        {column.map((col) => (
                            <td key={String(col.accessor)} className="border px-4 py-2">
                                {String(data[col.accessor])}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table >
    );
}
