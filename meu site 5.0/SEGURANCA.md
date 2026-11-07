# Segurança do site HULO

## O que foi feito
- **CSP (Content-Security-Policy)** em todas as páginas: só roda script, CSS e imagem do próprio site. Nenhum script externo, nenhum `eval`, nenhum atributo `style=` ou `onclick=` no HTML.
- **Sem dependências de terceiros**: nada de CDN, fontes externas, analytics ou bibliotecas. Não há o que ser comprometido na cadeia de fornecimento.
- **Referrer-Policy: no-referrer** e `rel="noopener noreferrer"` em todo link externo.
- **Anti-clickjacking**: o site se recusa a abrir dentro de iframe de outro endereço.
- **Entradas dos formulários** (contato, agenda, FAQ): limite de tamanho, remoção de caracteres de controle/direção invisíveis e de `<` `>`, tudo enviado com `encodeURIComponent`. Intervalo de 4 s contra clique repetido.
- **Sem `innerHTML` com texto digitado pelo visitante**: a busca do FAQ e os resumos usam `textContent`/nós de texto.
- **Navegação**: a transição de página só aceita caminhos relativos do próprio site (nada de `javascript:` ou URLs externas); o parâmetro `?plano=` é validado contra lista fixa.
- **Rascunho do formulário** agora fica em `sessionStorage` (apaga ao fechar a aba) e é limpo ao enviar. Dados pessoais não ficam gravados no navegador.
- **E-mail** montado por código (dificulta coleta simples por robôs de spam).
- `_headers` (Netlify/Cloudflare Pages) com CSP completa, X-Frame-Options, HSTS, nosniff, Permissions-Policy, COOP/CORP.
- `.well-known/security.txt` com seu contato para denúncias de falha.

## Limites (fale com sinceridade)
- **GitHub Pages não permite cabeçalhos HTTP.** Lá valem as meta tags (CSP, referrer). `frame-ancestors`, HSTS e X-Frame-Options só funcionam com `_headers` em Netlify/Cloudflare Pages ou com um proxy (ex.: Cloudflare gratuito na frente do domínio).
- **WhatsApp e e-mail são públicos por natureza**: quem ver o site consegue o número. Não existe como esconder isso num site estático.
- O envio é pelo WhatsApp do próprio cliente; **não há servidor nem banco de dados** neste projeto, então não há o que vazar do lado do servidor.

## Antes de publicar
1. Use HTTPS (GitHub Pages, Netlify e Cloudflare já ativam).
2. Ative autenticação em dois fatores na conta do GitHub e no e-mail usado no site.
3. Se publicar com domínio próprio, ative DNSSEC e bloqueio de transferência no registrador.
4. Nunca coloque senhas, chaves de API ou tokens neste repositório.
