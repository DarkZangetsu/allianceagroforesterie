import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { getLogoUrl } from '../../lib/utils';

export const parcellesColumns = (onViewDetails, onViewMap) => [
  {
    accessorKey: "Nom site de référence",
    header: ({ column }) => (
      <div className="text-center">
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Nom site de référence <ArrowUpDown className="ml-2 h-4 w-4" /></Button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center">{row.original.nom}</div>
    ),
  },
   {
    id: "Institutions",
    header: "Institutions",
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div className="flex items-center">
          {user?.logo && (
            <img src={getLogoUrl(user.logo)} alt="Logo" className="w-6 h-6 rounded-full mr-2" />
          )}
          <div>
            <div className="text-sm font-medium text-gray-900">{user?.nomInstitution}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "Personne Référente",
    header: "Personne référente",
    cell: ({ row }) => {
      const p = row.original;
      return (
        <div>
          <div className="text-sm font-medium">{p.nomPersonneReferente || '-'}</div>
          <div className="text-xs text-gray-500">{p.poste || '-'}</div>
          <div className="text-xs text-gray-500">{p.telephone || '-'}</div>
          <div className="text-xs text-gray-500">{p.email || '-'}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "Projet rattaché",
    header: () => <div className="text-center">Projet rattaché</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.original.nomProjet || "-"}</div>
    ),
  },
  {
    accessorKey: "Pratiques",
    header: () => <div className="text-center">Pratiques</div>,
    cell: ({ row }) => {
      const pratiques = row.original.pratique ? row.original.pratique.split(',') : [];
      if (!pratiques.length) return <div className="text-center">-</div>;
      return (
        <div className="flex justify-center">
          <ul className="text-center inline-block max-w-xs">
            {pratiques.map((p, idx) => {
              const pratiqueTrim = p.trim();
              const pratiqueAffiche = pratiqueTrim.length > 30 ? pratiqueTrim.slice(0, 30) + '...' : pratiqueTrim;
              return (
                <li key={idx} title={pratiqueTrim} className="truncate overflow-hidden whitespace-nowrap">{pratiqueAffiche}</li>
              );
            })}
          </ul>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Ouvrir le menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onViewDetails(row.original)}>
            Voir détails
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onViewMap(row.original)}>
            Voir sur la carte
          </DropdownMenuItem>
          <DropdownMenuSeparator />
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    enableSorting: false,
    enableHiding: false,
  },
]; 