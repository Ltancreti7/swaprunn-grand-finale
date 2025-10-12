import { useState, useRef } from 'react';
import { Camera, Upload, Edit, Save, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function DriverProfile() {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(userProfile?.drivers?.profile_photo_url || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Editable form state
  const [formData, setFormData] = useState({
    name: userProfile?.drivers?.name || '',
    phone: userProfile?.drivers?.phone || '',
    email: userProfile?.drivers?.email || '',
  });

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !userProfile?.user_id || !userProfile?.driver_id) return;

    setUploading(true);
    try {
      // Upload to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${userProfile.user_id}/profile.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('driver-photos')
        .upload(fileName, file, {
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('driver-photos')
        .getPublicUrl(fileName);

      // Update driver record with photo URL
      const { error: updateError } = await supabase
        .from('drivers')
        .update({ profile_photo_url: publicUrl })
        .eq('id', userProfile.driver_id);

      if (updateError) throw updateError;

      setProfilePhotoUrl(publicUrl);
      toast({
        title: "Success",
        description: "Profile photo updated successfully!",
      });
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Error",
        description: "Failed to upload photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!userProfile?.driver_id) return;
    
    try {
      setSaving(true);
      const { error } = await supabase
        .from('drivers')
        .update({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
        })
        .eq('id', userProfile.driver_id);

      if (error) throw error;

      setEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
      
      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error", 
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      name: userProfile?.drivers?.name || '',
      phone: userProfile?.drivers?.phone || '',
      email: userProfile?.drivers?.email || '',
    });
    setEditing(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getInitials = () => {
    const name = editing ? formData.name : (userProfile?.drivers?.name || 'Driver');
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            Driver Profile
          </CardTitle>
          <div className="flex gap-2">
            {editing ? (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCancelEdit}
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Save className="w-4 h-4 mr-1" />
                  {saving ? 'Saving...' : 'Save'}
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setEditing(true)}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          {/* Profile Photo */}
          <div className="relative">
            <div 
              className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
              onClick={triggerFileInput}
            >
              {profilePhotoUrl ? (
                <img 
                  src={profilePhotoUrl} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-bold text-lg">
                  {getInitials()}
                </span>
              )}
            </div>
            
            <button
              onClick={triggerFileInput}
              disabled={uploading}
              className="absolute -bottom-1 -right-1 bg-white/20 hover:bg-white/30 rounded-full p-2 shadow-lg transition-colors border border-white/30"
            >
              {uploading ? (
                <Upload className="w-3 h-3 animate-spin text-white" />
              ) : (
                <Camera className="w-3 h-3 text-white" />
              )}
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>

          {/* Driver Info */}
          <div className="w-full max-w-sm space-y-3">
            {editing ? (
              <>
                <div>
                  <Label htmlFor="driver-name" className="text-white/70 text-sm">Full Name</Label>
                  <Input
                    id="driver-name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 mt-1"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="driver-phone" className="text-white/70 text-sm">Phone Number</Label>
                  <Input
                    id="driver-phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 mt-1"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="driver-email" className="text-white/70 text-sm">Email Address</Label>
                  <Input
                    id="driver-email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 mt-1"
                    placeholder="your@email.com"
                  />
                </div>
              </>
            ) : (
              <div className="text-center space-y-2">
                <h3 className="text-white font-semibold text-lg">
                  {userProfile?.drivers?.name || 'Click Edit to add name'}
                </h3>
                {userProfile?.drivers?.email && (
                  <p className="text-white/70 text-sm">
                    {userProfile.drivers.email}
                  </p>
                )}
                {userProfile?.drivers?.phone && (
                  <p className="text-white/70 text-sm">
                    {userProfile.drivers.phone}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Driver Stats */}
          {!editing && (
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm pt-4">
              <div className="text-center">
                <div className="text-red-400 font-bold text-lg">
                  {userProfile?.drivers?.rating_avg?.toFixed(1) || '5.0'}
                </div>
                <div className="text-white/60 text-sm">Rating</div>
              </div>
              <div className="text-center">
                <div className="text-red-400 font-bold text-lg">
                  {userProfile?.drivers?.rating_count || 0}
                </div>
                <div className="text-white/60 text-sm">Reviews</div>
              </div>
            </div>
          )}

          {/* Photo Upload Tip */}
          {!profilePhotoUrl && !editing && (
            <div className="text-center mt-2">
              <p className="text-white/50 text-sm flex items-center gap-1 justify-center">
                <Upload className="w-3 h-3" />
                Click the photo area to upload your picture
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}