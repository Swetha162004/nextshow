

import React, { useMemo, useState } from "react";
import { newsItems } from "./data/newsData";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AdminLogin from "./AdminLogin";
import AdminHome from "./AdminHome";



const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=85";

const movies = [
  {
    title: "Nova",
    status: "NEW RELEASE",
    date: "OCT 09 2026",
    genres: ["Action", "Comedy"],
    director: "Milo",
    cast: ["Raiza Wilson", "Dhurva Neni", "Adhvithi Shetty"],
    image:
      "https://m.media-amazon.com/images/M/MV5BMWEyY2IzYmEtODEzOC00YTJhLWE1ODUtMGE1ODhiMWMyNTBjXkEyXkFqcGc%40._V1_.jpg",
  },
  {
    title: "Appa Kutty",
    status: "UPCOMING",
    date: "OCT 16 2026",
    genres: ["Action", "Drama"],
    director: "Mu. Maran",
    cast: ["Vijay Antony", "Preethi Asrani", "Lithanya"],
    image:
      "https://insightfulreels.com/_astro/featured.EGsM9mup_29Rujz.webp",
  },
  {
    title: "Dayangaram",
    status: "UPCOMING",
    date: "COMING SOON",
    genres: ["Comedy", "Drama"],
    director: "VJ Siddhu",
    cast: ["VJ Siddhu", "Harshath Khan", "Ilavarasu"],
    image:
      "https://i0.wp.com/indiaglitz.com/wp-content/uploads/2026/01/dayangaram160126_1.jpg?resize=1200%2C1800&ssl=1",
  },
  {
    title: "Raawadi",
    status: "UPCOMING",
    date: "DEC 23 2026",
    genres: ["Comedy", "Music"],
    director: "Vignesh Vadivel",
    cast: ["Basil Joseph", "L. K. Akshay Kumar", "Sathyan"],
    image:
      "https://thehawk.in/_next/image?q=75&url=https%3A%2F%2Fd2py10ayqu2jji.cloudfront.net%2Fb0b3951e-75fb-4d16-977e-e82e144d09df%2F202601273652487-ab148a9f-a480-4599-a3ec-d631731978aa.jpg&w=3840",
  },
  {
    title: "Thamizh Murugan",
    status: "UPCOMING",
    date: "COMING SOON",
    genres: ["Action", "Drama"],
    director: "To be announced",
    cast: ["Dhanush", "Vijay Sethupathi"],
    image:
      "https://voting-asset.eco.astro.com.my/media/35655ba2-4261-4213-9737-4af1aa30d66f-vetri-tamizh-murugan.jpeg",
  },
];

const trendingMovies = [
  {
    title: "Mandaadi",
    status: "TRENDING",
    date: "OCT 08 2026",
    genres: ["Drama", "Sports", "Action"],
    director: "Mathimaran Pugazhendhi",
    cast: ["Soori", "Suhas", "Mahima Nambiar"],
    image:
      "https://static.moviecrow.com/gallery/20250420/245395-maandadi.jpg",
  },
  {
    title: "Sardar 2",
    status: "TRENDING",
    date: "OCT 01 2026",
    genres: ["Action", "Thriller"],
    director: "P. S. Mithran",
    cast: ["Karthi", "S. J. Suryah", "VTV Ganesh"],
    image:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Photographer",
    status: "TRENDING",
    date: "SEP 25 2026",
    genres: ["Mystery", "Thriller"],
    director: "Ashraf Ali Mohamed",
    cast: ["Janani Samathanan", "Karunakaran"],
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Habeebi",
    status: "TRENDING",
    date: "SEP 25 2026",
    genres: ["Drama"],
    director: "Moora Kathiravan",
    cast: ["Malavika Manoj", "Kasthuri Raja"],
    image:
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=900&q=85",
  },
];

