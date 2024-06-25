import React, { useState, FormEvent, ChangeEvent } from 'react';
import axios from 'axios';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTiktok, faInstagram, faYoutube, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

config.autoAddCss = false;

const ChatForm: React.FC = () => {
    const [question, setQuestion] = useState<string>('');
    const [response, setResponse] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [videoCount, setVideoCount] = useState<string>('5');

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const res = await axios.post('http://localhost:3001/ask', { question, email, videoCount });
            setResponse(JSON.stringify(res.data, null, 2));
        } catch (error) {
            console.error('Error al llamar a la API:', error);
            setResponse('Error al procesar la solicitud.');
        }
    };

    const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setQuestion(event.target.value);
    };

    const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setVideoCount(event.target.value);
    };

    return (
        <div>
            <div className="ChatForm">
                <h1>Pregunta a mi TikTok</h1>
                <p>El proceso se puede demorar entre varios minutos a varias horas dependiendo de la opción seleccionada, recibirás un email con los datos.</p>
                <form onSubmit={handleSubmit}>
                    <textarea
                        placeholder="Escribe tu pregunta aquí..."
                        value={question}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email donde recibir respuestas..."
                        value={email}
                        onChange={handleEmailChange}
                        required
                    />
                    <select value={videoCount} onChange={handleSelectChange}>
                        <option value="5">5 últimos videos</option>
                        <option value="10">10 últimos videos</option>
                        <option value="30">30 últimos videos</option>
                    </select>
                    <button type="submit">Hacer pregunta</button>
                </form>
                <div className="social-icons">
                    <a href="https://www.tiktok.com/@aqualityguy" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faTiktok} size="2x" />
                    </a>
                    <a href="https://www.instagram.com/aqualityguy" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faInstagram} size="2x" />
                    </a>
                    <a href="https://www.youtube.com/@aqualityguy" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faYoutube} size="2x" />
                    </a>
                    <a href="https://www.linkedin.com/in/lleirgarcia" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faLinkedin} size="2x" />
                    </a>
                </div>
            </div>
            {/* <div className="Response" role="textbox" aria-multiline="true">
                Respuesta: {response}
            </div> */}
        </div>
    );
}

export default ChatForm;
