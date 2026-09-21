# Pão do Pedro — Cinematic Mobile-First Experience

Protótipo funcional criado a partir do material real do Pão do Pedro e da direção definida no projeto.

## O que está implementado

- experiência **mobile first**;
- abertura temática usando a foto real do corredor do estabelecimento;
- abertura exibida apenas uma vez por sessão;
- handshake simples de carregamento das imagens críticas + timeout de segurança;
- `prefers-reduced-motion` com experiência alternativa sem scroll cinematográfico;
- **Cinematic Image Reel**: sequência fotográfica controlada pelo scroll sem vídeo/WebGL;
- linguagem de arcos derivada da arquitetura real do local;
- botões permanentes de **Cardápio para encomendas** e **Pronta entrega via WhatsApp**;
- status “aberto/fechado” calculado para `America/Sao_Paulo`;
- história, processo, horários, endereço e links comerciais;
- SEO básico + Schema.org `Bakery`;
- imagens WebP/JPEG otimizadas e originais preservados em `assets/source-instagram/`.

## Links comerciais preservados

- Cardápio: `https://paodopedro.com/products`
- WhatsApp atual: `+55 12 98821-5993`
- Instagram: `https://www.instagram.com/paodopedro/`
- Maps: coordenadas atuais do estabelecimento.

## Rodar localmente

Não há dependências, bundler ou build obrigatório.

```bash
python -m http.server 8080
```

Abra `http://localhost:8080`.

Também funciona em hosts estáticos como Vercel, Netlify e GitHub Pages.

## Estrutura

```text
index.html
styles.css
app.js
assets/
  brand/
  images/            # imagens otimizadas usadas pelo site
  source-instagram/  # material original enviado
```

## Observação de qualidade

Os arquivos recebidos são exportações/prints do Instagram, em sua maioria com ~700 px de largura. O layout foi deliberadamente mobile-first e limita a largura visual das fotografias em desktop para não forçar upscale excessivo. Quando os arquivos originais de câmera/fotógrafo estiverem disponíveis, basta substituir as imagens mantendo os mesmos nomes/razões.
