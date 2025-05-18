
import { useState } from "react";
import { toast } from "sonner";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface OtpVerificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (otp: string) => Promise<void>;
  title: string;
  description: string;
}

const OtpVerificationDialog = ({
  isOpen,
  onClose,
  onVerify,
  title,
  description,
}: OtpVerificationDialogProps) => {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    if (!otp) {
      toast.error("Please enter the OTP code");
      return;
    }

    setIsVerifying(true);
    try {
      await onVerify(otp);
      // The calling component will handle success
      setOtp("");
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error("Failed to verify OTP. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCancel = () => {
    setOtp("");
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="py-4">
          <Input
            placeholder="Enter 6-digit OTP code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            type="text"
            pattern="[0-9]*"
            inputMode="numeric"
            className="text-center text-lg"
          />
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel} disabled={isVerifying}>
            Cancel
          </AlertDialogCancel>
          <Button 
            onClick={handleVerify} 
            disabled={!otp || otp.length < 6 || isVerifying}
          >
            {isVerifying ? (
              <>
                <LoadingSpinner size="small" className="mr-2" /> Verifying...
              </>
            ) : (
              "Verify & Proceed"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OtpVerificationDialog;
