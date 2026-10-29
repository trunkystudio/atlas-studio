import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.jsx';
import './style.css';
import './atlas.css';
import './studio.css';
import './studio-pro.css';
import 'katex/dist/katex.min.css';
createRoot(document.getElementById('root')).render(<App/>);

