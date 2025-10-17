import { useState, useRef } from 'react';
import { Camera, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
interface ProfilePhotoProps {
  photoUrl?: string | null;
  driverName?: string;
  onPhotoUpdate?: (newUrl: string) => void;
}
export function ProfilePhoto({
  photoUrl,
  driverName,
  onPhotoUpdate
}: ProfilePhotoProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    user,
    userProfile
  } = useAuth();
  const {
    toast
  } = useToast();
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user || !userProfile?.driver_id) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }
    setUploading(true);
    try {
      // Create a preview
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);

      // Ensure the storage bucket exists
      try {
        const { data: buckets } = await supabase.storage.listBuckets();
        const bucketExists = buckets?.some(bucket => bucket.id === 'driver-photos');
        
        if (!bucketExists) {
          await supabase.storage.createBucket('driver-photos', {
            public: true,
            fileSizeLimit: 5242880, // 5MB
            allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
          });
        }
      } catch (bucketError) {
        console.log('Bucket creation handled by server:', bucketError);
        // Continue with upload even if bucket creation fails - it might already exist
      }

      // Upload to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/profile.${fileExt}`;
      const {
        error: uploadError
      } = await supabase.storage.from('driver-photos').upload(fileName, file, {
        upsert: true
      });
      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data
      } = supabase.storage.from('driver-photos').getPublicUrl(fileName);

      // Update driver record
      const {
        error: updateError
      } = await supabase.from('drivers').update({
        profile_photo_url: data.publicUrl
      }).eq('id', userProfile.driver_id);
      if (updateError) throw updateError;
      onPhotoUpdate?.(data.publicUrl);
      toast({
        title: "Photo updated",
        description: "Your profile photo has been updated successfully"
      });
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Upload failed",
        description: "Failed to update your profile photo. Please try again.",
        variant: "destructive"
      });
      setPreviewUrl(null);
    } finally {
      setUploading(false);
    }
  };
  const displayUrl = previewUrl || photoUrl;
  const initials = driverName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'D';
  return <div className="flex flex-col items-start space-y-4">
      <div className="relative mx-0">
        <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-white/20 flex items-center justify-center mx-0 my-0 py-0 bg-[#393939]/10">
          {displayUrl ? <img src={displayUrl} alt="Profile" className="w-full h-full object-cover" /> : <span className="text-4xl font-bold text-white">{initials}</span>}
        </div>
        
        {/* Camera overlay button */}
        <button 
          onClick={() => fileInputRef.current?.click()} 
          disabled={uploading} 
          className="absolute -bottom-1 -right-1 w-12 h-12 bg-red-600 hover:bg-red-700 disabled:bg-red-800 rounded-full flex items-center justify-center transition-colors shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
          title={uploading ? "Uploading photo..." : "Change profile photo"}
        >
          {uploading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Camera className="w-6 h-6 text-white" />
          )}
        </button>
      </div>

      <input 
        ref={fileInputRef} 
        type="file" 
        accept="image/jpeg,image/png,image/webp,image/gif" 
        onChange={handleFileSelect} 
        className="hidden" 
      />

      {driverName && (
        <div className="text-center">
          <h3 className="text-lg font-semibold text-white">{driverName}</h3>
          <p className="text-sm text-white/70 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            📸 Tap photo to update
          </p>
        </div>
      )}
    </div>;
}