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
  formData.append('username', email);
  formData.append('password', password);

  const response = await fetch(`${BACKEND_URL}/api/v1/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
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
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro na resposta do backend:', errorData);
      if (response.status === 401) {
          throw new Error('Sessão expirada. Por favor, faça login novamente.');
      }
      throw new Error(errorData.detail || 'Erro ao gerar conteúdo no backend.');
    }

    const data = await response.json();
    const generatedText = data.generated_content;

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
        prompt_used: promptUsed,
        generated_text: generatedText,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro ao salvar conteúdo no histórico:', errorData);
    } else {
      console.log('Conteúdo salvo no histórico com sucesso!');
    }
  } catch (error) {
    console.error('Erro de rede ao tentar salvar conteúdo:', error);
  }
}

// --- NOVA FUNÇÃO: Obter Histórico de Conteúdo com Filtros ---
export interface GeneratedContentItem {
  id: number;
  prompt_used: string;
  generated_text: string;
  owner_id: number;
  created_at: string;
  is_favorite: boolean; // Add this
}

export async function getGeneratedContentHistory(
  isFavorite: boolean | null = null, // New filter parameter
  searchQuery: string | null = null, // New search parameter
  startDate: string | null = null, // New date filter
  endDate: string | null = null // New date filter
): Promise<GeneratedContentItem[]> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Usuário não autenticado. Faça login para ver o histórico.');
  }

  const queryParams = new URLSearchParams();
  if (isFavorite !== null) {
    queryParams.append('is_favorite', isFavorite.toString()); //
  }
  if (searchQuery) {
    queryParams.append('search_query', searchQuery); //
  }
  if (startDate) {
    queryParams.append('start_date', startDate); //
  }
  if (endDate) {
    queryParams.append('end_date', endDate); //
  }

  const url = `${BACKEND_URL}/api/v1/history/contents/?${queryParams.toString()}`;

  try {
    const response = await fetch(url, {
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

    return response.json();
  } catch (error) {
    console.error('Erro de rede ao tentar obter histórico:', error);
    throw error;
  }
}


// --- NOVA FUNÇÃO: Alternar Status de Favorito ---
export async function toggleFavoriteStatus(contentId: number, isFavorite: boolean): Promise<GeneratedContentItem> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Usuário não autenticado. Faça login para marcar como favorito.');
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/history/contents/${contentId}/favorite`, {
      method: 'PATCH', // Use PATCH for partial update
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ is_favorite: isFavorite }), // Send the new status
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro ao alternar favorito no backend:', errorData);
      if (response.status === 401) {
          throw new Error('Sessão expirada. Por favor, faça login novamente.');
      }
      throw new Error(errorData.detail || 'Falha ao atualizar status de favorito.');
    }

    return response.json(); // Return the updated item
  } catch (error) {
    console.error('Erro de rede ao tentar alternar favorito:', error);
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
            method: 'PUT',
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

        console.log('Senha alterada com sucesso via API.');

    } catch (error) {
        console.error('Erro de rede ao tentar alterar senha:', error);
        throw error;
    }
}

// --- NOVA FUNÇÃO: Gerar Imagem com Overlay de Texto ---
export async function generateImageWithTextOverlay(
  imageFile: File,
  textContent: string,
  imageTemplate: string
): Promise<Blob> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Usuário não autenticado. Faça login para gerar imagens.');
  }

  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('text', textContent);
  formData.append('template', imageTemplate);

  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/images/generate-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro na resposta do backend (gerar imagem):', errorData);
      if (response.status === 401) {
          throw new Error('Sessão expirada. Por favor, faça login novamente.');
      }
      throw new Error(errorData.detail || 'Erro ao gerar imagem no backend.');
    }

    const imageBlob = await response.blob();
    return imageBlob;
  } catch (error) {
    console.error('Erro de rede ao tentar gerar imagem:', error);
    throw error;
  }
}


// Interface para o objeto de analytics do usuário
interface UserAnalyticsResponse {
  total_generated_content: number;
}

export async function getUserAnalytics(): Promise<UserAnalyticsResponse> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Usuário não autenticado. Faça login para ver seus analytics.');
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/users/me/analytics`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro ao obter analytics do backend:', errorData);
      if (response.status === 401) {
          throw new Error('Sessão expirada. Por favor, faça login novamente.');
      }
      throw new Error(errorData.detail || 'Erro ao carregar analytics.');
    }

    return response.json();
  } catch (error) {
    console.error('Erro de rede ao tentar obter analytics:', error);
    throw error;
  }
}