import prismadb from "@/lib/prismadb";
import OrderCard from "./components/order-card";

const ColorPage = async ({
    params
}: {
    params: { orderId: string }
}) => {
    const order = await prismadb.order.findUnique({
        where: {
            id: params.orderId,
        },
        include: {
            orderItems: {
                include: {
                    product: true,
                },
            },
        },
    });


    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">

                <div className="text-center">
                    <span className="inline-flex">Adresse: <p className="font-bold mx-2">{order.address}</p></span><br />
                    <span className="inline-flex">Mobil: <p className="font-bold mx-2">{order.phone}</p></span>
                    {order.isPaid ? <p className="font-bold">Bestellung bezahlt</p> : <p className="font-bold ">Bestellung nicht bezahlt</p>}
                    <span className="inline-flex"> Total Preis <p className="font-bold mx-2"> {order.totalPrice} </p> CHF </span>
                    <p>Datum: {order.createdAt.toLocaleDateString()}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                    {order.orderItems.map((orderItem) => (
                        <OrderCard key={orderItem.id} name={orderItem.product.name} color={orderItem.color} size={orderItem.size} quantity={orderItem.quantity} id={orderItem.product.id} />
                    ))}
                </div>

            </div>
        </div>
    );
}

export default ColorPage;
