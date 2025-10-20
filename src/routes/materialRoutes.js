const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');
const { validateMaterial } = require('../middleware/validation');

/**
 * @swagger
 * /api/materials:
 *   get:
 *     summary: Get all materials with pagination
 *     tags: [Materials]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: -createdAt
 *         description: Sort field and order
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [in_stock, low_stock, out_of_stock]
 *         description: Filter by stock status
 *     responses:
 *       200:
 *         description: List of materials retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginationResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', materialController.getMaterials);

/**
 * @swagger
 * /api/materials/{id}:
 *   get:
 *     summary: Get a single material by ID
 *     tags: [Materials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Material ID
 *     responses:
 *       200:
 *         description: Material retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Material'
 *       404:
 *         description: Material not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', materialController.getMaterial);

/**
 * @swagger
 * /api/materials:
 *   post:
 *     summary: Create a new material
 *     tags: [Materials]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - unit
 *               - currentStock
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Corrugated Cardboard"
 *               description:
 *                 type: string
 *                 example: "High-quality corrugated cardboard for box manufacturing"
 *               unit:
 *                 type: string
 *                 enum: [kg, lbs, pcs, m, sqm, liters, sheets, rolls]
 *                 example: "kg"
 *               currentStock:
 *                 type: number
 *                 description: Current stock quantity
 *                 example: 500
 *               price:
 *                 type: number
 *                 description: Price per unit
 *                 example: 2.50
 *               lowStockThreshold:
 *                 type: number
 *                 description: Alert threshold for low stock
 *                 example: 50
 *     responses:
 *       201:
 *         description: Material created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Material'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', validateMaterial, materialController.createMaterial);

/**
 * @swagger
 * /api/materials/{id}:
 *   put:
 *     summary: Update an existing material
 *     tags: [Materials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Material ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               currentStock:
 *                 type: number
 *               price:
 *                 type: number
 *               lowStockThreshold:
 *                 type: number
 *     responses:
 *       200:
 *         description: Material updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Material'
 *       404:
 *         description: Material not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:id', validateMaterial, materialController.updateMaterial);

/**
 * @swagger
 * /api/materials/{id}:
 *   delete:
 *     summary: Delete a material
 *     tags: [Materials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Material ID
 *     responses:
 *       200:
 *         description: Material deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   example: {}
 *       404:
 *         description: Material not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', materialController.deleteMaterial);

module.exports = router;