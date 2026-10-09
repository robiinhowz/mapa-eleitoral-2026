# Mapa Eleitoral 2026

Crie a interface inicial de um site chamado provisoriamente “Mapa Eleitoral”, em português brasileiro, para visualizar os resultados das eleições presidenciais de 2026.

Nesta etapa, implemente somente o frontend. Não integre APIs, banco de dados, pagamentos ou autenticação ainda.

Requisitos:

- Design moderno, confiável, profissional e responsivo, com prioridade para celulares.

- Cabeçalho com nome do site, navegação e identificação clara de que é uma ferramenta independente.

- Painel principal com percentual de urnas apuradas, total de votos contabilizados e horário ilustrativo da atualização.

- Mapa interativo do Brasil com estados selecionáveis e destaque por região.

- Cards dos candidatos com espaço para foto, nome, partido, votos e percentual.

- Seção para selecionar Norte, Nordeste, Centro-Oeste, Sudeste e Sul.

- Gráfico comparativo de votos por região.

- Área visual de comparação histórica, identificada como recurso Premium por R$ 5, ainda sem pagamento funcional.

- Espaço pequeno e discreto reservado para anúncios, sem cobrir o mapa nem prejudicar a leitura.

- Layout com carregamento leve, hierarquia visual clara, acessibilidade e boa experiência em telas pequenas.

- Criar componentes reutilizáveis para mapa, cards, filtros, gráficos e cabeçalho.

- Não inventar dados apresentados como reais. Se utilizar dados de demonstração para montar a interface, exibir um aviso visível: “Dados fictícios — demonstração visual, não representam a apuração oficial”.

- Não simular conexão com o TSE nem afirmar que os resultados estão sendo atualizados.

- Deixar a estrutura organizada para integrar futuramente uma API própria e o Supabase sem precisar refazer a interface.

Ao terminar, apresente um resumo dos componentes criados e das partes que ainda são apenas visuais.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/cf6e9e25-062a-4780-a3d6-3734795f29e0).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
