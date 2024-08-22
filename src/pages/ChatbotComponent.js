import React, { useState } from 'react';
import './ChatbotComponent.css';

const ChatbotComponent = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    // 환경 변수에서 API 키 가져오기
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    const apiEndpoint = 'https://api.openai.com/v1/chat/completions';

    const addMessage = (sender, message) => {
        setMessages(prevMessages => [{ sender, message }, ...prevMessages]);
    };

    const fetchAIResponse = async (prompt) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.8,
                max_tokens: 1024,
                top_p: 1,
                frequency_penalty: 0.5,
                presence_penalty: 0.5,
                stop: ["Human"],
            }),
        };

        try {
            const response = await fetch(apiEndpoint, requestOptions);
            const data = await response.json();
            const aiResponse = data.choices[0].message.content;
            return aiResponse;
        } catch (error) {
            console.error('OpenAI API 호출 중 오류 발생:', error);
            return 'OpenAI API 호출 중 오류 발생';
        }
    };

    const handleSend = async () => {
        if (input.trim() === '') return;

        addMessage('나', input);
        const aiResponse = await fetchAIResponse(input);
        addMessage('챗봇', aiResponse);
        setInput('');
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div id="chat-container" className="chat-container">
            <div id="chat-messages" className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className="message">
                        {msg.sender}: {msg.message}
                    </div>
                ))}
            </div>
            <div id="user-input" className="user-input">
                <input
                    type="text"
                    placeholder="메시지를 입력하세요..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="input"
                />
                <button onClick={handleSend} className="button">
                    전송
                </button>
            </div>
        </div>
    );
};

export default ChatbotComponent;
