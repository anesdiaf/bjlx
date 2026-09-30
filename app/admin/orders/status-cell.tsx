"use client"

import { getOrderStatus } from "@/app/actions/orders";
import DynamicIcon from "@/components/admin/all/dynamic-icon";
import { Spinner } from "@/components/ui/spinner";
import { orderStatusType } from "@/src/db/schema";
import { useEffect, useState } from "react"

export default function StatusCell({ id }: { id: number }) {
    const [order_status, setOrderStatus] = useState<orderStatusType | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    useEffect(() => {
        setLoading(true)
        getOrderStatus(id).then(res => {
            if (res.success) {
                setOrderStatus(res.data)
                setLoading(false)
            }
        })
    }, [])

    if(loading || !order_status){
        return <div>
            <Spinner/>
        </div>
    }
    return (
        <div>

            {order_status && !loading &&
                <div className="text-center px-3 py-1 w-fit flex items-center gap-2"
                    style={{
                        backgroundColor: order_status.color ? order_status.color.replace(')', ' / 20%)') : "oklch(55.1% 0.027 264.364 / 10%)",
                        color: order_status.color ? order_status.color : "oklch(55.1% 0.027 264.364)"
                    }}>
                    <DynamicIcon name={order_status.icon??undefined}/>
                    {order_status.title}

                </div>}
        </div>
    )
}