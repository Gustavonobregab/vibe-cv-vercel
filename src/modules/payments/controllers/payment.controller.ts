import { Request, Response } from "express";
import paymentService from "../services/payment.service";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../../../shared/validators/validate-schema";
import {
  createPaymentSchema,
  updatePaymentSchema,
  getPaymentByIdSchema,
  getPaymentsByCurriculumIdSchema,
} from "../zodSchemas/payment.schema";
import { paginationSchema } from "../../../shared/zodSchemas/common.schema";
import { HttpStatus } from "../../../shared/errors/http-status";
import {
  InsufficientPermissionsException,
  InvalidInputException,
  NotFoundException,
} from "../../../shared/errors/http-exception";
import curriculumService from "../../curriculums/services/curriculum.service";

/**
 * Create a new payment
 */
const createPayment = async (req: Request, res: Response) => {
  const validatedData = validateBody(req).with(createPaymentSchema);

  // Verify that the curriculum belongs to the current user
  await curriculumService.getById(validatedData.curriculumId, req.user!.id);

  const payment = await paymentService.create(validatedData);
  res.status(HttpStatus.CREATED).json(payment);
};

/**
 * Get a payment by ID
 */
const getPaymentById = async (req: Request, res: Response) => {
  const { id } = validateParams(req).with(getPaymentByIdSchema);
  const payment = await paymentService.getById(id);

  // Get the curriculum to check ownership
  await curriculumService.getById(payment.curriculumId, req.user!.id);

  res.status(HttpStatus.OK).json(payment);
};

/**
 * Update a payment
 */
const updatePayment = async (req: Request, res: Response) => {
  const { id } = validateParams(req).with(getPaymentByIdSchema);
  const validatedData = validateBody(req).with(updatePaymentSchema);

  // Get existing payment
  const existingPayment = await paymentService.getById(id);

  // Get the curriculum to check ownership
  await curriculumService.getById(existingPayment.curriculumId, req.user!.id);

  const payment = await paymentService.update(id, validatedData);
  res.status(HttpStatus.OK).json(payment);
};

/**
 * Get payments by curriculum ID
 */
const getPaymentsByCurriculumId = async (req: Request, res: Response) => {
  const { curriculumId } = validateParams(req).with(
    getPaymentsByCurriculumIdSchema
  );

  // Get the curriculum to check ownership
  await curriculumService.getById(curriculumId, req.user!.id);

  const payments = await paymentService.getByCurriculumId(curriculumId);
  res.status(HttpStatus.OK).json(payments);
};

/**
 * Get paginated payments
 */
const getPaymentsPaginated = async (req: Request, res: Response) => {
  // This endpoint should be admin-only in a production environment
  // For now, we're assuming only admins can list all payments

  const { page = 1, limit = 10 } = validateQuery(req).with(paginationSchema);
  const payments = await paymentService.getPaginated({
    page: Number(page),
    limit: Number(limit),
  });
  res.status(HttpStatus.OK).json(payments);
};

export default {
  createPayment,
  getPaymentById,
  updatePayment,
  getPaymentsByCurriculumId,
  getPaymentsPaginated,
};
