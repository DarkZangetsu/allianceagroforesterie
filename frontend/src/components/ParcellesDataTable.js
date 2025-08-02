"use client";
import * as React from 'react';
import { DataTable } from './ui/table-data-table';
import { Button } from './ui/button';
import { Trash } from 'lucide-react';

export default function ParcellesDataTable({ parcelles, onDelete }) {
  // Colonnes pour DataTable shadcn/ui
  const columns = React.useMemo(() => [
    {
      accessorKey: 'nom',
      header: 'Nom',
      cell: info => info.getValue(),
    },
    {
      accessorKey: 'pratique',
      header: 'Pratique',
      cell: info => info.getValue() || '-',
    },
    {
      accessorKey: 'nomProjet',
      header: 'Nom Projet',
      cell: info => info.getValue() || '-',
    },
    {
      accessorKey: 'superficie',
      header: 'Superficie',
      cell: info => info.getValue() ? `${info.getValue()} ha` : '-',
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete && onDelete(row.original)}
          title="Supprimer la parcelle"
        >
          <Trash size={16} />
        </Button>
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ], [onDelete]);

  return (
    <DataTable
      columns={columns}
      data={Array.isArray(parcelles) ? parcelles : []}
      filterKey="nom"
      filterPlaceholder="Rechercher par nom..."
    />
  );
} 