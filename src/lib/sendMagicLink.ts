// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export const sendMagicLink = async (email: string, magicLink: string) => {
//   try {
//     if (!process.env.NEXT_PUBLIC_EMAIL_FROM) {
//       throw new Error(
//         "Missing NEXT_PUBLIC_EMAIL_FROM in environment variables"
//       );
//     }

//     console.log("Sending Magic Link to:", email, "URL:", magicLink);

//     await resend.emails.send({
//       from: process.env.NEXT_PUBLIC_EMAIL_FROM!,
//       to: email,
//       subject: "Your Magic Login Link",
//       html: `
//         <p>Click below to sign in:</p>
//         <p><a href="${magicLink}" target="_blank" style="color: blue; font-weight: bold;">Login Now</a></p>
//         <p>This link expires in 15 minutes.</p>
//       `,
//     });

//     console.log("Magic link sent successfully!");
//   } catch (error) {
//     console.error("Error sending magic link:", error);
//   }
// };
import nodemailer from "nodemailer";

export const sendMagicLink = async (email: string, magicLink: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // Change if using Outlook
    auth: {
      user: process.env.EMAIL_USER, // Your personal email
      pass: process.env.EMAIL_PASS, // App password (not your email password)
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Magic Login Link",
    html: `
      <p>Click the link below to log in:</p>
      <p><a href="${magicLink}">${magicLink}</a></p>
      <p>This link expires in 15 minutes.</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending magic link:", error);
    throw new Error("Failed to send email");
  }
};
