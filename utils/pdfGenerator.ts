import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { CV } from '@/types';
import { shareAsync } from 'expo-sharing';

// Generate HTML content for the CV
const generateCVHtml = (cv: CV): string => {
  const workExperienceHtml = cv.workExperience.map(exp => `
    <div class="section-item">
      <h3>${exp.position} at ${exp.company}</h3>
      <p class="date">${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</p>
      <p>${exp.description}</p>
    </div>
  `).join('');

  const educationHtml = cv.education.map(edu => `
    <div class="section-item">
      <h3>${edu.degree} in ${edu.field}</h3>
      <p>${edu.institution}</p>
      <p class="date">${edu.startDate} - ${edu.current ? 'Present' : edu.endDate}</p>
      ${edu.description ? `<p>${edu.description}</p>` : ''}
    </div>
  `).join('');

  const skillsHtml = cv.skills.map(skill => `
    <span class="skill-tag">${skill}</span>
  `).join('');

  const certificationsHtml = cv.certifications.map(cert => `
    <div class="section-item">
      <h3>${cert.name}</h3>
      <p>${cert.issuer}</p>
      <p class="date">${cert.date}</p>
      ${cert.description ? `<p>${cert.description}</p>` : ''}
    </div>
  `).join('');

  const referencesHtml = cv.references.map(ref => `
    <div class="section-item">
      <h3>${ref.name}</h3>
      <p>${ref.position} at ${ref.company}</p>
      <p>Email: ${ref.email}</p>
      ${ref.phone ? `<p>Phone: ${ref.phone}</p>` : ''}
    </div>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${cv.fullName} - CV</title>
      <style>
        body {
          font-family: 'Helvetica', 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .profile-img {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          object-fit: cover;
          margin: 0 auto 20px;
          display: block;
        }
        h1 {
          color: #4A6FA5;
          margin-bottom: 5px;
        }
        .contact-info {
          margin-bottom: 10px;
        }
        .section {
          margin-bottom: 30px;
        }
        .section-title {
          color: #4A6FA5;
          border-bottom: 2px solid #4A6FA5;
          padding-bottom: 5px;
          margin-bottom: 15px;
        }
        .section-item {
          margin-bottom: 20px;
        }
        .section-item h3 {
          margin-bottom: 5px;
          color: #333;
        }
        .date {
          color: #666;
          font-style: italic;
          margin-bottom: 5px;
        }
        .skill-tag {
          display: inline-block;
          background-color: #f0f4f8;
          padding: 5px 10px;
          margin: 0 5px 5px 0;
          border-radius: 3px;
        }
        .summary {
          margin-bottom: 30px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <img class="profile-img" src="${cv.photoURL}" alt="${cv.fullName}">
        <h1>${cv.fullName}</h1>
        <div class="contact-info">
          <p>Email: ${cv.email} | Phone: ${cv.phone}</p>
          <p>Address: ${cv.address}</p>
        </div>
      </div>
      
      <div class="summary">
        <h2 class="section-title">Professional Summary</h2>
        <p>${cv.summary}</p>
      </div>
      
      <div class="section">
        <h2 class="section-title">Work Experience</h2>
        ${workExperienceHtml}
      </div>
      
      <div class="section">
        <h2 class="section-title">Education</h2>
        ${educationHtml}
      </div>
      
      <div class="section">
        <h2 class="section-title">Skills</h2>
        <div>
          ${skillsHtml}
        </div>
      </div>
      
      ${cv.certifications.length > 0 ? `
        <div class="section">
          <h2 class="section-title">Certifications</h2>
          ${certificationsHtml}
        </div>
      ` : ''}
      
      ${cv.references.length > 0 ? `
        <div class="section">
          <h2 class="section-title">References</h2>
          ${referencesHtml}
        </div>
      ` : ''}
    </body>
    </html>
  `;
};

// Generate and save PDF
export const generatePDF = async (cv: CV): Promise<void> => {
  try {
    const html = generateCVHtml(cv);
    
    if (Platform.OS === 'web') {
      // For web, create a downloadable HTML file
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${cv.fullName.replace(/\s+/g, '_')}_CV.html`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }
    
    // For mobile, use expo-file-system to save HTML
    const fileUri = `${FileSystem.documentDirectory}${cv.fullName.replace(/\s+/g, '_')}_CV.html`;
    
    await FileSystem.writeAsStringAsync(fileUri, html, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    
    // Share the file
    await shareAsync(fileUri, {
      mimeType: 'text/html',
      dialogTitle: 'Download Your CV',
      UTI: 'public.html',
    });
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

// In a real app, you would use a library like react-native-html-to-pdf
// to convert HTML to PDF. For this example, we're using HTML as a simpler alternative.