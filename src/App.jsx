import { useState, useEffect } from "react";
import { Link, Route, Routes } from "react-router-dom";
import PokemonDetail from "./pages/PokemonDetail";
import SearchResult from "./pages/SearchResult";
import Favourites from "./pages/Favourites";
import { PokemonContext } from "./components/resources/context/Context";
import Home from "./pages/Home";

function App() {
  // State to manage favorite Pokemon IDs and details
  const [favPokeIDList, setFavPokeIDList] = useState([]);
  const [favIDDetails, setFavIDDetails] = useState([]);

  // Load saved favorites from local storage on component mount
  useEffect(() => {
    const savedFavPokemons = localStorage.getItem("favIDList");
    if (savedFavPokemons) {
      setFavPokeIDList(JSON.parse(savedFavPokemons));
    }

    const savedFavIDDetails = localStorage.getItem("favIdDetails");
    if (savedFavIDDetails) {
      setFavIDDetails(JSON.parse(savedFavIDDetails));
    }
  }, []);

  // Add a Pokemon to favorites
  const addToFavorites = (pokemon) => {
    setFavPokeIDList([...favPokeIDList, pokemon.id]);
    localStorage.setItem(
      "favIDList",
      JSON.stringify([...favPokeIDList, pokemon.id])
    );

    // Store the new favorite Pokemon details
    const existingFavIDDetails = localStorage.getItem("favIDDetails");
    const parsedFavIDDetails = existingFavIDDetails
      ? JSON.parse(existingFavIDDetails)
      : [];

    const newFavIDDetails = [
      ...parsedFavIDDetails,
      { name: pokemon.name, url: `https://pokeapi.co/api/v2/pokemon/${pokemon.id}` },
    ];

    localStorage.setItem("favIDDetails", JSON.stringify(newFavIDDetails));
  };

  // Remove a Pokemon from favorites
  const removeFromFavorites = (pokemon) => {
    const newIDList = favPokeIDList.filter((fav) => pokemon.id !== fav);
    const existingFavIDDetails = localStorage.getItem("favIDDetails");
    const parsedFavIDDetails = existingFavIDDetails
      ? JSON.parse(existingFavIDDetails)
      : [];
  
    const newFavIDDetails = parsedFavIDDetails.filter(
      (item) => item.url !== `https://pokeapi.co/api/v2/pokemon/${pokemon.id}`
    );
  
    setFavPokeIDList(newIDList);
    localStorage.setItem("favIDList", JSON.stringify(newIDList));
    localStorage.setItem("favIDDetails", JSON.stringify(newFavIDDetails));
  };
  
  return (
    // Provide context to components with favorite Pokemon data
    <PokemonContext.Provider value={{ favPokeIDList, addToFavorites, removeFromFavorites }}>
      <div className="container min-h-screen">
        <div className="py-5">
          {/* Header */}
          <h1 className="pokedex text-center text-5xl md:text-7xl text-gray-900"><Link to="/" href="#">PokéDex</Link></h1>
          <h3 className="pokedex text-center text-lg md:text-xl text-gray-600">Made using <a href="https://pokeapi.co" className=" text-red-500">Poke<span className=" text-yellow-400">Api</span></a></h3>
          
          {/* Route Configuration */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search/:query" element={<SearchResult />} />
            <Route exact path="/favourites" element={<Favourites />} />
            <Route path="*" element={<SearchResult />} />
            <Route path="/:name" element={<PokemonDetail />} />
          </Routes>
        </div>
      </div>
      {/* Footer */}
      <div className="footer relative bottom-0 w-full bg-slate-600 flex justify-center py-3 text-gray-100">Made By&nbsp; <a href="https://github.com/suyogsatyal"> Suyog</a> </div>
    </PokemonContext.Provider>
  )
}

export default App;
