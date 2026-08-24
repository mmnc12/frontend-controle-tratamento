// ============================================
// TIPOS DE USUÁRIO
// ============================================
export interface Usuario {
    id: number;
    nome: string;
    email: string;
    perfil: 'admin' | 'usuario' | 'visualizador';
    ativo: boolean;
    data_criacao: string;
    ultimo_login: string | null;
}

export interface LoginRequest {
    email: string;
    senha: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        token: string;
        usuario: Usuario;
    };
}

// ============================================
// TIPOS DE LOCALIDADE
// ============================================
export interface Localidade {
    id: number;
    codigo: string;
    nome: string;
    descricao: string | null;
}

export interface LocalidadeRequest {
    codigo: string;
    nome: string;
    descricao?: string;
}

// ============================================
// TIPOS DE PSF
// ============================================
export interface PSF {
    id: number;
    nome: string;
    nome_enfermeira: string | null;
}

export interface PSFRequest {
    nome: string;
    nome_enfermeira?: string;
}

// ============================================
// TIPOS DE REDE BÁSICA
// ============================================
export interface RedeBasica {
    id: number;
    ano: number;
    nome: string;
    psf_id: number;
    localidade_id: number;
    psf_nome?: string;
    localidade_nome?: string;
    quarteirao: string | null;
    numero_imovel: string | null;
    entrega_documento: 'S' | 'N';
    entrega_medicamento: 'S' | 'N';
    data_tratamento: string | null;
    data_revisao: string | null;
    revisao: 'S' | 'N';
    telefone: string | null;
    observacao: string | null;
}

export interface RedeBasicaRequest {
    ano: number;
    nome: string;
    psf_id: number;
    localidade_id: number;
    quarteirao?: string;
    numero_imovel?: string;
    entrega_documento?: 'S' | 'N';
    entrega_medicamento?: 'S' | 'N';
    data_tratamento?: string;
    revisao?: 'S' | 'N';
    telefone?: string;
    observacao?: string;
}

// ============================================
// TIPOS DE ROTINA
// ============================================
export interface Rotina {
    id: number;
    ano: number;
    nome: string;
    numero_amostra: string;
    controle: string | null;
    psf_id: number;
    localidade_id: number;
    psf_nome?: string;
    localidade_nome?: string;
    quarteirao: string | null;
    numero_imovel: string;
    entrega_resultado: 'S' | 'N';
    entrega_documento: 'S' | 'N';
    entrega_medicamento: 'S' | 'N';
    data_tratamento: string | null;
    data_revisao: string | null;
    revisao: 'S' | 'N';
    telefone: string | null;
    observacao: string | null;
}

export interface RotinaRequest {
    ano: number;
    nome: string;
    numero_amostra: string;
    controle?: string;
    psf_id: number;
    localidade_id: number;
    quarteirao?: string;
    numero_imovel: string;
    entrega_resultado?: 'S' | 'N';
    entrega_documento?: 'S' | 'N';
    entrega_medicamento?: 'S' | 'N';
    data_tratamento?: string;
    revisao?: 'S' | 'N';
    telefone?: string;
    observacao?: string;
}

// ============================================
// TIPOS DE FILTROS
// ============================================
export interface FiltrosRedeBasica {
    nome?: string;
    localidade_id?: number | string;
    psf_id?: number | string;
    ano?: number | string;
    data_inicio?: string;
    data_fim?: string;
    tratado?: 'S' | 'N';
    revisao?: 'S' | 'N';
}

export interface FiltrosRotina extends FiltrosRedeBasica {
    numero_amostra?: string;
}

// ============================================
// TIPOS DE RELATÓRIOS
// ============================================
export interface RelatorioFiltros {
    localidade_id?: number | string;
    psf_id?: number | string;
    ano?: number | string;
    tratado?: 'S' | 'N';
    revisao?: 'S' | 'N';
    numero_amostra?: string;
}

// ============================================
// TIPOS DE RESPOSTA DA API
// ============================================
export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
    total?: number;
    filters?: FiltrosRedeBasica | FiltrosRotina;
}

// ============================================
// TIPOS DE ESTATÍSTICAS
// ============================================
export interface DashboardStats {
    totalPacientes: number;
    totalPSFs: number;
    aguardandoTratamento: number;
    tratados: number;
    revisaoPendente: number;
}

// ============================================
// TIPO DE ERRO DA API
// ============================================
export interface ApiError {
    response?: {
        data?: {
            message?: string;
            error?: string;
        };
        status?: number;
    };
    message?: string;
}