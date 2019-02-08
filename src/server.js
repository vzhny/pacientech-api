import app from './app';

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`Server listening on port ${port}!`);
  }
});

export default server;
