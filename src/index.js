import {safe} from "@niceeli/try-catch";

async function FetchNowPlaying() {
    const [res, err] = await safe(fetch("https://lofi-api.vercel.app/"));

    if (err || !res) {
        console.log(`An error occurred: ${err}`);
        return;
    }

    const [data, jsonErr] = await safe(res.json());
    if (jsonErr || !data) {
        console.log(`Error parsing JSON: ${jsonErr}`);
        return;
    }

    let songName = data.title;
    let artist = data.artist;
    let album = data.album;
    let cover = data.cover;

    console.log(`Now playing: "${songName}" by ${artist}`);

}

FetchNowPlaying();
