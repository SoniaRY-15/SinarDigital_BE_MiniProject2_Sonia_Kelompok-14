const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const listUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({ include: { pets: true } });
    res.json({ users });
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await prisma.user.create({ data: { name, email } });
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const user = await prisma.user.findUnique({
      where: { id },
      include: { pets: true },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

module.exports = { listUsers, createUser, getUserById };
