"use client";

import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { columns, OrderColumn } from "./columns";
import { ApiList } from "@/components/ui/api-list";

interface OrderClientProps {
  data: OrderColumn[];
}

export const OrderClient: React.FC<OrderClientProps> = ({
  data
}) => {

  // console.log(data, "client");

  return (
    <>
      <Heading title={`Bestellungen (${data.length})`} description="Verwalten Sie Bestellungen für Ihr Geschäft" />
      <Separator />
      <DataTable searchKey="products" columns={columns} data={data} />
      <Heading title="API" description="API Calls for Billboards" />
      <Separator />
      <ApiList entityName="orders" entityIdName="orderId" />
    </>
  );
};