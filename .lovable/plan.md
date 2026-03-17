

# Associação Colo de Mãe — One Page Institucional

## Visão Geral
Site institucional one-page dark-mode premium, seguindo o design brief (deep slate background, yellow accents, modern typography), com animações Framer Motion e conteúdo real da associação.

## Seções

### 1. Header Fixo
- Logo da associação (from `https://colo-de-mae-doacao.lovable.app/assets/logo-CUxqItr0.png`)
- Nav com âncoras: Sobre, Atividades, Equipe, Galeria, Contato
- `backdrop-blur-md`, border bottom sutil, links com hover amarelo
- Menu hamburger no mobile

### 2. Hero Section
- Headline: "Acolhimento que transforma, protagonismo que liberta."
- Subline: "Apoio especializado e comunidade para famílias neurodivergentes."
- CTA amarelo "Conheça nossas Atividades" (scroll para seção)
- Imagem de destaque do site de doação (atividade com crianças)
- Layout 2 colunas no desktop, stacked no mobile
- Staggered fade-in animation

### 3. Seção Sobre (Missão, Visão, Valores)
- Texto institucional extraído do site de doação
- 3 cards com ícones: Missão, Visão, Valores
- Cards com hover border amarelo e fundo sutil

### 4. Seção Atividades (Bento Grid)
- 4 cards interativos: Oficinas de Desenvolvimento, Apoio às Famílias, Inclusão Social, Necessidades Básicas
- Ícones Lucide em amarelo, hover effects com "Saiba mais"
- Animação de entrada staggered

### 5. Seção Equipe
- Grid responsivo com membros (placeholder com nomes/cargos genéricos da associação)
- Fotos das instrutoras/mães do site de doação
- Hover scale effect

### 6. Galeria Multimídia
- Grid 2x4 com todas as fotos disponíveis do site de doação (crianças, atividades, mães)
- Modal de visualização ampliada com AnimatePresence
- Hover scale nas imagens

### 7. Seção Contato
- Formulário simples (nome, email, mensagem) — client-side only
- Links para Instagram, YouTube, Facebook
- Endereço e telefone placeholder

### 8. Footer
- Logo, links de navegação, redes sociais
- Texto de copyright

### 9. Botão Flutuante Instagram
- Ícone fixo no canto inferior direito, link para @colodemaetea

## Design & Técnico
- **Fontes**: Bricolage Grotesque (headings) + Plus Jakarta Sans (body) via Google Fonts
- **Paleta dark**: background `#0F172A`, amarelo `#FACC15`, azul accent `#0EA5E9`
- **Framer Motion** para todas as animações de entrada e hover
- **Scroll suave** com `scroll-behavior: smooth`
- **Responsivo** mobile-first
- **Acessibilidade**: contraste WCAG AA, aria-labels, navegação por teclado

