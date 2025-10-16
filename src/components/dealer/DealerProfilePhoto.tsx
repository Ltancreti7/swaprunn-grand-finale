import { useState, useRef } from 'react';
import { Camera, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
interface DealerProfilePhotoProps {
  photoUrl?: string | null;
  dealerName?: string;
  onPhotoUpdate?: (newUrl: string) => void;
}
export function DealerProfilePhoto({
  photoUrl,
  dealerName,
  onPhotoUpdate
}: DealerProfilePhotoProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showPositionControls, setShowPositionControls] = useState(false);
  const [imagePosition, setImagePosition] = useState({ x: 50, y: 50 }); // center by default
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
    if (!file || !user || !userProfile?.dealer_id) return;

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
      setShowPositionControls(true); // Show controls when new image is uploaded

      // Upload to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/profile.${fileExt}`;
      const {
        error: uploadError
      } = await supabase.storage.from('dealer-photos').upload(fileName, file, {
        upsert: true
      });
      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data
      } = supabase.storage.from('dealer-photos').getPublicUrl(fileName);

      // Update dealer record
      const {
        error: updateError
      } = await supabase.from('dealers').update({
        profile_photo_url: data.publicUrl
      }).eq('id', userProfile.dealer_id);
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

  const handleRemovePhoto = async () => {
    if (!user || !userProfile?.dealer_id) return;

    setUploading(true);
    try {
      // Update dealer record to remove photo URL
      const { error: updateError } = await supabase
        .from('dealers')
        .update({ profile_photo_url: null })
        .eq('id', userProfile.dealer_id);

      if (updateError) throw updateError;

      // Try to delete the file from storage (optional, won't fail if file doesn't exist)
      const fileName = `${user.id}/profile.jpg`;
      await supabase.storage
        .from('dealer-photos')
        .remove([fileName]);

      onPhotoUpdate?.('');
      setPreviewUrl(null);
      setShowPositionControls(false);
      
      toast({
        title: "Photo removed",
        description: "Your profile photo has been removed successfully"
      });
    } catch (error) {
      console.error('Error removing photo:', error);
      toast({
        title: "Remove failed",
        description: "Failed to remove your profile photo. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const adjustPosition = (direction: 'up' | 'down' | 'left' | 'right') => {
    setImagePosition(prev => {
      const step = 10;
      switch (direction) {
        case 'up': return { ...prev, y: Math.max(0, prev.y - step) };
        case 'down': return { ...prev, y: Math.min(100, prev.y + step) };
        case 'left': return { ...prev, x: Math.max(0, prev.x - step) };
        case 'right': return { ...prev, x: Math.min(100, prev.x + step) };
        default: return prev;
      }
    });
  };

  const displayUrl = previewUrl || photoUrl;
  const initials = dealerName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'D';
  return <div className="relative">
      <div className="w-52 h-52 rounded-full overflow-hidden bg-white/10 border-3 border-white/30 flex items-center justify-center shadow-xl">
        {displayUrl ? <img 
            src={displayUrl} 
            alt="Dealer profile" 
            className="w-full h-full object-cover transition-all duration-200" 
            style={{ 
              objectPosition: `${imagePosition.x}% ${imagePosition.y}%` 
            }}
          /> : <span className="text-4xl font-bold text-white">{initials}</span>}
      </div>

      {/* Position controls - only show when image is present and controls are enabled */}
      {displayUrl && showPositionControls && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Up arrow */}
          <button 
            onClick={() => adjustPosition('up')}
            className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 w-8 h-8 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition-colors pointer-events-auto"
          >
            <ArrowUp className="w-4 h-4 text-white" />
          </button>
          
          {/* Down arrow */}
          <button 
            onClick={() => adjustPosition('down')}
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-4 w-8 h-8 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition-colors pointer-events-auto"
          >
            <ArrowDown className="w-4 h-4 text-white" />
          </button>
          
          {/* Left arrow */}
          <button 
            onClick={() => adjustPosition('left')}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 w-8 h-8 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition-colors pointer-events-auto"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          
          {/* Right arrow */}
          <button 
            onClick={() => adjustPosition('right')}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 w-8 h-8 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition-colors pointer-events-auto"
          >
            <ArrowRight className="w-4 h-4 text-white" />
          </button>

          {/* Done button */}
          <button 
            onClick={() => setShowPositionControls(false)}
            className="absolute bottom-0 right-0 transform translate-x-2 translate-y-2 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded-full transition-colors pointer-events-auto"
          >
            Done
          </button>
        </div>
      )}
      
      {/* Camera and Remove buttons */}
      <div className="absolute bottom-2 right-2 flex gap-2">
        {/* Remove photo button - only show if there's a photo */}
        {displayUrl && (
          <button 
            onClick={handleRemovePhoto}
            disabled={uploading} 
            className="w-8 h-8 bg-red-600 hover:bg-red-700 disabled:bg-red-600/70 rounded-full flex items-center justify-center transition-colors shadow-lg"
          >
            {uploading ? (
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 className="w-3 h-3 text-white" />
            )}
          </button>
        )}
        
        {/* Camera button */}
        <button 
          onClick={() => {
            if (displayUrl) setShowPositionControls(true);
            fileInputRef.current?.click();
          }} 
          disabled={uploading} 
          className="w-10 h-10 bg-[#E11900] hover:bg-[#E11900]/90 disabled:bg-[#E11900]/70 rounded-full flex items-center justify-center transition-colors shadow-lg"
        >
          {uploading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Camera className="w-4 h-4 text-white" />}
        </button>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
    </div>;
}