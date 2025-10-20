const express = require('express');
const router = express.Router();
const branchController = require('../controllers/branchController');
const { validateBranch } = require('../middleware/validation');

// Branch routes
router.get('/', branchController.getBranches);
router.get('/:id', branchController.getBranch);
router.post('/', validateBranch, branchController.createBranch);
router.put('/:id', validateBranch, branchController.updateBranch);
router.delete('/:id', branchController.deleteBranch);

module.exports = router;
