'use client';
// app/agents/create/page.tsx

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useCreateAgent } from '../_components/use-agents';
import AgentForm from '../_components/AgentForm';

export default function CreateAgentPage() {
  const router = useRouter();
  const createAgentMutation = useCreateAgent();

  const handleSubmit = (data: any) => {
    createAgentMutation.mutate(data, {
      onSuccess: response => {
        router.push(`/dashboard/agents/${response.data._id}`);
      },
    });
  };

  const handleCancel = () => {
    router.push('/dashboard/agents');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <Button variant="outline" onClick={() => router.push('/dashboard/agents')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Agents
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create New Agent</h1>
        <p className="text-muted-foreground">Add a new sales agent to your team</p>
      </div>

      <AgentForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={createAgentMutation.isPending}
      />
    </div>
  );
}
