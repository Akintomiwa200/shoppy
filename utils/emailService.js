import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, 
    port: process.env.SMTP_PORT, 
    secure: false, // True for port 465, false for 587
    auth: {
        user: process.env.SMTP_USER, 
        pass: process.env.SMTP_PASS
    }
});

const sendMail = async (to, subject, html) => {
    try {
        await transporter.sendMail({
            from: `"arriesshop" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        });
        console.log("✅ Email sent successfully");
    } catch (error) {
        console.error("❌ Error sending email:", error);
        throw new Error("Failed to send email");
    }
};

export default sendMail; // ✅ Export as ES6 module
