import Cookies from "js-cookie";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!BACKEND_URL) {
  console.error("NEXT_PUBLIC_BACKEND_URL is not defined in .env.local");
  throw new Error("Backend URL not configured.");
}


interface LoginResponse {
  access_token: string;
  token_type: string;
}

interface RegisterResponse {
  id: number;
  email: string;
  is_active: boolean;
}

export async function loginUser(
  email: string,
  password: string
): Promise<LoginResponse> {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  const response = await fetch(`${BACKEND_URL}/api/v1/auth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Falha no login.");
  }

  return response.json();
}

export async function registerUser(
  email: string,
  password: string
): Promise<RegisterResponse> {
  const response = await fetch(`${BACKEND_URL}/api/v1/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Falha no registro.");
  }

  return response.json();
}



export async function getCurrentUser(): Promise<UserWithPlan> {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Usuário não autenticado.");
  }
  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Sessão expirada. Por favor, faça login novamente.");
      }
      const errorData = await response.json();
      throw new Error(errorData.detail || "Erro ao carregar dados do usuário.");
    }
    return response.json();
  } catch (error) {
    console.error("Erro de rede ao tentar obter dados do usuário:", error);
    throw error;
  }
}


const getAuthToken = (): string | null => {
  return Cookies.get("access_token") || null;
};


export interface PropertyDetailsInput {
  property_type: string;
  bedrooms?: number;
  bathrooms?: number;
  location: string;
  special_features?: string;
  purpose: string;
  target_audience?: string;
  tone?: string;
  length?: string;
  language?: string;
  property_value?: number;
  condo_fee?: number;
  iptu_value?: number;
}

export interface TextGenerationOutput {
  id: number;
  user_id: number;
  prompt_used: string;
  generated_text: string;
  timestamp: string; 
}

export const generateContent = async (
  propertyDetails: PropertyDetailsInput,
  token: string
): Promise<TextGenerationOutput> => {
  if (!token) {
    throw new Error("Usuário não autenticado. Faça login para gerar conteúdo.");
  }

  try {
    console.log("Dados da requisição enviados:", JSON.stringify(propertyDetails, null, 2)); 
    const response = await fetch(`${BACKEND_URL}/api/v1/generate-content`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(propertyDetails),
    });

   if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro na resposta do backend:", errorData);
      if (response.status === 401) {
        throw new Error("Sessão expirada. Por favor, faça login novamente.");
      }
      
      let errorMessage = "Erro desconhecido ao gerar conteúdo.";
      if (errorData && typeof errorData === 'object' && errorData.detail) {
          if (Array.isArray(errorData.detail)) {
              errorMessage = errorData.detail.map((err: any) => `${err.loc.join('.')} - ${err.msg}`).join('; ');
          } else {
              errorMessage = errorData.detail;
          }
      }
      throw new Error(errorMessage);
    }

    const data: TextGenerationOutput = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao chamar a API do backend:", error);
    throw error;
  }
}

export async function saveGeneratedContent(
  promptUsed: string,
  generatedText: string
): Promise<void> {
  const token = getAuthToken();
  if (!token) {
    console.warn(
      "Tentativa de salvar conteúdo sem autenticação. Ignorando salvamento."
    );
    return;
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/history/contents/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        prompt_used: promptUsed,
        generated_text: generatedText,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro ao salvar conteúdo no histórico:", errorData);
    } else {
      console.log("Conteúdo salvo no histórico com sucesso!");
    }
  } catch (error) {
    console.error("Erro de rede ao tentar salvar conteúdo:", error);
  }
}

export interface GeneratedContentItem {
  id: number;
  prompt_used: string;
  generated_text: string;
  owner_id: number;
  created_at: string;
  is_favorite: boolean; 
}

