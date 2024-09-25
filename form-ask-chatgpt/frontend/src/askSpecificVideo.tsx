import React, { useState, FormEvent, ChangeEvent } from 'react';
import axios from 'axios';
import './App.css';

const ChatForm: React.FC = () => {
    const [question, setQuestion] = useState<string>('');
    const [response, setResponse] = useState<string>('');
    const [url, setUrl] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false); // Estado para controlar el spinner
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // Estado para manejar mensajes de error


    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true); // Muestra el spinner cuando comienza la solicitud
        setErrorMessage(null); // Reseteamos el mensaje de error antes de la solicitud

        try {
            const res = await axios.post('http://localhost:3001/ask-video', { question, url });

            // Si la solicitud es exitosa, mostramos la respuesta
            setResponse(res.data.openAIResponse);
        } catch (error: any) {
            // Manejamos diferentes casos de error
            if (error.response && error.response.status === 404) {
                setErrorMessage('La URL proporcionada no coincide con ningún video de TikTok.');
            } else {
                setErrorMessage('Hubo un error al procesar tu solicitud. Inténtalo de nuevo más tarde.');
            }
        } finally {
            setIsLoading(false); // Ocultamos el spinner cuando la solicitud termina
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
                {/* Manejamos el estado de respuesta */}
                <div className="Response" role="textbox" aria-multiline="true">
                    <h2>Respuesta:</h2>
                    <div>
                        {isLoading ? (
                            <div className="spinner"></div> // Muestra el spinner mientras está cargando
                        ) : errorMessage ? (
                            <div className="error-message">{errorMessage}</div> // Muestra el mensaje de error
                        ) : (
                            response.replace(/\\n/g, '\n').split('\n').map((line, index) => (
                                <React.Fragment key={index}>
                                    {line}
                                    <br />
                                </React.Fragment>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default ChatForm;
