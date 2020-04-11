import React from 'react'

const Video = ({toggleView, video}) => {
    return (
        <div className="video">
            <button onClick = {toggleView}> <i class="fas fa-times"></i></button>
            <iframe width="560" height="315" src={`https://www.youtube.com/embed/${video}`} frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
    )
}

export default Video;
