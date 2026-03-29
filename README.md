# 📱 [자취생의 부엌] – [JS, HTML, CSS]
<img width="500" height="500" alt="logo_1" src="https://github.com/user-attachments/assets/334bf7b2-d8da-4aac-8956-a9e644cc167e" />

---

## 1. 프로젝트 개요

- **프로젝트명**: 자취생의 부엌 – 1인 가구를 위한 식재료 관리 & 레시피 추천 웹사이트
- **개발 기간**: 2025.10.15 ~ 2025.10.27
- **수행 방식**: **단독 개발**
- **담당 범위**: 프론트엔드
- **기술 스택**: HTML5, JS, CSS

---

## 2. 클라이언트 요구사항 및 나의 역할

### 💼 클라이언트 개요

- 재료 기반 레시피 검색 기능
- UI는 단순하고 직관적으로
- 데이터는 처음엔 localStorage로 저장 (후에 확장 가능하게 설계)
- 모바일에서도 잘 보이도록 반응형

### 📌 요구사항 요약

- 재료 기반 레시피 검색 기능
- UI는 단순하고 직관적으로
- 데이터는 처음엔 localStorage로 저장 (후에 확장 가능하게 설계)
- 모바일에서도 잘 보이도록 반응형

### 👨‍💻 담당 역할

- 전체 UI 설계 및 컴포넌트 구조 정립
- 로컬스토리지 기반 데이터 저장 구조 설계

---

## 3. 기술 스택 및 아키텍처

## 🔧 기술 스택

- **Frontend:** HTML, CSS, Vanilla JS
- **Data Storage:** Web Storage API (localStorage)
- **협업툴:** VSCode Live Server, GitHub

### 📐 아키텍처 특징

- MVC 형태의 구조는 아니지만, 기능 기반으로 JS 파일을 분리
    - `storage.js` – 데이터 저장/조회
    - `render.js` – 화면 렌더링 담당
    - `event.js` – 이벤트 리스너 관리
- SPA처럼 보이도록 DOM 업데이트 방식으로 구성

```jsx
/* 데이터 구조 예 */
{
  "id": 1,
  "name": "계란",
  "category": "냉장",
  "expireDate": "2025-11-25",
  "daysLeft": 6
}
```

---

## 4. 주요 기능

- 레시피 추천(선택한 재료 기반)

---

## 5. 문제 해결 및 트러블슈팅 경험

### ✅ 데이터가 새로고침하면 사라지는 문제

### 🧨 문제 상황

처음에는 단순히 JS 배열에 저장 → 새로고침하면 초기화됨

로컬 저장 방식이 필요함.

### 🔍 해결 과정

1. localStorage는 문자열만 저장 가능 → JSON으로 변환 필요
2. CRUD 발생할 때마다 항상 저장/로드 로직 분리
3. `id` 충돌 문제 해결 위해 timestamp 기반 id 생성

### ✅ **챗봇이 이전 대화를 기억하지 못하는 문제**

### 🧨 문제 상황

- 챗봇이 매 요청마다 **독립적인 응답**을 생성
- 이전 대화 맥락이 반영되지 않아:
  - 질문이 이어지지 않음
  - 대화형 UX가 아닌 단발성 응답 형태로 동작
- 사용자 입장에서:
  - "대화"가 아닌 "검색"처럼 느껴지는 문제 발생

---

### 🛠 해결 방법

### 1. 대화 상태를 배열로 관리

```jsx
letconversation= [
  { role:"user", content:"너는 친절하고 명확하게 답하는 챗봇이다." }
];
```

- 모든 메시지를 배열에 누적
- user / model 역할 구분

---

### 2. API 요청 시 전체 대화 전달

```jsx
body:JSON.stringify({
    contents:conversation.map(c => ({
        role:c.role,
        parts: [{ text:c.content }]
    })),
    system_instruction: {
        role:"system",
        parts: [{
            text:`
            너는 오직 '요리 레시피' 주제에만 답해야 해.
            다른 주제는 거절해야 해.
            `
        }]
    }
})
```

