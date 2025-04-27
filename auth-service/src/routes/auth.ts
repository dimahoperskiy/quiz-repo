import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { config } from "../config";
import { User } from "../models/User";

const router = Router();

type CredentialsType = {
  email: string;
  password: string;
};

// POST /register
router.post("/register", async (req, res) => {
  const { email, password } = req.body as CredentialsType;

  if (!email || !password) {
    res.status(400).json({ error: "Поля отсутсвуют" });
    return;
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      res.status(409).json({ error: "Этот пользователь уже существует" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ email, passwordHash });

    res.json({ message: "Пользователь зарегестрирован" });
  } catch (e) {
    console.error("Ошибка при регистрации:", e);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// POST /login
router.post("/login", async (req, res) => {
  const { email, password } = req.body as CredentialsType;

  try {
    const user = (await User.findOne({ email })) as {
      _id: string;
      email: string;
      passwordHash: string;
    };

    if (!user) {
      res.status(401).json({ error: "Неверные данные" });
      return;
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      res.status(401).json({ error: "Неверные данные" });
      return;
    }

    const signOptions: SignOptions = { expiresIn: "1d" };
    const token = jwt.sign(
      { userId: user._id.toString() },
      config.jwtSecret,
      signOptions,
    );

    res.json({ token });
  } catch (e) {
    console.error("Ошибка при входе:", e);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// GET /me
router.get("/me", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Токен не найден" });
    return;
  }

  const token = authHeader ? authHeader.split(" ")[1] : "";

  try {
    const payload = jwt.verify(token, config.jwtSecret) as { userId: string };

    const user = (await User.findById(payload.userId)) as {
      _id: string;
      email: string;
      passwordHash: string;
    };
    if (!user) {
      res.status(404).json({ error: "Пользователь не найден" });
      return;
    }

    res.json({ id: user._id, email: user.email });
  } catch (e) {
    res.status(401).json({ error: "Неверный токен" });
  }
});

export default router;
