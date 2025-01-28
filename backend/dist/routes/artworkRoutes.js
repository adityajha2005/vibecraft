"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const artworkController_1 = require("../controllers/artworkController");
const router = express_1.default.Router();
// Save artwork
router.post('/', artworkController_1.saveArtwork);
// Fetch artworks for a user
router.get('/user/:userId', artworkController_1.getArtworksByUser);
// Update artwork
router.put('/:id', artworkController_1.updateArtwork);
exports.default = router;
