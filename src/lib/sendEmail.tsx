import nodemailer from 'nodemailer';

export async function sendEmail(
   recipientEmail: string,
   resetLink: string
): Promise<boolean> {
   try {
      const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;
      if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) {
         throw new Error('SMTP configuration is missing. Please check your environment variables.');
      }

      const transporter = nodemailer.createTransport({
         host: SMTP_HOST,
         port: Number(SMTP_PORT),
         secure: parseInt(SMTP_PORT, 10) === 465,
         auth: {
            user: SMTP_USER,
            pass: SMTP_PASSWORD,
         },
      });

      const mailOptions = {
         from: `"Universal Tamil Academy" <${SMTP_USER}>`,
         to: recipientEmail,
         subject: 'Password Reset Request',
         html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #000000;">
               <h2 style="color: #000000;">Password Reset Request</h2>
               <p style="color: #000000;">Hello,</p>
               <p style="color: #000000;">
                  We received a request to reset your password. Please click the link
                  below to reset your password:
               </p>
               <a href="${resetLink}"
                  style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #007BFF; text-decoration: none; border-radius: 5px;">
                  Reset Password
               </a>
               <p style="color: #000000;">If you didn’t request this, you can safely ignore this email.</p>
               <p>Thanks, <br />Universal Tamil Academy</p>
            </div>
         `,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);
      return true;
   } catch (error) {
      console.error('Error sending password reset email:', error);
      return false;
   }
}
