import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { State } from "../entities/State";

export const getStates = async (_: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(State);
    const list = await repo.find({ order: { name: "ASC" } });
    return res.json(list);
  } catch (err) {
    return res.status(500).json({ error: "Erro ao listar estados" });
  }
};

export const getStateById = async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(State);
    const estado = await repo.findOneBy({ id: Number(req.params.id) });

    if (!estado) return res.status(404).json({ error: "Estado não encontrado" });

    return res.json(estado);
  } catch {
    return res.status(500).json({ error: "Erro ao buscar estado" });
  }
};
