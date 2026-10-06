# 한국 주식 모의투자

실제 주식 API 없이 프로젝트 내부의 고정 더미 데이터로 동작하는 한국 주식 모의투자 서비스입니다. 모든 거래는 가상 거래이며 실제 투자·증권계좌와 연결되지 않습니다.

## 시작하기

1. Node.js 20+와 pnpm을 설치합니다.
2. Supabase 프로젝트를 만든 뒤 프로젝트의 환경변수를 Vercel 프로젝트 Vars에 등록합니다.
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (또는 `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - 이메일 링크 리디렉션을 사용하는 경우 `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL`
3. Supabase SQL Editor에서 `supabase/schema.sql` 전체를 실행합니다. 이 SQL은 profiles, holdings, transactions, 회원가입 트리거와 RLS 정책을 생성합니다.
4. 프로젝트 의존성을 설치하고 개발 서버를 실행합니다.

```bash
pnpm install
pnpm dev
```

브라우저에서 `http://localhost:3000`을 엽니다.

## 데이터 구조

- `profiles`: 회원별 이메일, 닉네임, 초기 가상 현금 10,000,000원
- `holdings`: 사용자별 종목 보유수량과 평균매수가
- `transactions`: BUY/SELL 가상 거래 기록

모든 사용자 데이터는 `auth.uid()` 기반 Supabase RLS로 본인만 조회·수정할 수 있습니다. 종목 가격은 외부 API를 호출하지 않고 코드에 정의된 임시 데이터만 사용합니다.

## 주의

이 서비스의 가격, 수익률, 포트폴리오는 교육 및 화면 시연용입니다. 실제 금융 의사결정이나 투자 결과를 보장하지 않습니다.
