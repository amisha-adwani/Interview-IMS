import * as movementService from '../services/movement.service.js';

export const create = async (req, res) => {
  const { productId, type, quantity } = req.body;
  const movement = await movementService.createMovement(
    productId,
    type,
    quantity,
    req.user?.id
  );
  res.status(201).json({ success: true, data: movement });
};

export const list = async (req, res) => {
  const result = await movementService.listMovements(req.query);
  res.json({ success: true, ...result });
};
