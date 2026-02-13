import app from './src/app.js';
import { connectDB } from './src/config/database.js';

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
});
