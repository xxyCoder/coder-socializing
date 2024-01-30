import type { Request, Response } from "express";

class NoteController {
    like(req: Request, resp: Response) {
        const userId = req.query.id as string;
        const { note_id: id, is_like } = req.body;
        // (is_like === 'true' ? )
    }
}

export default new NoteController()