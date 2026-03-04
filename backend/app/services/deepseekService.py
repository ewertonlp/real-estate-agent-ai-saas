import os
from openai import AsyncOpenAI
from dotenv import load_dotenv

load_dotenv()

client = AsyncOpenAI(
    api_key=os.getenv("DEEP_SEEK_API_KEY"),
    base_url="https://api.deepseek.com/v1"  # Endpoint da DeepSeek
)

async def generate_content_for_real_estate(prompt: str) -> str:
    """
    Gera conteúdo de texto para corretores de imóveis usando a API DeepSeek.
    """
    try:
        print("--- Chamando a API DeepSeek para gerar conteúdo ---")
        print(f"Prompt enviado para a DeepSeek: {prompt}")

        # Monta as mensagens no formato chat (system + user)
        messages = [
            {
                "role": "system",
                "content": (
                    "Você é um assistente de marketing imobiliário experiente e criativo. "
                    "Seu objetivo é ajudar corretores de imóveis a criar legendas, descrições "
                    "e textos atraentes para redes sociais, sites e anúncios. Adapte o conteúdo "
                    "para a plataforma e público-alvo especificados. Se solicitado, inclua hashtags "
                    "relevantes e eficazes. Seja conciso e direto para plataformas como WhatsApp, "
                    "e mais descritivo para blogs/sites. O foco é sempre atrair potenciais "
                    "compradores e gerar interesse genuíno."
                )
            },
            {
                "role": "user",
                "content": prompt
            }
        ]

        # Faz a chamada assíncrona para a DeepSeek
        response = await client.chat.completions.create(
            model="deepseek-chat",          # Modelo de chat
            messages=messages,
            temperature=0.7,
            max_tokens=500
        )

        # Extrai a resposta gerada
        generated_text = response.choices[0].message.content.strip()
        print(f"Resposta bruta da DeepSeek: {generated_text[:100]}...")
        return generated_text

    except Exception as e:
        print(f"Erro ao gerar conteúdo com DeepSeek: {e}")
        return "Desculpe, não foi possível gerar o conteúdo no momento."