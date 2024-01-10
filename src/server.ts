import App from '@/app';
import IndexRoute from '@routes/index.route';
import validateEnv from '@utils/validateEnv';
import PostsRoute from './routes/posts.route';

validateEnv();

const app = new App([new IndexRoute(), new PostsRoute()]); //, new UsersRoute(), new AuthRoute()]);

app.listen();
