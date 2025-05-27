'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import { useAgent, useUpdateAgent } from '../../_components/use-agents';
import AgentForm from '../../_components/AgentForm';

export default function EditAgentPage() {
  const params = useParams();
  const router = useRouter();
  const { data, isLoading, error } = useAgent(params.id as string);
  const updateAgentMutation = useUpdateAgent();

  const agent = data?.data;

  const handleSubmit = (formData: any) => {
    updateAgentMutation.mutate(
      { id: params.id as string, data: formData },
      {
        onSuccess: () => {
          router.push(`/dashboard/agents/${params.id}`);
        },
      }
    );
  };

  const handleCancel = () => {
    router.push(`/dashboard/agents/${params.id}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-[600px] w-full max-w-2xl mx-auto" />
        </div>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">Agent not found</p>
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/agents')}
            className="mt-4"
          >
            Back to Agents
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <Button variant="outline" onClick={() => router.push(`/dashboard/agents/${params.id}`)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Agent
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Edit Agent</h1>
        <p className="text-muted-foreground">Update agent information and settings</p>
      </div>

      <AgentForm
        agent={agent}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={updateAgentMutation.isPending}
      />
    </div>
  );
}
