'use client';
import { useState, useEffect } from 'react';
import { getUserSkills } from '@/app/api/userSkillsApi';
import { UserSkill } from '@/app/types/UserSkills';
import Table from '../component/Table';
import { Column } from '@/app/types/global';

export default function UserSkillsPage() {
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    async function fetchSkills() {
      try {
        const data = await getUserSkills();
        setSkills(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      } finally {
        setLoading(false);
      }
    }


    fetchSkills();
  }, []);

  const columns: Column<UserSkill>[] = [
    { title: "名前", accessor: "name" },
    { title: "スキル", accessor: "skill" },
    { title: "レベル", accessor: "level" },
    { title: "経験年数", accessor: "experience" },
  ];
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ユーザースキル一覧</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <p>読み込み中...</p>
      ) : skills.length === 0 ? (
        <p>データがありません</p>
      ) : (
        <Table column={columns} columnDatas={skills} />
      )}
    </div>
  );
}
