"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateImageFromPrompt = void 0;
const axios_1 = __importDefault(require("axios"));
const generateImageFromPrompt = async (prompt) => {
    try {
        const response = await axios_1.default.post('https://api.replicate.com/v1/predictions', {
            version: 'your-model-version', // Replace with your model version
            input: { prompt },
        }, {
            headers: {
                Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
            },
        });
        return response.data.output; // TypeScript now knows the type of response.data
    }
    catch (error) {
        console.error('Error generating image:', error);
        throw error;
    }
};
exports.generateImageFromPrompt = generateImageFromPrompt;
