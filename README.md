# NeuroForge

Laboratório open-source para aprender redes neurais construindo experimentos reproduzíveis.

## Visão

- Motor didático de redes neurais com NumPy e testes de gradiente.
- Experimentos com métricas e sementes reproduzíveis.
- Interface para visualizar treinamento, pesos e curvas.
- Comparação de modelos e exportação de resultados.

## Desenvolvimento

Cada funcionalidade será implementada em branch própria, submetida por pull request e validada por CI antes de qualquer merge.

## Arquitetura planejada

- `packages/neuroforge-core`: redes neurais e treinamento em Python.
- `apps/web`: laboratório visual em Next.js.
- Infraestrutura externa apenas quando houver necessidade concreta; experimentos locais não exigem banco de dados ou servidor.
