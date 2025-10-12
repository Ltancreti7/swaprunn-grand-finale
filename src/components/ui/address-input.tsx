import React from "react";
import { Input } from "./input";
import { Label } from "./label";
import { formatState, formatZipCode } from '@/hooks/useFormValidation';

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

  return (
    <div className={`space-y-3 ${className}`}>
      <Label htmlFor={`${label}-street`}>
        {label} {required && "*"}
      </Label>
      
      {/* Street Address - Full Width */}
      <Input
        id={`${label}-street`}
        value={value.street}
        onChange={(e) => handleFieldChange("street", e.target.value)}
        placeholder="Street Address"
        required={required}
      />
      
      {/* City, State, ZIP - Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-1">
          <Input
            value={value.city}
            onChange={(e) => handleFieldChange("city", e.target.value)}
            placeholder="City"
            required={required}
          />
        </div>
        
        <div>
          <Input
            value={value.state}
            onChange={(e) => handleFieldChangeWithFormat("state", e.target.value)}
            placeholder="State"
            maxLength={2}
            required={required}
            className="uppercase"
          />
        </div>
        
        <div>
          <Input
            value={value.zip}
            onChange={(e) => handleFieldChangeWithFormat("zip", e.target.value)}
            placeholder="ZIP Code"
            maxLength={10}
            required={required}
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