"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { MOCK_USERS } from '../../../lib/users/mock';
import { Card, CardContent, CardHeader, CardTitle } from '../../../lib/ui/card';
import { Button } from '../../../lib/ui/button';
import { Search, User } from 'lucide-react';

export default function AdminUsersPage() {
  const router = useRouter();
  const users = MOCK_USERS;
  return (
    <div className="min-h-screen bg-black text-neutral-100 font-body">
      <div className="container mx-auto px-4 py-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-purple-300 font-display">Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="text-neutral-400">
                  <tr className="border-b border-neutral-800">
                    <th className="text-left py-2 pr-4">Name</th>
                    <th className="text-left py-2 pr-4">Email</th>
                    <th className="text-left py-2 pr-4">Points</th>
                    <th className="text-left py-2 pr-4">Level</th>
                    <th className="text-left py-2 pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-b border-neutral-900 hover:bg-neutral-900/40">
                      <td className="py-2 pr-4">{u.name}</td>
                      <td className="py-2 pr-4">{u.email}</td>
                      <td className="py-2 pr-4 font-mono">{u.points.toLocaleString()}</td>
                      <td className="py-2 pr-4">{u.level}</td>
                      <td className="py-2 pr-4 flex gap-2">
                        <Button size="sm" className="btn-professional btn-primary" onClick={() => router.push('/grading')}>Grade</Button>
                        <Button size="sm" variant="outline" className="border-neutral-600/50" onClick={() => router.push('/profile')}><User className="h-4 w-4 mr-1"/> Profile</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
