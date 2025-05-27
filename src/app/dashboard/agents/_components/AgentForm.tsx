// components/agents/AgentForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Agent, CreateAgentData } from './types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Save, X } from 'lucide-react';

const agentFormSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  email: z.string().email('Invalid email format'),
  officeEmail: z.string().email('Invalid email format').optional().or(z.literal('')),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']),
  profileImage: z.string().url('Invalid URL format').optional().or(z.literal('')),
});

type AgentFormData = z.infer<typeof agentFormSchema>;

interface AgentFormProps {
  agent?: Agent;
  onSubmit: (data: CreateAgentData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function AgentForm({ agent, onSubmit, onCancel, isLoading }: AgentFormProps) {
  const form = useForm<AgentFormData>({
    resolver: zodResolver(agentFormSchema),
    defaultValues: {
      name: agent?.name || '',
      email: agent?.email || '',
      officeEmail: agent?.officeEmail || '',
      phone: agent?.phone || '',
      status: agent?.status || 'ACTIVE',
      profileImage: agent?.profileImage || '',
    },
  });

  const handleSubmit = (data: AgentFormData) => {
    const submitData: CreateAgentData = {
      ...data,
      officeEmail: data.officeEmail || undefined,
      profileImage: data.profileImage || undefined,
    };
    onSubmit(submitData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{agent ? 'Edit Agent' : 'Create New Agent'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="officeEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Office Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter office email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                        <SelectItem value="SUSPENDED">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="profileImage"
                render={({ field }: any) => (
                  <FormItem>
                    <FormLabel>Profile Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter image URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <Button type="button" variant="outline" onClick={onCancel}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? 'Saving...' : agent ? 'Update Agent' : 'Create Agent'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
