import React from 'react';
import { ContactIdentifyResponse } from 'types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Crown, 
  Link, 
  Mail, 
  Phone, 
  Users, 
  ArrowRight,
  CheckCircle
} from 'lucide-react';

interface Props {
  result: ContactIdentifyResponse;
}

export const ReconciliationResults: React.FC<Props> = ({ result }) => {
  return (
    <div className="space-y-6">
      {/* Header with Primary Contact */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
            <Crown className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-mono text-cyan-400">
              Primary Contact
            </h3>
            <p className="text-sm text-gray-400">
              ID: {result.primary_contact_id}
            </p>
          </div>
        </div>
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
          <CheckCircle className="w-3 h-3 mr-1" />
          Reconciled
        </Badge>
      </div>

      <Separator className="bg-cyan-500/20" />

      {/* Contact Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Emails */}
        <Card className="border-cyan-500/20 bg-gray-800/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Mail className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-mono text-cyan-400">Email Addresses</span>
              <Badge variant="outline" className="text-xs">
                {result.emails?.length || 0}
              </Badge>
            </div>
            <div className="space-y-2">
              {result.emails && result.emails.length > 0 ? (
                result.emails.map((email, index) => (
                  <div 
                    key={email} 
                    className="flex items-center gap-2 p-2 rounded bg-gray-900/50 border border-gray-700"
                  >
                    <div className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span className="text-sm text-cyan-100 font-mono">{email}</span>
                    {index === 0 && (
                      <Badge size="sm" className="bg-cyan-500/20 text-cyan-400 text-xs">
                        Primary
                      </Badge>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No email addresses</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Phone Numbers */}
        <Card className="border-purple-500/20 bg-gray-800/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Phone className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-mono text-purple-400">Phone Numbers</span>
              <Badge variant="outline" className="text-xs">
                {result.phone_numbers?.length || 0}
              </Badge>
            </div>
            <div className="space-y-2">
              {result.phone_numbers && result.phone_numbers.length > 0 ? (
                result.phone_numbers.map((phone, index) => (
                  <div 
                    key={phone} 
                    className="flex items-center gap-2 p-2 rounded bg-gray-900/50 border border-gray-700"
                  >
                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                    <span className="text-sm text-purple-100 font-mono">{phone}</span>
                    {index === 0 && (
                      <Badge size="sm" className="bg-purple-500/20 text-purple-400 text-xs">
                        Primary
                      </Badge>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No phone numbers</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Contacts */}
      {result.secondary_contact_ids && result.secondary_contact_ids.length > 0 && (
        <>
          <Separator className="bg-gray-700" />
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30">
                <Link className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-mono text-purple-400">
                  Linked Secondary Contacts
                </h3>
                <p className="text-sm text-gray-400">
                  {result.secondary_contact_ids.length} contact{result.secondary_contact_ids.length > 1 ? 's' : ''} linked to primary
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {result.secondary_contact_ids.map((contactId, index) => (
                <Card key={contactId} className="border-purple-500/20 bg-gray-800/20">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-400" />
                        <span className="text-sm font-mono text-purple-100">
                          Contact {contactId}
                        </span>
                      </div>
                      <ArrowRight className="w-3 h-3 text-gray-500" />
                    </div>
                    <div className="mt-2 text-xs text-gray-400">
                      Linked to Primary #{result.primary_contact_id}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Summary Stats */}
      <Card className="border-cyan-500/20 bg-gradient-to-r from-cyan-500/5 to-purple-500/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Reconciliation Summary
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <span className="text-cyan-400">Total Emails:</span>
                <span className="text-cyan-100 font-mono">{result.emails?.length || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-purple-400">Total Phones:</span>
                <span className="text-purple-100 font-mono">{result.phone_numbers?.length || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-green-400">Linked Contacts:</span>
                <span className="text-green-100 font-mono">
                  {1 + (result.secondary_contact_ids?.length || 0)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};