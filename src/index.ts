import app from './app';

const start = async () => {
  const PORT = process.env.JWT_KEY || 3000;


  try {
  } catch (err) {
    console.log(err);
  }

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
};

start();
