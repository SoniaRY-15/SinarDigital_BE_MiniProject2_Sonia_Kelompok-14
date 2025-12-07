const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const uploadsDir = path.join(__dirname, "../../uploads");

const listPets = async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const [total, pets] = await Promise.all([
      prisma.pet.count(),
      prisma.pet.findMany({
        skip,
        take: limit,
        include: { owner: true },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    res.json({
      meta: { total, page, limit, pages: Math.ceil(total / limit) },
      pets,
    });
  } catch (err) {
    next(err);
  }
};

const getPetById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const pet = await prisma.pet.findUnique({
      where: { id },
      include: { owner: true },
    });
    if (!pet) return res.status(404).json({ message: "Pet not found" });
    res.json({ pet });
  } catch (err) {
    next(err);
  }
};

const createPet = async (req, res, next) => {
  try {
    const {
      name,
      type,
      reason,
      ageYears = 0,
      ageMonths = 0,
      ownerId,
    } = req.body;
    let imagePath = null;
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    const pet = await prisma.pet.create({
      data: {
        name,
        type,
        reason,
        ageYears: Number(ageYears),
        ageMonths: Number(ageMonths),
        imagePath,
        ownerId: Number(ownerId),
      },
    });

    res.status(201).json({ message: "Pet created", pet });
  } catch (err) {
    next(err);
  }
};

const updatePet = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.pet.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: "Pet not found" });

    // Handle image replacement: hapus file lama jika ada
    if (req.file && existing.imagePath) {
      const oldPath = path.join(__dirname, "../../", existing.imagePath);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const updated = await prisma.pet.update({
      where: { id },
      data: {
        name: req.body.name ?? existing.name,
        type: req.body.type ?? existing.type,
        reason: req.body.reason ?? existing.reason,
        ageYears: Number(req.body.ageYears ?? existing.ageYears),
        ageMonths: Number(req.body.ageMonths ?? existing.ageMonths),
        imagePath: req.file
          ? `/uploads/${req.file.filename}`
          : existing.imagePath,
        ownerId: req.body.ownerId ? Number(req.body.ownerId) : existing.ownerId,
      },
    });

    res.json({ message: "Pet updated", pet: updated });
  } catch (err) {
    next(err);
  }
};

const deletePet = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.pet.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: "Pet not found" });

    // Hapus file gambar jika ada
    if (existing.imagePath) {
      const filePath = path.join(__dirname, "../../", existing.imagePath);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await prisma.pet.delete({ where: { id } });
    res.json({ message: "Pet deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = { listPets, getPetById, createPet, updatePet, deletePet };
