import { useEffect } from "react";
const KEY = "492b1953";

export default function UseMovies (query,setIsLoading,setError,requestType,setMovies,setClickedID=false) {
    useEffect(function(){ 
        let runFinally = true;
        const controller = new AbortController();
        async function fetchMovies() {
            
            try {setIsLoading(true);
                const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&${requestType}=${query}`,{signal : controller.signal});
                if(!res.ok) throw new Error ("Something went wrong with fetching movies")
                const data = await res.json();
            if(data.Response === "False") throw new Error ("Movie not found")
            setError("");
            setClickedID ? setMovies(data.Search) : setMovies(data)
            } catch (err) {
            if (err.name === "AbortError") {runFinally = false}
            if (err.name !== "abortError") setError(err.message);
        } finally {
            if (runFinally) setIsLoading(false);
        }
    }
    if(setClickedID) setClickedID(null);
    if(query.length<3) {
        setError("");
        setMovies([]);
        return;
    }
    fetchMovies();
    //cleanup function
    return function(){
        controller.abort();
    }
    },[query])
}