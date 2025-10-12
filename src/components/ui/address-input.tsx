import React, { useRef, useEffect } from "react";
import { Input } from "./input";
import { Label } from "./label";
import { formatState, formatZipCode } from '@/hooks/useFormValidation';
import { Loader } from "@googlemaps/js-api-loader";

// Type declaration for Google Maps
declare global {
  interface Window {
    google: {
      maps: {
        places: {
          Autocomplete: any;
        };
        event: {
          clearInstanceListeners: (instance: any) => void;
        };
      };
    };
  }
}

export interface AddressData {
  street: string;
  city: string;
  state: string;
  zip: string;
}

interface AddressInputProps {
  label: string;
  value: AddressData;
  onChange: (address: AddressData) => void;
  required?: boolean;
  className?: string;
}

export const AddressInput: React.FC<AddressInputProps> = ({
  label,
  value,
  onChange,
  required = false,
  className = "",
}) => {
  const streetInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);

  const handleFieldChange = (field: keyof AddressData, fieldValue: string) => {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  };

  const handleFieldChangeWithFormat = (field: keyof AddressData, fieldValue: string) => {
    let processedValue = fieldValue;
    
    if (field === 'state') {
      processedValue = formatState(fieldValue);
    } else if (field === 'zip') {
      processedValue = formatZipCode(fieldValue);
    }
    
    handleFieldChange(field, processedValue);
  };

  useEffect(() => {
    const initAutocomplete = async () => {
      try {
        // Fetch API key from edge function
        const response = await fetch('/functions/v1/google-maps-config');
        const { apiKey } = await response.json();
        
        const loader = new Loader({
          apiKey: apiKey || "demo_key",
          version: "weekly",
          libraries: ["places"]
        });

        await loader.load();

        if (streetInputRef.current && window.google) {
          autocompleteRef.current = new window.google.maps.places.Autocomplete(
            streetInputRef.current,
            {
              types: ['address'],
              componentRestrictions: { country: 'us' }
            }
          );

          autocompleteRef.current.addListener('place_changed', () => {
            const place = autocompleteRef.current?.getPlace();
            if (place && place.address_components) {
              const addressComponents = place.address_components;
              
              let street = '';
              let city = '';
              let state = '';
              let zip = '';

              // Extract address components
              addressComponents.forEach((component) => {
                const types = component.types;
                
                if (types.includes('street_number')) {
                  street = component.long_name + ' ';
                }
                if (types.includes('route')) {
                  street += component.long_name;
                }
                if (types.includes('locality') || types.includes('sublocality_level_1')) {
                  city = component.long_name;
                }
                if (types.includes('administrative_area_level_1')) {
                  state = component.short_name;
                }
                if (types.includes('postal_code')) {
                  zip = component.long_name;
                }
              });

              // Update all address fields
              onChange({
                street: street.trim(),
                city,
                state,
                zip
              });
            }
          });
        }
      } catch (error) {
        console.log('Google Places API not available, using manual input');
      }
    };

    initAutocomplete();

    return () => {
      if (autocompleteRef.current && window.google) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [onChange]);

  return (
    <div className={`space-y-3 ${className}`}>
      <Label htmlFor={`${label}-street`} className="text-white text-lg font-semibold">
        {label} {required && "*"}
      </Label>
      
      {/* Street Address - Full Width */}
      <Input
        ref={streetInputRef}
        id={`${label}-street`}
        value={value.street}
        onChange={(e) => handleFieldChange("street", e.target.value)}
        placeholder="Start typing address for suggestions..."
        required={required}
        className="bg-neutral-800/60 border-2 border-white/25 text-white placeholder:text-white/40 text-lg h-14 rounded-xl"
      />
      
      {/* City, State, ZIP - Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-1">
          <Input
            value={value.city}
            onChange={(e) => handleFieldChange("city", e.target.value)}
            placeholder="City"
            required={required}
            className="bg-neutral-800/60 border-2 border-white/25 text-white placeholder:text-white/40 text-lg h-14 rounded-xl"
          />
        </div>
        
        <div>
          <Input
            value={value.state}
            onChange={(e) => handleFieldChangeWithFormat("state", e.target.value)}
            placeholder="State"
            maxLength={2}
            required={required}
            className="uppercase bg-neutral-800/60 border-2 border-white/25 text-white placeholder:text-white/40 text-lg h-14 rounded-xl"
          />
        </div>
        
        <div>
          <Input
            value={value.zip}
            onChange={(e) => handleFieldChangeWithFormat("zip", e.target.value)}
            placeholder="ZIP Code"
            maxLength={10}
            required={required}
            className="bg-neutral-800/60 border-2 border-white/25 text-white placeholder:text-white/40 text-lg h-14 rounded-xl"
          />
        </div>
      </div>
    </div>
  );
};

// Utility function to convert AddressData to string
export const addressToString = (address: AddressData): string => {
  const parts = [address.street, address.city, address.state, address.zip].filter(Boolean);
  return parts.join(", ");
};

// Utility function to parse address string to AddressData (basic implementation)
export const stringToAddress = (addressString: string): AddressData => {
  const parts = addressString.split(",").map(part => part.trim());
  
  return {
    street: parts[0] || "",
    city: parts[1] || "",
    state: parts[2]?.split(" ")[0] || "",
    zip: parts[2]?.split(" ")[1] || "",
  };
};