import z from "zod";

export const signupInput = z.object({
    email: z.string().email(),
    name: z.string().optional(),
    password: z.string().min(6)
});

export type SignupType = z.infer<typeof signupInput>;

export const signinInput = z.object({
    email: z.string().email(),
    password: z.string().min(6)    
});

export type SigninType = z.infer<typeof signinInput>;

export const createPostInput = z.object({
    title: z.string(),
    content: z.string()
});

export type CreatePostType = z.infer<typeof createPostInput>;

export const updatePostInput = z.object({
    id: z.string(),
    title: z.string().optional(),
    content: z.string().optional()
});

export type UpdatePostType = z.infer<typeof updatePostInput>;
