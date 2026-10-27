import { useEffect, useState } from 'react';
import { apiGet, apiPost, apiPut, apiDelete, ApiError } from '../api';

function mensagemDeErro(err) {
  if (err instanceof ApiError) {
    if (err.status === 404) return 'Recurso não encontrado';
    if (err.status === 500) return 'Erro no servidor';
    return 'Erro ' + err.status;
  }
  if (err instanceof TypeError) return 'Falha de rede';
  return 'Erro inesperado';
}

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function carregar() {
      try {
        const dados = await apiGet('/users', { signal: controller.signal });
        setUsuarios(dados);
      } catch (err) {
        if (err.name === 'AbortError') return; 
        setErro(mensagemDeErro(err));
      } finally {
        if (!controller.signal.aborted) setCarregando(false);
      }
    }

    carregar();
    return () => controller.abort();
  }, []);

  async function salvar(e) {
    e.preventDefault();
    setErro('');
    try {
      if (editandoId) {
        const atualizado = await apiPut('/users/' + editandoId, { name: nome, email });
        setUsuarios(usuarios.map((u) => (u.id === editandoId ? atualizado : u)));
      } else {
        const novo = await apiPost('/users', { name: nome, email });
        setUsuarios([...usuarios, novo]);
      }
      setNome('');
      setEmail('');
      setEditandoId(null);
    } catch (err) {
      setErro(mensagemDeErro(err));
    }
  }

  
  async function excluir(id) {
    setErro('');
    try {
      await apiDelete('/users/' + id);
      setUsuarios(usuarios.filter((u) => u.id !== id));
    } catch (err) {
      setErro(mensagemDeErro(err));
    }
  }

  function iniciarEdicao(u) {
    setEditandoId(u.id);
    setNome(u.name);
    setEmail(u.email);
  }

  async function testar404() {
    setErro('');
    try {
      await apiGet('/users/999');
    } catch (err) {
      setErro(mensagemDeErro(err));
    }
  }

  function testar500() {
    setErro(mensagemDeErro(new ApiError(500, 'Internal Server Error')));
  }

  return (
    <div>
      <h2>Usuários</h2>

      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      <form onSubmit={salvar}>
        <input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button type="submit">{editandoId ? 'Salvar edição' : 'Criar'}</button>
      </form>

      {carregando ? (
        <p>Carregando...</p>
      ) : (
        <ul>
          {usuarios.map((u) => (
            <li key={u.id}>
              {u.name} - {u.email}{' '}
              <button onClick={() => iniciarEdicao(u)}>Editar</button>{' '}
              <button onClick={() => excluir(u.id)}>Excluir</button>
            </li>
          ))}
        </ul>
      )}

      <hr />
      <button onClick={testar404}>Testar 404</button>{' '}
      <button onClick={testar500}>Testar 500</button>
    </div>
  );
}
