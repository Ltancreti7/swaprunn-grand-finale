import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const editDriverProfileSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(15, "Phone number too long"),
  email: z.string().email("Invalid email address").max(255, "Email too long").optional(),
  day_off: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']).optional(),
  max_miles: z.number().min(10, "Minimum 10 miles").max(200, "Maximum 200 miles"),
  city_ok: z.boolean(),
  available: z.boolean(),
});

interface DriverData {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  day_off?: string;
  max_miles?: number;
  city_ok?: boolean;
  available?: boolean;
}

interface EditDriverProfileProps {
  isOpen: boolean;
  onClose: () => void;
  driverData: DriverData;
  onUpdate: (updatedData: Partial<DriverData>) => void;
}

export const EditDriverProfile = ({ isOpen, onClose, driverData, onUpdate }: EditDriverProfileProps) => {
  const [phone, setPhone] = useState(driverData.phone || '');
  const [email, setEmail] = useState(driverData.email || '');
  const [dayOff, setDayOff] = useState(driverData.day_off || '');
  const [maxMiles, setMaxMiles] = useState(driverData.max_miles || 50);
  const [cityOk, setCityOk] = useState(driverData.city_ok ?? true);
  const [available, setAvailable] = useState(driverData.available ?? true);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      setIsLoading(true);
      
      // Validate input
      const validation = editDriverProfileSchema.safeParse({
        phone: phone.trim(),
        email: email.trim() || undefined,
        day_off: dayOff || undefined,
        max_miles: maxMiles,
        city_ok: cityOk,
        available: available,
      });

      if (!validation.success) {
        const errorMessage = validation.error.errors[0]?.message || "Invalid input";
        toast({
          title: "Validation Error",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      // Update driver profile
      const { error } = await supabase
        .from('drivers')
        .update({
          phone: phone.trim() || null,
          email: email.trim() || null,
          day_off: dayOff || null,
          max_miles: maxMiles,
          city_ok: cityOk,
          available: available,
        })
        .eq('id', driverData.id);

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });

      // Update local state
      onUpdate({
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        day_off: dayOff || undefined,
        max_miles: maxMiles,
        city_ok: cityOk,
        available: available,
      });

      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-numeric characters
    const phoneNumber = value.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX for US numbers
    if (phoneNumber.length >= 6) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    } else if (phoneNumber.length >= 3) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    } else {
      return phoneNumber;
    }
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setPhone(formatted);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-background border">
        <DialogHeader>
          <DialogTitle>Edit Driver Profile</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Contact Information Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Contact Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="(555) 123-4567"
                maxLength={14}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                maxLength={255}
              />
            </div>
          </div>

          <Separator />

          {/* Work Preferences Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Work Preferences</h3>

            <div className="space-y-2">
              <Label htmlFor="day-off">Preferred Day Off</Label>
              <Select value={dayOff} onValueChange={setDayOff}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Select a day (optional)" />
                </SelectTrigger>
                <SelectContent className="bg-background border-border z-50">
                  <SelectItem value="no-preference">No preference</SelectItem>
                  <SelectItem value="monday">Monday</SelectItem>
                  <SelectItem value="tuesday">Tuesday</SelectItem>
                  <SelectItem value="wednesday">Wednesday</SelectItem>
                  <SelectItem value="thursday">Thursday</SelectItem>
                  <SelectItem value="friday">Friday</SelectItem>
                  <SelectItem value="saturday">Saturday</SelectItem>
                  <SelectItem value="sunday">Sunday</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-miles">Maximum Miles Willing to Drive: {maxMiles} miles</Label>
              <Slider
                id="max-miles"
                min={10}
                max={200}
                step={5}
                value={[maxMiles]}
                onValueChange={(value) => setMaxMiles(value[0])}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Set the maximum distance you're willing to drive for a job
              </p>
            </div>

            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label htmlFor="city-ok">Comfortable with City Driving</Label>
                <p className="text-xs text-muted-foreground">
                  Are you comfortable driving in city traffic?
                </p>
              </div>
              <Switch
                id="city-ok"
                checked={cityOk}
                onCheckedChange={setCityOk}
              />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label htmlFor="available">Available for Jobs</Label>
                <p className="text-xs text-muted-foreground">
                  Turn this off when you're not available to accept new jobs
                </p>
              </div>
              <Switch
                id="available"
                checked={available}
                onCheckedChange={setAvailable}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};