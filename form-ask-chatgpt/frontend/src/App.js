// src/ChatForm.js

import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function ChatForm() {
    const [question, setQuestion] = useState('');
    const [response, setResponse] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const res = await axios.post('http://localhost:3001/ask', { question });
            setResponse(JSON.stringify(res.data, null, 2));
        } catch (error) {
            console.error('Error al llamar a la API:', error);
            setResponse('Error al procesar la solicitud.');
        }
    };

    return (
        <div>
            <div className="ChatForm">
                <h1>Pregunta a mi TikTok</h1>
                <form onSubmit={handleSubmit}>
                    <textarea
                        placeholder="Escribe tu pregunta aquí..."
                        value={question}
                        onChange={e => setQuestion(e.target.value)}
                        required
                    />
                    <button type="submit">Hacer pregunta</button>
                </form>
            </div>
            <div className="Response" role="textbox" aria-multiline="true">
                Respuesta: {response}
            </div>
        </div>
    );
}

export default ChatForm;
