import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const generateUserProfilePDF = async (user, profilePic) => {
  const doc = new jsPDF();
  
  // Add header with logo/profile pic
  doc.setFontSize(20);
  doc.text('Profile', 105, 15, { align: 'center' });
  
  if (profilePic) {
    try {
      const img = new Image();
      img.src = profilePic;
      await new Promise((resolve) => {
        img.onload = resolve;
      });
      doc.addImage(img, 'JPEG', 75, 25, 60, 60);
    } catch (error) {
      console.error('Error adding profile picture to PDF:', error);
    }
  }

  // Add user details
  const startY = profilePic ? 100 : 40;
  
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
    styles: { fontSize: 12 }
  });

  // Add library history
  if (user.borrowHistory?.length > 0) {
    doc.addPage();
    doc.text('Library History', 105, 15, { align: 'center' });
    
    const historyData = user.borrowHistory.map(item => [
      new Date(item.issuedDate).toLocaleDateString(),
      item.bookTitle,
      new Date(item.returnDate).toLocaleDateString(),
      item.status
    ]);

    doc.autoTable({
      startY: 30,
      head: [['Issue Date', 'Book', 'Return Date', 'Status']],
      body: historyData,
      theme: 'grid'
    });
  }

  doc.save(`${user.name}_profile.pdf`);
}; 