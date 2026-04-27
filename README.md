# TaskFlow App

Aplicativo mobile desenvolvido em React Native para gerenciamento de tarefas pessoais, com foco em organização, produtividade e aplicação de boas práticas de desenvolvimento.

## Funcionalidades

* Login com usuários pré-definidos (admin e user)
* CRUD completo de tarefas
* Filtro por status (pendente, em andamento, concluída)
* Persistência de dados com AsyncStorage
* Tema claro e escuro com alternância
* Consumo de API para exibição de frase motivacional
* Controle de permissões por tipo de usuário:

  * Admin pode criar, editar e excluir tarefas
  * User pode criar tarefas e editar apenas o status

## Tecnologias Utilizadas

* React Native
* Expo
* TypeScript
* React Navigation (Stack e Bottom Tabs)
* AsyncStorage
* Context API
* Fetch API

## Arquitetura

O projeto segue separação de responsabilidades:

* components: componentes reutilizáveis
* screens: telas da aplicação
* context: gerenciamento de estado global
* services: integração com API e armazenamento
* hooks: lógica reutilizável
* types: tipagens com TypeScript
* utils: funções auxiliares

## Objetivo

Aplicar conceitos fundamentais de desenvolvimento mobile, incluindo:

* Context API
* Navegação entre telas
* Persistência de dados local
* Consumo de API
* Tipagem com TypeScript
* Componentização e organização modular

## Vídeo de Demonstração

Link do vídeo:
(inserir link aqui)

## Integrantes

- Guilherme Barbiero — RM555185
- Marco Antonio Gonçalves — RM556818
- Vinicius Castro — RM556137
- Camila Mie Takara — RM555418
- Matheus Cantiere — RM558479

## Observações

O projeto atende aos requisitos propostos, incluindo navegação com Stack e Tabs, uso de Context API, CRUD com persistência local, consumo de API e interface organizada com suporte a tema dinâmico.
