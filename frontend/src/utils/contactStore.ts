import { create } from 'zustand';
import { ContactIdentifyResponse } from 'types';
import brain from 'brain';

interface Contact {
  id: number;
  email?: string | null;
  phone_number?: string | null;
  linked_id?: number | null;
  link_precedence: 'primary' | 'secondary';
  created_at: string;
  updated_at: string;
}

interface ContactStore {
  lastReconciliation: ContactIdentifyResponse | null;
  allContacts: Contact[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setLastReconciliation: (result: ContactIdentifyResponse) => void;
  setContacts: (contacts: Contact[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchAllContacts: () => Promise<void>;
  identifyContact: (email?: string, phone_number?: string) => Promise<ContactIdentifyResponse | null>;
}

export const useContactStore = create<ContactStore>((set, get) => ({
  lastReconciliation: null,
  allContacts: [],
  isLoading: false,
  error: null,

  setLastReconciliation: (result) => set({ lastReconciliation: result }),
  
  setContacts: (contacts) => set({ allContacts: contacts }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),

  fetchAllContacts: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Since we don't have a direct "get all contacts" endpoint,
      // we'll simulate this by maintaining a local store that gets updated
      // after each reconciliation. For now, we'll keep the existing contacts.
      
      set({ isLoading: false });
    } catch (error) {
      console.error('Error fetching contacts:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch contacts',
        isLoading: false 
      });
    }
  },

  identifyContact: async (email, phone_number) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await brain.identify_contact({
        email: email || null,
        phone_number: phone_number || null
      });
      
      const result = await response.json();
      
      set({ 
        lastReconciliation: result,
        isLoading: false 
      });
      
      // Update local contacts store with new information
      // This is a simplified approach - in a real app you'd have proper contact management endpoints
      const { allContacts } = get();
      const existingContactIds = new Set(allContacts.map(c => c.id));
      
      // Add primary contact if not exists
      if (!existingContactIds.has(result.primary_contact_id)) {
        const newContact: Contact = {
          id: result.primary_contact_id,
          email: result.emails?.[0] || null,
          phone_number: result.phone_numbers?.[0] || null,
          linked_id: null,
          link_precedence: 'primary',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        allContacts.push(newContact);
      }
      
      // Add secondary contacts if not exist
      result.secondary_contact_ids?.forEach((id, index) => {
        if (!existingContactIds.has(id)) {
          const newContact: Contact = {
            id,
            email: result.emails?.[index + 1] || null,
            phone_number: result.phone_numbers?.[index + 1] || null,
            linked_id: result.primary_contact_id,
            link_precedence: 'secondary',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          allContacts.push(newContact);
        }
      });
      
      set({ allContacts: [...allContacts] });
      
      return result;
    } catch (error) {
      console.error('Error identifying contact:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to identify contact';
      set({ 
        error: errorMessage,
        isLoading: false 
      });
      return null;
    }
  }
}));