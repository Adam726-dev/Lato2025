import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      (registration) => {
        console.log('Service Worker zarejestrowany:', registration);
      },
      (error) => {
        console.error('Błąd rejestracji Service Workera:', error);
      }
    );
  });
}

createRoot(document.getElementById("root")!).render(<App />);
