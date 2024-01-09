import App from '@/app';
import IndexRoute from '@routes/index.route';
import validateEnv from '@utils/validateEnv';

validateEnv();

const app = new App([new IndexRoute()]); //, new UsersRoute(), new AuthRoute()]);

app.listen();
