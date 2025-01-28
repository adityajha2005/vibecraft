"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController"); // Correct import
const router = express_1.default.Router();
// Define routes
router.post('/', userController_1.createUser); // Create a new user
router.get('/:userId', userController_1.getUser); // Fetch user details
exports.default = router;
