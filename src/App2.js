import { useEffect, useState, useRef } from "react";
import StarRating from "./StarRating";
import useLocalStorageState from "./useLocalStorageState";
import UseMovies from "./useMovies";
import useKey from "./useKey";

// const KEY = "492b1953";
const average = function(arr){
  return arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
}

export default function App2() {
    const [movies, setMovies] = useState([]);
    const [watched, setWatched] = useLocalStorageState([],"watched")
    // const [watched, setWatched] = useState(function(){
    //     const unparsed = sessionStorage.getItem("watched");
    //     return JSON.parse(unparsed) ? JSON.parse(unparsed) : [];
    // });
    const [isLoading, setIsLoading] = useState(false);
    const [isLoading2, setIsLoading2] = useState(false);
    const [error,setError] = useState("")
    const [error2,setError2] = useState("")
    const [query,setQuery] = useState("");
    const [clickedID, setClickedID] = useState(null);
    const [idDetails,setIdDetails] = useState("");
    const [userRating,setUserRating] = useState("");
    let listImdbIds = watched?.map(el=>el.imdbID);

  function handleAddWatched (movie) {
    listImdbIds.push(movie.imdbID);
    setWatched((cur)=>[...cur,movie]);
    setClickedID(null);
    movie.UserRating = userRating;
    setUserRating("");
  }
  
  function handleDeleteWatched (id) {
      setWatched((watched)=>watched.filter((movie)=>movie.imdbID!==id));
    }

    // useEffect(function(){
    //     sessionStorage.setItem("watched",JSON.stringify(watched));
    // },[watched])


   UseMovies(query,setIsLoading,setError,`s`,setMovies,setClickedID);
//     useEffect(function(){ 
//         let runFinally = true;
//         const controller = new AbortController();
//         async function fetchMovies() {
            
//             try {setIsLoading(true);
//                 const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,{signal : controller.signal});
//                 if(!res.ok) throw new Error ("Something went wrong with fetching movies")
//                 const data = await res.json();
//             if(data.Response === "False") throw new Error ("Movie not found")
//             setError("");
//         setMovies(data.Search)} catch (err) {
//             if (err.name === "AbortError") {runFinally = false}
//             if (err.name !== "abortError") setError(err.message);
//         } finally {
//             if (runFinally) setIsLoading(false);
//         }
//     }
//     if(query.length<3) {
//         setError("");
//         setMovies([]);
//         return;
//     }
//     fetchMovies();
//     setClickedID(null);
//     //cleanup function
//     return function(){
//         controller.abort();
//     }
// },[query])

  return (
    <>
      <Navbar>
        <SearchBar query={query} setQuery={setQuery}></SearchBar>
        <ResultCount movies={movies}></ResultCount>
      </Navbar>
      <Main>

        <Box>
        {isLoading && <Loader/>}
        {!isLoading && !error && <MovieList setClickedID={setClickedID} movies={movies} setIsLoading2={setIsLoading2}></MovieList>}
        {error && !isLoading && <ErrorMessage message={error}/>}
        </Box>

        <Box>
          {clickedID ? 
          <DetailsBox clickedID={clickedID} setError2={setError2} setIsLoading2={setIsLoading2} setIdDetails={setIdDetails} UseMovies={UseMovies}>
            {isLoading2 && <Loader/>}
            {error2 && !isLoading2 && <ErrorMessage message={error2}/>}
            {!isLoading2 && !error2 && <Details idDetails={idDetails} setClickedID={setClickedID} onAddWatched={handleAddWatched} setUserRating={setUserRating} userRating={userRating} watched={watched} listImdbIds={listImdbIds}></Details>}
          </DetailsBox> :
          <>
          <WatchedSummary watched={watched}></WatchedSummary>
          <WatchedList watched={watched} handleDeleteWatched={handleDeleteWatched}></WatchedList>
          </>
          }
        </Box>

      </Main>
    </>
  );
}

function ErrorMessage ({message}) {
  return (
    <p className="error">
      <span>{message}❌</span>
    </p>
  )
}

function Loader () {
  return (
    <p className="loader">Loading...</p>
  )
}

function Navbar ({children}) {
  return (
    <nav className="nav-bar">
      <Title></Title>
      {children}
    </nav>
  );
}

function Title () {
  return (
    <div className="logo">
    <span role="img">🍿</span>
    <h1>MovieMuse</h1>
    </div>
  );
}

function SearchBar ({query,setQuery}) {
    const inputEl = useRef("")
    useEffect(function () {
      function callback (e) {
            if(document.activeElement === inputEl.current) return;
            if(e.code==="Enter") {
                inputEl.current.focus();
                setQuery("");
            }
        }
        document.addEventListener("keydown",callback);
        inputEl.current.focus();
        return ()=>document.removeEventListener("keydown",callback);
    },[])

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}

