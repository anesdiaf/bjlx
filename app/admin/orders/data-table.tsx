"use client"

import { FilterFn, PaginationState, Row, useTable, type ColumnDef, type RowData } from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { features, type DataTableFeatures } from "./orders-table-features"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { OrderWithInfoType } from "@/types"

interface DataTableProps {
    columns: ColumnDef<DataTableFeatures, OrderWithInfoType>[]
    data: OrderWithInfoType[]
}

export function DataTable({
    columns,
    data,
}: DataTableProps) {


    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0, // initial page index
        pageSize: 15, // default page size
    })

    const [globalFilter, setGlobalFilter] = useState<string>('')

    const customFilterFn: FilterFn<DataTableFeatures, OrderWithInfoType> = (row, _columnId: string, filterValue: string) => {
        const search = String(filterValue).trim().toLowerCase();

        if (!search) {
            return true;
        }

        const order = row.original;

        return (
            String(order.id).toLowerCase().includes(search) ||
            String(order.info!.name).toLowerCase().includes(search) ||
            String(order.info!.phone).toLowerCase().includes(search) ||
            String(order.info!.wilaya_id).toLowerCase().includes(search) ||
            String(order.status_id).toLowerCase().includes(search) ||
            String(order.total).toLowerCase().includes(search)
        );
    };

    const table = useTable({
        features,
        data,
        columns,
        onPaginationChange: setPagination,
        globalFilterFn: customFilterFn,
        state: {
            pagination,
            globalFilter
        },
        onGlobalFilterChange: setGlobalFilter,
    })

    return (
        <div>

            <div className="flex items-center py-4">
                <Input
                    placeholder="Recherche..."
                    value={table.state.globalFilter ?? ""}
                    onChange={(e) => table.setGlobalFilter(String(e.target.value))}
                    className="max-w-sm"
                />
            </div>
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : (
                                                <table.FlexRender header={header} />
                                            )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            <table.FlexRender cell={cell} />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Précédent
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Suivant
                </Button>
            </div>
        </div>

    )
}