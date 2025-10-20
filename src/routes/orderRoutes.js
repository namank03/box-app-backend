const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { validateOrder } = require('../middleware/validation');

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders with pagination
 *     tags: [Orders]
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
 *           enum: [New, Confirmed, In Production, Packed, Partially Shipped, Completed, Cancelled]
 *         description: Filter by order status
 *     responses:
 *       200:
 *         description: List of orders retrieved successfully
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
router.get('/', orderController.getOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get a single order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
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
router.get('/:id', orderController.getOrder);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clientId
 *               - deliveryDate
 *               - items
 *             properties:
 *               clientId:
 *                 type: string
 *                 description: Client ID
 *                 example: "65f8a9b2c1d2e3f4a5b6c7d8"
 *               orderDate:
 *                 type: string
 *                 format: date
 *                 description: Order date (defaults to today)
 *                 example: "2024-03-15"
 *               deliveryDate:
 *                 type: string
 *                 format: date
 *                 description: Expected delivery date
 *                 example: "2024-03-25"
 *               priority:
 *                 type: string
 *                 enum: [Low, Medium, High]
 *                 description: Order priority
 *                 default: Medium
 *               orderSource:
 *                 type: string
 *                 description: Order source
 *                 default: Manual
 *               notes:
 *                 type: string
 *                 description: Order notes
 *                 example: "Urgent delivery requested"
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - productName
 *                     - quantity
 *                     - unitPrice
 *                     - totalPrice
 *                   properties:
 *                     productId:
 *                       type: string
 *                       description: Product ID
 *                       example: "65f8a9b2c1d2e3f4a5b6c7db"
 *                     productName:
 *                       type: string
 *                       description: Product name
 *                       example: "Standard Shipping Box - 12x12x12"
 *                     quantity:
 *                       type: number
 *                       description: Order quantity
 *                       example: 100
 *                     unitPrice:
 *                       type: number
 *                       description: Price per unit
 *                       example: 3.99
 *                     totalPrice:
 *                       type: number
 *                       description: Total price for this item
 *                       example: 399.00
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Order'
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
router.post('/', validateOrder, orderController.createOrder);

/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     summary: Update an existing order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deliveryDate:
 *                 type: string
 *                 format: date
 *                 description: Expected delivery date
 *               status:
 *                 type: string
 *                 enum: [New, Confirmed, In Production, Packed, Partially Shipped, Completed, Cancelled]
 *                 description: Order status
 *               priority:
 *                 type: string
 *                 enum: [Low, Medium, High]
 *                 description: Order priority
 *               notes:
 *                 type: string
 *                 description: Order notes
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     productName:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                     unitPrice:
 *                       type: number
 *                     totalPrice:
 *                       type: number
 *     responses:
 *       200:
 *         description: Order updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
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
router.put('/:id', validateOrder, orderController.updateOrder);

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Delete an order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order deleted successfully
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
 *         description: Order not found
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
router.delete('/:id', orderController.deleteOrder);

module.exports = router;