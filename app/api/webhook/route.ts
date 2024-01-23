import Stripe from "stripe"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

import { stripe } from "@/lib/stripe"
import prismadb from "@/lib/prismadb"

export async function POST(req: Request) {
    const body = await req.text()
    const signature = headers().get("Stripe-Signature") as string

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const address = session?.customer_details?.address;

    const addressComponents = [
        address?.line1,
        address?.line2,
        address?.city,
        address?.state,
        address?.postal_code,
        address?.country
    ];

    const addressString = addressComponents.filter((c) => c !== null).join(', ');


    if (event.type === "checkout.session.completed") {
        const order = await prismadb.order.update({
            where: {
                id: session?.metadata?.orderId,
            },
            data: {
                isPaid: true,
                address: addressString,
                phone: session?.customer_details?.phone || '',
            },
            include: {
                orderItems: true,
            }
        });

        const productIds = order.orderItems.map((orderItem) => orderItem.productId);

        // Fetch the products from the database
        const productsToUpdate = await prismadb.product.findMany({
            where: {
                id: {
                    in: [...productIds],
                },
            },
        });

        // Iterate through the products and update the quantities
        for (const productToUpdate of productsToUpdate) {
            const correspondingOrderItem = order.orderItems.find(
                (orderItem) => orderItem.productId === productToUpdate.id
            );

            if (correspondingOrderItem) {
                // Update the availableQuantity and isArchived based on the order quantity
                const newAvailableQuantity =
                    Number(productToUpdate.availableQuantity) - parseInt(correspondingOrderItem.quantity, 10);

                const updateData = {
                    availableQuantity: newAvailableQuantity,
                    isArchived: newAvailableQuantity === 0, // Set isArchived to true if availableQuantity becomes 0
                };

                // Update the product in the database
                await prismadb.product.update({
                    where: { id: productToUpdate.id },
                    data: updateData,
                });
            }
        }


        // await prismadb.product.updateMany({
        //     where: {
        //         id: {
        //             in: [...productIds],
        //         },
        //     },
        //     data: {
        //         isArchived: true
        //     }
        // });
    }

    return new NextResponse(null, { status: 200 });
};