import { useCallback } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const usePDFGenerator = () => {
  const generatePDF = useCallback(async (elementId: string, filename: string = 'relatorio.pdf') => {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('Elemento não encontrado');
      }

      // Configurações para melhor qualidade
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save the PDF
      pdf.save(filename);
      
      return true;
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      throw error;
    }
  }, []);

  const generateReportsPDF = useCallback(async () => {
    await generatePDF('reports-container', `ranhentos-relatorios-${new Date().toISOString().split('T')[0]}.pdf`);
  }, [generatePDF]);

  return {
    generatePDF,
    generateReportsPDF
  };
};
