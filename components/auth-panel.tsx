'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export function AuthPanel({ onReady }: { onReady: () => void }) {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('투자자')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setBusy(true); setMessage('')
    const supabase = createClient()
    const result = mode === 'login'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { data: { nickname }, emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? `${window.location.origin}/auth/callback` } })
    setBusy(false)
    if (result.error) { setMessage(mode === 'login' ? '이메일 또는 비밀번호를 확인해주세요.' : '가입을 완료할 수 없습니다. 입력 내용을 확인해주세요.'); return }
    if (mode === 'signup' && !result.data.session) { setMessage('가입 확인 이메일을 확인해주세요.'); return }
    onReady()
  }

  return <main className="flex min-h-screen items-center justify-center bg-[#f7f8fa] px-5"><div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"><div className="mb-8 flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-slate-950 font-black text-white">N</div><div><p className="text-xl font-bold">NOVA</p><p className="text-sm text-slate-500">나만의 주식 투자 기록</p></div></div><h1 className="text-2xl font-bold">{mode === 'login' ? '로그인' : '회원가입'}</h1><p className="mt-2 text-sm text-slate-500">계정에 투자 데이터를 안전하게 저장하세요.</p><form onSubmit={submit} className="mt-6 flex flex-col gap-4">{mode === 'signup' && <input required value={nickname} onChange={e => setNickname(e.target.value)} placeholder="닉네임" className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-950" />}<input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="이메일" className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-950" /><input required minLength={6} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="비밀번호 (6자 이상)" className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-950" />{message && <p className="text-sm text-slate-600">{message}</p>}<Button disabled={busy} className="rounded-xl bg-slate-950 py-6">{busy ? '처리 중...' : mode === 'login' ? '로그인' : '회원가입'}</Button></form><button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setMessage('') }} className="mt-5 w-full text-center text-sm text-slate-500 underline underline-offset-4">{mode === 'login' ? '처음이신가요? 회원가입' : '이미 계정이 있나요? 로그인'}</button></div></main>
}
