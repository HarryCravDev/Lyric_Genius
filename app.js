// DOM ELEMENTS
const form = document.getElementById("form");
const search = document.getElementById("search");
const result = document.getElementById("result");
const more = document.getElementById("more");

// API URL
const apiURL = "https://api.lyrics.ovh";

// Search by song or artist
const searchSongs = async (term) => {
  const res = await fetch(`${apiURL}/suggest/${term}`);
  const data = await res.json();

  showData(data);
};

// Show Data
const showData = (data) => {
  this.result.innerHTML = `
      <ul class="songs">
          ${data.data
            .map(
              (e) =>
                `<li>
                  <span><strong>${e.artist.name}</strong> - ${e.title}</span>
                  <button class="btn" data-artist="${e.artist.name}" data-songTitle="${e.title}">Get Lyrics!</button>
              </li>`
            )
            .join("")}
      </ul>
  `;

  // Show Previous and Next button
  if (data.prev || data.next) {
    this.more.innerHTML = `
          ${
            data.prev
              ? `<button class="btn" onClick="getMoreSongs('${data.prev}')">Prev</button>`
              : ""
          }
          ${
            data.next
              ? `<button class="btn" onClick="getMoreSongs('${data.next}')">Next</button>`
              : ""
          }
      `;
  } else {
    this.more.innerHTML = "";
  }
};

// Get more songs
const getMoreSongs = async (url) => {
  const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
  const data = await res.json();

  showData(data);
};
//

// Get Lyrics
const getLyrics = async (artist, songTitle) => {
  const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
  const data = await res.json();

  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, "<br>");

  result.innerHTML = `<h2 class="mb-3"><strong>${artist}</strong> - ${songTitle}</h2>
  <span class="lead p-2">${lyrics}</span>`;

  more.innerHTML = "";
};

// Event Listener
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const searchTerm = search.value.trim();

  if (!searchTerm) {
    // JOB: Add Div which informs user not valid submission...
    alert("Please enter valid entry.");
  } else {
    searchSongs(searchTerm);
  }
});

// Get Lyrcis button Event
result.addEventListener("click", (e) => {
  const element = e.target;

  if (element.tagName === "BUTTON") {
    const artist = element.getAttribute("data-artist");
    const songTitle = element.getAttribute("data-songTitle");

    getLyrics(artist, songTitle);
  }
});
