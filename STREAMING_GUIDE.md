# TanStack Query Experimental Streaming 이해하기

## 중요: "use client"와 서버 렌더링

### "use client"가 있어도 서버에서 렌더링됩니다!

많은 개발자들이 오해하는 부분:
- ❌ 잘못된 이해: "use client"가 있으면 클라이언트에서만 실행된다
- ✅ 올바른 이해: "use client"가 있어도 **SSR 시에는 서버에서 먼저 렌더링**됩니다

```tsx
// "use client"가 있는 컴포넌트
"use client";

export default function MyComponent() {
  const isServer = typeof window === "undefined";
  console.log(isServer ? "🟦 SERVER" : "🟨 CLIENT");
  
  // 초기 페이지 로드: 🟦 SERVER (서버에서 먼저 실행)
  // Hydration: 🟨 CLIENT (클라이언트에서 다시 실행)
  // 페이지 이동 후: 🟨 CLIENT (클라이언트에서만 실행)
}
```

### 서버 컴포넌트 vs 클라이언트 컴포넌트

| 특징 | 서버 컴포넌트 | 클라이언트 컴포넌트 |
|------|--------------|------------------|
| 선언 방법 | "use client" 없음 | "use client" 있음 |
| 초기 페이지 로드 | 서버에서만 실행 | 서버 + 클라이언트 (hydration) |
| 페이지 이동 후 | 서버에서만 실행 | 클라이언트에서만 실행 |
| 상태 관리 | ❌ 불가능 | ✅ 가능 (useState, useEffect) |
| 이벤트 핸들러 | ❌ 불가능 | ✅ 가능 (onClick 등) |
| React Query | ❌ useQuery 사용 불가 | ✅ 사용 가능 |

## 1. ReactQueryStreamedHydration이란?

`ReactQueryStreamedHydration`은 **prefetchQuery 없이** `useSuspenseQuery`만 사용해도 서버에서 데이터를 가져올 수 있게 해주는 실험적 기능입니다.

### 전통적인 방식 (Prefetching)

```tsx
// 서버 컴포넌트
export default async function Page() {
  const queryClient = new QueryClient();
  
  // ✅ prefetchQuery 필수
  await queryClient.prefetchQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Posts />
    </HydrationBoundary>
  );
}

// 클라이언트 컴포넌트
function Posts() {
  const { data } = useQuery({ queryKey: ["posts"], queryFn: getPosts });
  // ...
}
```

### 실험적 Streaming 방식

```tsx
// providers.tsx에 ReactQueryStreamedHydration 추가
<QueryClientProvider client={queryClient}>
  <ReactQueryStreamedHydration>
    {children}
  </ReactQueryStreamedHydration>
</QueryClientProvider>

// 클라이언트 컴포넌트 - prefetchQuery 불필요!
function Posts() {
  // ✨ 이것만으로 서버에서 자동으로 fetch됩니다!
  const { data } = useSuspenseQuery({ 
    queryKey: ["posts"], 
    queryFn: getPosts 
  });
  // ...
}
```

## 2. 서버에서 데이터 Fetch가 일어나는 증거

### 확인 방법

1. **터미널 로그 확인** (서버 로그)
   ```
   🚀 [getPosts] 시작 🟦 SERVER
   ✅ [getPosts] 완료 (2000ms) 🟦 SERVER
   ```

2. **브라우저 콘솔 확인** (클라이언트 로그)
   - 초기 로드 시: 로그 없음 (이미 서버에서 fetch됨)
   - 페이지 이동 후 재방문 시: staleTime이 지나면 클라이언트에서 refetch
   ```
   🚀 [getPosts] 시작 🟨 CLIENT
   ✅ [getPosts] 완료 (2000ms) 🟨 CLIENT
   ```

3. **Network 탭 확인**
   - 초기 HTML 응답에 데이터가 포함되어 있음
   - 별도의 API 요청이 발생하지 않음

### 동작 원리

```
[서버]
1. 클라이언트 컴포넌트가 서버에서 렌더링 시작
2. useSuspenseQuery 호출 → Suspense 트리거
3. queryFn(getPosts) 실행 🟦 SERVER
4. 데이터와 함께 HTML 스트리밍
5. Promise를 serialize하여 클라이언트로 전송

[클라이언트]
6. HTML 수신
7. hydration 시 Promise를 QueryCache에 복원
8. 컴포넌트 렌더링 시 이미 resolve된 데이터 사용
```

