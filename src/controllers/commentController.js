import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createComment = async (req, res) => {
    try {
        const { content, postId, parentId } = req.body;

        const comment = await prisma.comment.create({
            data: {
                content,
                postId,
                authorId: req.user.id,
                parentId: parentId || null,
            },
            include: {
                author: { select: { nickname: true } },
            },
        });

        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ error: "createComment failed" });
    }
};

export const updateComment = async (req, res) => {
    try {
        const { content } = req.body;
        const commentId = parseInt(req.params.id);

        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
        });

        if (!comment)
            return res.status(404).json({ error: "Comment not found" });
        if (comment.authorId !== req.user.id) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        const updatedComment = await prisma.comment.update({
            where: { id: commentId },
            data: { content },
            include: {
                author: { select: { nickname: true } },
            },
        });

        res.status(200).json(updatedComment);
    } catch (error) {
        res.status(500).json({ error: "updateComment failed" });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const commentId = parseInt(req.params.id);

        const comment = await prisma.comment.findUnique({
            where: { id: commentId },
        });

        if (!comment)
            return res.status(404).json({ error: "Comment not found" });
    } catch (error) {
        res.status(500).json({ error: "deleteComment failed" });
    }
};
