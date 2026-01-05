# TagPerson Web

Aplicação web frontend para gerenciamento de personagens em um sistema de RPG. Construída com **Angular 21** e **Material Design**, oferece uma interface moderna para criação, edição e gerenciamento de personagens com autenticação de usuários.

## 📋 Sobre o Projeto

TagPerson Web é a interface de usuário para o sistema TagPerson, uma plataforma completa de gerenciamento de personagens RPG. A aplicação permite que usuários:

- **Autenticar-se** no sistema
- **Criar e gerenciar** personagens
- **Editar características** e habilidades
- **Visualizar estatísticas** derivadas
- **Gerenciar equipamentos** e perícias
- **Consultar catálogos** de feitiços, habilidades e itens

## 🛠️ Tecnologias

| Tecnologia | Versão | Descrição |
|-----------|--------|-----------|
| **Angular** | 21.0.0 | Framework web moderno |
| **TypeScript** | ~5.9.2 | Linguagem tipada |
| **Angular Material** | 21.0.5 | Componentes UI Material Design |
| **Angular CDK** | 21.0.5 | Componentes e utilidades |
| **RxJS** | ~7.8.0 | Programação reativa |
| **SCSS** | nativo | Pré-processador CSS |
| **Vitest** | 4.0.8 | Framework de testes unitários |

### Gerenciador de Pacotes
- **npm** 10.9.2

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── core/                      # Funcionalidades compartilhadas
│   │   ├── guards/               # Route guards (autenticação, etc)
│   │   ├── models/               # Interfaces e tipos TypeScript
│   │   ├── services/             # Serviços centralizados
│   │   │   ├── api-config.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.interceptor.ts
│   │   │   ├── character-api.service.ts
│   │   │   ├── character-store.service.ts
│   │   │   ├── rules.service.ts
│   │   │   └── storage.service.ts
│   │   └── ...
│   ├── features/                 # Módulos de funcionalidades
│   │   ├── auth/
│   │   │   └── login-page.component.*
│   │   └── characters/
│   │       ├── components/
│   │       └── pages/
│   │           └── character-page.component.*
│   ├── layout/                   # Layout compartilhado
│   │   └── shell/               # Layout principal da aplicação
│   ├── app.ts                    # Root component
│   ├── app.routes.ts            # Rotas da aplicação
│   ├── app.config.ts            # Configuração global
│   ├── app.html                 # Template root
│   └── app.scss                 # Estilos globais
├── index.html                    # HTML principal
├── main.ts                       # Ponto de entrada
└── styles.scss                   # Estilos globais

public/                          # Arquivos estáticos
├── Imagens/
│   ├── Brasao/
│   ├── categoria/
│   ├── ico/
│   ├── Item/
│   ├── Personagem/
│   ├── screenshoot/
│   └── tela/
```

## 🚀 Começando

### Pré-requisitos

- **Node.js** 18+ 
- **npm** 10.9.2
- Backend TagPerson API em execução (porta 5000 por padrão)

### Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/cleversantoro/tagperson-web.git
   cd tagperson-web
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento**
   ```bash
   npm start
   ```
   Ou use o comando Angular CLI diretamente:
   ```bash
   ng serve
   ```

4. **Acesse a aplicação**
   Abra seu navegador e navegue até `http://localhost:4200/`
   
   A aplicação será recarregada automaticamente quando você modificar qualquer arquivo fonte.

## 📝 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm start` | Inicia o servidor de desenvolvimento |
| `npm run build` | Compila o projeto para produção (saída: `dist/`) |
| `npm run watch` | Compila em modo watch com configuração de desenvolvimento |
| `npm test` | Executa testes unitários com Vitest |
| `ng generate component <name>` | Cria novo componente |
| `ng generate service <name>` | Cria novo serviço |

## 🏗️ Arquitetura

### Padrões Utilizados

- **Standalone Components** - Componentes Angular independentes (padrão Angular 21+)
- **Reactive Forms** - Formulários reativos com RxJS
- **Services** - Serviços para lógica de negócio e integração com API
- **Route Guards** - Proteção de rotas com autenticação
- **Interceptors** - Interceptação de requisições HTTP para adicionar tokens
- **State Management** - Gerenciamento de estado com observables

### Serviços Principais

#### `AuthService`
Gerencia autenticação de usuários:
- Login/Logout
- Refresh de tokens
- Verificação de autenticação

#### `CharacterApiService`
Interface com API para operações de personagem:
- Listar personagens
- Criar/Editar personagem
- Buscar detalhes
- Deletar personagem

#### `CharacterStoreService`
Gerenciamento de estado de personagem em cache

#### `RulesService`
Lógica de regras do RPG e cálculo de estatísticas derivadas

#### `StorageService`
Wrapper para LocalStorage com suporte a tipos

### Autenticação

- Usa **JWT (JSON Web Tokens)**
- Token armazenado em LocalStorage
- `AuthInterceptor` adiciona token automaticamente em requisições
- Route Guards protegem páginas autenticadas

## 🎨 Estilos

- **SCSS** para pré-processamento CSS
- **Angular Material Theme** para componentes consistentes
- **Responsive Design** para múltiplos dispositivos
- Configuração Prettier com printWidth de 100 caracteres

## 🧪 Testes

O projeto usa **Vitest** para testes unitários:

```bash
npm test
```

Testes são colocados em arquivos `.spec.ts` ao lado dos componentes/serviços testados.

## 📦 Build para Produção

Para compilar o projeto otimizado para produção:

```bash
npm run build
```

Os artefatos de build serão armazenados no diretório `dist/`. Por padrão, o build de produção otimiza sua aplicação para performance e velocidade com hashing de saída.

**Budgets de tamanho:**
- Bundle inicial: máximo 500kB (warning), 1MB (erro)
- Estilos de componente: máximo 4kB (warning), 8kB (erro)

## 🔗 Integração com Backend

A aplicação se comunica com a **TagPerson API** através de requisições HTTP. Configure a URL da API em:

```typescript
// src/app/core/services/api-config.ts
```

Por padrão, a API é esperada em `http://localhost:5000`

## 📱 Recursos Principais

### Autenticação
- Login com usuário e senha
- Logout seguro
- Persistência de sessão
- Tratamento de erros de autenticação

### Gerenciamento de Personagens
- Lista de personagens do usuário
- Criação de novos personagens
- Edição de características
- Cálculo automático de estatísticas
- Visualização de detalhes

### Lookups
- Catálogo de perícias
- Catálogo de feitiços
- Catálogo de equipamentos
- Catálogo de habilidades

## 🐛 Troubleshooting

### A aplicação não conecta com a API
- Verifique se a TagPerson API está rodando
- Verifique a URL configurada em `api-config.ts`
- Verifique CORS nas configurações da API

### Token expirado
- Faça login novamente
- O token expirado será automaticamente capturado pelo interceptor

### Build falha com erro de budget
- Otimize o bundle reduzindo imports não utilizados
- Divida componentes em lazy-loaded modules

## 📚 Documentação Adicional

- [Angular 21 Documentation](https://angular.io/docs)
- [Angular Material](https://material.angular.io/)
- [RxJS Documentation](https://rxjs.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Contribuindo

1. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
2. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
3. Push para a branch (`git push origin feature/AmazingFeature`)
4. Abra um Pull Request

## 📄 Licença

Verifique o arquivo `LICENSE.txt` no projeto.

## 👥 Autor

**Clever Santoro**
- GitHub: [@cleversantoro](https://github.com/cleversantoro)

---

**Última atualização:** Janeiro 2026
**Versão Angular:** 21.0.4
