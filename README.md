# TanStack Query + Next.js 서버 렌더링 학습 프로젝트

## 🎯 목표

TanStack Query의 **실험적 스트리밍 기능 (ReactQueryStreamedHydration)**을 이해하고, Request Waterfall 문제를 직접 체험하며 학습하는 프로젝트입니다.

## 🚀 시작하기

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# http://localhost:3000 접속
```

## 📚 예제 페이지

### ⭐ 추천 예제 (서버 컴포넌트 사용)

#### 1. 🔴 서버 컴포넌트에서 작동 확인 (`/experimental-server-demo`)

**목적:** ReactQueryStreamedHydration이 서버에서 어떻게 작동하는지 명확히 확인

**구조:**
```
📦 Page (서버 컴포넌트)
  └─ 🔵 ClientComponent (클라이언트 컴포넌트)
       └─ useSuspenseQuery (서버에서 자동 fetch!)
```

**확인 사항:**
- ✅ 터미널에서 🟦 SERVER 로그
- ✅ 브라우저에서 🟨 CLIENT 로그 (Hydration)
- ✅ Network 탭: HTML에 데이터 포함

#### 2. 🌊 Waterfall - 서버 vs 클라이언트 (`/waterfall-server-demo`)

**목적:** 서버와 클라이언트에서 waterfall이 어떻게 다르게 발생하는지 비교

**구조:**
```
📦 Page (서버 컴포넌트)
  └─ 🔵 WaterfallWrapper
       └─ useSuspenseQuery 1️⃣ (2초)
            └─ 🔵 PostDetail
                 └─ useSuspenseQuery 2️⃣ (1초)
                      └─ 🔵 PostAuthor
                           └─ useSuspenseQuery 3️⃣ (1초)
```

**확인 사항:**
- ✅ 초기 로드: 터미널에서 순차 실행 (약 4초)
- ✅ 페이지 이동 후: 브라우저에서 순차 실행 (약 4초)
- ✅ 병렬 실행 시: 약 2초면 충분!

### 기본 예제 (모든 컴포넌트 "use client")

#### 3. 🔴 Experimental Streaming (`/experimental-streaming`)
- prefetchQuery 없이 useSuspenseQuery만 사용
- 서버에서 자동 fetch (초기 로드)

#### 4. 🌊 Waterfall (`/waterfall-example`)
- Request Waterfall 발생 시연
- 중첩된 컴포넌트 구조

#### 5. 🟢 Streaming with Prefetching (`/streaming-example`)
- prefetchQuery (await 없음) + pending 쿼리 dehydrate
- v5.40.0+ 기능

#### 6. 🟠 Blocking with Await (`/streaming-blocking`)
- 전통적인 prefetchQuery + await 방식
- 모든 데이터 준비 후 화면 표시

## 🔍 핵심 개념

### 1. "use client"와 서버 렌더링

**중요:** "use client"가 있어도 SSR 시에는 서버에서 렌더링됩니다!

```tsx
"use client";

export default function MyComponent() {
  // 초기 페이지 로드: 🟦 SERVER (서버에서 먼저 실행)
  // Hydration: 🟨 CLIENT (클라이언트에서 다시 실행)
  // 페이지 이동 후: 🟨 CLIENT (클라이언트에서만 실행)
  
  const { data } = useSuspenseQuery({
    queryKey: ["posts"],
    queryFn: getPosts, // 초기 로드 시 서버에서 실행!
  });
}
```

### 2. ReactQueryStreamedHydration

```tsx
// providers.tsx
<QueryClientProvider client={queryClient}>
  <ReactQueryStreamedHydration>
    {children}
  </ReactQueryStreamedHydration>
</QueryClientProvider>
```

**장점:**
- ✅ prefetchQuery 불필요
- ✅ 코드 단순화
- ✅ 서버에서 자동 fetch
- ✅ Streaming SSR

**단점:**
- ❌ 페이지 이동 시 waterfall 발생
- ❌ 깊은 중첩 시 성능 문제

### 3. Request Waterfall

**문제:** 컴포넌트 렌더링 순서에 따라 요청이 순차적으로 발생

```
순차 실행 (Waterfall):
1. |> getPosts()          (0~2s)
2.   |> getPostDetail()    (2~3s)
3.     |> getUserInfo()    (3~4s)
총 4초

