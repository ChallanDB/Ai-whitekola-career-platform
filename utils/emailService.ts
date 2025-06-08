// Email service for sending notifications
// In a real app, this would use a service like SendGrid, Mailgun, or Firebase Cloud Functions

export const sendEmail = async (options: {
  to: string;
  subject: string;
  body: string;
  attachments?: Array<{ name: string; content: string; type: string }>;
}): Promise<boolean> => {
  try {
    // In a real app, this would be an API call to your email service
    console.log('Sending email:', options);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demonstration purposes, log the email details
    console.log(`Email sent to: ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Body: ${options.body}`);
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const sendCounselingBookingEmail = async (
  counselorEmail: string,
  bookingDetails: {
    userName: string;
    userEmail: string;
    date: string;
    time: string;
    duration: number;
    notes?: string;
  }
): Promise<boolean> => {
  const { userName, userEmail, date, time, duration, notes } = bookingDetails;
  
  const subject = `New Counseling Session Booking - ${userName}`;
  
  const body = `
    Hello,
    
    A new counseling session has been booked through WhiteKola.
    
    Booking Details:
    - Client: ${userName}
    - Client Email: ${userEmail}
    - Date: ${date}
    - Time: ${time}
    - Duration: ${duration} hour${duration > 1 ? 's' : ''}
    ${notes ? `- Notes: ${notes}` : ''}
    
    Please confirm this booking with the client directly.
    
    Thank you,
    WhiteKola Team
  `;
  
  return sendEmail({
    to: counselorEmail,
    subject,
    body
  });
};