import createHttpError from "http-errors";
import { Note } from "../models/note.js";

export const getAllNotes = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, tag, search = "" } = req.query;
    const skip = (page - 1) * perPage;

    let query = Note.find().where("userId").equals(req.user._id);

    if (tag) {
      query = query.where("tag").equals(tag);
    }

    if (search) {
      query = query.where({ $text: { $search: search } });
    }

    const [notes, totalNotes] = await Promise.all([
      query.skip(skip).limit(perPage).lean(),
      Note.countDocuments(query.getFilter()),
    ]);

    res.status(200).json({
      page: Number(page),
      perPage: Number(perPage),
      totalNotes,
      totalPages: Math.ceil(totalNotes / perPage),
      notes,
    });
  } catch (err) {
    next(err);
  }
};

export const getNoteById = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findOne()
      .where("_id")
      .equals(noteId)
      .where("userId")
      .equals(req.user._id)
      .lean();

    if (!note) {
      return next(createHttpError(404, "Note not found"));
    }

    res.status(200).json(note);
  } catch (err) {
    next(err);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const note = await Note.create({
      ...req.body,
      userId: req.user._id,
    });

    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const updated = await Note.findOneAndUpdate(
      { _id: noteId, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return next(createHttpError(404, "Note not found"));
    }

    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const { noteId } = req.params;

    const deleted = await Note.findOneAndDelete({
      _id: noteId,
      userId: req.user._id,
    });

    if (!deleted) {
      return next(createHttpError(404, "Note not found"));
    }

    res.status(200).json(deleted);
  } catch (err) {
    next(err);
  }
};
