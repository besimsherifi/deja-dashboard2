"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action";

export type OrderColumn = {
  id: string;
  phone: string;
  address: string;
  isPaid: boolean;
  totalPrice: string;
  products: any;
  createdAt: string;
}

export const columns: ColumnDef<OrderColumn>[] = [
  // {
  //   accessorKey: "name",
  //   header: "Produkten",
  // },
  {
    accessorKey: "address",
    header: "Adresse",
  },
  {
    accessorKey: "phone",
    header: "Mobil",
  },
  {
    accessorKey: "totalPrice",
    header: "Gesamtpreis",
  },
  {
    accessorKey: "isPaid",
    header: "Bezahlt",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];