export async function getGeneratedContentHistory(
  isFavorite: boolean | null = null, 
  searchQuery: string | null = null, 
  startDate: string | null = null, 
  endDate: string | null = null
): Promise<GeneratedContentItem[]> {
  const token = getAuthToken();
  if (!token) {
    throw new Error(
      "Usuário não autenticado. Faça login para ver o histórico."
    );
  }

  const queryParams = new URLSearchParams();
  if (isFavorite !== null) {
    queryParams.append("is_favorite", isFavorite.toString()); //
  }
  if (searchQuery) {
    queryParams.append("search_query", searchQuery); //
  }
  if (startDate) {
    queryParams.append("start_date", startDate); //
  }
  if (endDate) {
    queryParams.append("end_date", endDate); //
  }

  const url = `${BACKEND_URL}/api/v1/history/contents/?${queryParams.toString()}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro ao obter histórico do backend:", errorData);
      if (response.status === 401) {
        throw new Error("Sessão expirada. Por favor, faça login novamente.");
      }
      throw new Error(errorData.detail || "Erro ao carregar histórico.");
    }

    return response.json();
  } catch (error) {
    console.error("Erro de rede ao tentar obter histórico:", error);
    throw error;
  }
}

export async function toggleFavoriteStatus(
  contentId: number,
  isFavorite: boolean
): Promise<GeneratedContentItem> {
  const token = getAuthToken();
  if (!token) {
    throw new Error(
      "Usuário não autenticado. Faça login para marcar como favorito."
    );
  }

  try {
    const response = await fetch(
      `${BACKEND_URL}/api/v1/history/contents/${contentId}/favorite`,
      {
        method: "PATCH", 
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_favorite: isFavorite }), 
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro ao alternar favorito no backend:", errorData);
      if (response.status === 401) {
        throw new Error("Sessão expirada. Por favor, faça login novamente.");
      }
      throw new Error(
        errorData.detail || "Falha ao atualizar status de favorito."
      );
    }

    return response.json(); 
  } catch (error) {
    console.error("Erro de rede ao tentar alternar favorito:", error);
    throw error;
  }
}

export async function changeUserPassword(
  currentPassword: string,
  newPassword: string
): Promise<void> {
  const token = getAuthToken();
  if (!token) {
    throw new Error(
      "Usuário não autenticado. Faça login para alterar a senha."
    );
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/users/me/password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro ao alterar senha no backend:", errorData);
      if (response.status === 401) {
        throw new Error("Sessão expirada. Por favor, faça login novamente.");
      }
      throw new Error(errorData.detail || "Falha ao alterar a senha.");
    }

    console.log("Senha alterada com sucesso via API.");
  } catch (error) {
    console.error("Erro de rede ao tentar alterar senha:", error);
    throw error;
  }
}

export async function generateImageWithTextOverlay(
  imageFile: File,
  textContent: string,
  imageTemplate: string
): Promise<Blob> {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Usuário não autenticado. Faça login para gerar imagens.");
  }

  const formData = new FormData();
  formData.append("image", imageFile);
  formData.append("text", textContent);
  formData.append("template", imageTemplate);

  try {
    const response = await fetch(
      `${BACKEND_URL}/api/v1/images/generate-image`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro na resposta do backend (gerar imagem):", errorData);
      if (response.status === 401) {
        throw new Error("Sessão expirada. Por favor, faça login novamente.");
      }
      throw new Error(errorData.detail || "Erro ao gerar imagem no backend.");
    }

    const imageBlob = await response.blob();
    return imageBlob;
  } catch (error) {
    console.error("Erro de rede ao tentar gerar imagem:", error);
    throw error;
  }
}

interface UserAnalyticsResponse {
  total_generated_content: number;
}

export async function getUserAnalytics(): Promise<UserAnalyticsResponse> {
  const token = getAuthToken();
  if (!token) {
    throw new Error(
      "Usuário não autenticado. Faça login para ver seus analytics."
    );
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/users/me/analytics`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro ao obter analytics do backend:", errorData);
      if (response.status === 401) {
        throw new Error("Sessão expirada. Por favor, faça login novamente.");
      }
      throw new Error(errorData.detail || "Erro ao carregar analytics.");
    }

    return response.json();
  } catch (error) {
    console.error("Erro de rede ao tentar obter analytics:", error);
    throw error;
  }
}

