# Fluxen Frontend

Interface web moderna desenvolvida em React com TypeScript para o sistema de monitoramento de equipamentos Fluxen. O frontend oferece uma experiência de usuário intuitiva com dashboards interativos, gráficos em tempo real e gerenciamento completo de equipamentos e métricas.

## 📋 Índice

- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Executando o Projeto](#-executando-o-projeto)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Arquitetura](#-arquitetura)
- [Funcionalidades](#-funcionalidades)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Deploy](#-deploy)

## 🚀 Tecnologias

- **React 19** - Biblioteca JavaScript para construção de interfaces
- **TypeScript** - Superset JavaScript com tipagem estática
- **Vite** - Build tool moderna e rápida
- **Material-UI (MUI)** - Biblioteca de componentes React
- **Redux Toolkit** - Gerenciamento de estado global
- **React Router** - Roteamento para aplicações React
- **Axios** - Cliente HTTP para requisições à API
- **Chart.js** - Biblioteca para criação de gráficos
- **React Window** - Virtualização de listas grandes
- **Tailwind CSS** - Framework CSS utility-first
- **Date-fns** - Biblioteca para manipulação de datas
- **Firebase** - Integração com serviços Firebase (se aplicável)

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**
- **Git**

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd fluxen-frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente (veja seção [Configuração](#-configuração))

## ⚙️ Configuração

Crie um arquivo `.env` na raiz do projeto (opcional, pois a URL da API está configurada no código):

```env
# URL da API Backend
VITE_API_URL=http://localhost:3000

# URL de produção (já configurada no código como https://api.fluxen.cloud)
# VITE_API_URL=https://api.fluxen.cloud
```

**Nota**: A URL da API está configurada diretamente no arquivo `src/api.ts`. Para desenvolvimento local, você pode alterar temporariamente para `http://localhost:3000`.

## 🏃 Executando o Projeto

### Modo Desenvolvimento

Inicia o servidor de desenvolvimento com hot reload:

```bash
npm run dev
```

O aplicativo estará disponível em: `http://localhost:5173`

### Build para Produção

Compila o projeto para produção:

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

### Preview da Build

Visualiza a build de produção localmente:

```bash
npm run preview
```

### Linting

Executa o linter para verificar problemas no código:

```bash
npm run lint
```

## 📁 Estrutura do Projeto

```
fluxen-frontend/
├── src/
│   ├── api.ts                    # Configuração do Axios e interceptors
│   ├── App.tsx                   # Componente raiz da aplicação
│   ├── main.tsx                  # Ponto de entrada da aplicação
│   ├── routes.tsx                # Definição de rotas
│   ├── theme.ts                  # Tema do Material-UI
│   ├── styles.ts                 # Estilos globais
│   │
│   ├── components/               # Componentes reutilizáveis
│   │   ├── shared/              # Componentes compartilhados (SideMenu, SnackBar, etc.)
│   │   └── ...                  # Outros componentes específicos
│   │
│   ├── pages/                    # Páginas da aplicação
│   │   ├── HomePage.tsx         # Dashboard principal
│   │   ├── LoginPage.tsx        # Página de login
│   │   ├── EquipamentosPage.tsx # Lista de equipamentos
│   │   └── ...                  # Outras páginas
│   │
│   ├── redux/                    # Gerenciamento de estado
│   │   ├── store.ts             # Configuração do Redux store
│   │   └── slices/              # Redux slices (userSlice, etc.)
│   │
│   ├── services/                 # Serviços de API
│   │   ├── equipamentoService.ts
│   │   ├── authService.ts
│   │   └── ...                  # Outros serviços
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAuth.ts
│   │   └── ...                  # Outros hooks
│   │
│   ├── types/                    # Definições de tipos TypeScript
│   │   ├── Usuario.ts
│   │   ├── Equipamento.ts
│   │   └── ...                  # Outros tipos
│   │
│   ├── utils/                    # Funções utilitárias
│   │
│   ├── tables/                   # Componentes de tabelas
│   │
│   └── assets/                   # Imagens, ícones, etc.
│
├── public/                        # Arquivos estáticos públicos
├── dist/                          # Build de produção (gerado)
├── vite.config.ts                 # Configuração do Vite
├── tsconfig.json                  # Configuração do TypeScript
└── package.json                   # Dependências e scripts
```

## 🏗️ Arquitetura

### Padrão de Arquitetura

O projeto segue uma arquitetura baseada em componentes com separação clara de responsabilidades:

```
┌─────────────────────────────────────────┐
│           Pages (Rotas)                  │
│  ┌───────────────────────────────────┐  │
│  │      Components (UI)               │  │
│  │  ┌──────────────────────────────┐  │  │
│  │  │   Services (API Calls)       │  │  │
│  │  └──────────────────────────────┘  │  │
│  │  ┌──────────────────────────────┐  │  │
│  │  │   Redux (State Management)  │  │  │
│  │  └──────────────────────────────┘  │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Fluxo de Dados

1. **Páginas** renderizam componentes e gerenciam o layout
2. **Componentes** interagem com o usuário e fazem chamadas aos serviços
3. **Serviços** fazem requisições HTTP para a API
4. **Redux** gerencia o estado global (usuário autenticado, dados em cache, etc.)
5. **API** (axios) intercepta requisições para adicionar tokens e headers

### Autenticação

- Tokens JWT são armazenados no `localStorage`
- Interceptor do Axios adiciona automaticamente o token nas requisições
- Redirecionamento automático para login em caso de 401
- Estado de autenticação gerenciado pelo Redux

### Roteamento

- Rotas públicas: `/auth`, `/register`, `/forgot-password`, `/reset-password`
- Rotas protegidas: Todas as outras rotas requerem autenticação
- Rotas com permissões: Algumas rotas requerem roles específicas (ADM, Gestor)

## ✨ Funcionalidades

### Autenticação e Autorização
- ✅ Login e registro de usuários
- ✅ Recuperação de senha via email
- ✅ Controle de acesso baseado em roles (ADM, Gestor, Usuário)
- ✅ Proteção de rotas com middleware

### Dashboard
- ✅ Visão geral de equipamentos e métricas
- ✅ Gráficos interativos em tempo real
- ✅ Cards com informações resumidas
- ✅ Filtros por data e equipamento

### Gerenciamento de Equipamentos
- ✅ Listagem de equipamentos com paginação
- ✅ Criação, edição e exclusão de equipamentos
- ✅ Visualização detalhada de cada equipamento
- ✅ Histórico de logs por equipamento
- ✅ Configuração de métricas por equipamento

### Métricas e Monitoramento
- ✅ Visualização de métricas em gráficos
- ✅ Alertas e alarmes configuráveis
- ✅ Histórico de valores
- ✅ Exportação de dados

### Clientes
- ✅ Gerenciamento de clientes (apenas ADM/Gestor)
- ✅ Associação de equipamentos a clientes

### Usuários
- ✅ Gerenciamento de usuários (apenas ADM)
- ✅ Atribuição de perfis e permissões
- ✅ Associação de usuários a clientes

### Notificações
- ✅ Sistema de notificações em tempo real
- ✅ Marcação de notificações como visualizadas
- ✅ Histórico de notificações

### Relatórios
- ✅ Geração de relatórios em PDF
- ✅ Geração de relatórios em Excel
- ✅ Filtros personalizáveis

### Suporte
- ✅ Criação de tickets de suporte
- ✅ Upload de anexos
- ✅ Histórico de tickets

### Anúncios do Sistema
- ✅ Sistema de anúncios/avisos
- ✅ Bloqueio de funcionalidades em contingência
- ✅ Diferentes tipos de anúncios (INFO, CRITICAL, MAINTENANCE, CONTINGENCY)

## 📜 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Build
npm run build        # Compila para produção
npm run preview      # Preview da build de produção

# Qualidade de Código
npm run lint         # Executa o linter
```

## 🚢 Deploy

### Vercel (Recomendado)

O projeto está configurado para deploy na Vercel:

1. Conecte seu repositório à Vercel
2. Configure as variáveis de ambiente (se necessário)
3. O deploy será automático a cada push

### Build Manual

1. Execute o build:
```bash
npm run build
```

2. Os arquivos estáticos estarão na pasta `dist/`

3. Faça upload da pasta `dist/` para seu servidor web (Nginx, Apache, etc.)

### Configuração do Servidor

Exemplo de configuração Nginx:

```nginx
server {
    listen 80;
    server_name seu-dominio.com;
    root /caminho/para/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Variáveis de Ambiente em Produção

Certifique-se de que a URL da API está correta no arquivo `src/api.ts` ou configure via variável de ambiente se necessário.

## 🎨 Customização

### Tema

O tema do Material-UI pode ser customizado em `src/theme.ts`:

```typescript
const theme = createTheme({
  palette: {
    primary: {
      main: '#sua-cor-primaria',
    },
    // ... outras customizações
  },
});
```

### Estilos

- **Material-UI**: Use componentes do MUI e o sistema de tema
- **Tailwind CSS**: Classes utilitárias disponíveis globalmente
- **CSS Modules**: Para estilos específicos de componentes

## 🔒 Segurança

- Tokens JWT armazenados no `localStorage` (considerar migrar para httpOnly cookies em produção)
- Interceptor do Axios valida tokens automaticamente
- Rotas protegidas verificam autenticação antes de renderizar
- Headers de segurança podem ser adicionados via configuração do servidor

## 📱 Responsividade

O aplicativo é totalmente responsivo e funciona em:
- 💻 Desktop
- 📱 Tablet
- 📱 Mobile

## 🐛 Troubleshooting

### Problemas Comuns

**Erro de CORS:**
- Verifique se o backend está configurado para aceitar requisições do frontend
- Confirme a URL da API no arquivo `src/api.ts`

**Token não encontrado:**
- Limpe o `localStorage` e faça login novamente
- Verifique se o token está sendo salvo corretamente após o login

**Página em branco:**
- Verifique o console do navegador para erros
- Confirme que todas as dependências foram instaladas
- Execute `npm run build` para verificar erros de compilação

## 🤝 Contribuindo

1. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
2. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
3. Push para a branch (`git push origin feature/AmazingFeature`)
4. Abra um Pull Request

## 📄 Licença

Este projeto é proprietário e confidencial.

---

**Desenvolvido com ❤️ para Fluxen**
