import React, {useState, useEffect, useCallback} from 'react'
import axios from 'axios'
import {NavLink} from 'react-router-dom'
import {animated, config, useSpring} from 'react-spring'

import MovieOverview from '../movie-overview-container/movie-overview-container.component'
import SkeletonScreen from '../skeleton-screen/skeleton-screen.component'

import useObserver from '../../hooks/useObserver'

import './scrolling-wrapper.styles.scss'

const ScrollingWrapper = ({id, linkRel, url,  children, ...props}) => {
    const [isScrolling, setIsScrolling] = useState(false);
    const [showLeftNav, setShowLeftNav] = useState(false);
    const [showRightNav, setShowRightNav] = useState(true);
    const [isVisible, domRef] = useObserver();

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    
    const fetchResults = useCallback(async () => {
        const response = await axios.get(url);
        const results = await response.data.results;
        setData(results);
        setIsLoading(false);
    }, [url]);

    useEffect(() => {
        setIsLoading(true);
        if(isVisible) fetchResults();
    }, [fetchResults, isVisible])

    const scrollStyles = useSpring({
        config: config.wobbly,
        paddingLeft: isScrolling ? '0px' : '50px'
    })

    const getScrollPosition = window.innerWidth / 1.2;

    const [scrollPosition, setScrollPosition] = useState(getScrollPosition);

    useEffect(() => {
        window.addEventListener('resize', () => setScrollPosition(window.innerWidth / 1.2))
        return () => window.removeEventListener('resize', () => setScrollPosition());
    },[])

    const toggleScrollerArrows = elem => {
        const scrollWidth = elem.scrollWidth - elem.offsetWidth;

        elem.scrollLeft > 0 ? 
        setShowLeftNav(true)
        : setShowLeftNav(false);
    
        elem.scrollLeft < scrollWidth ?
        setShowRightNav(true)
        : setShowRightNav(false);
    }

    const POS = {
        LEFT: -scrollPosition,
        RIGHT: scrollPosition
    }

    const scrollWrapper = (el, type) => {
        setIsScrolling(true);
        const content = el.target.parentNode.parentNode;

        type === 'left' && content.scrollBy(POS.LEFT, 0);
        
        type === 'right' && content.scrollBy(POS.RIGHT, 0);
        
        content.addEventListener('scroll', () => toggleScrollerArrows(content));
    }
 
    return (
        <animated.div style = {scrollStyles} onMouseLeave = {() => setIsScrolling(false)} className="scrolling-wrapper-container" ref = {domRef}>
        {data.length > 0 && isVisible && !isLoading ? 
            <div className='scrolling-wrapper'>
                {data.map(movie => movie.backdrop_path !== null &&
                    <MovieOverview movie = {movie} {...props} key = {movie.id}/>
                )}
                <div className="see-more-scroller">
                    <NavLink to = {linkRel}>See more</NavLink>  
                </div>
                {showLeftNav 
                    && <div className="left-arrow" onClick = {(el) => scrollWrapper(el, 'left')}><i className="fas fa-chevron-left"></i></div>}
                {showRightNav 
                    && <div className="right-arrow" onClick = {(el) => scrollWrapper(el, 'right')}><i className="fas fa-chevron-right"></i></div> }
            </div>
            :
            <div className="loading-wrapper">
                <SkeletonScreen />
            </div>
        }
        </animated.div>
    )
}

export default ScrollingWrapper