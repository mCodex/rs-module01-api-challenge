const express = require('express');
const cors = require('cors');
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const checkIfRepositoryExists = (req, res, next) => {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ message: 'ID is not an UUID' });
  }

  const repositoryIndex = repositories.findIndex((r) => r.id === id);

  if (repositoryIndex < 0) {
    return res.status(400).json({ message: 'Repository not found' });
  }

  return next();
};

app.use('/repositories/:id', checkIfRepositoryExists);

app.get('/repositories', (req, res) => res.json(repositories));

app.post('/repositories', (req, res) => {
  const { title, url, techs } = req.body;

  const id = uuid();

  const repository = {
    id,
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return res.json(repository);
});

app.put('/repositories/:id', (req, res) => {
  const { id } = req.params;

  const {
    title, url, techs,
  } = req.body;

  const repositoryIndex = repositories.findIndex((r) => r.id === id);


  const updatedRepository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes,
  };

  repositories[repositoryIndex] = updatedRepository;

  return res.json(updatedRepository);
});

app.delete('/repositories/:id', (req, res) => {
  const { id } = req.params;

  const repositoryIndex = repositories.findIndex((p) => p.id === id);

  repositories.splice(repositoryIndex, 1);

  return res.status(204).send();
});

app.post('/repositories/:id/like', (req, res) => {
  const { id } = req.params;

  const repositoryIndex = repositories.findIndex((r) => r.id === id);

  const updatedRepository = {
    ...repositories[repositoryIndex],
    likes: repositories[repositoryIndex].likes += 1,
  };

  repositories[repositoryIndex] = updatedRepository;

  return res.json({ likes: repositories[repositoryIndex].likes });
});

module.exports = app;
