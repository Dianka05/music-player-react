import { useEffect, useState } from 'react';
import './App.css';
import './assets/basic.css';
import Play from '/Play.svg';
import Pause from '/Pause.svg';
import Next from '/Next.svg';
import Previous from '/Previous.svg';
import Shuffle from '/Shuffle.svg';
import Song from './components/Song';
import autoplay from '/autoplay.svg';
import autoplayActive from '/autoplayY.svg';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [songData, setSongData] = useState({});
  const [sliderValue, setSliderValue] = useState(0);
  const [autoplayValue, setAutoplayValue] = useState(false);
  const [audio] = useState(new Audio());

  useEffect(() => {
    const fetchedData = async () => {
      try {
        const response = await fetch('https://66a51a585dc27a3c190aa98b.mockapi.io/songs');
        const data = await response.json();
        setSongData({
          songs: data,
          currentSong: data[0] || null,
          songCurrentTime: 0
        });
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchedData();
  }, []);

  useEffect(() => {
    if (songData.currentSong) {
      audio.src = songData.currentSong.src;
      audio.title = songData.currentSong.title;

      audio.currentTime = songData.songCurrentTime ?? 0;

      audio.play();
      setIsPlaying(true);

      intervalId = setInterval(() => setSliderValue(audio.currentTime), 1000);

      audio.onended = () => {
        if (autoplayValue) {
          audio.currentTime=0;
          audio.play();
        } else {
          nextSong();
        }
      };
    }
  }, [songData.currentSong, autoplayValue]);

  let intervalId = '';

  const nextSong = () => {
    clearInterval(intervalId);
    const currentIndex = getCurrentIndex();
    const nextSong =
      songData?.songs[currentIndex + 1] || songData?.songs[0];
    setSongData(prevData => ({
      ...prevData,
      currentSong: nextSong
    }));
  };

  const playSong = (id) => {
    clearInterval(intervalId);
    const song = songData.songs.find(song => song.id === id);
    if (!song) return;

    setSongData(prevData => ({
      ...prevData,
      currentSong: song,
      songCurrentTime: prevData.currentSong?.id === song.id ? prevData.songCurrentTime : 0
    }));
  };

  const pauseSong = () => {
    clearInterval(intervalId);
    setSongData(prevData => ({
      ...prevData,
      songCurrentTime: audio.currentTime
    }));
    audio.pause();
    setIsPlaying(false);
  };

  const previousSong = () => {
    clearInterval(intervalId);
    const currentIndex = getCurrentIndex();
    const previousSong =
      songData?.songs[currentIndex - 1] || songData?.songs[songData.songs.length - 1];
    setSongData(prevData => ({
      ...prevData,
      currentSong: previousSong
    }));
  };

  const shuffleSong = () => {
    clearInterval(intervalId);
    const shuffledSong = songData?.songs[Math.floor(Math.random() * songData?.songs.length)];
    setSongData(prevData => ({
      ...prevData,
      currentSong: shuffledSong
    }));
  };

  const getCurrentIndex = () => {
    return songData.songs.findIndex(song => song.id === songData.currentSong.id);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return (
    <>
      <div className='player'>
        <span><h1>Audio Player</h1></span>
        <div className='player-content'>
          <div className="player-img">
            <img src={songData.currentSong?.img || ''} alt="photo" />
          </div>
          <div className="player-display">
            <div className="player-info">
              <h2 className="song-title">{songData.currentSong?.title || 'Song Title'}</h2>
              <p className="song-artist">{songData.currentSong?.artist || ''}</p>
              <p style={{ opacity: 'none', paddingBottom: '5px' }}>
                {`${formatTime(audio.currentTime)} / ${
                  !isNaN(audio.duration) && audio.duration > 0 
                    ? formatTime(audio.duration) 
                    : '0:00'
                }`}
              </p>
              <div className='audio-slider' style={{ width: '100%' }}>
                <span className='slider' style={{ width: `${(sliderValue / audio.duration) * 100}%`, }}></span>
              </div>
            </div>
            <div className="player-controls">
              <button id="previous" className="previous" onClick={previousSong}><img src={Previous} alt="Previous" /></button>
              <button id="play" className="play" onClick={() => {
                if (isPlaying) {
                  pauseSong();
                } else {
                  playSong(songData.currentSong.id);
                }
              }}><img src={isPlaying ? Pause : Play} alt="Play" /></button>
              <button id="next" className="next" onClick={nextSong}><img src={Next} alt="Next" /></button>
              <button id="shuffle" className="shuffle" onClick={shuffleSong}><img src={Shuffle} alt="Shuffle" /></button>
              <button onClick={() => setAutoplayValue(prev => !prev)}><img src={autoplayValue ? autoplayActive : autoplay} alt="" /></button>
            </div>
          </div>
        </div>

        <div className='list-title'>
          <div className='decoration'>
            <span className='line'></span>
            <span className='line'></span>
          </div>
          <p>Playlist</p>
          <div className='decoration'>
            <span className='line'></span>
            <span className='line'></span>
          </div>
        </div>
        <div className='playlist-content'>
          <ul id="playlist-songs">
            <Song 
              songs={songData.songs} 
              playSong={playSong} 
              play={songData?.currentSong?.id || 0}
            />
          </ul>
        </div>
      </div>
    </>
  );
}

export default App;