// Interface para um plano de assinatura
export interface SubscriptionPlan {
  id: number;
  name: string;
  description: string | null;
  max_generations: number;
  price_id_stripe: string;
  unit_amount: number | null; 
  currency: string | null; 
  interval: "month" | "year" | null;
  is_active: boolean;
}


export interface UserWithPlan {
  id: number;
  email: string;
  nome: string | null;     
  creci: string | null; 
  is_active: boolean;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_plan_id: number | null;
  subscription_plan: SubscriptionPlan | null;
  content_generations_count: number; // Adicionado
}

// Função para obter todos os planos de assinatura disponíveis
export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Usuário não autenticado. Faça login para ver os planos.");
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/subscriptions/plans`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro ao obter planos do backend:", errorData);
      if (response.status === 401) {
        throw new Error("Sessão expirada. Por favor, faça login novamente.");
      }
      throw new Error(
        errorData.detail || "Erro ao carregar planos de assinatura."
      );
    }

    return response.json();
  } catch (error) {
    console.error("Erro de rede ao tentar obter planos:", error);
    throw error;
  }
}

export async function createStripeCheckoutSession(
  priceId: string
): Promise<{ checkout_url: string }> {
  const token = getAuthToken();
  if (!token) {
    throw new Error(
      "Usuário não autenticado. Faça login para iniciar o pagamento."
    );
  }

  try {
    const response = await fetch(
      `${BACKEND_URL}/api/v1/subscriptions/create-checkout-session/${priceId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro ao criar sessão de checkout:", errorData);
      if (response.status === 401) {
        throw new Error("Sessão expirada. Por favor, faça login novamente.");
      }
      throw new Error(
        errorData.detail || "Erro ao criar sessão de checkout do Stripe."
      );
    }

    return response.json();
  } catch (error) {
    console.error("Erro de rede ao tentar criar sessão de checkout:", error);
    throw error;
  }
}

export interface PromptTemplate {
  id: number;
  name: string;
  template_text: string;
  description: string | null;
  is_premium: boolean;
  created_at: string;
  updated_at: string | null;
}

export async function getPromptTemplates(): Promise<PromptTemplate[]> {
  const token = getAuthToken();
  if (!token) {
    throw new Error(
      "Usuário não autenticado. Faça login para ver os templates."
    );
  }

  try {
    const response = await fetch(
      `${BACKEND_URL}/api/v1/prompt_templates/templates/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro ao obter templates do backend:", errorData);
      if (response.status === 401) {
        throw new Error("Sessão expirada. Por favor, faça login novamente.");
      }
      throw new Error(errorData.detail || "Erro ao carregar templates.");
    }

    return response.json();
  } catch (error) {
    console.error("Erro de rede ao tentar obter templates:", error);
    throw error;
  }
}

export const updateUserInfo = async (email: string, nome: string, creci: string): Promise<any> => {
  const token = Cookies.get("access_token"); 
  
  if (!token) {
    throw new Error('Token de autenticação não encontrado');
  }

  const response = await fetch(`${BACKEND_URL}/api/v1/users/me/update-info`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ email, nome, creci }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Erro ao atualizar informações do usuário');
  }

  return response.json();
};



export async function cancelSubscription(): Promise<{ detail: string }> {
  const token = Cookies.get("access_token");

  if (!token) {
    throw new Error("Usuário não autenticado.");
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/v1/subscriptions/cancel-subscription`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro ao cancelar assinatura:", errorData);
      if (response.status === 401) {
        throw new Error("Sessão expirada. Faça login novamente.");
      }
      throw new Error(errorData.detail || "Erro ao cancelar assinatura.");
    }

    return response.json(); 
  } catch (error) {
    console.error("Erro de rede ao tentar cancelar assinatura:", error);
    throw error;
  }
}