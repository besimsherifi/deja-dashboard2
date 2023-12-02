"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type ProductColumn = {
  id: string
  name: string;
  price: string;
  category: string;
  size: string;
  color: string;
  createdAt: string;
  isFeatured: boolean;
  isArchived: boolean;
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "isArchived",
    header: "Archiviert",
  },
  {
    accessorKey: "isFeatured",
    header: "Lieblingsprodukt",
  },
  {
    accessorKey: "price",
    header: "Preis",
  },
  {
    accessorKey: "category",
    header: "Kategorie",
  },
  {
    accessorKey: "size",
    header: "Größe",
  },
  {
    accessorKey: "color",
    header: "Farbe",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.color}
        <div className="h-6 w-6 rounded-full border" style={{ backgroundColor: row.original.color }} />
      </div>
    )
  },
  {
    accessorKey: "createdAt",
    header: "Datum",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];