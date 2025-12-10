import { Router } from "express";
import {
  getMunicipios,
  getMunicipioById,
  createMunicipio,
  updateMunicipio,
  deleteMunicipio,
} from "../../controllers/MunicipioController";

const router = Router();

router.get("/municipios", getMunicipios);
router.get("/municipios/:id", getMunicipioById);
router.post("/municipios", createMunicipio);
router.put("/municipios/:id", updateMunicipio);
router.delete("/municipios/:id", deleteMunicipio);

export default router;
