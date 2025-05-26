// frontend/src/lib/api.ts
import Cookies from 'js-cookie'; 

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!BACKEND_URL) {
  console.error('NEXT_PUBLIC_BACKEND_URL is not defined in .env.local');
  throw new Error('Backend URL not configured.');
}

// --- Funções de Autenticação ---

interface LoginResponse {
  access_token: string;
  token_type: string;
}

interface RegisterResponse {
  id: number;
  email: string;
  is_active: boolean;
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  const formData = new URLSearchParams();
  formData.append('username', email); // O backend espera 'username' para o email
  formData.append('password', password);

  const response = await fetch(`${BACKEND_URL}/api/v1/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded', // Importante para form_data
    },
    body: formData.toString(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Falha no login.');
  }

  return response.json();
}

export async function registerUser(email: string, password: string): Promise<RegisterResponse> {
  const response = await fetch(`${BACKEND_URL}/api/v1/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Falha no registro.');
  }

  return response.json();
}

// --- Funções de Geração de Conteúdo (AGORA AUTENTICADA) ---

// Função para obter o token JWT do localStorage
const getAuthToken = (): string | null => {
  return Cookies.get('access_token') || null;
};

export async function generateContent(prompt: string): Promise<string> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Usuário não autenticado. Faça login para gerar conteúdo.');
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/generate-text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // ADICIONA O TOKEN DE AUTORIZAÇÃO AQUI
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro na resposta do backend:', errorData);
      // Se for um erro de autenticação (401), pode ser um token expirado
      if (response.status === 401) {
          throw new Error('Sessão expirada. Por favor, faça login novamente.');
      }
      throw new Error(errorData.detail || 'Erro ao gerar conteúdo no backend.');
    }

    const data = await response.json();
    const generatedText = data.generated_content; // Captura o texto gerado

    // --- ADICIONE ESTA LINHA: CHAMADA PARA SALVAR O CONTEÚDO ---
    await saveGeneratedContent(prompt, generatedText);
    // --- FIM DA ADIÇÃO ---
    return data.generated_content;
  } catch (error) {
    console.error('Erro ao chamar a API do backend:', error);
    throw error;
  }
}

export async function saveGeneratedContent(promptUsed: string, generatedText: string): Promise<void> {
  const token = getAuthToken();
  if (!token) {
    // Se não há token, não é possível salvar, mas não lançamos erro fatal aqui
    // A geração principal já tratou a falta de autenticação
    console.warn('Tentativa de salvar conteúdo sem autenticação. Ignorando salvamento.');
    return;
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/history/contents/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        prompt_used: promptUsed, // O prompt que foi enviado para a IA
        generated_text: generatedText, // O texto que a IA retornou
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro ao salvar conteúdo no histórico:', errorData);
      // Aqui você pode adicionar um tratamento específico para 401/403 se quiser
    } else {
      console.log('Conteúdo salvo no histórico com sucesso!');
    }
  } catch (error) {
    console.error('Erro de rede ao tentar salvar conteúdo:', error);
  }
}

// --- NOVA FUNÇÃO: Obter Histórico de Conteúdo ---
interface GeneratedContentItem {
  id: number;
  prompt_used: string;
  generated_text: string;
  owner_id: number;
  created_at: string; // Ou Date, dependendo de como você quer parsear
}

export async function getGeneratedContentHistory(): Promise<GeneratedContentItem[]> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Usuário não autenticado. Faça login para ver o histórico.');
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/history/contents/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro ao obter histórico do backend:', errorData);
      if (response.status === 401) {
          throw new Error('Sessão expirada. Por favor, faça login novamente.');
      }
      throw new Error(errorData.detail || 'Erro ao carregar histórico.');
    }

    return response.json(); // Retorna a lista de itens do histórico
  } catch (error) {
    console.error('Erro de rede ao tentar obter histórico:', error);
    throw error;
  }
}


// --- FUNÇÃO: Alterar Senha do Usuário ---
export async function changeUserPassword(currentPassword: string, newPassword: string): Promise<void> {
    const token = getAuthToken();
    if (!token) {
        throw new Error('Usuário não autenticado. Faça login para alterar a senha.');
    }

    try {
        const response = await fetch(`${BACKEND_URL}/api/v1/users/me/password`, {
            method: 'PUT', // Método PUT para atualização
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                current_password: currentPassword,
                new_password: newPassword,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Erro ao alterar senha no backend:', errorData);
            if (response.status === 401) {
                throw new Error('Sessão expirada. Por favor, faça login novamente.');
            }
            throw new Error(errorData.detail || 'Falha ao alterar a senha.');
        }

        // Se a resposta for OK (200), não precisamos retornar dados específicos, apenas que foi bem-sucedido.
        console.log('Senha alterada com sucesso via API.');

    } catch (error) {
        console.error('Erro de rede ao tentar alterar senha:', error);
        throw error; // Propaga o erro para ser tratado no componente
    }
}

// --- NOVA FUNÇÃO: Gerar Imagem com Overlay de Texto ---
export async function generateImageWithTextOverlay(
  imageFile: File, // Recebe o objeto File do input
  textContent: string,
  imageTemplate: string
): Promise<Blob> { // Retorna um Blob da imagem
  const token = getAuthToken();
  if (!token) {
    throw new Error('Usuário não autenticado. Faça login para gerar imagens.');
  }

  // FormData é usado para enviar arquivos junto com outros dados de formulário
  const formData = new FormData();
  formData.append('image', imageFile); // 'image' deve corresponder ao nome do campo no backend (@File(...))
  formData.append('text', textContent); // 'text' deve corresponder ao nome do campo no backend (@Form(...))
  formData.append('template', imageTemplate); // 'template' deve corresponder ao nome do campo no backend (@Form(...))

  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/images/generate-image`, {
      method: 'POST',
      headers: {
        // NÃO defina 'Content-Type': 'multipart/form-data' manualmente aqui.
        // O navegador fará isso automaticamente e definirá o boundary correto.
        'Authorization': `Bearer ${token}`, // O token ainda é necessário
      },
      body: formData, // Envie o FormData diretamente
    });

    if (!response.ok) {
      const errorData = await response.json(); // Tenta ler como JSON se for um erro do backend
      console.error('Erro na resposta do backend (gerar imagem):', errorData);
      if (response.status === 401) {
          throw new Error('Sessão expirada. Por favor, faça login novamente.');
      }
      throw new Error(errorData.detail || 'Erro ao gerar imagem no backend.');
    }

    // A resposta é um Blob de imagem, não JSON
    const imageBlob = await response.blob();
    return imageBlob; // Retorna o Blob
  } catch (error) {
    console.error('Erro de rede ao tentar gerar imagem:', error);
    throw error;
  }
}