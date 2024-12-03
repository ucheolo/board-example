import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createPost = async (req, res) => {
    try {
        const { title, content } = req.body;
        const post = await prisma.post.create({
            data: {
                title,
                content,
                authorId: req.user.id
            }
        });

        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ error: 'createPost failed' }); 
    }
}

export const getPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const posts = await prisma.post.findMany({
            skip,
            take: limit,
            include: {
                author: { select: { email: true } },
                _count: { select: { comments: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        const total = await prisma.post.count();

        res.json({
            posts,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalPosts: total
        });
    } catch (error) {
        res.status(500).json({ error: 'getPosts failed' }); 
    }
}

export const getPostById = async (req, res) => {
    try {
        const post = await prisma.post.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                author: { select: { email: true } },
                comments: {
                    include: {
                        author: { select: { email: true } },
                        childComments: {
                            include: {
                                author: { select: { email: true } }
                            }
                        }
                    }
                },
                where: { parentId: null }
            }
        });

        if (!post) return res.status(404).json({ error: 'getPostById failed' });
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: 'getPostById failed' });
    }
};