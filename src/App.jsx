import { useState } from 'react';
import { apiGet, apiPost } from './api';
import Usuarios from './components/Usuarios';

apiGet('/users').then(console.log);

export default function App() {
  const [mostrar, setMostrar] = useState(true);

  function testarHeader() {
    apiPost('/users', { name: 'Teste', email: 'teste@email.com' }, { headers: { 'X-Custom': 'aula07' } });
  }

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <button onClick={() => setMostrar(!mostrar)}>
        {mostrar ? 'Desmontar' : 'Montar'} componente
      </button>{' '}
      <button onClick={testarHeader}>Testar header X-Custom</button>

      {mostrar && <Usuarios />}
    </div>
  );
}
