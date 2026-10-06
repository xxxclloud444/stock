'use client'

import { useMemo, useState } from 'react'
import { Search, Bell, ChevronDown, ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, BarChart3, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const stocks = [
  ['005930','삼성전자',72000,1200,1.69],['000660','SK하이닉스',185000,-3500,-1.85],['005380','현대차',245000,5000,2.08],['035420','NAVER',178000,-2000,-1.11],['035720','카카오',52000,800,1.56],['068270','셀트리온',168000,2500,1.51],['051910','LG화학',310000,-4500,-1.43],['105560','KB금융',98000,1800,1.87],
] as const
const won = new Intl.NumberFormat('ko-KR')
const money = (n:number) => `${won.format(n)}원`
const percent = (n:number) => `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`

function Change({ value, rate }: { value:number; rate:number }) { const up=value>=0; return <span className={up?'text-rose-500':'text-blue-500'}>{up?<ArrowUpRight className="inline size-4"/>:<ArrowDownRight className="inline size-4"/>}{won.format(Math.abs(value))} ({percent(rate)})</span> }

export default function Page() {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState('홈')
  const [mobileOpen, setMobileOpen] = useState(false)
  const filtered = useMemo(() => stocks.filter(s => s[1].includes(query) || s[0].includes(query)), [query])
  const portfolio = [{ code:'005930', name:'삼성전자', quantity:20, avg:68400 }, { code:'035420', name:'NAVER', quantity:8, avg:171500 }]
  const stockValue = portfolio.reduce((sum, p) => sum + p.quantity * (stocks.find(s=>s[0]===p.code)?.[2] ?? 0), 0)
  const profit = stockValue - portfolio.reduce((sum,p)=>sum+p.quantity*p.avg,0)
  const total = 10000000 + profit
  const nav = ['홈','종목 찾기','내 포트폴리오','거래 내역']

  return <div className="min-h-screen bg-[#f7f8fa] text-slate-950">
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur"><div className="mx-auto flex h-18 max-w-[1400px] items-center justify-between px-5 lg:px-8">
      <div className="flex items-center gap-3"><div className="flex size-9 items-center justify-center rounded-xl bg-slate-950 text-sm font-black text-white">M</div><span className="text-xl font-bold tracking-tight">Mirae</span></div>
      <nav className="hidden items-center gap-1 md:flex">{nav.map(n=><button key={n} onClick={()=>setActive(n)} className={`rounded-lg px-4 py-2 text-sm font-medium ${active===n?'bg-slate-100 text-slate-950':'text-slate-500 hover:bg-slate-50'}`}>{n}</button>)}</nav>
      <div className="flex items-center gap-2"><Button variant="ghost" size="icon" aria-label="알림"><Bell className="size-5"/></Button><Button className="hidden rounded-lg bg-slate-950 px-4 sm:flex">내 계정 <ChevronDown data-icon="inline-end"/></Button><Button variant="ghost" size="icon" className="md:hidden" onClick={()=>setMobileOpen(!mobileOpen)} aria-label="메뉴">{mobileOpen?<X/>:<Menu/>}</Button></div>
    </div>{mobileOpen&&<nav className="flex flex-col gap-1 border-t border-slate-200 bg-white p-3 md:hidden">{nav.map(n=><button key={n} onClick={()=>{setActive(n);setMobileOpen(false)}} className="rounded-lg px-3 py-3 text-left text-sm font-medium">{n}</button>)}</nav>}</header>
    <main className="mx-auto max-w-[1400px] px-5 py-8 lg:px-8 lg:py-10">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-2 text-sm font-medium text-slate-500">화요일, 2026년 10월 6일</p><h1 className="text-3xl font-bold tracking-tight sm:text-4xl">안녕하세요, 투자자님</h1><p className="mt-2 text-slate-500">오늘의 시장 흐름과 포트폴리오를 확인해보세요.</p></div><Button className="w-fit rounded-xl bg-slate-950">+ 거래 시작하기</Button></div>
      <section className="grid gap-4 lg:grid-cols-[1.25fr_1fr_1fr]"><div className="rounded-2xl bg-slate-950 p-6 text-white shadow-sm"><div className="flex items-start justify-between"><div><p className="text-sm text-slate-400">내 총자산</p><p className="mt-3 text-3xl font-bold tracking-tight">{money(total)}</p></div><div className="rounded-xl bg-white/10 p-3"><Wallet className="size-5"/></div></div><div className="mt-7 flex items-center gap-2 text-sm text-emerald-300"><TrendingUp className="size-4"/> {money(profit)} <span className="text-slate-400">이번 달 수익</span></div></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6"><p className="text-sm text-slate-500">보유 현금</p><p className="mt-3 text-2xl font-bold">{money(10000000 - profit)}</p><div className="mt-7 h-1.5 rounded-full bg-slate-100"><div className="h-full w-[72%] rounded-full bg-slate-950"/></div><p className="mt-2 text-xs text-slate-400">투자 가능 금액의 72%</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6"><p className="text-sm text-slate-500">총 수익률</p><p className="mt-3 text-2xl font-bold text-rose-500">{percent((profit/10000000)*100)}</p><div className="mt-5 flex items-center gap-2 text-sm text-slate-500"><BarChart3 className="size-4"/> 평가금액 {money(stockValue)}</div></div></section>
      <section className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]"><div><div className="mb-4 flex items-center justify-between"><div><h2 className="text-xl font-bold">관심 종목</h2><p className="mt-1 text-sm text-slate-500">국내 주요 종목의 현재가입니다.</p></div><button onClick={()=>setActive('종목 찾기')} className="text-sm font-semibold text-slate-500 hover:text-slate-950">전체보기 →</button></div><div className="mb-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3"><Search className="size-4 text-slate-400"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="종목명 또는 코드 검색" className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"/></div><div className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><div className="grid grid-cols-[1.5fr_1fr_1fr_auto] gap-4 border-b border-slate-100 px-5 py-3 text-xs font-medium text-slate-400"><span>종목</span><span>현재가</span><span>등락</span><span>관심</span></div>{filtered.map(s=><div key={s[0]} className="grid grid-cols-[1.5fr_1fr_1fr_auto] items-center gap-4 border-b border-slate-100 px-5 py-4 last:border-0"><div><p className="font-semibold">{s[1]}</p><p className="mt-0.5 text-xs text-slate-400">{s[0]} · KOSPI</p></div><p className="font-semibold">{money(s[2])}</p><p className="text-sm"><Change value={s[3]} rate={s[4]}/></p><button aria-label={`${s[1]} 관심 등록`} className="text-lg text-slate-300 hover:text-amber-400">☆</button></div>)}</div></div>
        <aside><div className="mb-4"><h2 className="text-xl font-bold">내 포트폴리오</h2><p className="mt-1 text-sm text-slate-500">보유 종목의 현재 상태입니다.</p></div><div className="rounded-2xl border border-slate-200 bg-white p-5">{portfolio.map(p=>{const s=stocks.find(x=>x[0]===p.code)!; const gain=(s[2]-p.avg)*p.quantity; return <div key={p.code} className="flex items-center justify-between border-b border-slate-100 py-4 first:pt-0 last:border-0 last:pb-0"><div><p className="font-semibold">{p.name}</p><p className="mt-1 text-xs text-slate-400">{p.quantity}주 · 평균 {won.format(p.avg)}원</p></div><div className="text-right"><p className="font-semibold">{money(s[2]*p.quantity)}</p><p className={gain>=0?'text-sm text-rose-500':'text-sm text-blue-500'}>{gain>=0?'+':''}{money(gain)}</p></div></div>})}<Button variant="outline" className="mt-5 w-full rounded-xl" onClick={()=>setActive('내 포트폴리오')}>포트폴리오 보기</Button></div><div className="mt-4 rounded-2xl bg-white p-5 ring-1 ring-slate-200"><p className="text-sm font-semibold">거래 유의사항</p><p className="mt-2 text-xs leading-5 text-slate-500">Mirae의 모든 가격과 거래는 학습 및 시연을 위한 가상 데이터입니다. 실제 투자와 무관합니다.</p></div></aside></section>
    </main>
  </div>
}
