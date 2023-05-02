import React, { useState, useEffect } from "https://esm.sh/react@18";
import ReactDOM from "https://esm.sh/react-dom@18";

function App() {
  const [animes, setAnimes] = useState([]);

  useEffect(() => {
    fetch("https://anime-website.blackeye2005.repl.co/api/animes/")
      .then((response) => response.json())
      .then((data) => setAnimes(data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="container">
      <h1 className="title">Anime List</h1>
      <div className="anime-list">
        {animes.map((anime) => (
          <div className="anime-card" key={anime.id}>
            <div className="anime-info">
              <h2 className="anime-title">{anime.name}</h2>
              <p className="anime-score">Score: {anime.averageScore}</p>
              <p className="anime-episodes">Episodes: {anime.episodes}</p>
              <div className="character-list">
                <h3>Characters:</h3>
                <div className="character-cards">
                  {anime.characters.map((character) => (
                    <div className="character-card" key={character.id}>
                      <img
                        src={character.image}
                        alt={character.name}
                        className="character-image"
                      />
                      <p className="character-name">{character.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <img
              src={anime.coverImage}
              alt={anime.name}
              className="anime-cover-image"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
