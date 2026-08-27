// src/utils/downloadUtils.ts

export const downloadFile = (blob: Blob, filename: string): void => {
    console.log('📥 downloadFile chamado com:', { filename, size: blob.size, type: blob.type });

    try {
        const url = window.URL.createObjectURL(blob);
        console.log('📥 URL criada:', url);

        const link = document.createElement('a');
        link.href = url;
        link.download = filename;

        document.body.appendChild(link);
        console.log('📥 Link adicionado ao DOM');

        link.click();
        console.log('📥 Click disparado');

        document.body.removeChild(link);
        console.log('📥 Link removido');

        setTimeout(() => {
            window.URL.revokeObjectURL(url);
            console.log('📥 URL revogada');
        }, 1000);
    } catch (error) {
        console.error('❌ Erro no downloadFile:', error);
    }
};

export const downloadPDF = (data: Blob, nomeArquivo: string = 'relatorio'): void => {
    console.log('📥 downloadPDF chamado com:', { nomeArquivo, dataSize: data.size, dataType: data.type });
    const blob = new Blob([data], { type: 'application/pdf' });
    console.log('📥 Novo Blob criado:', { size: blob.size, type: blob.type });
    downloadFile(blob, `${nomeArquivo}.pdf`);
};