- 단일 메시지가 아닌
👉 "대화 전체"를 모델에 전달
- 문맥 기반 응답 가능

---

### 3. 응답 이후 다시 상태에 저장

```jsx
conversation.push({ role:"user", content:msg });
conversation.push({ role:"model", content:finalText });
```

- user + model 모두 저장
- 다음 요청에서 context 유지

---

### 4. 스트리밍 기반 응답 처리

```jsx
constreader=response.body
.pipeThrough(newTextDecoderStream())
.getReader();

letfinalText="";

while (true) {
const { value, done }=awaitreader.read();
if (done)break;

constchunk=value.slice(1).trim();
if (!chunk)continue;

constdata=JSON.parse(chunk);
consttextChunk=data.candidates?.[0]?.content?.parts?.[0]?.text||"";

finalText+=textChunk;

botDiv.innerHTML=marked.parse(finalText);
}
```

- chunk 단위로 데이터 수신
- 실시간 UI 업데이트

💡 결과
- LLM은 상태를 기억하지 않기 때문에, 대화 상태를 직접 관리해야 함
- 단순 API 호출이 아니라 상태 관리 + 스트리밍 UI까지 포함한 구조 설계

### ✅ 레시피 데이터에서 재료 파싱 정확도 문제

### 🧨 문제 상황

- 레시피 API에서 받아온 재료 데이터가 일정하지 않음
- 예:
  - "양파 1/2개"
  - "소금 약간"
  - "돼지고기 200g"

→ 재료명과 수량이 섞여 있어  
👉 주문 기능에서 정확한 재료 추출이 어려움

---
### 🛠 해결 방법

### 1. 정규식 기반 파싱 로직 구현

```jsx
functionparseIngredient(text) {
constmatch=text.match(/^([^\d]+)\s*(.*)$/);
return {
        name:match?.[1]?.trim(),
        amount:match?.[2]?.trim()
    };
}
```

---

### 2. 불필요 단어 제거 처리

```jsx
constcleaned=name.replace(/약간|적당량/g,"").trim();
```

---

### 3. 표준화된 구조로 변환

```jsx
{
name:"양파",
amount:"1/2개"
}
```

---

### 💡 결과

- 재료 데이터 구조화 성공
- 주문 기능과 안정적으로 연동 가능
---

## 6. 개발 결과 및 회고

### 📈 결과

- 실제 동작 가능한 식재료 관리 웹사이트 완성
- 순수 HTML/JS 기반으로 로컬 CRUD 기능 구현
- 날짜 계산·데이터 유지 등 핵심 기능 완성

### 🤔 회고

- 작은 프로젝트였지만 구조 분리의 중요성 체감
- localStorage만으로도 충분히 강력한 기능 구현 가능
- JS Date 처리가 생각보다 까다로웠으나 큰 배움이 됨
- 다음엔 백엔드 API 붙여보고 싶음

---

## 7. 화면 스크린샷 
<img width="1905" height="2234" alt="image" src="https://github.com/user-attachments/assets/875643e5-fdeb-4368-80d7-7e7b6a255012" />
<img width="823" height="841" alt="image" src="https://github.com/user-attachments/assets/97f89295-5682-4e99-b2eb-9b2aee2a2757" />
<img width="857" height="851" alt="image" src="https://github.com/user-attachments/assets/1b00804c-0292-4c60-83c3-fa4808323050" />
<img width="1877" height="854" alt="image" src="https://github.com/user-attachments/assets/0dde864d-9283-4b82-a1af-455586528da8" />
<img width="354" height="639" alt="image" src="https://github.com/user-attachments/assets/44796f7d-8b31-42bd-befb-9497efb6fe82" />
<img width="759" height="739" alt="image" src="https://github.com/user-attachments/assets/3a530e9f-5f49-4334-852e-416df39fa3f9" />





