// backend/routes/schoolRoutes.js
const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const School = require("../models/School");

const router = express.Router();

// ensure upload dir exists (beginner-friendly safety)
const uploadDir = path.join(__dirname, "..", "schoolImages");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// configure multer storage (save to schoolImages with unique name)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const safeName = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, safeName);
  },
});

// simple file filter (accept common image types only)
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error("Invalid file type"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

// POST /api/schools/add  -> create a new school
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    // image filename if provided
    const imageFileName = req.file ? req.file.filename : null;

    // create doc
    const school = await School.create({
      name: req.body.name,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      contact: req.body.contact,
      email_id: req.body.email_id,
      description: req.body.description,
      image: imageFileName,
    });

    return res.status(201).json({ message: "School added", school });
  } catch (err) {
    console.error("Add school error:", err);
    return res.status(400).json({ message: "Validation or save error", error: err.message });
  }
});

// GET /api/schools  -> list all schools
router.get("/", async (_req, res) => {
  try {
    // latest first feels nice
    const schools = await School.find().sort({ createdAt: -1 });
    return res.json(schools);
  } catch (err) {
    console.error("Fetch schools error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// DELETE /api/schools/:id → remove school + image
router.delete("/:id", async (req, res) => {
  try {
    const school = await School.findById(req.params.id);
    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }

    // remove image file if exists
    if (school.image) {
      const imgPath = path.join(__dirname, "..", "schoolImages", school.image);
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      }
    }

    await School.findByIdAndDelete(req.params.id);
    res.json({ message: "School deleted successfully", id: req.params.id });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Error deleting school", error: err.message });
  }
});

// update school details
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const school = await School.findById(req.params.id);
    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }

    // If new image uploaded, replace old one
    if (req.file) {
      const oldImg = school.image;
      school.image = req.file.filename;

      // delete old image if exists
      if (oldImg) {
        const imgPath = path.join(__dirname, "..", "schoolImages", oldImg);
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
      }
    }

    // Update other fields
    school.name = req.body.name || school.name;
    school.address = req.body.address || school.address;
    school.city = req.body.city || school.city;
    school.state = req.body.state || school.state;
    school.contact = req.body.contact || school.contact;
    school.email_id = req.body.email_id || school.email_id;
    school.description = req.body.description || school.description;

    const updated = await school.save();
    res.json({ message: "School updated", school: updated });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Error updating school", error: err.message });
  }
});


module.exports = router;
