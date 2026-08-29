# 🏥 Sistema de Controle de Tratamento - Frontend

Interface web para gerenciamento de pacientes com esquistossomose.

---

## 📋 Índice

- [Tecnologias](#tecnologias)
- [Funcionalidades](#funcionalidades)
- [Como Rodar](#como-rodar)
- [Deploy](#deploy)
- [Credenciais de Teste](#credenciais-de-teste)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Licença](#licença)

---

## 🚀 Tecnologias

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| React | v19 | Framework frontend |
| TypeScript | v5 | Superset tipado do JavaScript |
| TailwindCSS | v3 | Framework CSS |
| Vite | v8 | Build tool |
| React Router | v7 | Roteamento |
| React Hook Form | v7 | Gerenciamento de formulários |
| Recharts | v3 | Gráficos |
| Axios | v1 | Cliente HTTP |
| Lucide React | v0.5 | Ícones |

---

## ✨ Funcionalidades

### 🔐 Autenticação
- Login com JWT
- Controle de perfil (admin, usuario, visualizador)
- Logout
- Proteção de rotas
- Validação de campos no login
- Toast com duração adequada (6 segundos para erros)

### 👥 Gestão de Pacientes
- **Rede Básica**: CRUD completo
- **Rotina**: CRUD completo
- Filtros avançados (ano, localidade, PSF, nome, tratado)
- Paginação (20 itens por página)
- Busca em tempo real por nome
- Validação de datas (não pode ser no futuro)
- Cálculo automático de data de revisão (40 dias após tratamento)
- Indicador visual de revisões atrasadas

### 📍 Gestão de Cadastros
- **Localidades**: CRUD completo
- **PSFs**: CRUD completo
- **Usuários**: CRUD completo (apenas admin)

### 📊 Relatórios
- Download em CSV
- Download em Excel (XLSX)
- Download em PDF
- Filtros aplicáveis aos relatórios
- Layout profissional

### 📈 Dashboard
- Cards com estatísticas em tempo real
- Lista dos últimos pacientes cadastrados
- Notificações de revisões atrasadas
- Indicadores de progresso (percentuais)

### 🔔 Notificações
- Alertas de revisões atrasadas
- Indicador visual no ícone de sino
- Lista de pacientes com revisão atrasada

---

## 🛠️ Como Rodar

### Pré-requisitos

- Node.js (v18+)
- npm ou yarn

### Passo a passo

```bash
# 1. Clonar o repositório
git clone https://github.com/mmnc12/frontend-controle-tratamento.git
cd frontend-controle-tratamento

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com a URL da API

# 4. Rodar em desenvolvimento
npm run dev

# 5. Build para produção
npm run build
npm run preview
🌐 Deploy
Frontend (Vercel)
URL: https://frontend-controle-tratamento.vercel.app

Status: ✅ Produção

Repositório: https://github.com/mmnc12/frontend-controle-tratamento

Backend (Render)
URL: https://backend-controle-tratamento.onrender.com

Status: ✅ Produção

🔐 Credenciais de Teste
Perfil	E-mail	Senha
Administrador	admin@sistema.com	admin123
Usuário	usuario@sistema.com	admin123
📁 Estrutura do Projeto
text
frontend-controle-tratamento/
├── src/
│   ├── api/             # Conexão com a API
│   │   ├── axiosConfig.ts
│   │   ├── authApi.ts
│   │   ├── localidadeApi.ts
│   │   ├── psfApi.ts
│   │   ├── redeBasicaApi.ts
│   │   ├── relatorioApi.ts
│   │   └── rotinaApi.ts
│   ├── components/      # Componentes reutilizáveis
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Layout.tsx
│   │   │   └── Sidebar.tsx
│   │   └── ui/
│   │       └── Pagination.tsx
│   ├── contexts/        # Contextos React
│   │   ├── AuthContext.tsx
│   │   └── AuthContextCore.tsx
│   ├── hooks/           # Hooks customizados
│   │   └── useAuth.ts
│   ├── pages/           # Páginas do sistema
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   ├── Localidades.tsx
│   │   ├── PSFs.tsx
│   │   ├── RedeBasica.tsx
│   │   ├── Relatorios.tsx
│   │   ├── Rotina.tsx
│   │   ├── Usuarios.tsx
│   │   └── Configuracoes.tsx
│   ├── types/           # Tipos TypeScript
│   │   └── index.ts
│   └── utils/           # Utilitários
│       ├── dateUtils.ts
│       ├── errorHandler.ts
│       └── downloadUtils.ts
├── .env.example         # Exemplo de variáveis de ambiente
├── package.json
├── tailwind.config.js
└── tsconfig.json
📄 Licença
MIT © Manoel Mecias do Nascimento

📞 Contato
Contato	Informação
Autor	Manoel Mecias do Nascimento
Email	mmnc12@gmail.com
GitHub	https://github.com/mmnc12
Versão do documento: 1.0.0
Última atualização: 28/08/2026