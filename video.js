const API = "AIzaSyC9MXh6vKEIyWR7m8SaGkNUE0nwtxeBTxQ";
const BASE_URL = "https://www.googleapis.com/youtube/v3";

window.addEventListener("load", () =>{

    const search = window.location.search;
    const params = new URLSearchParams(search);

    const videoId = params.get('videoId');

    if (videoId) {
        loadVideo(videoId);
        loadComments(videoId);
        loadVideoDetails(videoId);
    } else {
        console.error("No video ID found in URL");
    }
})

function loadVideo(videoId){
    if (YT) {
        new YT.Player('video', {
            height: "500",
            width: "1100",
            videoId: videoId
        });
    }
}

async function loadVideoDetails(videoId) {
    try {
        const response = await fetch(`${BASE_URL}/videos?key=${API}&part=snippet&id=${videoId}`);
       
        const data = await response.json();
        if (data.items && data.items.length > 0) {
            const channelId = data.items[0].snippet.channelId;
            loadChannelInfo(channelId);
        }
    } catch (error) {
        console.error('Error fetching video details: ', error);
    }
}

async function loadChannelInfo(channelId) {
    try {
        const response = await fetch(`${BASE_URL}/channels?key=${API}&part=snippet&id=${channelId}`);
       
        const data = await response.json();
        if (data.items) {
            displayChannelInfo(data.items[0]);
            loadRecommendedVideos(data.items[0].snippet.title);
        }
    } catch (error) {
        console.error('Error fetching channel info: ', error);
    }
}

function displayChannelInfo(channelData) {
    const channelInfoSection = document.getElementById('channel-info');
    channelInfoSection.innerHTML = `
    <img src="${channelData.snippet.thumbnails.default.url}" alt="${channelData.snippet.title}">
        <h3>${channelData.snippet.title}</h3>
        <p>${channelData.snippet.description}</p>
    `;
}

async function loadComments(videoId){
    try{
        const response = await fetch(`${BASE_URL}/commentThreads?key=${API}&videoId=${videoId}&maxResults=25&part=snippet`);
        const data = await response.json();

        console.log("comments", data);

        if(data.items){
            displayComments(data.items);
        }
        else{
            console.log("No comments available")
        }
    }catch(error){
        console.log("Error in fetching comments", error);
    }
}

function displayComments(comments){
    const commentSection = document.getElementById("comment-section")
    comments.forEach(comment => {
        const commentt = document.createElement("div");
        commentt.innerHTML = `
        <img src='${comment.snippet.topLevelComment.snippet.authorProfileImageUrl}'>
         <h3>${comment.snippet.topLevelComment.snippet.authorDisplayName}</h3>
         <p>${comment.snippet.topLevelComment.snippet.textDisplay}</p>
        `
        commentSection.appendChild(commentt);
    })
}

async function loadRecommendedVideos(channelName){
    try{
        const response = await fetch(`${BASE_URL}/search?key=${API}&maxResults=15&part=snippet&q=${channelName}`)
        const data = await response.json();

        if(data.items){
            displayRecommendedVideos(data.items);
        }
        else{
            console.log("No data found")
        }
    }catch(error){
        console.log("Error in fetching data", error);
    }
}

function displayRecommendedVideos(videos){
    const recommendedSection = document.getElementById("suggestions");
    recommendedSection.innerHTML = ''

    videos.forEach(video => {
        const videoId = video.id.videoId;
        const title = video.snippet.title;
        const thumbnail = video.snippet.thumbnails.default.url;
        const videoCard = document.createElement('div');
        videoCard.innerHTML = `
            <a href="video.html?videoId=${videoId}">
                <img src="${thumbnail}" alt="${title}">
                <p>${title}</p>
            </a>
        `;
        recommendedSection.appendChild(videoCard);
    })
}