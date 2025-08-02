import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { getLogoUrl } from '../../lib/utils';

export const pepinieresColumns = (onViewDetails, onViewMap) => [
  {
    accessorKey: "Nom pépinière",
    header: ({ column }) => (
      <div className="text-center">
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Nom pépinière<ArrowUpDown className="ml-2 h-4 w-4" /></Button>
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
    id: "Gestionnaire",
    header: "Gestionnaire",
    cell: ({ row }) => {
      const pepiniere = row.original;
      return (
        <div className="space-y-1">
          {pepiniere.nomGestionnaire && (
            <div className="text-sm font-medium text-gray-900">{pepiniere.nomGestionnaire}</div>
          )}
          {pepiniere.posteGestionnaire && (
            <div className="text-xs text-gray-500">{pepiniere.posteGestionnaire}</div>
          )}
          {pepiniere.telephoneGestionnaire && (
            <div className="text-xs text-gray-500">{pepiniere.telephoneGestionnaire}</div>
          )}
          {pepiniere.emailGestionnaire && (
            <div className="text-xs text-gray-500">{pepiniere.emailGestionnaire}</div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "adresse",
    header: () => <div className="text-center">Adresse</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("adresse") || "-"}</div>
    ),
  },
  {
    accessorKey: "Projet rattaché",
    header: () => <div className="text-center">Projet rattaché</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.original.nomProjet || "-"}</div>
    ),
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