## 3. Request Waterfall 문제

### Request Waterfall이란?

**컴포넌트 렌더링 순서에 따라 요청이 순차적으로 발생하는 현상**

### 발생 시나리오

```tsx
// Page → PostsList → PostDetail → PostAuthor

// 1️⃣ PostsList 컴포넌트
function PostsList() {
  const { data } = useSuspenseQuery({
    queryKey: ["posts"],
    queryFn: getPosts, // 🚀 첫 번째 요청
  });
  
  return <PostDetail postId={data.posts[0].id} />;
}

// 2️⃣ PostDetail 컴포넌트 (PostsList 렌더링 후에야 실행됨)
function PostDetail({ postId }) {
  const { data } = useSuspenseQuery({
    queryKey: ["post", postId],
    queryFn: () => getPostDetail(postId), // 🚀 두 번째 요청 (getPosts 완료 후)
  });
  
  return <PostAuthor userId={data.userId} />;
}

// 3️⃣ PostAuthor 컴포넌트 (PostDetail 렌더링 후에야 실행됨)
function PostAuthor({ userId }) {
  const { data } = useSuspenseQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserInfo(userId), // 🚀 세 번째 요청 (getPostDetail 완료 후)
  });
  
  return <div>{data.name}</div>;
}
```

### Waterfall 흐름

```
시간 축 →

초기 페이지 로드 (SSR):
1. |> getPosts()          (0~2s)
2.   |> getPostDetail()    (2~4s)
3.     |> getUserInfo()    (4~6s)
총 6초

페이지 이동 후 (Client):
1. |> JS for <PostsList>   (0~1s, code splitting)
2.   |> getPosts()         (1~3s)
3.     |> JS for <PostDetail> (3~4s)
4.       |> getPostDetail() (4~6s)
5.         |> JS for <PostAuthor> (6~7s)
6.           |> getUserInfo() (7~9s)
총 9초!
```

### 왜 페이지 이동 시 더 나쁜가?

#### 초기 로드 (SSR)
- ✅ 서버는 모든 컴포넌트를 한 번에 렌더링
- ✅ 코드 스플리팅 없음 (모든 컴포넌트 코드가 서버에 있음)
- ❌ 하지만 여전히 데이터 waterfall 발생

#### 페이지 이동 (Client-side Navigation)
- ❌ 코드 스플리팅으로 인한 추가 지연
- ❌ 각 컴포넌트 코드 다운로드 → 실행 → 데이터 요청
- ❌ "코드 다운로드" + "데이터 요청"이 번갈아 발생

### ReactQueryStreamedHydration의 한계

공식 문서의 경고:

> While we recommend the prefetching solution detailed above because it flattens request waterfalls both on the initial page load **and** any subsequent page navigation, there is an experimental way to skip prefetching altogether...

**의미:**
- ✅ 초기 페이지 로드: waterfall 발생 (하지만 서버에서 빠르게 처리)
- ❌ 페이지 이동 후: waterfall + code splitting = 매우 느림

### 해결 방법

#### 1. Prefetching 사용 (권장)

```tsx
// 서버 컴포넌트에서 병렬 prefetch
export default async function Page() {
  const queryClient = new QueryClient();
  
  // 🚀 모든 요청을 병렬로 시작
  await Promise.all([
    queryClient.prefetchQuery({ queryKey: ["posts"], queryFn: getPosts }),
    queryClient.prefetchQuery({ queryKey: ["post", 1], queryFn: () => getPostDetail(1) }),
    queryClient.prefetchQuery({ queryKey: ["user", 1], queryFn: () => getUserInfo(1) }),
  ]);
  
  return <HydrationBoundary state={dehydrate(queryClient)}>...</HydrationBoundary>;
}
```

결과:
```
1. |> getPosts(), getPostDetail(), getUserInfo() 병렬 실행
총 2초 (가장 느린 요청의 시간)
```

#### 2. Parallel Routes (Next.js)

```
app/
  posts/
    page.tsx          # getPosts()
    @detail/
      page.tsx        # getPostDetail()
    @author/
      page.tsx        # getUserInfo()
```

Next.js가 자동으로 병렬 fetch!

#### 3. useSuspenseQueries 사용

