'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

const TERMS_SUMMARY = [
  '3 posts and 3 post deletions per rolling 7 days.',
  'One 20-word comment per post, one 10-word reply per comment.',
  'Reactions (Like, Bomb, Cringe, Disgusting, F* You) trigger automatic consequences with no human review first.',
  'Too many Bombs vs Likes → your post is buried in the Graveyard and you\'re sent to Limbo.',
  'Too many F* You reactions → your post is frozen and you\'re sent to Limbo.',
  'Too many Cringe reactions → your post is marked Under Investigation.',
  'Limbo blocks posting/commenting/reacting for a period — you can still browse.',
  'Admins can edit profiles, delete posts, and suspend, ban, investigate, graveyard, or delete accounts at their discretion.',
  'You must be 18 or older to use Trollrr.',
];

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleLogin() {
    setMsg('');
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) { setMsg(error.message); return; }
    router.push('/feed');
  }

  async function handleSignup() {
    setMsg('');
    if (!ageConfirmed || !agreed) {
      setMsg('You must confirm you\'re 18+ and agree to the terms before creating an account.');
      return;
    }
    if (password.length < 6) {
      setMsg('Password needs at least 6 characters.');
      return;
    }
    if (password !== password2) {
      setMsg('Passwords don\'t match.');
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          age_confirmed_18_plus: true,
          terms_agreed_at: new Date().toISOString(),
        },
      },
    });
    setBusy(false);
    if (error) { setMsg(error.message); return; }
    setMsg('Account created! Check your email to confirm, then log in.');
    setMode('login');
  }

  return (
    <div className="card">
      <h2>{mode === 'login' ? 'LOG IN' : 'CREATE ACCOUNT'}</h2>

      <div className="field">
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
      </div>
      <div className="field">
        <label>Troll Code</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" />
      </div>

      {mode === 'signup' && (
        <>
          <div className="field">
            <label>Confirm Troll Code</label>
            <input type="password" value={password2} onChange={(e) => setPassword2(e.target.value)} placeholder="again" />
          </div>

          <h3 style={{ fontSize: '0.85rem', margin: '16px 0 8px' }}>BEFORE YOU JOIN — HOW TROLLRR WORKS</h3>
          <ul style={{ fontSize: '0.8rem', lineHeight: 1.5, paddingLeft: 18 }}>
            {TERMS_SUMMARY.map((line, i) => <li key={i}>{line}</li>)}
          </ul>

          <div className="field" style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <input type="checkbox" id="age" checked={ageConfirmed} onChange={(e) => setAgeConfirmed(e.target.checked)} style={{ width: 'auto', marginTop: 4 }} />
            <label htmlFor="age" style={{ textTransform: 'none', fontWeight: 'normal', fontSize: '0.85rem' }}>
              I confirm I am <b>18 years of age or older</b>.
            </label>
          </div>
          <div className="field" style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <input type="checkbox" id="agree" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} style={{ width: 'auto', marginTop: 4 }} />
            <label htmlFor="agree" style={{ textTransform: 'none', fontWeight: 'normal', fontSize: '0.85rem' }}>
              I have read and agree to how Trollrr works, including the Terms of Service and Privacy Policy.
            </label>
          </div>
        </>
      )}

      <button
        className="btn accent"
        disabled={busy || (mode === 'signup' && (!ageConfirmed || !agreed))}
        onClick={mode === 'login' ? handleLogin : handleSignup}
      >
        {busy ? 'WORKING…' : mode === 'login' ? 'LOG IN' : 'JOIN THE CHAOS'}
      </button>

      <div style={{ textAlign: 'center', marginTop: 12 }}>
        <button className="switchLink" onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setMsg(''); }}>
          {mode === 'login' ? "New here? JOIN THE CHAOS →" : 'Already got a Troll Code? Log in →'}
        </button>
      </div>
      {msg && <p className="hint" style={{ marginTop: 10 }}>{msg}</p>}
    </div>
  );
}
