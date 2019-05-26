const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')

export const getAllMovies = async (type, year) => {
    let query = {}
    if(year) {
        query.year = year
    }
    const movies = await Movie.find(query)
    return movies
}


export const getMoviesDetail = async (type, year) => {
    const movie = await Movie.findOne({_id:id})
    return movie
}