```tsx
function AllData() {
  const [posts, detail, author] = useSuspenseQueries({
    queries: [
      { queryKey: ["posts"], queryFn: getPosts },
      { queryKey: ["post", 1], queryFn: () => getPostDetail(1) },
      { queryKey: ["user", 1], queryFn: () => getUserInfo(1) },
    ],
  });
  
  return <div>...</div>;
}
```

## 4. 각 방식의 Trade-off

| 방식 | 초기 로드 | 페이지 이동 | 코드 복잡도 | DX |
|------|----------|-----------|------------|-----|
| **Prefetching + await** | 느림 (blocking) | 빠름 | 높음 | 보통 |
| **Prefetching (no await)** | 빠름 (streaming) | 빠름 | 높음 | 보통 |
| **ReactQueryStreamedHydration** | 빠름 (streaming) | **느림 (waterfall)** | 낮음 | 좋음 |

### 권장 사항

공식 문서의 조언:

> If you value DX/iteration/shipping speed with low code complexity over performance, don't have deeply nested queries, or are on top of your request waterfalls with parallel fetching using tools like `useSuspenseQueries`, this can be a good tradeoff.

**사용해도 괜찮은 경우:**
- ✅ 프로토타입/MVP 개발 (빠른 개발 속도 중시)
- ✅ 중첩이 깊지 않은 구조 (1~2 depth)
- ✅ useSuspenseQueries로 병렬 처리가 가능한 경우
- ✅ 서버 latency가 매우 낮은 경우

**사용하면 안 되는 경우:**
- ❌ 프로덕션 앱 (성능 중시)
- ❌ 깊은 컴포넌트 중첩 (3 depth 이상)
- ❌ 페이지 이동이 많은 앱
- ❌ 모바일 등 네트워크가 느린 환경

## 5. 실습 확인 사항

### 실험 1: 서버 컴포넌트에서 작동 확인 (/experimental-server-demo)

**목표:** ReactQueryStreamedHydration이 서버에서 실행되는 것을 명확히 확인

1. `/experimental-server-demo` 접속 (새로고침 F5)
2. **터미널 로그** 확인:
   ```
   🔴 [SERVER COMPONENT] 페이지 렌더링 - 🟦 SERVER
   🟦 [SERVER] 클라이언트 컴포넌트가 서버에서 렌더링 중 (SSR)
   🟦 [SERVER] useSuspenseQuery 호출 직전...
   🟦 SERVER queryFn 실행 중...
   🚀 [getPosts] 시작 🟦 SERVER
   ✅ [getPosts] 완료 (2000ms) 🟦 SERVER
   🟦 SERVER queryFn 완료!
   🟦 [SERVER] useSuspenseQuery 완료 - 데이터 획득!
   ```

3. **브라우저 콘솔** 확인:
   ```
   🟨 [CLIENT] Hydration 완료 - 이제 클라이언트에서 실행 중
   ```

4. **Network 탭** 확인:
   - 초기 HTML 응답에 데이터가 포함되어 있음
   - 별도 API 요청 없음

5. **홈으로 이동 → 다시 돌아오기**:
   - 터미널 로그 없음 (서버 실행 안됨)
   - 브라우저 콘솔에서 클라이언트 로그만 확인
   - staleTime(60초) 이내면 캐시 사용

### 실험 2: Waterfall 서버 vs 클라이언트 (/waterfall-server-demo)

**목표:** 서버와 클라이언트에서 waterfall이 어떻게 다르게 발생하는지 확인

#### A. 초기 로드 (서버 waterfall)

1. `/waterfall-server-demo` 접속 (F5 새로고침)
2. **터미널 로그**에서 순차 실행 확인:
   ```
   🌊 [WATERFALL SERVER PAGE] 렌더링 시작
      위치: 🟦 SERVER

   🟦 SERVER 1️⃣ [WaterfallClientWrapper] 렌더링 시작
   🟦 SERVER    🚀 1️⃣ getPosts() 시작...
   🚀 [getPosts] 시작 🟦 SERVER
   ✅ [getPosts] 완료 (2000ms) 🟦 SERVER
   🟦 SERVER    ✅ 1️⃣ getPosts() 완료 (2000ms)
   🟦 SERVER ✅ 1️⃣ [WaterfallClientWrapper] 데이터 로드 완료
   🟦 SERVER    다음 단계: PostDetail 렌더링 시작...

   🟦 SERVER 2️⃣ [PostDetail] 렌더링 시작
   🟦 SERVER    🚀 2️⃣ getPostDetail(1) 시작...
   🟦 SERVER    ✅ 2️⃣ getPostDetail(1) 완료 (1000ms)
   🟦 SERVER ✅ 2️⃣ [PostDetail] 데이터 로드 완료
   🟦 SERVER    다음 단계: PostAuthor 렌더링 시작...

   🟦 SERVER 3️⃣ [PostAuthor] 렌더링 시작
   🟦 SERVER    🚀 3️⃣ getUserInfo(1) 시작...
   🟦 SERVER    ✅ 3️⃣ getUserInfo(1) 완료 (1000ms)
   🟦 SERVER ✅ 3️⃣ [PostAuthor] 데이터 로드 완료

   🎉 🟦 SERVER ========================================
   🎉 🟦 SERVER 모든 Waterfall 요청 완료!
   🎉 🟦 SERVER 총 소요 시간: 약 4초 (2s + 1s + 1s)
   ```

