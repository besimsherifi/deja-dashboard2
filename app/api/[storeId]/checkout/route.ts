import Stripe from "stripe";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    const { products, totalPrice } = await req.json();


    if (!products || products.length === 0) {
        return new NextResponse("Product ids are required", { status: 400 });
    }



    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    products.forEach((product) => {
        line_items.push({
            quantity: product.quantity ?? 1,
            price_data: {
                currency: 'CHF',
                product_data: {
                    name: product.name,
                },
                unit_amount: product.price * 100
            },
        });
    });

    console.log(products);


    const order = await prismadb.order.create({
        data: {
            storeId: params.storeId,
            isPaid: false,
            totalPrice: totalPrice,
            orderItems: {
                create: products.map((product) => ({
                    product: {
                        connect: {
                            id: product.id
                        }
                    },
                    quantity: product.quantity !== null ? product.quantity.toString() : '1',
                    size: product.chosenSize !== null ? product.chosenSize : (product.availableSizes && product.availableSizes.length > 0 ? product.availableSizes[0] : ''),
                    color: product.color.name ?? null,
                }))
            }
        }
    });





    const session = await stripe.checkout.sessions.create({
        line_items,
        mode: 'payment',
        billing_address_collection: 'required',
        phone_number_collection: {
            enabled: true,
        },
        success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
        cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
        metadata: {
            orderId: order.id
        },
    });

    return NextResponse.json({ url: session.url }, {
        headers: corsHeaders
    });
};