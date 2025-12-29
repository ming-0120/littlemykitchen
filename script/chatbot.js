    const CHAT_API_KEY = "";
    const MODEL_NAME = "gemini-2.5-flash"; 
    const API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:streamGenerateContent?key=${CHAT_API_KEY}`;
    const outputElement = document.getElementById('output');
    const promptInput = document.getElementById('userInput');
    let conversation = [
      { role: "user", content: "너는 친절하고 명확하게 답하는 챗봇이다." }
    ];  
     
async function sendMessage() {
    const msg = userInput.value.trim();
    if (!msg) return;

    const userDiv = document.createElement("div");
    userDiv.className = "user_msg";
    userDiv.textContent = msg;
    chatWindow.appendChild(userDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    userInput.value = "";

    const botDiv = document.createElement("div");
    botDiv.className = "bot_msg";
    botDiv.textContent = "챗봇이 생각 중...";
    chatWindow.appendChild(botDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    conversation.push({ role: "user", content: msg });

    try {
        const response = await fetch(API_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: conversation.map(c => ({
                    role: c.role,
                    parts: [{ text: c.content }]
                })),
                system_instruction:{
                    role:"system",
                    parts:[
                        {
                            text:
                            ` 너는 오직 '요리 레시피' 주제에만 답해야 해.
                            다른 주제(정치, 날씨, 수학 등)는 모두 거절해.
                            사용자가 다른 주제로 물어보면 "이건 제 전문 분야가 아니에요! 
                            레시피에 관련된 질문으로 다시 부탁드립니다." 라고 답해.`,
                        }
                    ]
                }
            })
        });

        if (!response.ok) {
            const errorJson = await response.json();
            botDiv.innerHTML = `API 오류: ${errorJson.error?.message || response.status}`;
            return;
        }

        const reader = response.body
            .pipeThrough(new TextDecoderStream())
            .getReader();

        let finalText = "";

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            const chunk = value.slice(1).trim();
            if (!chunk) continue; 
            const data = JSON.parse(chunk);
            
            const textChunk = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
            finalText += textChunk;

            botDiv.innerHTML = marked.parse(finalText);
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }

        conversation.push({ role: "model", content: finalText });

    } catch (error) {
        botDiv.innerHTML = `오류 발생: ${error.message}`;
        console.error(error);
    }
}
        
$("#sendBtn")[0].addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});