"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createArtwork = exports.updateArtwork = exports.getArtworksByUser = exports.saveArtwork = void 0;
const database_1 = __importDefault(require("../config/database"));
// Save generated artwork
const saveArtwork = async (req, res) => {
    const { title, image, userId } = req.body;
    try {
        const artwork = await database_1.default.artwork.create({
            data: { title, image, userId },
        });
        res.status(201).json(artwork);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to save artwork' });
    }
};
exports.saveArtwork = saveArtwork;
// Fetch all artworks for a user
const getArtworksByUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const artworks = await database_1.default.artwork.findMany({
            where: { userId },
        });
        res.status(200).json(artworks);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch artworks' });
    }
};
exports.getArtworksByUser = getArtworksByUser;
// Update artwork
const updateArtwork = async (req, res) => {
    const { id } = req.params;
    const { title, image, userId, enhancedImage, variations } = req.body;
    try {
        const artwork = await database_1.default.artwork.update({
            where: { id },
            data: { title, image, userId, enhancedImage, variations },
        });
        res.status(200).json(artwork);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update artwork' });
    }
};
exports.updateArtwork = updateArtwork;
const createArtwork = async (req, res) => {
    const { title, image, userId, enhancedImage, variations } = req.body;
    try {
        const artwork = await database_1.default.artwork.create({
            data: {
                title,
                image,
                userId,
                enhancedImage, // Optional field
                variations, // Optional field
            },
        });
        res.status(201).json(artwork);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create artwork' });
    }
};
exports.createArtwork = createArtwork;
