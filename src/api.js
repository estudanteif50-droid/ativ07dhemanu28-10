export const BASE_URL = 'http://localhost:3000';

export class ApiError extends Error {
  constructor(status, statusText) {
    super(statusText);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function requisicao(caminho, opcoes = {}) {
  const { headers: headersDaChamada, ...resto } = opcoes;

  const resp = await fetch(BASE_URL + caminho, {
    ...resto, 
    headers: {
      'Content-Type': 'application/json',
      ...headersDaChamada, 
    },
  });

  if (!resp.ok) throw new ApiError(resp.status, resp.statusText); 
  if (resp.status === 204) return null;
  return resp.json();
}

export const apiGet = (caminho, opcoes = {}) =>
  requisicao(caminho, { ...opcoes, method: 'GET' });

export const apiPost = (caminho, dados, opcoes = {}) =>
  requisicao(caminho, { ...opcoes, method: 'POST', body: JSON.stringify(dados) });

export const apiPut = (caminho, dados, opcoes = {}) =>
  requisicao(caminho, { ...opcoes, method: 'PUT', body: JSON.stringify(dados) });

export const apiDelete = (caminho, opcoes = {}) =>
  requisicao(caminho, { ...opcoes, method: 'DELETE' });
