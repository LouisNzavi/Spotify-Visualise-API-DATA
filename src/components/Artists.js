import React, { useEffect, useState } from "react";
import axios from "axios";

function Artists() {
  const CLIENT_ID = "f0860282488e4e60bff27e13356a00b1";
  const REDIRECT_URI = "http://localhost:3000";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";

  const [token, setToken] = useState("");

  //to fetch data we need these two states: 1 to keep our search team and 2 to keep the fetched data
  const [searchKey, setSearchKey] = useState("");
  const [artists, setArtists] = useState([]);

  //when the app is opened, we check if we have a hash or we already have a token saved in our localstorage
  //if no token stored, we continue by setting our token state variable
  //if we do have a token, we check if we have a hash, if so we perform tasks on that string to extract the token
  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }

    setToken(token);
  }, []);

  //logout removes token from our localstorage as well as set the state token back to an empty string

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  };

  //fetching data

  const searchArtists = async (e) => {
    e.preventDefault();
    const { data } = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q: searchKey,
        type: "artist",
      },
    });
    setArtists(data.artists.items);
  };

  //display data
  const renderArtists = () => {
    return artists.map((artist) => (
      <div key={artist.id}>
        {artist.images.length ? (
          <img width={"50%"} src={artist.images[0].url} alt="" />
        ) : (
          <div>No Image</div>
        )}
        {artist.name}
      </div>
    ));
  };

  return (
    //once you click login you will either be logged in or accpet terms to login with your spotify details
    //once done you will be re-directed
    <div>
      <header className="App-header">
        <h1>Spotify React</h1>
        {!token ? (
          <a
            href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}
          >
            Login to Spotify
          </a>
        ) : (
          <button onClick={logout}>Logout</button>
        )}

        {token ? (
          <form onSubmit={searchArtists}>
            <input type="text" onChange={(e) => setSearchKey(e.target.value)} />
            <button type={"submit"}>Search</button>
          </form>
        ) : (
          <h2>Please login</h2>
        )}

        {renderArtists()}
      </header>
    </div>
  );
}

export default Artists;
