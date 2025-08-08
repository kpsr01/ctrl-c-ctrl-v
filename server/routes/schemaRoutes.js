import { Router } from "express";
import { generateSchema, testLlm } from "../controllers/schemaController.js";
import { validateSchemaRequest } from "../middleware/validationMiddleware.js";

const router = Router();

router.post("/generate-schema", validateSchemaRequest, generateSchema);
router.post("/test-llm", testLlm);

export { router as schemaRoutes };
