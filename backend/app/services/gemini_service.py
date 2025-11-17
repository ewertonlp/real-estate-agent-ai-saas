# backend/app/services/gemini_service.py

import os
import google.generativeai as genai
from google.generativeai import types
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

async def generate_content_for_real_estate(prompt: str) -> str:
    """
    Gera conteúdo de texto para corretores de imóveis usando a API Gemini.
    """
    try:
        print("--- Chamando a API Gemini para gerar conteúdo ---")
        print(f"Prompt enviado para a Gemini: {prompt}")

        model = genai.GenerativeModel('gemini-2.0-flash')

        # Ajuste a mensagem do sistema para dar mais contexto à IA
        messages = [
            {"role": "user", "parts": [
                {"text": "Você é um assistente de marketing imobiliário experiente e criativo. Seu objetivo é ajudar corretores de imóveis a criar legendas, descrições e textos atraentes para redes sociais, sites e anúncios. Adapte o conteúdo para a plataforma e público-alvo especificados. Se solicitado, inclua hashtags relevantes e eficazes. Seja conciso e direto para plataformas como WhatsApp, e mais descritivo para blogs/sites. O foco é sempre atrair potenciais compradores e gerar interesse genuíno."}
            ]},
            {"role": "user", "parts": [{"text": prompt}]}
        ]

        response = await model.generate_content_async(
            contents=messages,
            generation_config={"temperature": 0.7, "max_output_tokens": 500}
        )
        print(f"Resposta bruta da Gemini: {response.text[:100]}...")
        return response.text.strip()
    except Exception as e:
        print(f"Erro ao gerar conteúdo com Gemini: {e}")
        return "Desculpe, não foi possível gerar o conteúdo no momento."