import express from 'express';
import { createMock, getMock, listMocks, deleteMock } from '../controllers/mockSingleFile.js';

const router = express.Router();

// Crear un nuevo mock
router.post('/', createMock);

// Obtener un mock específico por su ID
router.get('/:mockId', getMock);

// Listar todos los mocks disponibles
router.get('/', listMocks);

// Eliminar un mock
router.delete('/:mockId', deleteMock);

export default router;
