import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Send, Mail, Phone } from 'lucide-react';
import { useContactStore } from 'utils/contactStore';
import { ContactIdentifyResponse } from 'types';
import { toast } from 'sonner';

interface Props {
  onReconciliationComplete?: (result: ContactIdentifyResponse) => void;
  isLoading?: boolean;
}

export const ContactInputForm: React.FC<Props> = ({ 
  onReconciliationComplete,
  isLoading = false 
}) => {
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [validationError, setValidationError] = useState('');
  
  const { identifyContact, error } = useContactStore();

  const validateForm = (): boolean => {
    setValidationError('');
    
    // Check if at least one field is provided
    if (!email.trim() && !phoneNumber.trim()) {
      setValidationError('Please provide at least one contact method (email or phone number)');
      return false;
    }
    
    // Basic email validation
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setValidationError('Please enter a valid email address');
      return false;
    }
    
    // Basic phone validation
    if (phoneNumber.trim() && !/^[\d\s\-\+\(\)]{10,}$/.test(phoneNumber.trim())) {
      setValidationError('Please enter a valid phone number (at least 10 digits)');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const result = await identifyContact(
        email.trim() || undefined,
        phoneNumber.trim() || undefined
      );
      
      if (result) {
        toast.success('Identity reconciliation completed successfully!');
        onReconciliationComplete?.(result);
        
        // Reset form
        setEmail('');
        setPhoneNumber('');
        setValidationError('');
      }
    } catch (err) {
      toast.error('Failed to process identity reconciliation');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Input */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-cyan-300 font-mono flex items-center">
          <Mail className="w-4 h-4 mr-2" />
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="user@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-gray-800/50 border-cyan-500/30 text-cyan-100 placeholder-gray-500 focus:border-cyan-400 focus:ring-cyan-400/20"
          disabled={isLoading}
        />
      </div>

      {/* Phone Number Input */}
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-cyan-300 font-mono flex items-center">
          <Phone className="w-4 h-4 mr-2" />
          Phone Number
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+1234567890"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="bg-gray-800/50 border-cyan-500/30 text-cyan-100 placeholder-gray-500 focus:border-cyan-400 focus:ring-cyan-400/20"
          disabled={isLoading}
        />
      </div>

      {/* Validation Error */}
      {validationError && (
        <Alert className="border-red-500/50 bg-red-900/20">
          <AlertDescription className="text-red-400">
            {validationError}
          </AlertDescription>
        </Alert>
      )}

      {/* API Error */}
      {error && (
        <Alert className="border-red-500/50 bg-red-900/20">
          <AlertDescription className="text-red-400">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-mono border-0 shadow-lg shadow-cyan-500/25"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Identify & Reconcile Contact
          </>
        )}
      </Button>

      {/* Help Text */}
      <p className="text-xs text-gray-500 text-center font-mono">
        Provide at least one contact method. The system will find and link related identities.
      </p>
    </form>
  );
};