import { Router } from "express";
import { getStates, getStateById } from "../../controllers/StateController";

const router = Router();

router.get("/estados", getStates);
router.get("/estados/:id", getStateById);

export default router;