병렬 실행:
1. |> getPosts(), getPostDetail(), getUserInfo() 동시 실행
총 2초 (가장 느린 요청의 시간)
```

## 📖 실습 가이드

### Step 1: 서버에서 fetch 확인

1. `/experimental-server-demo` 접속 (F5 새로고침)
2. 터미널 확인:
   ```
   🟦 [SERVER] 클라이언트 컴포넌트가 서버에서 렌더링 중
   🚀 [getPosts] 시작 🟦 SERVER
   ✅ [getPosts] 완료 🟦 SERVER
   ```
3. 브라우저 콘솔 확인:
   ```
   🟨 [CLIENT] Hydration 완료
   ```

### Step 2: Waterfall 확인

1. `/waterfall-server-demo` 접속 (F5 새로고침)
2. 터미널에서 순차 실행 확인 (약 4초)
3. 홈으로 이동 → 60초 후 다시 돌아오기
4. 브라우저 콘솔에서 클라이언트 waterfall 확인

### Step 3: 서버 vs 클라이언트 비교

| 확인 방법 | 서버 실행 | 클라이언트 실행 |
|---------|---------|---------------|
| 새로고침 (F5) | 🟦 터미널 로그 | 🟨 브라우저 로그 (Hydration) |
| 페이지 이동 후 | - | 🟨 브라우저 로그 |
| staleTime 이내 | - | 캐시 사용 (로그 없음) |

## 🛠️ 기술 스택

- **Next.js 16.0.8** (App Router)
- **React 19**
- **TanStack Query 5.99.2**
- **@tanstack/react-query-next-experimental 5.99.2**
- **TypeScript**
- **pnpm**

## 📝 주요 파일

```
src/
├── app/
│   ├── experimental-server-demo/      # ⭐ 서버 컴포넌트 + 클라이언트 컴포넌트
│   ├── waterfall-server-demo/         # ⭐ Waterfall (서버 컴포넌트)
│   ├── experimental-streaming/        # 기본 Experimental 예제
│   ├── waterfall-example/             # 기본 Waterfall 예제
│   ├── streaming-example/             # Streaming with Prefetching
│   └── streaming-blocking/            # Blocking with Await
├── lib/
│   └── TanstackqueryProvider.tsx      # ReactQueryStreamedHydration 설정
├── services/
│   ├── posts.ts                       # getPosts() with logging
│   └── comments.ts                    # getComments() with logging
└── utils/
    └── tanstack-query.ts              # QueryClient 설정

STREAMING_GUIDE.md                     # 상세 가이드 문서
```

## 🎓 학습 포인트

### 1. 서버 렌더링 이해
- "use client"가 있어도 SSR 시 서버에서 실행
- Hydration 과정
- 서버 컴포넌트 vs 클라이언트 컴포넌트

### 2. ReactQueryStreamedHydration
- 작동 원리
- prefetchQuery 없이 서버 fetch
- Promise serialization

### 3. Request Waterfall
- 발생 원인
- 성능 영향
- 해결 방법 (prefetching, parallel routes, useSuspenseQueries)

### 4. Streaming SSR vs Blocking SSR
- TTFB 차이
- 사용자 경험 차이
- Trade-off

## 🚨 주의사항

### ReactQueryStreamedHydration 사용 시

**✅ 사용해도 괜찮은 경우:**
- 프로토타입/MVP 개발
- 중첩이 깊지 않은 구조 (1~2 depth)
- useSuspenseQueries로 병렬 처리 가능
- 서버 latency가 매우 낮음

**❌ 사용하면 안 되는 경우:**
- 프로덕션 앱 (성능 중시)
- 깊은 컴포넌트 중첩 (3 depth 이상)
- 페이지 이동이 많은 앱
- 모바일 등 네트워크가 느린 환경

## 📚 참고 자료

- [TanStack Query 공식 문서 - Advanced SSR](https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr)
- [Next.js App Router 문서](https://nextjs.org/docs/app)
- [Performance & Request Waterfalls](https://tanstack.com/query/latest/docs/framework/react/guides/request-waterfalls)

## 🤝 기여

이 프로젝트는 학습 목적으로 만들어졌습니다. 개선 사항이나 버그를 발견하시면 이슈를 등록해주세요!

## 📄 라이선스

MIT
