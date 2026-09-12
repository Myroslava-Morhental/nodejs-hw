import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

export const getAllNotes = async (req, res) => {
  const { page = 1, perPage = 10, tag, search } = req.query;

  const notesQuery = Note.find({ userId: req.user._id });

  if (tag) {
    notesQuery.where('tag').equals(tag);
  }
  if (search) {
    notesQuery.where({
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ],
    });
  }

  const skip = (page - 1) * perPage;
  const [totalNotes, notes] = await Promise.all([
    notesQuery.clone().countDocuments(),
    notesQuery.skip(skip).limit(perPage),
  ]);

  const totalPages = Math.ceil(totalNotes / perPage);
  res.status(200).json({ page, perPage, totalNotes, totalPages, notes });
};

export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const result = await Note.findOne({
    _id: noteId,
    userId: req.user._id,
  });
  if (!result) {
    throw createHttpError(404, 'Note not found');
  }
  res.json(result);
};

export const createNote = async (req, res) => {
  const newNote = await Note.create({
    ...req.body,
    userId: req.user._id,
  });
  res.status(201).json(newNote);
};

export const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const updateNote = await Note.findOneAndUpdate(
    { _id: noteId, userId: req.user._id },
    req.body,
    {
      returnDocument: 'after',
    },
  );
  if (!updateNote) {
    throw createHttpError(404, 'Note not found');
  }
  res.status(200).json(updateNote);
};

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const deleteNote = await Note.findOneAndDelete({
    _id: noteId,
    userId: req.user._id,
  });
  if (!deleteNote) {
    throw createHttpError(404, 'Note not found');
  }
  res.status(200).json(deleteNote);
};
