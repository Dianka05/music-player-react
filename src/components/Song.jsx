import './song.css'

export default function Song({ songs, playSong, play }) {

  return (
    <>
      {songs?.map((song) => (
        <li className='track' key={song?.id} id={song?.id}>
          <button onClick={() => {
            playSong(song.id)
            }} className={ play === song.id ? "playlist-song-info active" : "playlist-song-info"} type="button" >
            <div>
              <img className="img" src={song?.img} alt={song?.title} />
            </div>
            <div className='song-info'>
                <h3>{song?.title}</h3>
                <span className='artist'>{song?.artist}</span>
                <span>{song?.duration}</span>
            </div>
          </button>
        </li>
      ))}
    </>
  );
}