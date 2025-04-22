const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';


export async function getUsers() {
    const response = await fetch(`${API_BASE_URL}/users`);

    if (!response.ok) {
        throw new Error('ユーザ一覧の取得に失敗しました');
    }

    return response.json();
}
