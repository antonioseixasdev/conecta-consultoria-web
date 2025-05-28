import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './firebase'; // Esta linha executa o código em firebase.ts

createRoot(document.getElementById("root")!).render(<App />);
