import React, { useState, FormEvent, ChangeEvent } from 'react';
import axios from 'axios';
import './App.css';

const ChatForm: React.FC = () => {
    const [question, setQuestion] = useState<string>('');
    const [response, setResponse] = useState<string>('');
    const [url, setUrl] = useState<string>('');

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const res = await axios.post('http://localhost:3001/ask-video', { question, url });
            setResponse(JSON.stringify(res.data.openAIResponse, null, 2)); // Muestra la respuesta de la API en el estado `response`
        } catch (error) {
            console.error('Error al llamar a la API:', error);
            setResponse('Error al procesar la solicitud.'); // Muestra un mensaje de error en el estado `response`
        }
    };

    const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setQuestion(event.target.value);
    };

    const handleUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
        setUrl(event.target.value);
    };

    return (
        <div className="App">
        <div className="ChatFormContainer">
            <div className="ChatForm">
                <h1>Pregunta a mi TikTok</h1>
                <form onSubmit={handleSubmit}>
                    <textarea
                        placeholder="Escribe tu pregunta aquí..."
                        value={question}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Copia la URL del video de TikTok"
                        value={url}
                        onChange={handleUrlChange}
                        required
                    />
                    <button type="submit">Hacer pregunta al video</button>
                </form>
            </div>
            <div className="Response" role="textbox" aria-multiline="true">
                <h2>Respuesta:</h2>
                <div>
                    {response.replace(/\\n/g, '\n').split('\n').map((line, index) => (
                        <React.Fragment key={index}>
                            {line}
                            <br />
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    </div>
    
    );
}

export default ChatForm;
