// /workspaces/SIOB-Mobile/backend/src/api/routes/municipio.routes.ts
import { Router } from "express";
import {
  getMunicipios,
  getMunicipioById,
  createMunicipio,
  updateMunicipio,
  deleteMunicipio,
} from "../../controllers/MunicipioController";

const router = Router();

router.get("/", getMunicipios);
router.get("/:id", getMunicipioById);
router.post("/", createMunicipio);
router.put("/:id", updateMunicipio);
router.delete("/:id", deleteMunicipio);

export default router;