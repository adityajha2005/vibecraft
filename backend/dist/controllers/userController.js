"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.createUser = void 0;
const database_1 = __importDefault(require("../config/database"));
// Create a new user
const createUser = async (req, res) => {
    const { username, email } = req.body;
    try {
        const user = await database_1.default.user.create({
            data: { username, email },
        });
        res.status(201).json(user);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
};
exports.createUser = createUser;
// Fetch user details
const getUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await database_1.default.user.findUnique({
            where: { id: userId },
        });
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};
exports.getUser = getUser;
