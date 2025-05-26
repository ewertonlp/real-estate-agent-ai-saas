# backend/app/services/image_generator_service.py

from PIL import Image, ImageDraw, ImageFont
from io import BytesIO
from typing import Literal

# Definindo alguns templates de exemplo
# Para um SaaS real, estes seriam mais sofisticados ou configuráveis
TEMPLATES = {
    "padrao": {
        "text_position": (50, 50),  # Posição (x, y) do texto
        "text_color": (255, 255, 255), # Cor do texto (branco)
        "font_size": 40,
        "max_width_percentage": 0.8, # Porcentagem da largura da imagem para o texto
        "background_overlay_color": (0, 0, 0, 128) # Preto com 50% de opacidade (para contraste)
    },
    "destaque_inferior": {
        "text_position": (50, "bottom-50"), # Posição (x, y) do texto, "bottom-X" para X pixels do fundo
        "text_color": (255, 255, 255),
        "font_size": 50,
        "max_width_percentage": 0.9,
        "background_overlay_color": (0, 0, 0, 150)
    },
    # Adicione mais templates aqui
}

# Caminho para uma fonte padrão (ajuste se precisar de uma fonte específica)
# Se você não tiver uma fonte específica, a PIL usará uma fonte bitmap padrão.
# Você pode baixar uma fonte .ttf e colocá-la em uma pasta como 'fonts/' no backend.
# Ex: FONT_PATH = "backend/fonts/Arial.ttf"
# Para simplificar no início, podemos deixar PIL usar sua fonte padrão.
# Se precisar de texto multilinha com fonte bonita, é recomendável usar um .ttf.
try:
    FONT_PATH = "arial.ttf" # Nome de uma fonte comum no Windows ou que você pode baixar
    ImageFont.truetype(FONT_PATH, 10) # Tenta carregar para verificar
except IOError:
    print(f"Aviso: Fonte '{FONT_PATH}' não encontrada. Usando a fonte padrão da PIL.")
    FONT_PATH = None # Indica para usar a fonte padrão da PIL

async def generate_image_with_text_overlay(
    image_bytes: bytes,
    text_content: str,
    template_name: Literal["padrao", "destaque_inferior"] = "padrao" # Lista dos templates disponíveis
) -> BytesIO:
    """
    Recebe bytes de imagem, texto e um template, e retorna a imagem com o texto sobreposto.
    """
    # Abre a imagem
    image = Image.open(BytesIO(image_bytes)).convert("RGBA") # Converte para RGBA para lidar com transparência
    draw = ImageDraw.Draw(image)

    # Obtém as configurações do template
    template_settings = TEMPLATES.get(template_name, TEMPLATES["padrao"]) # Pega o template ou o padrão

    # Carrega a fonte
    font_size = template_settings["font_size"]
    try:
        if FONT_PATH:
            font = ImageFont.truetype(FONT_PATH, font_size)
        else:
            font = ImageFont.load_default() # Carrega a fonte bitmap padrão da PIL
    except Exception as e:
        print(f"Erro ao carregar a fonte: {e}. Usando a fonte padrão da PIL.")
        font = ImageFont.load_default()


    # Calcula a posição e o tamanho do texto
    img_width, img_height = image.size
    max_text_width = int(img_width * template_settings["max_width_percentage"])

    # Função para quebrar o texto em várias linhas
    def break_text(text, font, max_width):
        lines = []
        words = text.split(' ')
        current_line = []
        for word in words:
            # textbbox é mais preciso que textsize para cálculo de largura de texto
            # textbbox retorna (left, top, right, bottom)
            test_line = ' '.join(current_line + [word])
            bbox = draw.textbbox((0, 0), test_line, font=font)
            line_width = bbox[2] - bbox[0] # Largura calculada

            if line_width <= max_width:
                current_line.append(word)
            else:
                lines.append(' '.join(current_line))
                current_line = [word]
        lines.append(' '.join(current_line))
        return lines

    text_lines = break_text(text_content, font, max_text_width)
    line_height = font_size + 10 # Espaçamento entre linhas

    # Calcula a altura total do bloco de texto
    total_text_height = len(text_lines) * line_height

    # Calcula a posição Y
    y_position_raw = template_settings["text_position"][1]
    if isinstance(y_position_raw, str) and y_position_raw.startswith("bottom-"):
        margin_from_bottom = int(y_position_raw.split('-')[1])
        start_y = img_height - total_text_height - margin_from_bottom
    else:
        start_y = template_settings["text_position"][1]

    # Desenha um overlay de fundo para melhorar a legibilidade do texto
    if template_settings.get("background_overlay_color"):
        overlay_color = template_settings["background_overlay_color"]
        # Criar uma imagem de overlay semi-transparente
        overlay = Image.new('RGBA', image.size, (0,0,0,0))
        draw_overlay = ImageDraw.Draw(overlay)
        # Calcular a caixa de fundo para o texto
        bg_padding = 20 # Padding ao redor do texto no overlay
        bg_x1 = template_settings["text_position"][0] - bg_padding
        bg_y1 = start_y - bg_padding
        bg_x2 = template_settings["text_position"][0] + max_text_width + bg_padding
        bg_y2 = start_y + total_text_height + bg_padding

        draw_overlay.rectangle([bg_x1, bg_y1, bg_x2, bg_y2], fill=overlay_color)
        image = Image.alpha_composite(image, overlay)
        draw = ImageDraw.Draw(image) # Redesenha o objeto Draw na nova imagem composite


    # Adiciona o texto à imagem
    current_y = start_y
    for line in text_lines:
        text_bbox = draw.textbbox((0, 0), line, font=font)
        text_width = text_bbox[2] - text_bbox[0]
        # Centraliza o texto horizontalmente dentro da largura máxima
        start_x = template_settings["text_position"][0] # Posição X inicial
        # start_x = (img_width - text_width) / 2 # Para centralizar completamente
        draw.text((start_x, current_y), line, font=font, fill=template_settings["text_color"])
        current_y += line_height

    # Salva a imagem em um buffer de bytes
    byte_io = BytesIO()
    image.save(byte_io, format="PNG") # Use PNG para manter transparência se houver
    byte_io.seek(0) # Volta ao início do buffer
    return byte_io