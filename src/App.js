import "./index.css";
import { useEffect, useState, useMemo } from "react";

function App() {
  const [apod, setApod] = useState({});
  const [opened, setOpened] = useState(false);
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [error, setError] = useState(null);

  return (
    <div className="app">
      <APOD apod={apod} setApod={setApod} date={date} setError={setError} />
      {error ? (
        <div className="error-message">Error: {error}</div>
      ) : (
        <>
          <Bar
            title={apod.title}
            date={apod.date}
            opened={opened}
            setOpened={setOpened}
            setDate={setDate}
          />

          {opened && (
            <Sidebar
              explanation={apod.explanation}
              copyright={apod.copyright}
              setOpened={setOpened}
            />
          )}
        </>
      )}
    </div>
  );
}

function APOD({ apod, setApod, date, setError }) {
  const API = "espYMWWogo4wXoWqd69yF8UCktn3K9XYosdNXrA1";

  const apiUrl = useMemo(
    () => `https://api.nasa.gov/planetary/apod?api_key=${API}&date=${date}`,
    [API, date]
  );

  useEffect(() => {
    async function fetchApod() {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        const data = await response.json();
        setApod(data);

        if (data.hdurl) {
          document.body.style.background = `url(${data.hdurl})`;
          document.body.style.backgroundSize = "cover";
        }
      } catch (err) {
        setError(err.message);
        console.error(err);
      }
    }

    fetchApod();
  }, [apiUrl, setApod, setError]);

  return <div></div>;
}

function Bar({ title, date, opened, setOpened, setDate }) {
  return (
    <div className="bar">
      <div className="left">
        {title && <h1>{title}</h1>}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <button onClick={() => setOpened(!opened)}>
        <i className="fa-solid fa-bars"></i>
      </button>
    </div>
  );
}

function Sidebar({ explanation, copyright, setOpened }) {
  return (
    <div className="sidebar" onClick={() => setOpened(false)}>
      <p>{explanation}</p>
      <p className="author">{copyright}</p>
    </div>
  );
}

export default App;
