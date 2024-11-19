import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, User, Building2, Phone, Mail, MapPin, Briefcase, GraduationCap, DollarSign, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { getEntrepreneurById } from "@/lib/db";
import { cn } from "@/lib/utils";

interface ViewEntrepreneurDialogProps {
  entrepreneurId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface EntrepreneurDetails {
  name: string;
  icNumber: string;
  gender: string;
  race: string;
  academic: string;
  phone: string;
  companyName: string;
  address: string;
  email: string;
  district: string;
  businessType: string;
  businessField: string;
  agency: string;
  employeeCount: number;
  program: string;
  premiseLot: string;
  location: string;
  monthlyIncome: number;
  businessStatus: string;
  year: number;
}

interface InfoItemProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  className?: string;
}

function InfoItem({ icon: Icon, label, value, className }: InfoItemProps) {
  return (
    <div className={cn("flex items-start gap-3", className)}>
      <Icon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-base font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
    </div>
  );
}

export function ViewEntrepreneurDialog({
  entrepreneurId,
  open,
  onOpenChange,
}: ViewEntrepreneurDialogProps) {
  const [entrepreneur, setEntrepreneur] = useState<EntrepreneurDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadEntrepreneur() {
      if (!entrepreneurId) return;
      
      setIsLoading(true);
      try {
        const data = await getEntrepreneurById(entrepreneurId);
        setEntrepreneur(data);
      } catch (error) {
        console.error('Error loading entrepreneur details:', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (open && entrepreneurId) {
      loadEntrepreneur();
    }
  }, [entrepreneurId, open]);

  const getStatusBadgeClasses = (status: string) => {
    const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium";
    switch (status.toLowerCase()) {
      case 'active':
        return cn(baseClasses, "bg-green-100 text-green-800");
      case 'inactive':
        return cn(baseClasses, "bg-red-100 text-red-800");
      case 'in process':
        return cn(baseClasses, "bg-yellow-100 text-yellow-800");
      default:
        return cn(baseClasses, "bg-gray-100 text-gray-800");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Entrepreneur Details</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : entrepreneur ? (
          <div className="space-y-8 py-4">
            {/* Header Section */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-gray-900">{entrepreneur.name}</h2>
                <p className="text-gray-500">{entrepreneur.icNumber}</p>
              </div>
              <span className={getStatusBadgeClasses(entrepreneur.businessStatus)}>
                {entrepreneur.businessStatus}
              </span>
            </div>

            {/* Personal Information */}
            <Section title="Personal Information">
              <InfoItem
                icon={User}
                label="Gender"
                value={entrepreneur.gender.charAt(0).toUpperCase() + entrepreneur.gender.slice(1)}
              />
              <InfoItem
                icon={User}
                label="Race"
                value={entrepreneur.race}
              />
              <InfoItem
                icon={GraduationCap}
                label="Academic Qualification"
                value={entrepreneur.academic}
              />
              <InfoItem
                icon={Phone}
                label="Phone Number"
                value={entrepreneur.phone}
              />
              <InfoItem
                icon={Mail}
                label="Email"
                value={entrepreneur.email}
              />
              <InfoItem
                icon={MapPin}
                label="District"
                value={entrepreneur.district}
              />
            </Section>

            {/* Business Information */}
            <Section title="Business Information">
              <InfoItem
                icon={Building2}
                label="Company Name"
                value={entrepreneur.companyName}
              />
              <InfoItem
                icon={Briefcase}
                label="Business Type"
                value={entrepreneur.businessType.charAt(0).toUpperCase() + entrepreneur.businessType.slice(1)}
              />
              <InfoItem
                icon={Briefcase}
                label="Business Field"
                value={entrepreneur.businessField}
              />
              <InfoItem
                icon={Building2}
                label="Supporting Agency"
                value={entrepreneur.agency}
              />
              <InfoItem
                icon={User}
                label="Number of Employees"
                value={entrepreneur.employeeCount}
              />
              <InfoItem
                icon={Briefcase}
                label="Program Enrolled"
                value={entrepreneur.program}
              />
            </Section>

            {/* Location Information */}
            <Section title="Location Information">
              <InfoItem
                icon={MapPin}
                label="Address"
                value={entrepreneur.address}
                className="col-span-2"
              />
              <InfoItem
                icon={MapPin}
                label="Premise Lot"
                value={entrepreneur.premiseLot}
              />
              <InfoItem
                icon={MapPin}
                label="Location"
                value={entrepreneur.location}
              />
            </Section>

            {/* Financial Information */}
            <Section title="Financial Information">
              <InfoItem
                icon={DollarSign}
                label="Monthly Income"
                value={`RM ${entrepreneur.monthlyIncome.toLocaleString()}`}
              />
              <InfoItem
                icon={Calendar}
                label="Year"
                value={entrepreneur.year}
              />
            </Section>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Entrepreneur details not found
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}