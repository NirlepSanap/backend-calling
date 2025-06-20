import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Crown,
  Users,
  Mail,
  Phone,
  Search,
  Filter,
  Calendar,
  Link,
  Loader2
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

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
  searchEnabled?: boolean;
  isLoading?: boolean;
  showRelationships?: boolean;
}

type SortField = 'id' | 'email' | 'phone_number' | 'link_precedence' | 'created_at';
type SortDirection = 'asc' | 'desc';

export const ContactsTable: React.FC<Props> = ({ 
  contacts, 
  searchEnabled = true, 
  isLoading = false,
  showRelationships = false 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'primary' | 'secondary'>('all');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Filtered and sorted contacts
  const processedContacts = useMemo(() => {
    let filtered = contacts;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(contact => 
        contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.phone_number?.includes(searchTerm) ||
        contact.id.toString().includes(searchTerm)
      );
    }

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(contact => contact.link_precedence === filterType);
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      // Handle null/undefined values
      if (aValue === null || aValue === undefined) aValue = '';
      if (bValue === null || bValue === undefined) bValue = '';

      // Convert to comparable values
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [contacts, searchTerm, filterType, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      {searchEnabled && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search contacts by email, phone, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800/50 border-cyan-500/30 text-cyan-100 placeholder-gray-500 focus:border-cyan-400"
            />
          </div>
          
          <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
            <SelectTrigger className="w-48 bg-gray-800/50 border-cyan-500/30 text-cyan-100">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-cyan-500/30">
              <SelectItem value="all">All Contacts</SelectItem>
              <SelectItem value="primary">Primary Only</SelectItem>
              <SelectItem value="secondary">Secondary Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-400 font-mono">
          Showing {processedContacts.length} of {contacts.length} contacts
        </div>
        <div className="flex gap-2">
          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50">
            <Crown className="w-3 h-3 mr-1" />
            {contacts.filter(c => c.link_precedence === 'primary').length} Primary
          </Badge>
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">
            <Users className="w-3 h-3 mr-1" />
            {contacts.filter(c => c.link_precedence === 'secondary').length} Secondary
          </Badge>
        </div>
      </div>

      {/* Contacts Table */}
      {processedContacts.length > 0 ? (
        <Card className="border-cyan-500/30 bg-gray-900/50">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-cyan-500/20 hover:bg-gray-800/50">
                  <TableHead 
                    className="text-cyan-400 font-mono cursor-pointer hover:text-cyan-300"
                    onClick={() => handleSort('id')}
                  >
                    ID {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead 
                    className="text-cyan-400 font-mono cursor-pointer hover:text-cyan-300"
                    onClick={() => handleSort('link_precedence')}
                  >
                    Type {sortField === 'link_precedence' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead 
                    className="text-cyan-400 font-mono cursor-pointer hover:text-cyan-300"
                    onClick={() => handleSort('email')}
                  >
                    Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  <TableHead 
                    className="text-cyan-400 font-mono cursor-pointer hover:text-cyan-300"
                    onClick={() => handleSort('phone_number')}
                  >
                    Phone {sortField === 'phone_number' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                  {showRelationships && (
                    <TableHead className="text-cyan-400 font-mono">
                      Linked To
                    </TableHead>
                  )}
                  <TableHead 
                    className="text-cyan-400 font-mono cursor-pointer hover:text-cyan-300"
                    onClick={() => handleSort('created_at')}
                  >
                    Created {sortField === 'created_at' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processedContacts.map((contact) => (
                  <TableRow 
                    key={contact.id} 
                    className="border-gray-700 hover:bg-gray-800/30 transition-colors"
                  >
                    <TableCell className="font-mono text-cyan-100">
                      #{contact.id}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={
                          contact.link_precedence === 'primary'
                            ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50'
                            : 'bg-purple-500/20 text-purple-400 border-purple-500/50'
                        }
                      >
                        {contact.link_precedence === 'primary' ? (
                          <Crown className="w-3 h-3 mr-1" />
                        ) : (
                          <Users className="w-3 h-3 mr-1" />
                        )}
                        {contact.link_precedence}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {contact.email ? (
                        <div className="flex items-center gap-2 text-cyan-100">
                          <Mail className="w-4 h-4 text-cyan-400" />
                          <span className="font-mono text-sm">{contact.email}</span>
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {contact.phone_number ? (
                        <div className="flex items-center gap-2 text-purple-100">
                          <Phone className="w-4 h-4 text-purple-400" />
                          <span className="font-mono text-sm">{contact.phone_number}</span>
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">—</span>
                      )}
                    </TableCell>
                    {showRelationships && (
                      <TableCell>
                        {contact.linked_id ? (
                          <div className="flex items-center gap-2">
                            <Link className="w-4 h-4 text-green-400" />
                            <span className="text-green-100 font-mono text-sm">
                              #{contact.linked_id}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-500 text-sm">—</span>
                        )}
                      </TableCell>
                    )}
                    <TableCell className="text-gray-400 text-sm font-mono">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        {formatDate(contact.created_at)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-gray-700 bg-gray-900/30">
          <CardContent className="p-12 text-center">
            <Search className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <h3 className="text-lg font-mono text-gray-400 mb-2">
              {searchTerm || filterType !== 'all' ? 'No Matching Contacts' : 'No Contacts Found'}
            </h3>
            <p className="text-gray-500">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Submit identity data to start building your contact database'
              }
            </p>
            {(searchTerm || filterType !== 'all') && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setFilterType('all');
                }}
                className="mt-4 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};