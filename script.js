const API = "AIzaSyC9MXh6vKEIyWR7m8SaGkNUE0nwtxeBTxQ";
const BASE_URL = "https://www.googleapis.com/youtube/v3";

function displayVideos(videos) {

    // videos - is array 
    document.getElementById("rightOL").innerHTML = "";

    videos.map((video, i) => {
        document.getElementById("rightOL").innerHTML += `
        <a href='/video.html?videoId=${video.id.videoId}'>
            <li>
                <img src='${video.snippet.thumbnails.high.url}'/> <p>${video.snippet.title}</p>
            </li>
        </a>
        `
    })

}

function getVideos(query) {
    fetch(`${BASE_URL}/search?key=${API}&q=${query}&type=video&maxResults=20&part=snippet`)
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            displayVideos(data.items)
        })
}


getVideos("");


document.getElementById("search-button").addEventListener("click", () => {
    getVideos(document.getElementById("search-input").value);
})