
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AddOwnerForm from "./AddOwnerForm";
import { addOwner } from "@/services/admin-service";
import { Owner } from "@/lib/types";
import { UserPlus, X } from "lucide-react";

interface AddOwnerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onOwnerAdded: () => void;
}

const AddOwnerDialog = ({ isOpen, onClose, onOwnerAdded }: AddOwnerDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: Partial<Owner>) => {
    setIsLoading(true);
    try {
      await addOwner(data);
      onOwnerAdded();
      onClose();
    } catch (error) {
      console.error("Error adding owner:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-xl border border-white/60 shadow-3xl rounded-3xl">
        <DialogHeader className="border-b border-rose-100 pb-6">
          <DialogTitle className="flex items-center gap-3 text-2xl font-serif font-bold text-gray-800">
            <div className="w-10 h-10 bg-gradient-to-r from-rose-500 to-emerald-500 rounded-2xl flex items-center justify-center">
              <UserPlus size={20} className="text-white" />
            </div>
            Add New Owner
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-6 top-6 rounded-2xl hover:bg-rose-50"
          >
            <X size={20} />
          </Button>
        </DialogHeader>
        
        <div className="p-6">
          <AddOwnerForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddOwnerDialog;
