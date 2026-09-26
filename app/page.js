import Link from 'next/link';

export default function Home() {
  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <h1>🧌 TROLLRR</h1>
      <p className="hint">The restrictions are the feature.</p>
      <Link href="/login" className="btn accent" style={{ marginTop: 16 }}>
        ENTER
      </Link>
    </div>
  );
}
