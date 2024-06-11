// src/ChatForm.tsx

import React, { useState, FormEvent, ChangeEvent } from 'react';
import axios from 'axios';
import './App.css';

const ChatForm: React.FC = () => {
    const [question, setQuestion] = useState<string>('');
    const [response, setResponse] = useState<string>('');

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const res = await axios.post('http://localhost:3001/ask', { question });
            setResponse(JSON.stringify(res.data, null, 2));
        } catch (error) {
            console.error('Error al llamar a la API:', error);
            setResponse('Error al procesar la solicitud.');
        }
    };

    const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setQuestion(event.target.value);
    };

    return (
        <div>
            <div className="ChatForm">
                <h1>Pregunta a mi TikTok</h1>
                <form onSubmit={handleSubmit}>
                    <textarea
                        placeholder="Escribe tu pregunta aquí..."
                        value={question}
                        onChange={handleInputChange}
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
