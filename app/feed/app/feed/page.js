'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function FeedPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/login');
      } else {
        setUser(data.user);
      }
      setLoading(false);
    });
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/login');
  }

  if (loading) return <div className="card">Loading…</div>;

  return (
    <div className="card">
      <h2>🎉 IT WORKS</h2>
      <p className="hint">
        Logged in as <b>{user?.email}</b>. This is a placeholder — the real feed, posting,
        reactions, and profile setup are the next pieces to build here.
      </p>
      <button className="btn" onClick={handleLogout} style={{ marginTop: 12 }}>LOG OUT</button>
    </div>
  );
}
