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