import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { NavLink, withRouter } from 'react-router-dom'

/* MOVIEDB API KEY*/
import {API_KEY} from '../../base'

/* COMPONENTS */
import Pagination from '../pagination/pagination.component'
import MovieList from '../movie-list/movie-list.component'
import Spinner from '../spinner/spinner.component'
import ErrorMessage from '../error-message/error-message.component'
import BackButton from '../back-button/back-button.component'
import Video from '../video/video.component'

import './movie-view.styles.scss'

const MovieView = ({history, url, title, error, num = 0}) => {
    const [movies, setMovies] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [current, setCurrent] = useState(1)
    const [total, setTotal] = useState() 
    const [video, setVideo] = useState(null)
    const [isOpen, setIsOpen] = useState(false)
    const [listTitle, setListTitle] = useState('Rating Descending')

    const getData = () => {
        setIsLoading(true)
        axios.get(`${url}&page=${current}`)
        .then(result => {
            setMovies(result.data.results)
            setTotal(result.data.total_results)
            setIsLoading(false)
        },(error => console.log(error)))
    }

    const fetchVideo = id => {
        axios.get(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}&language=en-US`)
        .then(result => {
            setVideo(result.data.results[0].key)
            setIsOpen(true)
        },(error => console.log(error)))
    }

    useEffect(() => {
        setIsLoading(true)
        axios.get(`${url}&page=${current}`)
        .then(result => {
            setMovies(result.data.results)
            setTotal(result.data.total_results)

        // Account for landing on homepage for first time
        // num will be set to scroll to 800px (past header image) when navigating using pagination
        if(current > 1) {
            window.scrollTo(0, num);
            setTimeout(() => {
              setIsLoading(false)
            }, 500)
        } else {
            window.scrollTo(0, 0);
            setTimeout(() => {
              setIsLoading(false)
            }, 500)
        }
        },(error => console.log(error)))
    },[current, url])

    const next = pageNum => setCurrent(pageNum)

    const numPages = Math.floor(total / 20)

    return (
        <div className = 'movie-list-container'>
            {
                isOpen &&
                <Video video = {video} toggleView = {() => setIsOpen(!isOpen)}/>
            }

            { total !== 0 ?
            
            <MovieList 
                isLoading= {isLoading}
                movies={movies} 
                action = {fetchVideo}>
                <h1>{title}</h1>
            </MovieList>              
            : 
            <ErrorMessage error = {error}> 
                <BackButton />
            </ErrorMessage>}  
        
            { total > 20 ? 
            <Pagination pages= {numPages} next={next} current = {current} /> : '' }  
        </div> 
    )
}         
    
export default withRouter(MovieView);