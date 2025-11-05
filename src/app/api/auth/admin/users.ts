// pages/api/admin/users.ts
import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next';
import AdminUser from '@/models/AdminUser';
import mongoose from 'mongoose';
import { AdminRole } from '@/models/AdminUser';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session || session.user.role !== AdminRole.SUPER_ADMIN) {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  await mongoose.connect(
    process.env.DATABASE_URL! ??
      'mongodb+srv://itadmin02:XLw7BKzwUok4jF44@devclus.63bz1.mongodb.net/?retryWrites=true&w=majority&appName=devclus'
  );

  if (req.method === 'GET') {
    const admins = await AdminUser.find({});
    return res.json(admins);
  }

  if (req.method === 'POST') {
    const { email, role } = req.body;

    if (!email || !Object.values(AdminRole).includes(role)) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    const existingAdmin = await AdminUser.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin already exists' });
    }

    const newAdmin = await AdminUser.create({
      email,
      role,
      isActive: true,
    });

    return res.status(201).json(newAdmin);
  }

  res.status(405).end();
}
