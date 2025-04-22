'use client';
import { Users } from '@/app/types/Users';
import { useState, useEffect } from 'react';
import { getUsers } from '@/app/api/usersApi'
import Table from '../component/Table';
import { Column } from '../types/global';

export default function UserPage() {
  const [users, setUsers] = useState<Users[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    async function fetchSkills() {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      } finally {
        setLoading(false);
      }
    }


    fetchSkills();
  }, []);

  const columns: Column<Users>[] = [
    { title: "ID", accessor: "id" },
    { title: "名前", accessor: "name" },
    { title: "カナ", accessor: "name_kana" },
    { title: "email", accessor: "email" },
    { title: "社員番号", accessor: "employee_number" },
  ];
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ユーザ一覧</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <p>読み込み中...</p>
      ) : users.length === 0 ? (
        <p>データがありません</p>
      ) : (
        <Table column={columns} columnDatas={users} />
      )}
    </div>
  );
}
