import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContactInputForm } from 'components/ContactInputForm';
import { ContactVisualization } from 'components/ContactVisualization';
import { ContactsTable } from 'components/ContactsTable';
import { ReconciliationResults } from 'components/ReconciliationResults';
import { useContactStore } from 'utils/contactStore';
import { ContactIdentifyResponse } from 'types';
import { Badge } from '@/components/ui/badge';
import { Users, Network, Search, Database } from 'lucide-react';

const ContactDashboard: React.FC = () => {
  const { 
    lastReconciliation, 
    allContacts, 
    isLoading, 
    fetchAllContacts 
  } = useContactStore();

  const [activeTab, setActiveTab] = useState('identify');

  useEffect(() => {
    // Load initial contact data
    fetchAllContacts();
  }, [fetchAllContacts]);

  const handleReconciliationComplete = (result: ContactIdentifyResponse) => {
    // Refresh contacts data after reconciliation
    fetchAllContacts();
  };

  return (
    <div className="min-h-screen bg-black text-cyan-100 p-6">
      {/* Cyberpunk Header */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 blur-xl" />
        <div className="relative border border-cyan-500/30 bg-black/80 backdrop-blur-sm p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-mono">
                DevForge Studio
              </h1>
              <p className="text-cyan-300/80 mt-2 font-mono text-sm">
                Contact Identity Reconciliation Dashboard
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">
                <Database className="w-4 h-4 mr-2" />
                {allContacts.length} Contacts
              </Badge>
              <Badge variant="outline" className="border-purple-500/50 text-purple-400">
                <Network className="w-4 h-4 mr-2" />
                Identity Engine
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-900/50 border border-cyan-500/30">
          <TabsTrigger 
            value="identify" 
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-gray-400 border-r border-cyan-500/20"
          >
            <Users className="w-4 h-4 mr-2" />
            Identity Reconciliation
          </TabsTrigger>
          <TabsTrigger 
            value="visualization" 
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-gray-400 border-r border-cyan-500/20"
          >
            <Network className="w-4 h-4 mr-2" />
            Contact Network
          </TabsTrigger>
          <TabsTrigger 
            value="search" 
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-gray-400 border-r border-cyan-500/20"
          >
            <Search className="w-4 h-4 mr-2" />
            Search & Filter
          </TabsTrigger>
          <TabsTrigger 
            value="database" 
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 text-gray-400"
          >
            <Database className="w-4 h-4 mr-2" />
            All Contacts
          </TabsTrigger>
        </TabsList>

        {/* Identity Reconciliation Tab */}
        <TabsContent value="identify" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Form */}
            <Card className="border-cyan-500/30 bg-gray-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-cyan-400 font-mono flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Submit Identity Data
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Enter email and/or phone number to identify and reconcile contact information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContactInputForm 
                  onReconciliationComplete={handleReconciliationComplete}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>

            {/* Results Display */}
            <Card className="border-purple-500/30 bg-gray-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-purple-400 font-mono flex items-center">
                  <Network className="w-5 h-5 mr-2" />
                  Reconciliation Results
                </CardTitle>
                <CardDescription className="text-gray-400">
                  View how identities are linked and consolidated
                </CardDescription>
              </CardHeader>
              <CardContent>
                {lastReconciliation ? (
                  <ReconciliationResults result={lastReconciliation} />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Network className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Submit identity data to see reconciliation results</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Contact Network Visualization Tab */}
        <TabsContent value="visualization" className="space-y-6">
          <Card className="border-cyan-500/30 bg-gray-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-cyan-400 font-mono flex items-center">
                <Network className="w-5 h-5 mr-2" />
                Contact Relationship Network
              </CardTitle>
              <CardDescription className="text-gray-400">
                Visual representation of how contacts are linked together
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContactVisualization contacts={allContacts} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Search & Filter Tab */}
        <TabsContent value="search" className="space-y-6">
          <Card className="border-purple-500/30 bg-gray-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-purple-400 font-mono flex items-center">
                <Search className="w-5 h-5 mr-2" />
                Search & Filter Contacts
              </CardTitle>
              <CardDescription className="text-gray-400">
                Find specific contacts and filter by criteria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContactsTable 
                contacts={allContacts} 
                searchEnabled={true}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* All Contacts Database Tab */}
        <TabsContent value="database" className="space-y-6">
          <Card className="border-cyan-500/30 bg-gray-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-cyan-400 font-mono flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Complete Contact Database
              </CardTitle>
              <CardDescription className="text-gray-400">
                Comprehensive view of all contacts and their relationships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContactsTable 
                contacts={allContacts} 
                searchEnabled={false}
                isLoading={isLoading}
                showRelationships={true}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContactDashboard;