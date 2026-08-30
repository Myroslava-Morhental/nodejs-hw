import { Router } from 'express';
import {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from '../controllers/notesController.js';

const notesRouter = Router();

notesRouter.get('/', getAllNotes);
notesRouter.get('/:noteId', getNoteById);

notesRouter.post('/', createNote);
notesRouter.patch('/:noteId', updateNote);
notesRouter.delete('/:noteId', deleteNote);

export default notesRouter;
