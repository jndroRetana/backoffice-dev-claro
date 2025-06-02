import express from 'express';
import {
  getCountries,
  addCountry,
  updateCountry,
  deleteCountry,
  getDevices,
  addDevice,
  updateDevice,
  deleteDevice
} from '../controllers/catalogController.js';

const router = express.Router();

// Rutas para países
router.get('/countries', getCountries);
router.post('/countries', addCountry);
router.put('/countries', updateCountry);
router.delete('/countries/:country', deleteCountry);

// Rutas para dispositivos
router.get('/devices', getDevices);
router.post('/devices', addDevice);
router.put('/devices', updateDevice);
router.delete('/devices/:device', deleteDevice);

export default router;
