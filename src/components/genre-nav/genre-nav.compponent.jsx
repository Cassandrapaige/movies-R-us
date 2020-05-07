import React, {useState, useEffect} from 'react'
import axios from 'axios'

import {API_KEY} from '../../base'

import GenreItems from '../genre-items/genre-items.component'

import './genre-nav.styles.scss'

const GenreNav = ({setIsActive}) => {
    const [data, setData] = useState([])

    useEffect(() => {
        axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`)
        .then(result => setData(result.data.genres))
    },[])

    return (
        <div className = 'genre-list-nav'>
            {data.map(genre => (
                <GenreItems genre = {genre} setIsActive = {setIsActive}/>
            ))}
        </div>
    )
}

export default GenreNav