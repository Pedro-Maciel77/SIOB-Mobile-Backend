import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Municipality } from "../entities/Municipality";
import { State } from "../entities/State";

export const getMunicipios = async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Municipality);
    const municipios = await repo.find({
      relations: ["state"],
      order: { name: "ASC" }
    });

    res.json(municipios);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar municípios" });
  }
};

export const getMunicipioById = async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Municipality);
    const municipio = await repo.findOne({
      where: { id: Number(req.params.id) },
      relations: ["state"]
    });

    if (!municipio) {
      return res.status(404).json({ error: "Município não encontrado" });
    }

    res.json(municipio);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar município" });
  }
};

export const createMunicipio = async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Municipality);
    const stateRepo = AppDataSource.getRepository(State);

    const { name, stateId } = req.body;

    const state = await stateRepo.findOne({ where: { id: stateId } });
    if (!state) return res.status(404).json({ error: "Estado não encontrado" });

    const municipio = repo.create({ name, state });
    await repo.save(municipio);

    res.status(201).json(municipio);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar município" });
  }
};

export const updateMunicipio = async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Municipality);

    const municipio = await repo.findOne({ where: { id: Number(req.params.id) } });

    if (!municipio) {
      return res.status(404).json({ error: "Município não encontrado" });
    }

    repo.merge(municipio, req.body);
    await repo.save(municipio);

    res.json(municipio);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar município" });
  }
};

export const deleteMunicipio = async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Municipality);
    const municipio = await repo.findOne({ where: { id: Number(req.params.id) } });

    if (!municipio) {
      return res.status(404).json({ error: "Município não encontrado" });
    }

    await repo.remove(municipio);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir município" });
  }
};
