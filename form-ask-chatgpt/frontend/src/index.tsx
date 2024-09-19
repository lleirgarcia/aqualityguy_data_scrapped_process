import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './index.css';
import AskSpecificVideo  from './askSpecificVideo';
import AskAllVideos  from './askAllVideo';
import reportWebVitals from './reportWebVitals';
import HomePage from './HomePage';
import { createRoot } from 'react-dom/client';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement!);

root.render(
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/specific-video" element={<AskSpecificVideo />} />
        <Route path="/general" element={<AskAllVideos />} />
      </Routes>
    </Router>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