3. **관찰 포인트:**
   - 모든 로그에 🟦 SERVER 표시
   - 각 단계가 순차적으로 실행됨
   - 총 약 4초 소요

#### B. 페이지 이동 후 재방문 (클라이언트 waterfall)

1. 홈으로 이동 (`/`)
2. 60초 기다리기 (staleTime 초과)
3. `/waterfall-server-demo`로 다시 이동
4. **브라우저 콘솔**에서 클라이언트 waterfall 확인:
   ```
   🟨 CLIENT 1️⃣ [WaterfallClientWrapper] 렌더링 시작
   🟨 CLIENT    🚀 1️⃣ getPosts() 시작...
   🚀 [getPosts] 시작 🟨 CLIENT
   ✅ [getPosts] 완료 (2000ms) 🟨 CLIENT
   🟨 CLIENT    ✅ 1️⃣ getPosts() 완료 (2000ms)
   
   🟨 CLIENT 2️⃣ [PostDetail] 렌더링 시작
   🟨 CLIENT    🚀 2️⃣ getPostDetail(1) 시작...
   🟨 CLIENT    ✅ 2️⃣ getPostDetail(1) 완료 (1000ms)
   
   🟨 CLIENT 3️⃣ [PostAuthor] 렌더링 시작
   🟨 CLIENT    🚀 3️⃣ getUserInfo(1) 시작...
   🟨 CLIENT    ✅ 3️⃣ getUserInfo(1) 완료 (1000ms)
   
   🎉 🟨 CLIENT 모든 Waterfall 요청 완료!
   ```

5. **관찰 포인트:**
   - 모든 로그에 🟨 CLIENT 표시
   - 터미널에 로그 없음 (서버 실행 안됨)
   - 동일한 waterfall이 클라이언트에서 발생

### 실험 3: 기본 예제들 비교

#### A. Experimental Streaming (/experimental-streaming)

- 모든 컴포넌트가 "use client"
- 초기 로드: 서버에서 fetch (터미널 로그)
- 페이지 이동 후: 클라이언트에서 fetch (브라우저 로그)

#### B. Waterfall (/waterfall-example)

- 모든 컴포넌트가 "use client"
- 동일한 패턴 (서버 → 클라이언트)
- Waterfall 발생

### 핵심 차이 정리

| 예제 | 페이지 컴포넌트 | 자식 컴포넌트 | 장점 |
|------|---------------|-------------|------|
| experimental-streaming | "use client" | "use client" | 단순함 |
| experimental-server-demo | 서버 컴포넌트 | "use client" | **명확한 로그**, Hydration 과정 확인 가능 |
| waterfall-example | "use client" | "use client" | 단순함 |
| waterfall-server-demo | 서버 컴포넌트 | "use client" | **명확한 로그**, 서버/클라이언트 비교 가능 |

### 실험 4: Streaming vs Blocking 비교

1. `/streaming-example` (await 없음) vs `/streaming-blocking` (await 있음)
2. TTFB 비교
3. 화면 표시 시점 비교

## 결론

**ReactQueryStreamedHydration**:
- ✅ 개발자 경험이 우수함 (코드 단순화)
- ✅ 초기 로드는 빠름 (streaming)
- ✅ 서버에서 자동으로 fetch
- ❌ 페이지 이동 시 waterfall 발생
- ❌ 프로덕션에서는 신중하게 사용

**현명한 선택:**
- 프로토타입: ReactQueryStreamedHydration ✅
- 프로덕션: Prefetching + Parallel Routes ✅
