import { createPostInput, updatePostInput } from '@dhruvchadha/common';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { Hono } from 'hono';
import { verify } from 'hono/jwt';

export const postRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string,
    },
    Variables: {
        userId: string;
    }
}>();

postRouter.use("/*", async (c, next) => {
    const jwt = c.req.header("Authorization");
    if (!jwt) {
        c.status(401);
        return c.json({ Error: "User Unauthorized" });
    }
  
    try {
        const token = jwt.split(" ")[1];
        const payload = await verify(token, c.env.JWT_SECRET);
    
        if (!payload) {
            c.status(401);
            return c.json({ Error: "User Unauthorized" });
        }
    
        c.set("userId", payload.id);
    
        await next();
    }
    catch(e) {
        c.status(401);
        return c.json({ Error: "User Unauthorized" });
    }
});

postRouter.post('/create', async (c) => {
    const prisma = new PrismaClient({
		datasourceUrl: c.env.DATABASE_URL
	}).$extends(withAccelerate());

    const userId = c.get("userId");
    const body = await c.req.json();
    const { success } = createPostInput.safeParse(body);
    if (!success) {
        c.status(400);
        return c.json({ Error: "Invalid Inputs" });
    }

    const post = await prisma.post.create({
        data: {
            title: body.title,
            content: body.content,
            authorId: userId
        }
    });

    return c.json({ id: post.id });
});

postRouter.put('/update', async (c) => {
    const prisma = new PrismaClient({
		datasourceUrl: c.env.DATABASE_URL
	}).$extends(withAccelerate());

    const userId = c.get("userId");
    const body = await c.req.json();
    const { success } = updatePostInput.safeParse(body);
    if (!success) {
        c.status(400);
        return c.json({ Error: "Invalid Inputs" });
    }

    await prisma.post.update({
        where: {
            id: body.id,
            authorId: userId
        },
        data: {
            title: body.title,
            content: body.content
        }
    });

    return c.json({ msg: "Post Updated" });
});

postRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({
		datasourceUrl: c.env.DATABASE_URL
	}).$extends(withAccelerate());

    const posts = await prisma.post.findMany({
        select: {
            content: true,
            title: true,
            id: true,
            author: {
                select: {
                    name: true
                }
            }
        }
    });

    return c.json(posts);
});

postRouter.get('/:id', async (c) => {
    const prisma = new PrismaClient({
		datasourceUrl: c.env.DATABASE_URL
	}).$extends(withAccelerate());

    const id = c.req.param("id");

    try {
        const post = await prisma.post.findUnique({
            where: {
                id
            },
            select: {
                id: true,
                title: true,
                content: true,
                author: {
                    select: {
                        name: true
                    }
                }
            }
        });

        return c.json(post);
    }
    catch(e) {
        c.status(411);
        return c.json({ msg: "Error while fetching blog post" });
    }
});
