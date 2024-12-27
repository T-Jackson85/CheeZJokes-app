import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

function JokeList({ numJokesToGet = 5 }) {
  const [jokes, setJokes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchJokes = useCallback(async () => {
    try {
      const newJokes = [];
      const seenJokes = new Set();

      while (newJokes.length < numJokesToGet) {
        const res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" },
        });
        const joke = res.data;

        if (!seenJokes.has(joke.id)) {
          seenJokes.add(joke.id);
          newJokes.push({ ...joke, votes: 0 });
        } else {
          console.log("Duplicate joke found!");
        }
      }

      setJokes(newJokes);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
    }
  }, [numJokesToGet]);

  useEffect(() => {
    fetchJokes();
  }, [fetchJokes]);

  const generateNewJokes = () => {
    setIsLoading(true);
    fetchJokes();
  };

  const vote = (id, delta) => {
    setJokes((prevJokes) =>
      prevJokes.map((j) => (j.id === id ? { ...j, votes: j.votes + delta } : j))
    );
  };

  if (isLoading) {
    return (
      <div className="loading">
        <i className="fas fa-4x fa-spinner fa-spin" />
      </div>
    );
  }

  const sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);

  return (
    <div className="JokeList">
      <button className="JokeList-getmore" onClick={generateNewJokes}>
        Get New Jokes
      </button>

      {sortedJokes.map((j) => (
        <Joke
          text={j.joke}
          key={j.id}
          id={j.id}
          votes={j.votes}
          vote={vote}
        />
      ))}
    </div>
  );
}

export default JokeList;
