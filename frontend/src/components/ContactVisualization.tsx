import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Users, Mail, Phone, ArrowDown } from 'lucide-react';

interface Contact {
  id: number;
  email?: string | null;
  phone_number?: string | null;
  linked_id?: number | null;
  link_precedence: 'primary' | 'secondary';
  created_at: string;
  updated_at: string;
}

interface Props {
  contacts: Contact[];
}

interface ContactGroup {
  primary: Contact;
  secondaries: Contact[];
}

export const ContactVisualization: React.FC<Props> = ({ contacts }) => {
  // Group contacts by their primary-secondary relationships
  const contactGroups = useMemo(() => {
    const groups: ContactGroup[] = [];
    const processedIds = new Set<number>();

    // Find all primary contacts
    const primaries = contacts.filter(c => c.link_precedence === 'primary');
    
    for (const primary of primaries) {
      if (processedIds.has(primary.id)) continue;
      
      // Find all secondaries linked to this primary
      const secondaries = contacts.filter(c => 
        c.link_precedence === 'secondary' && c.linked_id === primary.id
      );
      
      groups.push({ primary, secondaries });
      processedIds.add(primary.id);
      secondaries.forEach(s => processedIds.add(s.id));
    }

    // Handle any orphaned secondary contacts (shouldn't happen in normal flow)
    const orphanedSecondaries = contacts.filter(c => 
      c.link_precedence === 'secondary' && !processedIds.has(c.id)
    );
    
    for (const orphan of orphanedSecondaries) {
      // Create a group with the orphan as primary (for display purposes)
      groups.push({ 
        primary: { ...orphan, link_precedence: 'primary' }, 
        secondaries: [] 
      });
      processedIds.add(orphan.id);
    }

    return groups;
  }, [contacts]);

  if (contacts.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="w-16 h-16 mx-auto mb-4 text-gray-600" />
        <h3 className="text-lg font-mono text-gray-400 mb-2">No Contacts Found</h3>
        <p className="text-gray-500">Submit identity data to start building the contact network</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Network Overview */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="border-cyan-500/30 bg-cyan-500/10">
          <CardContent className="p-4 text-center">
            <Crown className="w-8 h-8 mx-auto mb-2 text-cyan-400" />
            <div className="text-2xl font-mono text-cyan-400">
              {contactGroups.length}
            </div>
            <div className="text-sm text-cyan-300">Primary Contacts</div>
          </CardContent>
        </Card>
        
        <Card className="border-purple-500/30 bg-purple-500/10">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-purple-400" />
            <div className="text-2xl font-mono text-purple-400">
              {contactGroups.reduce((sum, group) => sum + group.secondaries.length, 0)}
            </div>
            <div className="text-sm text-purple-300">Secondary Contacts</div>
          </CardContent>
        </Card>
        
        <Card className="border-green-500/30 bg-green-500/10">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-green-400" />
            <div className="text-2xl font-mono text-green-400">
              {contacts.length}
            </div>
            <div className="text-sm text-green-300">Total Contacts</div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Groups Visualization */}
      <div className="space-y-8">
        {contactGroups.map((group, groupIndex) => (
          <div key={group.primary.id} className="relative">
            {/* Primary Contact */}
            <div className="flex justify-center mb-6">
              <Card className="border-cyan-500/50 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 shadow-lg shadow-cyan-500/25">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-cyan-500/30 border-2 border-cyan-400">
                      <Crown className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-mono text-cyan-400">
                          Primary Contact #{group.primary.id}
                        </h3>
                        <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50">
                          Primary
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        {group.primary.email && (
                          <div className="flex items-center gap-2 text-sm text-cyan-100">
                            <Mail className="w-4 h-4" />
                            <span className="font-mono">{group.primary.email}</span>
                          </div>
                        )}
                        {group.primary.phone_number && (
                          <div className="flex items-center gap-2 text-sm text-cyan-100">
                            <Phone className="w-4 h-4" />
                            <span className="font-mono">{group.primary.phone_number}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Connection Lines */}
            {group.secondaries.length > 0 && (
              <div className="flex justify-center mb-4">
                <ArrowDown className="w-6 h-6 text-purple-400" />
              </div>
            )}

            {/* Secondary Contacts */}
            {group.secondaries.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.secondaries.map((secondary) => (
                  <Card 
                    key={secondary.id} 
                    className="border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-pink-500/10"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-full bg-purple-500/30 border border-purple-400">
                          <Users className="w-4 h-4 text-purple-400" />
                        </div>
                        <div>
                          <h4 className="text-sm font-mono text-purple-400">
                            Contact #{secondary.id}
                          </h4>
                          <Badge size="sm" className="bg-purple-500/20 text-purple-300 border-purple-500/50">
                            Secondary
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-2 text-xs">
                        {secondary.email && (
                          <div className="flex items-center gap-2 text-purple-100">
                            <Mail className="w-3 h-3" />
                            <span className="font-mono truncate">{secondary.email}</span>
                          </div>
                        )}
                        {secondary.phone_number && (
                          <div className="flex items-center gap-2 text-purple-100">
                            <Phone className="w-3 h-3" />
                            <span className="font-mono">{secondary.phone_number}</span>
                          </div>
                        )}
                        <div className="text-gray-500 font-mono">
                          Linked to #{group.primary.id}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            {/* No secondaries message */}
            {group.secondaries.length === 0 && (
              <div className="text-center py-4">
                <p className="text-gray-500 text-sm font-mono">
                  No linked secondary contacts
                </p>
              </div>
            )}
            
            {/* Separator between groups */}
            {groupIndex < contactGroups.length - 1 && (
              <div className="mt-8 border-t border-gray-700" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};