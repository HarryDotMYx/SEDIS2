import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { addEntrepreneur } from "@/lib/db";

interface AddEntrepreneurDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SABAH_DISTRICTS = [
  // Main Districts
  { value: "beaufort", label: "Beaufort" },
  { value: "beluran", label: "Beluran" },
  { value: "keningau", label: "Keningau" },
  { value: "kota-belud", label: "Kota Belud" },
  { value: "kota-kinabalu", label: "Kota Kinabalu" },
  { value: "kota-marudu", label: "Kota Marudu" },
  { value: "kudat", label: "Kudat" },
  { value: "kunak", label: "Kunak" },
  { value: "lahad-datu", label: "Lahad Datu" },
  { value: "nabawan", label: "Nabawan" },
  { value: "papar", label: "Papar" },
  { value: "penampang", label: "Penampang" },
  { value: "pitas", label: "Pitas" },
  { value: "putatan", label: "Putatan" },
  { value: "ranau", label: "Ranau" },
  { value: "sandakan", label: "Sandakan" },
  { value: "semporna", label: "Semporna" },
  { value: "sipitang", label: "Sipitang" },
  { value: "tambunan", label: "Tambunan" },
  { value: "tawau", label: "Tawau" },
  { value: "telupid", label: "Telupid" },
  { value: "tenom", label: "Tenom" },
  { value: "tongod", label: "Tongod" },
  { value: "tuaran", label: "Tuaran" },
  { value: "kuala-penyu", label: "Kuala Penyu" },
  { value: "kalabakan", label: "Kalabakan" },
  { value: "tanjung-aru", label: "Tanjung Aru" },
  // Sub-Districts
  { value: "tamparuli", label: "Tamparuli", isSubDistrict: true },
  { value: "membakut", label: "Membakut", isSubDistrict: true },
  { value: "menumbok", label: "Menumbok", isSubDistrict: true },
  { value: "matunggong", label: "Matunggong", isSubDistrict: true },
  { value: "paitan", label: "Paitan", isSubDistrict: true }
];

export function AddEntrepreneurDialog({ open, onOpenChange }: AddEntrepreneurDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    icNumber: "",
    gender: "",
    race: "",
    academic: "",
    phone: "",
    companyName: "",
    address: "",
    email: "",
    district: "",
    businessType: "",
    businessField: "",
    agency: "",
    employeeCount: "",
    program: "",
    premiseLot: "",
    location: "",
    monthlyIncome: "",
    businessStatus: "",
    year: new Date().getFullYear().toString(),
  });

  const resetForm = () => {
    setFormData({
      name: "",
      icNumber: "",
      gender: "",
      race: "",
      academic: "",
      phone: "",
      companyName: "",
      address: "",
      email: "",
      district: "",
      businessType: "",
      businessField: "",
      agency: "",
      employeeCount: "",
      program: "",
      premiseLot: "",
      location: "",
      monthlyIncome: "",
      businessStatus: "",
      year: new Date().getFullYear().toString(),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const entrepreneurData = {
        ...formData,
        employeeCount: parseInt(formData.employeeCount, 10),
        monthlyIncome: parseFloat(formData.monthlyIncome),
        year: parseInt(formData.year, 10),
      };

      const success = await addEntrepreneur(entrepreneurData);
      
      if (success) {
        toast({
          title: "Success",
          description: "Entrepreneur has been successfully added",
        });
        resetForm();
        onOpenChange(false);
        window.dispatchEvent(new CustomEvent('refreshEntrepreneurs'));
      } else {
        throw new Error('Failed to add entrepreneur');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add entrepreneur. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Entrepreneur</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="icNumber">IC Number</Label>
                <Input
                  id="icNumber"
                  value={formData.icNumber}
                  onChange={(e) => setFormData({ ...formData, icNumber: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => setFormData({ ...formData, gender: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="race">Race</Label>
                <Input
                  id="race"
                  value={formData.race}
                  onChange={(e) => setFormData({ ...formData, race: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="academic">Academic Qualification</Label>
                <Input
                  id="academic"
                  value={formData.academic}
                  onChange={(e) => setFormData({ ...formData, academic: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="address">Mailing Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="district">District</Label>
                <Select
                  value={formData.district}
                  onValueChange={(value) => setFormData({ ...formData, district: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="space-y-1">
                      {/* Main Districts */}
                      <div className="px-2 py-1.5 text-sm font-semibold text-gray-500">
                        Main Districts
                      </div>
                      {SABAH_DISTRICTS.filter(d => !d.isSubDistrict).map((district) => (
                        <SelectItem
                          key={district.value}
                          value={district.value}
                          className="capitalize"
                        >
                          {district.label}
                        </SelectItem>
                      ))}
                      
                      {/* Sub-Districts */}
                      <div className="px-2 py-1.5 text-sm font-semibold text-gray-500 border-t">
                        Sub-Districts
                      </div>
                      {SABAH_DISTRICTS.filter(d => d.isSubDistrict).map((district) => (
                        <SelectItem
                          key={district.value}
                          value={district.value}
                          className="capitalize"
                        >
                          {district.label}
                        </SelectItem>
                      ))}
                    </div>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="businessType">Business Type</Label>
                <Select
                  value={formData.businessType}
                  onValueChange={(value) => setFormData({ ...formData, businessType: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="businessField">Business Field</Label>
                <Input
                  id="businessField"
                  value={formData.businessField}
                  onChange={(e) => setFormData({ ...formData, businessField: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="agency">Supporting Agency</Label>
                <Select
                  value={formData.agency}
                  onValueChange={(value) => setFormData({ ...formData, agency: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select agency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MIDE">MIDE</SelectItem>
                    <SelectItem value="DIDR">DIDR</SelectItem>
                    <SelectItem value="SVH">SVH</SelectItem>
                    <SelectItem value="PRSB">PRSB</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="employeeCount">Number of Employees</Label>
                <Input
                  id="employeeCount"
                  type="number"
                  value={formData.employeeCount}
                  onChange={(e) => setFormData({ ...formData, employeeCount: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="program">Program Enrolled</Label>
                <Select
                  value={formData.program}
                  onValueChange={(value) => setFormData({ ...formData, program: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select program" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rental">Rental</SelectItem>
                    <SelectItem value="spubs">SPUBS</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="premiseLot">Premise Lot</Label>
                <Input
                  id="premiseLot"
                  value={formData.premiseLot}
                  onChange={(e) => setFormData({ ...formData, premiseLot: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="location">Location (Premise)</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="monthlyIncome">Monthly Income (RM)</Label>
              <Input
                id="monthlyIncome"
                type="number"
                value={formData.monthlyIncome}
                onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="businessStatus">Business Status</Label>
              <Select
                value={formData.businessStatus}
                onValueChange={(value) => setFormData({ ...formData, businessStatus: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="in process">In Process</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}