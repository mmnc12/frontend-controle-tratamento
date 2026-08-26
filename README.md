## 📄 **README para o Frontend**

### **`frontend-controle-tratamento/README.md`**

```markdown
# 🖥️ Frontend - Sistema de Controle de Tratamento

Aplicação web moderna para gerenciamento de pacientes com esquistossomose, desenvolvida com React + TypeScript + Tailwind CSS.

---

## 📋 Índice

- [Tecnologias](#tecnologias)
- [Funcionalidades](#funcionalidades)
- [Como Rodar](#como-rodar)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Screenshots](#screenshots)
- [Deploy](#deploy)
- [Licença](#licença)

---

## 🚀 Tecnologias

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| React | v18 | Biblioteca UI |
| TypeScript | v5 | Superset tipado do JavaScript |
| Tailwind CSS | v3 | Framework CSS |
| Vite | v5 | Build tool |
| React Router DOM | v6 | Navegação |
| Axios | - | HTTP Client |
| Recharts | - | Gráficos |
| React Hook Form | - | Formulários |
| Lucide React | - | Ícones |

---

## ✨ Funcionalidades

### 🔐 Autenticação
- Login com JWT
- Proteção de rotas
- Perfis: Admin, Usuário, Visualizador

### 📊 Dashboard
- Estatísticas em tempo real
- Cards com indicadores
- Notificações de revisões atrasadas
- Últimos pacientes cadastrados

### 👥 Gestão de Usuários (Admin)
- Listagem com busca
- Criação, edição e exclusão
- Controle de perfis e status

### 📍 Localidades
- CRUD completo
- Busca por nome/código

### 🏥 PSFs
- CRUD completo
- Busca por nome

### 🩺 Rede Básica
- CRUD completo
- Filtros avançados
- Busca em tempo real (debounce)
- Paginação
- Exportação (CSV, Excel, PDF)

### 🔬 Rotina
- CRUD completo
- Filtros avançados
- Busca em tempo real (debounce)
- Paginação

### 📈 Relatórios
- Gráficos interativos
- Estatísticas consolidadas

### ⚙️ Configurações
- Edição de perfil
- Alteração de senha

### 🔔 Notificações
- Revisões atrasadas
- Badge no sininho

---

## 🛠️ Como Rodar

### Pré-requisitos

- Node.js (v18+)
- npm ou yarn

### Passo a passo

```bash
# 1. Clonar o repositório
git clone https://github.com/seu-usuario/frontend-controle-tratamento.git
cd frontend-controle-tratamento

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env se necessário

# 4. Rodar em desenvolvimento
npm run dev

# 5. Build para produção
npm run build
npm run preview
Variáveis de Ambiente
env
VITE_API_URL=http://localhost:3000/api
📁 Estrutura do Projeto
text
frontend/
├── src/
│   ├── api/
│   │   ├── axiosConfig.ts      # Configuração Axios
│   │   ├── authApi.ts
│   │   ├── localidadeApi.ts
│   │   ├── psfApi.ts
│   │   ├── redeBasicaApi.ts
│   │   ├── rotinaApi.ts
│   │   └── relatorioApi.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Layout.tsx
│   │   ├── ui/
│   │   │   └── Pagination.tsx
│   │   └── tables/
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── hooks/
│   │   └── useAuth.ts
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Localidades.tsx
│   │   ├── PSFs.tsx
│   │   ├── RedeBasica.tsx
│   │   ├── Rotina.tsx
│   │   ├── Relatorios.tsx
│   │   ├── Configuracoes.tsx
│   │   └── Usuarios.tsx
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
├── .env
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
📸 Screenshots
Dashboard
https://via.placeholder.com/800x400?text=Dashboard

Login
https://via.placeholder.com/800x400?text=Login

Rede Básica
https://via.placeholder.com/800x400?text=Rede+Basica

Relatórios
https://via.placeholder.com/800x400?text=Relatorios

🚀 Deploy
Vercel (Recomendado)
bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel
Netlify
bash
# Build
npm run build

# Upload da pasta dist para o Netlify
📄 Licença
MIT

📞 Contato
Autor: Manoel Mecias do Nascimento

Email: mmnc12@gmail.com

