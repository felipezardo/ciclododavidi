# Tales from the Loop / Contos do Loop: ficha digital e guia

Site estático (HTML + CSS + JavaScript puro, módulos ES). Sem build, sem dependências.

## Rodar localmente
Módulos ES não funcionam via `file://`. Use qualquer servidor estático na raiz:

    python3 -m http.server 8080
    # ou: npx serve .

## Deploy
Publique a pasta como está (Vercel, Netlify, GitHub Pages, Cloudflare Pages). Não há etapa de build.

## Estrutura
    index.html
    css/        tokens (cores/tema), base, components, pages, sheet, wizard, dice
    js/
      main.js          roteador por hash (#/, #/sheet/<id>, #/guide/<seção>, #/new)
      i18n.js          idioma (padrão: o do dispositivo), t([en, pt])
      data-types.js    8 arquétipos (textos do livro, EN/PT)  <- edite as traduções aqui
      data-rules.js    atributos, perícias, condições, XP, tabela de chances
      store.js         persistência (localStorage), import/export JSON
      wizard.js        criação guiada (16 passos)
      sheet.js         ficha interativa fiel ao PDF
      dice.js          dados 3D (CSS), forçar, Sorte, Orgulho, histórico
      portrait.js      retrato com arrastar e zoom
      guide.js         guia de regras
      home.js          página inicial
    assets/     ilustrações do livro, logo, emblema, texturas

## Observações
- Textos de jogo são pares `[inglês, português]`. Nomes do cenário usam `{Suécia|EUA}`.
- Dados salvos no navegador (localStorage). Use Exportar para backup.
- Fontes (Jost, EB Garamond) vêm do Google Fonts; há fallbacks locais.
- Projeto privado: arte e texto pertencem a Simon Stålenhag e Free League.

## Sons e atalhos
- Sons gerados em tempo real (Web Audio, sem arquivos). Botão de alto-falante no cabeçalho e no painel de dados; a preferência fica salva. Vibração leve em celulares quando os sons estão ligados.
- Na ficha: `R` rola, `D` abre/fecha o painel de dados, `Esc` fecha.
