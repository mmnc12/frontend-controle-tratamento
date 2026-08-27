// src/utils/downloadUtils.ts

/**
 * Baixa um arquivo a partir de um Blob
 */
export const downloadFile = (blob: Blob, filename: string): void => {
  // Criar URL do blob
  const url = window.URL.createObjectURL(blob);
  
  // Criar link para download
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  
  // Adicionar ao DOM, clicar e remover
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Liberar URL após o download
  setTimeout(() => {
    window.URL.revokeObjectURL(url);
  }, 1000);
};

/**
 * Baixa um arquivo CSV
 */
export const downloadCSV = (data: Blob, nomeArquivo: string = 'relatorio'): void => {
  const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
  downloadFile(blob, `${nomeArquivo}.csv`);
};

/**
 * Baixa um arquivo Excel (XLSX)
 */
export const downloadExcel = (data: Blob, nomeArquivo: string = 'relatorio'): void => {
  const blob = new Blob([data], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
  downloadFile(blob, `${nomeArquivo}.xlsx`);
};

/**
 * Baixa um arquivo PDF
 */
export const downloadPDF = (data: Blob, nomeArquivo: string = 'relatorio'): void => {
  const blob = new Blob([data], { type: 'application/pdf' });
  downloadFile(blob, `${nomeArquivo}.pdf`);
};