const trailers = [
  {
    title: "America Aavi - Official Trailer",
    type: "Trailer",
    date: "10 Oct",
    duration: "3m 8s",
    image: FALLBACK_IMAGE,
  },
  {
    title: "Ranabaali Official Trailer (Tamil)",
    type: "Trailer",
    date: "08 Oct",
    duration: "3m 49s",
    image:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Haiku - Official Trailer",
    type: "Trailer",
    date: "06 Oct",
    duration: "2m 26s",
    image:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=85",
  },
  {
    title: "Love Always",
    type: "Teaser",
    date: "05 Oct",
    duration: "1m 15s",
    image:
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=900&q=85",
  },
];

function SafeImage({ src, alt, className, loading = "lazy" }) {
  const [failed, setFailed] = useState(false);

  return (
    <img
      className={className}
      src={failed ? FALLBACK_IMAGE : src}
      alt={alt}
      loading={loading}
      onError={() => {
        if (!failed) setFailed(true);
      }}
    />
  );
}

function SectionTitle({ eyebrow, title, action }) {
  return (
    <div className="section-heading">
      <div className="section-title-wrap">
        <span className="section-line" />
        <div>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h2>{title}</h2>
        </div>
      </div>

      {action && (
        <button className="text-button" onClick={action.onClick}>
          {action.label} <span>›</span>
        </button>
      )}
    </div>
  );
}

