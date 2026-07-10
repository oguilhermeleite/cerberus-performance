# Cerberus Performance

Painel de performance de campanhas para **lojas de moda** — protótipo de conceito para a
[Cerberus Assessoria](https://instagram.com/cerberus.assessoria).

> ⚠️ **Todos os dados são fictícios.** O objetivo é demonstrar o potencial de uma
> ferramenta interna que automatiza o acompanhamento de resultados dos clientes.

## A ideia

Uma assessoria focada em ROI gasta muito tempo montando relatório manual todo mês. Este
painel transforma isso em algo vivo: o cliente abre um link e vê o resultado da campanha em
tempo real, com uma leitura inteligente dos números em vez de uma planilha crua.

## O que tem aqui

**Central da carteira** (tela inicial) — visão de todos os clientes em cards de status
verde/amarelo/vermelho, ordenados por prioridade de atenção. Pensada para escala: quem
gerencia dezenas de contas não consegue abrir relatório manual de cada uma.

- **KPIs agregados** da carteira: faturamento total, investimento, ROAS médio, quantas no alvo
- **Filtro** por status (todas / atenção / no alvo) e **pacing de meta** por loja
- Clique em qualquer loja para abrir o **painel detalhado**:
  - KPIs com variação vs. período anterior — faturamento, ROAS, investimento, vendas
  - Faturamento × Investimento em série temporal (30 / 90 dias / 12 meses)
  - Funil de conversão com taxa entre etapas
  - ROAS por canal (Meta Ads, Google, orgânico, influencers)
  - **Cerberus Intelligence** — leitura automática dos dados em português, com opção de
    aprofundar usando a API da Claude
  - Exportar relatório em PDF

## Stack

React 18 · Vite · Recharts · lucide-react — identidade visual em preto + laranja Cerberus.

## Rodando local

```bash
npm install
npm run dev
```

## Sobre a análise por IA

O botão *"Aprofundar com IA"* funciona em ambiente de preview. Para produção (deploy no
Vercel), a chamada deve passar por uma **rota serverless** que guarda a chave da API no
backend — nunca no front. A leitura automática dos dados funciona 100% offline, então a
demonstração nunca depende da IA para ter valor.

---

Construído por **Guilherme** como proposta de ferramenta interna.
