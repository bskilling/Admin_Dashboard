'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // const result = await signIn("email", {
    //   email,

    //   redirect: false, // Ensures NextAuth doesn't handle redirection
    // });
    const result = await signIn('email', {
      email,
      callbackUrl: '/dashboard', // ✅ Force redirect to dashboard
      redirect: false, // Prevent immediate redirect
    });
    if (result?.error) {
      alert('Error sending Magic Link. Please try again.');
    } else {
      alert('Check your email for the login link.');
      // Optionally, redirect user after confirmation
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold text-center">Sign in</h2>
        <p className="text-gray-600 text-sm text-center mb-4">
          Enter your email to receive a Magic Link.
        </p>

        <form onSubmit={handleSignIn} className="space-y-4">
          <input
            type="email"
            className="w-full p-3 border rounded-lg"
            placeholder="your@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Magic Link'}
          </button>
        </form>
      </div>
    </div>
  );
}