function MovieCard({ movie, onSelect }) {
  return (
    <article className="movie-card">
      <div className="movie-status-row">
        <span className="status-pill">{movie.status}</span>
        <span className="added-pill">ADDED RECENTLY</span>
      </div>

      <button
        className="poster-button"
        onClick={() => onSelect(movie)}
        aria-label={`View ${movie.title}`}
      >
        <SafeImage
          className="movie-poster"
          src={movie.image}
          alt={movie.title}
        />
        <span className="poster-play">▶</span>
      </button>

      <div className="movie-card-content">
        <div className="release-row">
          <span>{movie.date}</span>
          <span className="release-label">●</span>
        </div>

        <button className="movie-title" onClick={() => onSelect(movie)}>
          {movie.title}
        </button>

        <div className="genre-list">
          {movie.genres.map((genre) => (
            <span key={genre}>{genre}</span>
          ))}
        </div>

        <div className="card-detail">
          <span className="detail-icon">▱</span>
          <span className="detail-chip">{movie.director}</span>
        </div>

        <div className="card-detail">
          <span className="detail-icon">♙</span>
          <div className="cast-list">
            {movie.cast.map((person) => (
              <span className="detail-chip" key={person}>
                {person}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

function HomePage(){
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("Home");
  const [search, setSearch] = useState("");
  const [trailerFilter, setTrailerFilter] = useState("All");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [notice, setNotice] = useState("");
  const [showAllNews, setShowAllNews] = useState(false);

  const allMovies = useMemo(() => [...movies, ...trendingMovies], []);

  const filteredMovies = allMovies.filter((movie) =>
    `${movie.title} ${movie.genres.join(" ")} ${movie.cast.join(" ")}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const filteredTrailers =
    trailerFilter === "All"
      ? trailers
      : trailers.filter((trailer) => trailer.type === trailerFilter);

  const navItems = ["Home", "Streaming Now", "New Movies", "News"];

  function goToSection(nav) {
    setActiveNav(nav);
    setSelectedMovie(null);

    const ids = {
      Home: "home",
      "Streaming Now": "streaming",
      "New Movies": "movies",
      News: "news",
      Trailers: "trailers",
    };

    document.getElementById(ids[nav] || "home")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function openMovie(movie) {
    setSelectedMovie(movie);
    setNotice("");

  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => goToSection("Home")}>
          <span className="brand-next">NEXT</span>
          <span className="brand-show">
            SH<span className="brand-reel">✿</span>W
          </span>
        </button>

        <form
          className="search-box"
          onSubmit={(event) => {
            event.preventDefault();
            goToSection("New Movies");
          }}
        >
          <span className="search-icon">⌕</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search movies, genres, cast..."
            aria-label="Search movies"
          />
          <button type="submit">SEARCH</button>
        </form>

        <nav className="main-nav">
          {navItems.map((nav) => (
            <button
              key={nav}
              className={activeNav === nav ? "nav-link active" : "nav-link"}
              onClick={() => goToSection(nav)}
            >
              {nav}
            </button>
          ))}
        </nav>

        <button
          className="language-button"
          onClick={() => setNotice("Language selector: Tamil")}
        >
          文 Tamil ›
        </button>

        <button
          className="icon-button notification-button"
          onClick={() => setNotice("You are all caught up!")}
          aria-label="Notifications"
        >
          ♧<i />
        </button>

        <button
          className="login-button"
          onClick={() => navigate("/admin/login")}
        >
          <span>♟</span> Login
        </button>
      </header>

      {notice && (
        <div className="notice-bar">
          {notice}
          <button onClick={() => setNotice("")}>×</button>
        </div>
      )}

      <main>
        <section className="hero-layout" id="home">
          <div className="hero-banner">
            <SafeImage
              className="hero-image"
              src="https://m.media-amazon.com/images/M/MV5BYmE0MTFjOTYtMWYxNC00YjFjLTlhNzYtMWQ5ZDEwNjRmYzE1XkEyXkFqcGc%40._V1_.jpg"
              alt="Jailer 2 official poster"
              loading="eager"
            />

            <div className="hero-shade" />

            <div className="hero-content">
              <p className="hero-kicker">FEATURED MOVIE</p>
              <h1>JAILER 2</h1>

              <div className="hero-meta">
                <span>2026</span>
                <b>•</b>
                <span className="muted">OCT 15</span>
                <b>•</b>
                <span>Tamil</span>
                <b>•</b>
                <span>Telugu</span>
              </div>

              <p className="hero-description">
                Rajinikanth returns as Tiger Muthuvel Pandian in Jailer 2,
                the action-packed sequel directed by Nelson Dilipkumar.
              </p>

              <div className="hero-genres">
                Action <b>•</b> Comedy <b>•</b> Crime <b>•</b> Thriller
              </div>

              <button
                className="watch-button"
                onClick={() =>
                  setNotice("Jailer 2 trailer link will be added here.")
                }
              >
                ▶ &nbsp; WATCH NOW
              </button>
            </div>

            <button
              className="hero-play"
              onClick={() =>
                setNotice("Jailer 2 trailer link will be added here.")
              }
              aria-label="Play featured trailer"
            >
              ▶
            </button>

            <span className="sound-toggle">◖♪</span>
          </div>

          <aside className="news-sidebar" id="news">
            <div className="news-heading">
              <h2>
                <span /> TRENDING NEWS
              </h2>
              <button onClick={() => setShowAllNews(!showAllNews)}>
                {showAllNews ? "SHOW LESS" : "VIEW ALL"} ›
              </button>
            </div>

            {(showAllNews ? [...newsItems, ...newsItems] : newsItems).map(
              (item, index) => (
                <article className="news-item" key={`${item.title}-${index}`}>
                  <SafeImage
                    src={item.image}
                    alt={item.title}
                  />

                  <div className="news-copy">
                    <button onClick={() => setNotice(item.title)}>
                      {item.title}
                    </button>

                    <p>
                      {item.date} <span>•</span> {index + 1} views
                    </p>

                    <div className="news-tags">
                      {item.tags.map((tag) => (
                        <span key={tag}>◆ {tag}</span>
                      ))}
                    </div>
                  </div>
                </article>
              )
            )}
          </aside>
        </section>

        <section className="content-section" id="movies">
          <SectionTitle
            eyebrow="RECENTLY ADDED"
            title="MOVIES"
            action={{
              label: "SEE ALL",
              onClick: () => setNotice("Showing all available movie cards."),
            }}
          />

          {search && (
            <p className="search-result-label">
              Search results for "{search}" — {filteredMovies.length} movies
            </p>
          )}

          <div className="horizontal-cards">
            {filteredMovies.length ? (
              filteredMovies.map((movie) => (
                <MovieCard
                  key={movie.title}
                  movie={movie}
                  onSelect={openMovie}
                />
              ))
            ) : (
              <p className="empty-state">
                No movies found. Try another search.
              </p>
            )}
          </div>
        </section>

        <section className="content-section streaming-section" id="streaming">
          <div className="streaming-rail">
            <span>▷</span>
            <b>STREAMING</b>
            <b>NEW MOVIES</b>
          </div>

          <div className="streaming-content">
            <SectionTitle
              eyebrow="STREAMING"
              title="TRENDING"
              action={{
                label: "SEE ALL",
                onClick: () =>
                  setNotice("Showing trending streaming titles."),
              }}
            />

            <div className="horizontal-cards">
              {trendingMovies.map((movie) => (
                <MovieCard
                  key={movie.title}
                  movie={movie}
                  onSelect={openMovie}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="content-section trailers-section" id="trailers">
          <SectionTitle title="TRAILERS" />

          <div className="filter-row">
            {["All", "Teaser", "Trailer", "Clip", "Songs", "Others"].map(
              (filter) => (
                <button
                  key={filter}
                  className={
                    trailerFilter === filter
                      ? "filter-chip selected"
                      : "filter-chip"
                  }
                  onClick={() => setTrailerFilter(filter)}
                >
                  {filter === "All"
                    ? "▤"
                    : filter === "Teaser"
                      ? "▦"
                      : "▷"}
                  &nbsp; {filter}
                </button>
              )
            )}
          </div>

          <div className="trailer-grid">
            <div className="month-filter">
              <h3>2026</h3>
              {[
                "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
                "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
              ].map((month) => (
                <button
                  key={month}
                  onClick={() => setNotice(`${month} 2026 trailers`)}
                >
                  {month}
                </button>
              ))}
            </div>

            {filteredTrailers.length ? (
              filteredTrailers.map((trailer) => (
                <article className="trailer-card" key={trailer.title}>
                  <button
                    className="trailer-image-wrap"
                    onClick={() =>
                      setNotice(`${trailer.title} — video link will be added.`)
                    }
                  >
                    <SafeImage src={trailer.image} alt={trailer.title} />
                    <span className="trailer-type">
                      {trailer.type.toUpperCase()}
                    </span>
                    <span className="trailer-play">▶</span>
                    <span className="duration">{trailer.duration}</span>
                  </button>

                  <div className="trailer-stats">
                    <span>◉ 129.7K</span>
                    <span>♡ 954</span>
                    <span>▦ {trailer.date}</span>
                  </div>

                  <h3>{trailer.title}</h3>
                  <p className="director-note">
                    Director &amp; Cast will be updated soon
                  </p>
                </article>
              ))
            ) : (
              <p className="empty-state">
                No videos in this category yet.
              </p>
            )}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-brand">
          <span className="brand-next">NEXT</span>
          <span className="brand-show">
            SH<span className="brand-reel">✿</span>W
          </span>
        </div>

        <p>Your Daily Destination for Everything Movies!</p>

        <div className="footer-links">
          {["Home", "Streaming Now", "New Movies", "News", "Trailers"].map(
            (item) => (
              <button key={item} onClick={() => goToSection(item)}>
                {item}
              </button>
            )
          )}
        </div>

        <span className="copyright">
          © 2026 NextShow. All rights reserved.
        </span>
      </footer>

      {selectedMovie && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedMovie(null)}
        >
          <section
            className="movie-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelectedMovie(null)}
            >
              ×
            </button>

            <SafeImage
              src={selectedMovie.image}
              alt={selectedMovie.title}
            />

            <div className="modal-content">
              <span className="status-pill">{selectedMovie.status}</span>
              <h2>{selectedMovie.title}</h2>
              <p>{selectedMovie.date}</p>
              <p>
                <b>Director:</b> {selectedMovie.director}
              </p>
              <p>
                <b>Cast:</b> {selectedMovie.cast.join(", ")}
              </p>

              <div className="genre-list">
                {selectedMovie.genres.map((genre) => (
                  <span key={genre}>{genre}</span>
                ))}
              </div>

              <button
                className="watch-button"
                onClick={() =>
                  setNotice(`${selectedMovie.title} details selected.`)
                }
              >
                MOVIE DETAILS
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/home" element={<AdminHome />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;