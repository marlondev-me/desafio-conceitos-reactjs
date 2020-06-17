import React, { useState, useEffect } from 'react';

import api from './services/api';
import './styles.css';

function App() {
  const [repositories, setRepositories] = useState([]);
  const [repository, setRepository] = useState({
    title: '',
    url: '',
    techs: '',
  });
  useEffect(() => {
    api
      .get('repositories')
      .then((response) => {
        setRepositories(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  async function handleAddRepository() {
    repository.techs = repository.techs.split(',');
    const response = await api.post('repositories', repository);
    setRepositories([...repositories, response.data]);
    setRepository({ url: '', title: '', techs: '' });
  }

  async function handleRemoveRepository(id) {
    const response = await api.delete(`repositories/${id}`);
    if (response.status === 204) {
      let repositoryIndex = repositories.findIndex(
        (repository) => repository.id === id
      );
      let auxRepositories = repositories;
      auxRepositories.splice(repositoryIndex, 1);
      setRepositories([...auxRepositories]);
    }
  }

  return (
    <div id="container">
      <ul data-testid="repository-list">
        {repositories.map((repository) => (
          <li key={repository.id}>
            {repository.title}
            <button onClick={() => handleRemoveRepository(repository.id)}>
              Remover
            </button>
          </li>
        ))}
      </ul>
      <div className="form">
        <input
          placeholder="URL do repositorio"
          onChange={(event) =>
            setRepository({ ...repository, url: event.target.value })
          }
          value={repository.url}
        />
        <input
          placeholder="Titulo do repositorio"
          onChange={(event) =>
            setRepository({ ...repository, title: event.target.value })
          }
          value={repository.title}
        />
        <input
          placeholder="Tecnologias separadas por virgula."
          onChange={(event) =>
            setRepository({ ...repository, techs: event.target.value })
          }
          value={repository.techs}
        />
        <button onClick={handleAddRepository}>Adicionar</button>
      </div>
    </div>
  );
}

export default App;
