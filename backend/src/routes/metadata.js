import express from 'express';
import * as metadataController from '../controllers/metadataController.js';

const router = express.Router();

/**
 * @route GET /api/metadata
 * @desc Obtener todas las llaves de configuración
 */
router.get('/', metadataController.getAllMetadata);

/**
 * @route GET /api/metadata/:country/:device
 * @desc Obtener llaves por país y dispositivo
 */
router.get('/:country/:device', metadataController.getMetadataByCountryAndDevice);

/**
 * @route GET /api/metadata/:country
 * @desc Obtener llaves por país
 */
router.get('/:country', metadataController.getMetadataByCountry);

/**
 * @route POST /api/metadata
 * @desc Crear nueva llave de configuración
 */
router.post('/', metadataController.createMetadata);

/**
 * @route PUT /api/metadata/:id
 * @desc Actualizar llave de configuración existente
 */
router.put('/:id', metadataController.updateMetadata);

/**
 * @route DELETE /api/metadata/:id
 * @desc Eliminar llave de configuración
 */
router.delete('/:id', metadataController.deleteMetadata);

export default router;
