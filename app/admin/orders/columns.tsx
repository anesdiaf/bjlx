"use client"

import { createColumnHelper } from "@tanstack/react-table"

import { type DataTableFeatures } from "./orders-table-features"
import { OrderWithInfoType } from "@/types"
import { formatNumbers } from "@/lib/utils"
import StatusCell from "./status-cell"
import LocationCell from "./location-cell"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"


// Use `accessor` for data columns and `display` for columns without one.
const columnHelper = createColumnHelper<DataTableFeatures, OrderWithInfoType>()

export const columns = columnHelper.columns([
    columnHelper.accessor("id", {
        header: "ID",
    }),
    columnHelper.accessor("info.name", {
        header: "Client",
        cell: ({row}) => {
            const data = row.original;
            const name = data.info?.name
            const phone = data.info?.phone
            return (
                <div className="space-y-2">
                    <p>{name}</p>
                    <p className="text-xs">{phone}</p>
                </div>
            )
        }
    }),
    columnHelper.accessor("info.commune_id", {
        header: "Adresse",
        cell: ({row}) => {
            const data = row.original;
            const commune_id = data.info?.commune_id as number
            return <LocationCell commune_id={commune_id}/>
        }
    }),
    columnHelper.accessor("total", {
        header: "Total",
        cell: ({row}) => {
            const total = row.getValue("total") as number
            return <div className="font-medium">{formatNumbers(total, "US-us")} D.A</div>
        }
    }),
    columnHelper.accessor("status_id", {
        header: "Status",
        cell: ({row}) => {

            const statusID = row.getValue("status_id") as number

            return <StatusCell id={statusID}/>
        }
    }),
    columnHelper.accessor("createdAt", {
        header: "Date",
        cell: ({row}) => {
            const date = row.getValue("createdAt") as Date;
            return <div>{date.toDateString()} <span className="text-xs text-muted-foreground">{`${date.getHours()}:${date.getMinutes()}`}</span></div>
        }
    }),
    columnHelper.display({
        id: "actions",
        cell: ({row}) => {
            const data = row.original;
            const orderID = data.id
            return <div><Link href={`/admin/orders/manage/${orderID}`}><Button size="icon-sm" ><Eye/></Button></Link></div>
        }
    })
])