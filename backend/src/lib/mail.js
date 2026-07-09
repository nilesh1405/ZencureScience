import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmployeeCredentials = async ({
  email,
  name,
  username,
  password,
}) => {
  try {
    await resend.emails.send({
      from: "Zencure Science <onboarding@resend.dev>",
      to: email,
      subject: "🎉 Welcome to Zencure Science",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Welcome to Zencure Science 🎉</h2>

          <p>Hi <b>${name}</b>,</p>

          <p>Congratulations! We are delighted to have you as a part of the Zencure Science team.</p>

          <p>Your account has been created successfully.</p>

          <hr>

          <h3>Login Credentials</h3>

          <p><b>Username:</b> ${username}</p>
          <p><b>Password:</b> ${password}</p>

          <hr>

          <p>
            <b>Login Here:</b><br>
            <a href="https://zencure-science.vercel.app">
              https://zencure-science.vercel.app
            </a>
          </p>

          <p>
            For security reasons, please change your password after your first login.
          </p>

          <br>

          <p>Best Wishes,</p>

          <h3>Zencure Science Team</h3>
        </div>
      `,
    });

    console.log("Email sent successfully.");
  } catch (err) {
    console.error(err);
  }
};
