'use client';
// app/agents/page.tsx

import { useState } from 'react';
import { Agent, AgentFilters } from './_components/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useAgents, useDeleteAgent, useUpdateAgentStatus } from './_components/use-agents';
import { Button } from '@/components/ui/button';
import AgentFiltersComponent from './_components/AgentFilters';
import AgentCard from './_components/AgentCard';

export default function AgentsPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<AgentFilters>({
    page: 1,
    limit: 12,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const [showForm, setShowForm] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [deletingAgent, setDeletingAgent] = useState<string | null>(null);

  // Queries and Mutations
  const { data: agentsData, isLoading, error } = useAgents(filters);
  const deleteAgentMutation = useDeleteAgent();
  const updateStatusMutation = useUpdateAgentStatus();

  // Handle form actions
  const handleEdit = (agent: Agent) => {
    setEditingAgent(agent);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingAgent(null);
  };

  // Handle delete
  const handleDelete = () => {
    if (!deletingAgent) return;
    deleteAgentMutation.mutate(deletingAgent, {
      onSuccess: () => setDeletingAgent(null),
      onError: () => setDeletingAgent(null),
    });
  };

  // Handle status change
  const handleStatusChange = (id: string, status: Agent['status']) => {
    updateStatusMutation.mutate({ id, status });
  };

  // Handle filters change
  const handleFiltersChange = (newFilters: AgentFilters) => {
    setFilters(newFilters);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const agents = agentsData?.data?.agents || [];
  const pagination = agentsData?.data?.pagination;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agents</h1>
          <p className="text-muted-foreground">
            Manage your sales agents and track their performance
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/agents/create')}>
          <Plus className="w-4 h-4 mr-2" />
          Add Agent
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <AgentFiltersComponent filters={filters} onFiltersChange={handleFiltersChange} />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-[200px] w-full rounded-lg" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">Failed to load agents</p>
          <Button variant="outline" onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      )}

      {/* Success State */}
      {!isLoading && !error && (
        <>
          {agents.length > 0 ? (
            <>
              {/* Agents Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {agents.map(agent => (
                  <AgentCard
                    key={agent._id}
                    agent={agent}
                    onEdit={handleEdit}
                    onDelete={id => setDeletingAgent(id)}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            pagination.hasPrevPage && handlePageChange(pagination.currentPage - 1)
                          }
                          className={
                            pagination.hasPrevPage
                              ? 'cursor-pointer'
                              : 'pointer-events-none opacity-50'
                          }
                        />
                      </PaginationItem>

                      {/* Page Numbers */}
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        const pageNumber = i + 1;
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              onClick={() => handlePageChange(pageNumber)}
                              isActive={pagination.currentPage === pageNumber}
                              className="cursor-pointer"
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}

                      {pagination.totalPages > 5 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            pagination.hasNextPage && handlePageChange(pagination.currentPage + 1)
                          }
                          className={
                            pagination.hasNextPage
                              ? 'cursor-pointer'
                              : 'pointer-events-none opacity-50'
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No agents found</h3>
              <p className="text-gray-500 mb-6">Get started by creating your first agent.</p>
              <Button onClick={() => router.push('/dashboard/agents/create')}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Agent
              </Button>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingAgent} onOpenChange={() => setDeletingAgent(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the agent and remove their
              data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleteAgentMutation.isPending}>
              {deleteAgentMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Agent'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
