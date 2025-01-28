"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/eyeTrackingRoutes.ts
const express_1 = __importDefault(require("express"));
const eyeTrackingController_1 = __importDefault(require("../controllers/eyeTrackingController"));
const eyeTrackingService_1 = __importDefault(require("../services/eyeTrackingService"));
const router = express_1.default.Router();
const eyeTrackingService = new eyeTrackingService_1.default();
const eyeTrackingController = new eyeTrackingController_1.default(eyeTrackingService);
// Routes
router.post('/start', eyeTrackingController.startTracking);
router.post('/stop', eyeTrackingController.stopTracking);
router.get('/status/:userId', eyeTrackingController.getStatus);
router.get('/active-users', eyeTrackingController.getActiveUsers);
exports.default = router;
