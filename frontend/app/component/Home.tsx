'use client';
import { getUsers } from '@/app/api/usersApi';
import { useState } from 'react';

export default function Home() {
    const [text, setText] = useState<string>("")
    async function getTestData() {
        const response = await getUsers()
        setText(text + response.text)
    }
    return (
        <>
            <div className="container mx-auto p-4">
                <button className="bg-gray-300" onClick={getTestData}>PUSH</button>
            </div>
            <div className="container mx-auto p-4">
                {text}
            </div>
        </>
    )
}