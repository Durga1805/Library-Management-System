import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const generateUserProfilePDF = async (user, profilePic) => {
  const doc = new jsPDF();
  
  // Add header with logo/profile pic
  doc.setFontSize(22);
  doc.setTextColor(44, 62, 80); // Dark blue color
  doc.text('Library Management System', 105, 15, { align: 'center' });
  
  // Add report generation info
  doc.setFontSize(10);
  doc.setTextColor(128, 128, 128); // Gray color
  const now = new Date();
  doc.text(`Report Generated: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`, 105, 22, { align: 'center' });
  
  doc.setFontSize(18);
  doc.setTextColor(44, 62, 80);
  doc.text('User Profile Report', 105, 30, { align: 'center' });

  // Add horizontal line
  doc.setDrawColor(220, 220, 220); // Light gray
  doc.line(20, 35, 190, 35);
  
  if (profilePic) {
    try {
      const img = new Image();
      img.src = profilePic;
      await new Promise((resolve) => {
        img.onload = resolve;
      });
      doc.addImage(img, 'JPEG', 75, 45, 60, 60);
    } catch (error) {
      console.error('Error adding profile picture to PDF:', error);
    }
  }

  // Add user details
  const startY = profilePic ? 120 : 50;
  
  const details = [
    ['Name', user.name],
    ['Email', user.email],
    ['Phone', user.phoneno],
    ['Department', user.dept],
    ['ID', user.userid],
    ['Semester', user.semester],
    ['Address', user.address]
  ];

  doc.autoTable({
    startY,
    head: [['Field', 'Value']],
    body: details,
    theme: 'grid',
    styles: { 
      fontSize: 12,
      cellPadding: 5
    },
    headStyles: {
      fillColor: [44, 62, 80],
      textColor: [255, 255, 255]
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240]
    }
  });

  // Add library history
  if (user.borrowHistory?.length > 0) {
    doc.addPage();
    
    // Add header to new page
    doc.setFontSize(20);
    doc.setTextColor(44, 62, 80);
    doc.text('Library History', 105, 15, { align: 'center' });
    
    // Add generation info to new page
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text(`Report Generated: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`, 105, 22, { align: 'center' });
    
    // Add horizontal line
    doc.line(20, 25, 190, 25);
    
    const historyData = user.borrowHistory.map(item => [
      new Date(item.issuedDate).toLocaleDateString(),
      item.bookTitle,
      new Date(item.returnDate).toLocaleDateString(),
      item.status
    ]);

    doc.autoTable({
      startY: 35,
      head: [['Issue Date', 'Book', 'Return Date', 'Status']],
      body: historyData,
      theme: 'grid',
      styles: {
        fontSize: 11,
        cellPadding: 5
      },
      headStyles: {
        fillColor: [44, 62, 80],
        textColor: [255, 255, 255]
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      }
    });
  }

  // Add footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Page ${i} of ${pageCount}`,
      105,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }

  doc.save(`${user.name}_profile_${now.toISOString().split('T')[0]}.pdf`);
}; 