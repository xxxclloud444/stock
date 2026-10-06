'use client'

import { useMemo, useState } from 'react'
import { ArrowDownRight, ArrowUpRight, BarChart3, Bell, Check, ChevronDown, Menu, Search, TrendingUp, Wallet, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Stock = { code: string; name: string; price: number; change: number; rate: number }
type Holding = { code: string; name: string; quantity: number; avg: number }
type Transaction = { id: number; type: '매수' | '매도'; stock: string; quantity: number; price: number; date: string }

const stocks: Stock[] = [
  { code: '005930', name: '삼성전자', price: 72000, change: 1200, rate: 1.69 },
  { code: '000660', name: 'SK하이닉스', price: 185000, change: -3500, rate: -1.85 },
  { code: '005380', name: '현대차', price: 245000, change: 5000, rate: 2.08 },
  { code: '035420', name: 'NAVER', price: 178000, change: -2000, rate: -1.11 },
  { code: '035720', name: '카카오', price: 52000, change: 800, rate: 1.56 },
  { code: '068270', name: '셀트리온', price: 168000, change: 2500, rate: 1.51 },
  { code: '051910', name: 'LG화학', price: 310000, change: -4500, rate: -1.43 },
  { code: '105560', name: 'KB금융', price: 98000, change: 1800, rate: 1.87 },
]
const won = new Intl.NumberFormat('ko-KR')
const money = (n: number) => `${won.format(n)}원`
const percent = (n: number) => `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`

function Change({ value, rate }: Pick<Stock, 'change' | 'rate'>) {
  const up = value >= 0
  return <span className={up ? 'text-rose-500' : 'text-blue-500'}>{up ? <ArrowUpRight className="inline size-4" /> : <ArrowDownRight className="inline size-4" />}{won.format(Math.abs(value))} ({percent(rate)})</span>
}

export default function Page() {
  const [active, setActive] = useState('홈')
  const [query, setQuery] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [favorites, setFavorites] = useState<string[]>(['005930', '035420'])
  const [holdings, setHoldings] = useState<Holding[]>([{ code: '005930', name: '삼성전자', quantity: 20, avg: 68400 }, { code: '035420', name: 'NAVER', quantity: 8, avg: 171500 }])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [tradeStock, setTradeStock] = useState<Stock | null>(null)
  const [tradeType, setTradeType] = useState<'매수' | '매도'>('매수')
  const [quantity, setQuantity] = useState('1')
  const [notice, setNotice] = useState('')

  const filtered = useMemo(() => stocks.filter((stock) => stock.name.includes(query) || stock.code.includes(query)), [query])
  const stockValue = holdings.reduce((sum, holding) => sum + holding.quantity * (stocks.find((stock) => stock.code === holding.code)?.price ?? 0), 0)
  const invested = holdings.reduce((sum, holding) => sum + holding.quantity * holding.avg, 0)
  const profit = stockValue - invested
  const total = 10000000 + profit
  const nav = ['홈', '종목 찾기', '내 포트폴리오', '거래 내역']

  function toggleFavorite(code: string) { setFavorites((current) => current.includes(code) ? current.filter((item) => item !== code) : [...current, code]) }
  function openTrade(stock: Stock, type: '매수' | '매도' = '매수') { setTradeStock(stock); setTradeType(type); setQuantity('1') }
  function submitTrade() {
    if (!tradeStock) return
    const count = Number(quantity)
    if (!Number.isInteger(count) || count < 1) { setNotice('수량은 1주 이상 입력해주세요.'); return }
    const existing = holdings.find((holding) => holding.code === tradeStock.code)
    if (tradeType === '매도' && (!existing || existing.quantity < count)) { setNotice('보유 수량보다 많이 매도할 수 없습니다.'); return }
    setHoldings((current) => {
      if (tradeType === '매수') {
        if (!existing) return [...current, { code: tradeStock.code, name: tradeStock.name, quantity: count, avg: tradeStock.price }]
        const nextQuantity = existing.quantity + count
        return current.map((holding) => holding.code === tradeStock.code ? { ...holding, quantity: nextQuantity, avg: Math.round((holding.quantity * holding.avg + count * tradeStock.price) / nextQuantity) } : holding)
      }
      return current.map((holding) => holding.code === tradeStock.code ? { ...holding, quantity: holding.quantity - count } : holding).filter((holding) => holding.quantity > 0)
    })
    setTransactions((current) => [{ id: Date.now(), type: tradeType, stock: tradeStock.name, quantity: count, price: tradeStock.price, date: new Date().toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }, ...current])
    setTradeStock(null); setNotice(`${tradeStock.name} ${count}주 ${tradeType} 주문이 체결되었습니다.`)
  }

  return <div className="min-h-screen bg-[#f7f8fa] text-slate-950">
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur"><div className="mx-auto flex h-18 max-w-[1400px] items-center justify-between px-5 lg:px-8">
      <div className="flex items-center gap-3"><div className="flex size-9 items-center justify-center rounded-xl bg-slate-950 text-sm font-black text-white">N</div><span className="text-xl font-bold tracking-tight">NOVA</span></div>
      <nav className="hidden items-center gap-1 md:flex">{nav.map((item) => <button key={item} onClick={() => setActive(item)} className={`rounded-lg px-4 py-2 text-sm font-medium ${active === item ? 'bg-slate-100 text-slate-950' : 'text-slate-500 hover:bg-slate-50'}`}>{item}</button>)}</nav>
      <div className="flex items-center gap-2"><Button variant="ghost" size="icon" aria-label="알림"><Bell className="size-5" /></Button><Button className="hidden rounded-lg bg-slate-950 px-4 sm:flex">내 계정 <ChevronDown data-icon="inline-end" /></Button><Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="메뉴">{mobileOpen ? <X /> : <Menu />}</Button></div>
    </div>{mobileOpen && <nav className="flex flex-col gap-1 border-t border-slate-200 bg-white p-3 md:hidden">{nav.map((item) => <button key={item} onClick={() => { setActive(item); setMobileOpen(false) }} className="rounded-lg px-3 py-3 text-left text-sm font-medium">{item}</button>)}</nav>}</header>
    <main className="mx-auto max-w-[1400px] px-5 py-8 lg:px-8 lg:py-10">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-2 text-sm font-medium text-slate-500">화요일, 2026년 10월 6일</p><h1 className="text-3xl font-bold tracking-tight sm:text-4xl">안녕하세요, 투자자님</h1><p className="mt-2 text-slate-500">오늘의 시장 흐름과 포트폴리오를 확인해보세요.</p></div><Button onClick={() => openTrade(stocks[0])} className="w-fit rounded-xl bg-slate-950">+ 거래 시작하기</Button></div>
      {notice && <div className="mb-5 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"><span><Check className="mr-2 inline size-4" />{notice}</span><button onClick={() => setNotice('')} aria-label="알림 닫기"><X className="size-4" /></button></div>}
      {(active === '홈' || active === '내 포트폴리오') && <section className="grid gap-4 lg:grid-cols-[1.25fr_1fr_1fr]"><div className="rounded-2xl bg-slate-950 p-6 text-white shadow-sm"><div className="flex items-start justify-between"><div><p className="text-sm text-slate-400">내 총자산</p><p className="mt-3 text-3xl font-bold tracking-tight">{money(total)}</p></div><div className="rounded-xl bg-white/10 p-3"><Wallet className="size-5" /></div></div><div className="mt-7 flex items-center gap-2 text-sm text-emerald-300"><TrendingUp className="size-4" /> {money(profit)} <span className="text-slate-400">평가손익</span></div></div><div className="rounded-2xl border border-slate-200 bg-white p-6"><p className="text-sm text-slate-500">보유 현금</p><p className="mt-3 text-2xl font-bold">{money(10000000 - profit)}</p><div className="mt-7 h-1.5 rounded-full bg-slate-100"><div className="h-full w-[72%] rounded-full bg-slate-950" /></div><p className="mt-2 text-xs text-slate-400">투자 가능 금액의 72%</p></div><div className="rounded-2xl border border-slate-200 bg-white p-6"><p className="text-sm text-slate-500">총 수익률</p><p className={`mt-3 text-2xl font-bold ${profit >= 0 ? 'text-rose-500' : 'text-blue-500'}`}>{percent((profit / 10000000) * 100)}</p><div className="mt-5 flex items-center gap-2 text-sm text-slate-500"><BarChart3 className="size-4" /> 평가금액 {money(stockValue)}</div></div></section>}
      {(active === '홈' || active === '종목 찾기') && <section className="mt-8"><div className="mb-4 flex items-center justify-between"><div><h2 className="text-xl font-bold">{active === '종목 찾기' ? '종목 찾기' : '관심 종목'}</h2><p className="mt-1 text-sm text-slate-500">국내 주요 종목의 현재가입니다.</p></div></div><div className="mb-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3"><Search className="size-4 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="종목명 또는 코드 검색" className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" /></div><div className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><div className="grid grid-cols-[1.5fr_1fr_1fr_auto_auto] gap-4 border-b border-slate-100 px-5 py-3 text-xs font-medium text-slate-400"><span>종목</span><span>현재가</span><span>등락</span><span>관심</span><span>거래</span></div>{filtered.map((stock) => <div key={stock.code} className="grid grid-cols-[1.5fr_1fr_1fr_auto_auto] items-center gap-4 border-b border-slate-100 px-5 py-4 last:border-0"><div><p className="font-semibold">{stock.name}</p><p className="mt-0.5 text-xs text-slate-400">{stock.code} · KOSPI</p></div><p className="font-semibold">{money(stock.price)}</p><p className="text-sm"><Change value={stock.change} rate={stock.rate} /></p><button onClick={() => toggleFavorite(stock.code)} aria-label={`${stock.name} 관심 등록`} className={`text-lg ${favorites.includes(stock.code) ? 'text-amber-400' : 'text-slate-300 hover:text-amber-400'}`}>{favorites.includes(stock.code) ? '★' : '☆'}</button><Button size="sm" variant="outline" onClick={() => openTrade(stock)} className="rounded-lg">거래</Button></div>)}</div></section>}
      {(active === '홈' || active === '내 포트폴리오') && <section className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]"><div><div className="mb-4"><h2 className="text-xl font-bold">내 포트폴리오</h2><p className="mt-1 text-sm text-slate-500">보유 종목의 현재 상태입니다.</p></div><div className="rounded-2xl border border-slate-200 bg-white p-5">{holdings.length === 0 ? <p className="py-8 text-center text-sm text-slate-500">아직 보유한 종목이 없습니다.</p> : holdings.map((holding) => { const stock = stocks.find((item) => item.code === holding.code)!; const gain = (stock.price - holding.avg) * holding.quantity; return <div key={holding.code} className="flex items-center justify-between border-b border-slate-100 py-4 first:pt-0 last:border-0 last:pb-0"><div><p className="font-semibold">{holding.name}</p><p className="mt-1 text-xs text-slate-400">{holding.quantity}주 · 평균 {won.format(holding.avg)}원</p></div><div className="text-right"><p className="font-semibold">{money(stock.price * holding.quantity)}</p><p className={gain >= 0 ? 'text-sm text-rose-500' : 'text-sm text-blue-500'}>{gain >= 0 ? '+' : ''}{money(gain)}</p></div></div> })}</div></div><aside><div className="mb-4"><h2 className="text-xl font-bold">최근 거래</h2><p className="mt-1 text-sm text-slate-500">이번 세션의 주문 내역입니다.</p></div><div className="rounded-2xl border border-slate-200 bg-white p-5">{transactions.length === 0 ? <p className="py-5 text-center text-sm text-slate-500">거래 내역이 없습니다.</p> : transactions.slice(0, 4).map((transaction) => <div key={transaction.id} className="flex items-center justify-between border-b border-slate-100 py-3 last:border-0"><div><p className="font-semibold">{transaction.stock} <span className={transaction.type === '매수' ? 'text-rose-500' : 'text-blue-500'}>{transaction.type}</span></p><p className="text-xs text-slate-400">{transaction.quantity}주 · {transaction.date}</p></div><p className="text-sm font-medium">{money(transaction.price * transaction.quantity)}</p></div>)}</div><div className="mt-4 rounded-2xl bg-white p-5 ring-1 ring-slate-200"><p className="text-sm font-semibold">거래 유의사항</p><p className="mt-2 text-xs leading-5 text-slate-500">NOVA의 모든 가격과 거래는 학습 및 시연을 위한 가상 데이터입니다. 실제 투자와 무관합니다.</p></div></aside></section>}
      {active === '거래 내역' && <section className="mt-8"><h2 className="text-xl font-bold">거래 내역</h2><p className="mt-1 text-sm text-slate-500">이번 세션에서 체결된 주문을 확인하세요.</p><div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">{transactions.length === 0 ? <p className="py-12 text-center text-sm text-slate-500">아직 체결된 거래가 없습니다.</p> : transactions.map((transaction) => <div key={transaction.id} className="flex items-center justify-between border-b border-slate-100 py-4 last:border-0"><div><p className="font-semibold">{transaction.stock} <span className={transaction.type === '매수' ? 'text-rose-500' : 'text-blue-500'}>{transaction.type}</span></p><p className="mt-1 text-xs text-slate-400">{transaction.quantity}주 · {transaction.date}</p></div><p className="font-semibold">{money(transaction.price * transaction.quantity)}</p></div>)}</div></section>}
    </main>
    {tradeStock && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-5" role="dialog" aria-modal="true" aria-label="주식 거래"><div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"><div className="flex items-start justify-between"><div><p className="text-sm text-slate-500">주문하기</p><h2 className="mt-1 text-2xl font-bold">{tradeStock.name}</h2><p className="mt-1 text-sm text-slate-500">현재가 {money(tradeStock.price)}</p></div><button onClick={() => setTradeStock(null)} aria-label="거래창 닫기"><X className="size-5" /></button></div><div className="mt-6 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1"><button onClick={() => setTradeType('매수')} className={`rounded-lg py-2 text-sm font-semibold ${tradeType === '매수' ? 'bg-white shadow-sm' : 'text-slate-500'}`}>매수</button><button onClick={() => setTradeType('매도')} className={`rounded-lg py-2 text-sm font-semibold ${tradeType === '매도' ? 'bg-white shadow-sm' : 'text-slate-500'}`}>매도</button></div><label className="mt-5 block text-sm font-medium">주문 수량<input type="number" min="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-950" /></label><div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm"><span className="text-slate-500">주문 금액</span><strong className="text-lg">{money(tradeStock.price * (Number(quantity) || 0))}</strong></div><Button onClick={submitTrade} className="mt-5 w-full rounded-xl bg-slate-950">{tradeType} 주문 체결하기</Button><p className="mt-3 text-center text-xs text-slate-400">가상 거래 환경입니다.</p></div></div>}
  </div>
}
