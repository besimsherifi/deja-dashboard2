import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";

export async function GET(
    req: Request,
    { params }: { params: { orderId: string } }
) {
    try {
        if (!params.orderId) {
            return new NextResponse("order id is required", { status: 400 });
        }

        const order = await prismadb.order.findUnique({
            where: {
                id: params.orderId
            }
        });

        return NextResponse.json(order);
    } catch (error) {
        console.log('[order_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export async function DELETE(
    req: Request,
    { params }: { params: { orderId: string, storeId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 403 });
        }

        if (!params.orderId) {
            return new NextResponse("order id is required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 405 });
        }

        await prismadb.orderItem.deleteMany({
            where: {
                orderId: params.orderId,
            },
        });

        const order = await prismadb.order.delete({
            where: {
                id: params.orderId,
            },
        });

        return NextResponse.json(order);
    } catch (error) {
        console.log('[order_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
};

