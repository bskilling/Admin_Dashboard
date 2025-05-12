'use client';
import FileUploader from '@/components/global/FileUploader';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useSkills } from './useSkills';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import env from '@/lib/env';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { MdDelete, MdEdit } from 'react-icons/md';
import AlertLoader from '@/components/global/AlertLoader';

const zodSchema = z.object({
  title: z.string(),
});

type skillType = z.infer<typeof zodSchema>;

export default function SkillForm() {
  const { data, isLoading } = useSkills();
  const [show, setShow] = useState(false);
  const queryClient = useQueryClient();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setUrl] = useState<null | string>(null);
  const form = useForm<skillType>({
    defaultValues: undefined,
    resolver: zodResolver(zodSchema),
  });
  const [editSkill, setEditSkill] = useState<{
    _id: string;
    title: string;
  } | null>(null);
  const [edit, setEdit] = useState<boolean>(false);
  const [delete1, setDelete] = useState<boolean>(false);
  const createNewSkill = useMutation({
    mutationKey: ['new-skill'],
    mutationFn: async (data: skillType) => {
      const res = await axios.post(`${env?.BACKEND_URL}/api/skills`, data);
      return res.data.data;
    },
    onSuccess: () => {
      form.reset();
      toast.success('Skill created successfully');
      queryClient?.invalidateQueries({ queryKey: ['skills'] });
      setShow(false);
    },
  });

  const deleteSkill = useMutation({
    mutationKey: ['delete-skill'],
    mutationFn: async (id: string) => {
      const res = await axios.delete(`${env?.BACKEND_URL}/api/skills/${id}`);
      return res.data.data;
    },
    onSuccess: () => {
      toast.success('Skill deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      setDelete(false);
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  const updateSkill = useMutation({
    mutationKey: ['update-skill'],
    mutationFn: async (data: { _id: string; title: string }) => {
      const res = await axios.put(`${env?.BACKEND_URL}/api/skills/${data._id}`, data);
      return res.data.data;
    },
    onSuccess: () => {
      toast.success('Skill updated successfully');
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      setEdit(false);
      setEditSkill(null);
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  return (
    <div className="p-10">
      <AlertLoader isloading={isLoading} />
      <div>
        <Input placeholder="Search Skill" label="Search Skill" />
      </div>
      <div className="flex justify-end mt-5">
        <Dialog open={show} onOpenChange={setShow}>
          <DialogTrigger>
            <Button>Create New Skill</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your account and remove
                your data from our servers.
              </DialogDescription>
            </DialogHeader>
            <form action="flex gap-y-6" onSubmit={form.handleSubmit(e => createNewSkill.mutate(e))}>
              <Input {...form.register('title')} placeholder="Enter skill" label="Skill" />

              <div className="flex justify-end mt-5">
                <Button>Add Skill</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-wrap gap-5 mt-10 gap-x-10">
        {data?.map(skill => (
          <div key={skill._id} className="flex flex-col items-center border rounded-md p-5">
            <p className="mt-2 font-bold capitalize">{skill.title}</p>
            <div className="flex gap-x-5 mt-5">
              <Dialog open={Boolean(editSkill)} onOpenChange={open => !open && setEditSkill(null)}>
                <DialogTrigger>
                  <Button
                    variant={'default'}
                    onClick={() => {
                      setEditSkill(skill); // Set skill data when edit is clicked
                      form.reset({ title: skill.title });
                    }}
                  >
                    <MdEdit size={20} />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Skill</DialogTitle>
                    <DialogDescription>
                      This will update the skill. Ensure correctness before confirming.
                    </DialogDescription>
                  </DialogHeader>

                  <form
                    className="flex flex-col gap-y-6"
                    onSubmit={form.handleSubmit(data => {
                      if (!editSkill) return;
                      updateSkill.mutate({
                        _id: editSkill._id, // Ensure correct skill ID is passed
                        title: data.title,
                      });
                    })}
                  >
                    <Input {...form.register('title')} placeholder="Enter skill" label="Skill" />
                    <div className="flex justify-end mt-5">
                      <Button type="submit">Confirm Edit</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
              <Dialog open={delete1} onOpenChange={setDelete}>
                <DialogTrigger>
                  {' '}
                  <Button variant={'destructive'}>
                    <MdDelete size={20} />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete tool from the data
                      base
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-end mt-5 gap-x-5">
                    <DialogClose>
                      <Button variant={'outline'}>Cancel</Button>
                    </DialogClose>
                    <Button
                      variant={'destructive'}
                      onClick={() => {
                        deleteSkill?.mutate(skill._id);
                      }}
                    >
                      Confirm Delete
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
