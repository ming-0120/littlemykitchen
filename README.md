# 📱 [자취생의 부엌] – [JS, HTML, CSS]
<img width="500" height="500" alt="logo_1" src="https://github.com/user-attachments/assets/334bf7b2-d8da-4aac-8956-a9e644cc167e" />

## 화면
<table>
  <tr>
    <td style="padding:12px;">
      <img src="https://github.com/user-attachments/assets/875643e5-fdeb-4368-80d7-7e7b6a255012" style="width:100%; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.1);" />
    </td>
    <td style="padding:12px;">
      <img src="https://github.com/user-attachments/assets/1edcd25b-6958-490f-b328-a390dc3247ee" style="width:100%; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.1);" />
    </td>
    <td style="padding:12px;">
      <img src="https://github.com/user-attachments/assets/7c4ae256-ca47-4056-8bd9-708ee7eea2aa" style="width:100%; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.1);" />
    </td>
  </tr>
  <tr>
    <td style="padding:12px;">
      <img src="https://github.com/user-attachments/assets/04460438-84f6-4b6c-ac45-169a702bb000" style="width:100%; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.1);" />
    </td>
    <td style="padding:12px;">
      <img src="https://github.com/user-attachments/assets/643e3234-68b9-4640-9d0a-3c7795068a9e" style="width:100%; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.1);" />
    </td>
    <td style="padding:12px;">
      <img src="https://github.com/user-attachments/assets/9c7d724a-16b7-457b-9f2e-f7e8c5a93b3a" style="width:100%; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.1);" />
    </td>
  </tr>
</table>

---

## 1. 프로젝트 개요

- **프로젝트명**: 자취생의 부엌 – 1인 가구를 위한 식재료 관리 & 레시피 추천 웹사이트
- **개발 기간**: 2025.10.15 ~ 2025.10.27
- **수행 방식**: **단독 개발**
---

## 2. 주요 기능
- **만개의 레시피 API** 를 활용하여 검색한 재료 기반 레시피 추천
- 선택한 레시피 내의 재료 구매 기능
- 챗봇을 활용한 제공된 API 외의 자세한 레시피 검색 기능

---

## 3. 문제 해결 및 트러블슈팅 경험

### ✅ 데이터가 새로고침하면 사라지는 문제

### 🧨 문제 상황

- 처음에는 단순히 JS 배열에 저장 → 새로고침하면 초기화됨
 -> 로컬 저장 방식이 필요함.

### 🔍 해결 과정

1. localStorage는 문자열만 저장 가능 → JSON으로 변환 필요
2. CRUD 발생할 때마다 항상 저장/로드 로직 분리
3. `id` 충돌 문제 해결 위해 timestamp 기반 id 생성

---

### ✅ **챗봇이 이전 대화를 기억하지 못하는 문제**

### 🧨 문제 상황

- 챗봇이 매 요청마다 **독립적인 응답**을 생성
- 이전 대화 맥락이 반영되지 않아:
  - 질문이 이어지지 않음
  - 대화형 UX가 아닌 단발성 응답 형태로 동작
- 사용자 입장에서:
  - "대화"가 아닌 "검색"처럼 느껴지는 문제 발생

### 🛠 해결 방법

### 1. 대화 상태를 배열로 관리

```jsx
letconversation= [
  { role:"user", content:"너는 친절하고 명확하게 답하는 챗봇이다." }
];
```

- 모든 메시지를 배열에 누적
- user / model 역할 구분

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


### 3. 응답 이후 다시 상태에 저장

```jsx
conversation.push({ role:"user", content:msg });
conversation.push({ role:"model", content:finalText });
```

- user + model 모두 저장
- 다음 요청에서 context 유지


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

### 💡 결과
- LLM은 상태를 기억하지 않기 때문에, 대화 상태를 직접 관리해야 함
- 단순 API 호출이 아니라 상태 관리 + 스트리밍 UI까지 포함한 구조 설계

---

### ✅ 레시피 데이터에서 재료 파싱 정확도 문제

### 🧨 문제 상황

- 레시피 API에서 받아온 재료 데이터가 일정하지 않음
- 예:
  - "양파 1/2개"
  - "소금 약간"
  - "돼지고기 200g"

→ 재료명과 수량이 섞여 있어  
👉 주문 기능에서 정확한 재료 추출이 어려움

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

### 2. 불필요 단어 제거 처리

```jsx
constcleaned=name.replace(/약간|적당량/g,"").trim();
```

### 3. 표준화된 구조로 변환

```jsx
{
name:"양파",
amount:"1/2개"
}
```


### 💡 결과

- 재료 데이터 구조화 성공
- 주문 기능과 안정적으로 연동 가능
---

## 4. 개발 결과

### 📈 결과

- 실제 동작 가능한 식재료 관리 웹사이트 완성
- 순수 HTML/JS 기반으로 로컬 CRUD 기능 구현
- 날짜 계산·데이터 유지 등 핵심 기능 완성
---
