// ============================================
// UTILITÁRIOS PARA DATA
// ============================================

/**
 * Converte uma data ISO para o formato YYYY-MM-DD
 * Exemplo: "2026-08-24T03:00:00.000Z" -> "2026-08-24"
 * Exemplo: "2024-01-01" -> "2024-01-01"
 * Exemplo: "01/01/2024" -> "2024-01-01"
 */
export const formatDateToInput = (date: string | null): string => {
  if (!date) return '';
  
  // Se já estiver no formato YYYY-MM-DD, retorna direto
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }
  
  // Se estiver no formato DD/MM/YYYY
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
    const parts = date.split('/');
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  
  try {
    const parsedDate = new Date(date);
    // Verificar se a data é válida
    if (isNaN(parsedDate.getTime())) {
      return '';
    }
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const day = String(parsedDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
    return '';
  }
};

/**
 * Verifica se uma string é uma data válida
 */
export const isValidDate = (date: string): boolean => {
  if (!date) return false;
  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime());
};

/**
 * Formata uma data para exibição (DD/MM/YYYY)
 */
export const formatDateToDisplay = (date: string | null): string => {
  if (!date) return '-';
  try {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return '-';
    return parsedDate.toLocaleDateString('pt-BR');
  } catch {
    return '-';
  }
};