function ResultCount ({movies}) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  )
}

function Main ({children}) {
  return (
    <main className="main">
      {children}
    </main>
  )
}

function Box ({children}) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
          <button
            className="btn-toggle"
            onClick={() => setIsOpen((open) => !open)}
          >
            {isOpen ? "–" : "+"}
          </button>
          {isOpen &&
          children}
    </div>
  )
}

function MovieList ({movies, setClickedID, setIsLoading2}) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <li style={{cursor:"pointer"}} onClick={()=>{setIsLoading2(true);
          setClickedID((cur)=>cur !== movie.imdbID ? movie.imdbID : null)}} key={movie.imdbID}>
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
            <p>
              <span>🗓</span>
              <span>{movie.Year}</span>
            </p>
          </div>
        </li>
      ))}
    </ul>
          
  )
}



function WatchedSummary ({watched}) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie)=>movie.UserRating));
  const avgRuntime = average(watched.map((movie) => +movie.Runtime.match(/(\d+)/)[0]));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} mins</span>
        </p>
      </div>
    </div>
  )
}

function WatchedList ({watched, handleDeleteWatched}) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <li key={movie.imdbID}>
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
            <p>
              <span>⭐️</span>
              <span>{movie.imdbRating}</span>
            </p>
            <p>
              <span>🌟</span>
              <span>{movie.UserRating}</span>
            </p>
            <p>
              <span>⏳</span>
              <span>{movie.Runtime}</span>
            </p>
            <button className="btn-delete" onClick={()=>handleDeleteWatched(movie.imdbID)}>X</button>
          </div>
        </li>
      ))}
    </ul>
  )
}

function DetailsBox ({clickedID, setError2, setIsLoading2, children, setIdDetails, UseMovies}) {
  UseMovies(clickedID, setIsLoading2, setError2, `i`, setIdDetails);
//   useEffect(function(){ 
//     async function fetchDetails() {
//       try {
//         const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${clickedID}`);
//         if(!res.ok) throw new Error ("Something went wrong with fetching details")
//         const data = await res.json();
//       if(data.Response === "False") throw new Error ("Details not found")
//       setError2("");
//     setIdDetails(data)} catch (err) {
//       setError2(err.message);
//     } finally {
//       setIsLoading2(false);
//     }
//   }
//   fetchDetails();
// },[clickedID])
return (
  <main>{children}</main>
)
}

function Details ({idDetails, setClickedID, onAddWatched, setUserRating, userRating, watched, listImdbIds}) {
  let currentUserRating = 0;
  function searchID (details) {
    if(idDetails.imdbID===details.imdbID) {
      currentUserRating = details.UserRating;
    }
  }
 
  useKey("escape",setClickedID,null);
  // useEffect(function(){
  //   function callback (e) {
  //     if(e.code === "Escape") setClickedID(null);
  //   }
  //   document.addEventListener("keydown",callback);
  //   return function () {
  //     document.removeEventListener("keydown",callback);
  //   }
  // },[setClickedID])

  useEffect(function(){
    document.title = "MovieMuse | "+idDetails.Title;
    //cleanup function
    return function(){
      document.title = "MovieMuse";
    }
  },[]);

  return (
    <div className="details">
      <header>

      <button className="btn-back" onClick={()=>setClickedID(null)}>&larr;</button>
      <img src={idDetails.Poster} alt={`Poster of the ${idDetails.Title}`} />
      <div className="details-overview">
        <h2>{idDetails.Title}</h2>
        <p>{idDetails.Released} &bull; {idDetails.Runtime}</p>
        <p>{idDetails.Genre}</p>
        <p><span>⭐️</span>{idDetails.imdbRating} Imdb Rating</p>
      </div>
      </header>

      <section>
        <div className="rating">                                                    
          {listImdbIds.includes(idDetails.imdbID) ? watched.forEach(el=>searchID(el)) : null}
        {currentUserRating===0 ? <StarRating maxRating={10} size={24} onSetRating={setUserRating}></StarRating> : <h1>You rated with {currentUserRating} ⭐️</h1>}
        {!listImdbIds.includes(idDetails.imdbID) && userRating!=="" && currentUserRating===0 ? <button className="btn-add" onClick={()=>onAddWatched(idDetails)}>+ Add to list</button> : null}
        </div>
        <p><em>{idDetails.Plot}</em></p>
        <p>Starring {idDetails.Actors}</p>
        <p>Directed by {idDetails.Director}</p>

      </section>
    </div>
  )
}
