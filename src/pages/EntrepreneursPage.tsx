import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, Users } from "lucide-react";
import { AddEntrepreneurDialog } from "@/components/entrepreneurs/AddEntrepreneurDialog";
import { EntrepreneursList } from "@/components/entrepreneurs/EntrepreneursList";

export function EntrepreneursPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SEDCO Entrepreneur Database</h1>
          <p className="text-gray-500 mt-2">
            Manage and track all SEDCO entrepreneurs in the system
          </p>
        </div>
        <Button 
          onClick={() => setIsDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add Entrepreneur
        </Button>
      </div>

      <EntrepreneursList />
      
      <AddEntrepreneurDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
      />
    </div>
  );
}