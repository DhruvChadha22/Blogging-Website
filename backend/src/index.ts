import { Hono } from 'hono';
import { userRouter } from './routes/user';
import { postRouter } from './routes/posts';
import { cors } from 'hono/cors';

export const app = new Hono<{
	Bindings: {
		DATABASE_URL: string,
		JWT_SECRET: string,
	}
}>();

app.use("/*", cors());
app.route("/users", userRouter);
app.route("/posts", postRouter);

export default app
