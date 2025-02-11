require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true, // Use true para 465 (SSL) ou false para 587 (TLS)
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false, // Evita erro de certificado SSL
    },
  });

app.post("/enviar-email", async (req, res) => {
  const { nome, email, whatsapp, mensagem } = req.body;

  if (!nome || !email || !whatsapp || !mensagem) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios!" });
  }

  try {
    const info = await transporter.sendMail({
      from: `"${nome}" <${email}>`,
      to: "cafementoria51@gmail.com", // Troque pelo email que receberá as mensagens
      subject: "Nova mensagem do formulário",
      text: `Nome: ${nome}\nE-mail: ${email}\nWhatsApp: ${whatsapp}\n\nMensagem: ${mensagem}`,
    });

    res.json({ success: true, message: "E-mail enviado com sucesso!", info });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
