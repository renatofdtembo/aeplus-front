import axios from "axios";
import { rtalert } from "../hooks/rtalert";

// Base config
axios.defaults.baseURL = import.meta.env.VITE_API_URL;

// 👉 Interceptor para adicionar o token em todas as requisições
axios.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const apiRequest = async (method: string, url: string, data: any = null) => {
  try {
    const config: any = {
      method,
      url,
      data,
      withCredentials: true, // garante que cookies sejam enviados se usados
    };
    
    if((sessionStorage.getItem("auth_token") == null || sessionStorage.getItem("auth_token") == '') && url.indexOf('me') > -1 ){
      rtalert.alert("Faça login para acessar o sistema, informando o usuário e a paalavra passe.", 'top-right', 8000);
      return;
    }
    // Define cabeçalhos para JSON (caso não seja FormData)
    if (!(data instanceof FormData)) {
      config.headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
    }
    
    const response = await axios(config);
    return response.data;

  } catch (error: any) {
    let mensagem = 'Erro desconhecido';
    console.log('Erro desconhecido', error)
    if (axios.isAxiosError(error)) {
      const resposta = error.response;

      if (resposta?.data?.mensagem) {
        mensagem = resposta.data.mensagem;
      } else if (resposta?.data?.erro) {
        mensagem = resposta.data.erro;
      } else if (resposta?.data?.message) {
        mensagem = resposta.data.message;
      } else if (resposta?.data?.error) {
        mensagem = resposta.data.error;
      }

      // Tratamento especial para tokens expirados ou ausentes
      if (mensagem.includes('Token inválido') || mensagem.includes('Token expirado')) {
        await rtalert.error("Sua sessão expirou", 'top-right', 8000);
        localStorage.clear();
        sessionStorage.clear();
        setTimeout(() => {
          document.location.href = '/signin';
        }, 3000);
        return;
      }

      if (mensagem.includes('Token ausente')) {
        await rtalert.error("Token não foi enviado. Faça login novamente.", 'top-right');
        localStorage.clear();
        return;
      }
    }

    await rtalert.alert(mensagem, 'top-right');
    return Promise.reject(new Error(mensagem));// lança erro para quem chamou, se necessário
  }
};

export const getCapa = (capajson: string) => {
  if (capajson === "" || capajson === null) return "/assets/aeplus/defaultcourse.png";
  let capa = JSON.parse(capajson)
  return `${import.meta.env.VITE_API_URL}${capa.url}`;
}