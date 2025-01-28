"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateImage = void 0;
const aiService_1 = require("../services/aiService");
const generateImage = async (req, res) => {
    const { prompt } = req.body;
    try {
        const imageUrl = await (0, aiService_1.generateImageFromPrompt)(prompt);
        res.status(200).json({ imageUrl });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to generate image' });
    }
};
exports.generateImage = generateImage;
