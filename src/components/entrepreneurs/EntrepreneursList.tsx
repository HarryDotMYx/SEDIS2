import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Edit2, Trash2, Loader2, Search, Eye } from "lucide-react";
import { getAllEntrepreneurs, deleteEntrepreneur } from "@/lib/db";
import { ViewEntrepreneurDialog } from "./ViewEntrepreneurDialog";
import { EditEntrepreneurDialog } from "./EditEntrepreneurDialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Entrepreneur {
  id: number;
  name: string;
  icNumber: string;
  companyName: string;
  businessType: string;
  status: string;
  district: string;
}

export function EntrepreneursList() {
  const { toast } = useToast();
  const [entrepreneurs, setEntrepreneurs] = useState<Entrepreneur[]>([]);
  const [filteredEntrepreneurs, setFilteredEntrepreneurs] = useState<Entrepreneur[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEntrepreneur, setSelectedEntrepreneur] = useState<number | null>(null);
  const [editingEntrepreneur, setEditingEntrepreneur] = useState<number | null>(null);
  const [deletingEntrepreneur, setDeletingEntrepreneur] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadEntrepreneurs = async () => {
    try {
      const data = await getAllEntrepreneurs();
      setEntrepreneurs(data);
      setFilteredEntrepreneurs(data);
    } catch (error) {
      console.error('Error loading entrepreneurs:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load entrepreneurs. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEntrepreneurs();
  }, []);

  useEffect(() => {
    const filtered = entrepreneurs.filter((entrepreneur) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        entrepreneur.name.toLowerCase().includes(searchLower) ||
        entrepreneur.icNumber.toLowerCase().includes(searchLower) ||
        entrepreneur.companyName.toLowerCase().includes(searchLower) ||
        entrepreneur.district.toLowerCase().includes(searchLower) ||
        entrepreneur.businessType.toLowerCase().includes(searchLower)
      );
    });
    setFilteredEntrepreneurs(filtered);
  }, [searchQuery, entrepreneurs]);

  const handleDelete = async () => {
    if (!deletingEntrepreneur) return;

    setIsDeleting(true);
    try {
      const success = await deleteEntrepreneur(deletingEntrepreneur);
      if (success) {
        toast({
          title: "Success",
          description: "Entrepreneur has been deleted successfully",
        });
        loadEntrepreneurs();
      } else {
        throw new Error('Failed to delete entrepreneur');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete entrepreneur. Please try again.",
      });
    } finally {
      setIsDeleting(false);
      setDeletingEntrepreneur(null);
    }
  };

  const getStatusBadgeClasses = (status: string) => {
    const baseClasses = "px-3 py-1 text-xs font-medium rounded-full capitalize";
    switch (status.toLowerCase()) {
      case 'active':
        return cn(baseClasses, "bg-green-100 text-green-700");
      case 'inactive':
        return cn(baseClasses, "bg-red-100 text-red-700");
      case 'in process':
      case 'pending':
        return cn(baseClasses, "bg-yellow-100 text-yellow-700");
      default:
        return cn(baseClasses, "bg-gray-100 text-gray-700");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search entrepreneurs by name, IC, company..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>IC Number</TableHead>
              <TableHead>Company Name</TableHead>
              <TableHead>Business Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>District</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEntrepreneurs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  {searchQuery
                    ? "No entrepreneurs found matching your search criteria."
                    : "No entrepreneurs found. Add your first entrepreneur using the button above."}
                </TableCell>
              </TableRow>
            ) : (
              filteredEntrepreneurs.map((entrepreneur) => (
                <TableRow key={entrepreneur.id}>
                  <TableCell className="font-medium">{entrepreneur.name}</TableCell>
                  <TableCell>{entrepreneur.icNumber}</TableCell>
                  <TableCell>{entrepreneur.companyName}</TableCell>
                  <TableCell className="capitalize">{entrepreneur.businessType}</TableCell>
                  <TableCell>
                    <span className={getStatusBadgeClasses(entrepreneur.status)}>
                      {entrepreneur.status}
                    </span>
                  </TableCell>
                  <TableCell>{entrepreneur.district}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="ghost"
                      size="icon"
                      title="View Details"
                      onClick={() => setSelectedEntrepreneur(entrepreneur.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      title="Edit"
                      onClick={() => setEditingEntrepreneur(entrepreneur.id)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-600 hover:text-red-700" 
                      title="Delete"
                      onClick={() => setDeletingEntrepreneur(entrepreneur.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ViewEntrepreneurDialog
        entrepreneurId={selectedEntrepreneur}
        open={selectedEntrepreneur !== null}
        onOpenChange={(open) => !open && setSelectedEntrepreneur(null)}
      />

      <EditEntrepreneurDialog
        entrepreneurId={editingEntrepreneur}
        open={editingEntrepreneur !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditingEntrepreneur(null);
          }
        }}
        onSuccess={() => {
          setEditingEntrepreneur(null);
          loadEntrepreneurs();
        }}
      />

      <AlertDialog open={deletingEntrepreneur !== null} onOpenChange={(open) => !open && setDeletingEntrepreneur(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the entrepreneur's data from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}