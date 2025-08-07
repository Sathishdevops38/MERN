const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const todosRouter = require('./routes/todos');

app.use('/todos', todosRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
