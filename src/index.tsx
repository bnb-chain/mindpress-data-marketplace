import { Buffer } from 'buffer';
import ReactDOM from 'react-dom/client';
import App from './App';

window.Buffer = Buffer;
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  // <React.StrictMode>
  <App />,
  // </React.StrictMode>,
);
