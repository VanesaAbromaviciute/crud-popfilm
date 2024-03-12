//Funciones de acceso a la api de películas

import { Movies } from "~/models/movies"

// Obtiene todas las películas
export const getMovies = async (): Promise<Movies[]> => {
    try {
        const response = await fetch('http://localhost:8000/movies/')
        const movies = response.json()
        return movies
    } catch (error) {
        console.error(error)
    }
    return <Movies[]><unknown>null
}

// Añade una película
export const addMovie = async (user: Movies) => {
    try {
        await fetch('http://localhost:8000/movies/',
            {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(user),
            })
    } catch (error) {
        console.error(error)
    }

}

// Modifica una película
export const updateMovie = async (movie: string, movies: Movies) => {
    try {
        await fetch(`http://localhost:8000/movies/${movie}`,
            {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(movies),
            })
    } catch (error) {
        console.error(error)
    }

}

// Borra una película
export const deleteMovie = async (movie: string) => {
    try {
        await fetch(`http://localhost:8000/movies/${movie}`,
            {
                method: 'DELETE',
            })
    } catch (error) {
        console.error(error)
    }

}

// Obtiene todas las películas recientes
export const getRecents = async (): Promise<Movies[]> => {
    try {
        const response = await fetch('http://localhost:8000/movies/recents/')
        const recents = response.json()
        return recents
    } catch (error) {
        console.error(error)
    }
    return <Movies[]><unknown>null
}

// Obtiene todas las películas antiguas
export const getOlds = async (): Promise<Movies[]> => {
    try {
        const response = await fetch('http://localhost:8000/movies/olds/')
        const olds = response.json()
        return olds
    } catch (error) {
        console.error(error)
    }
    return <Movies[]><unknown>null
}

// Obtiene todas las películas con más de 5 oscars
export const getOscars = async (): Promise<Movies[]> => {
    try {
        const response = await fetch('http://localhost:8000/movies/oscars/')
        const recents = response.json()
        return recents
    } catch (error) {
        console.error(error)
    }
    return <Movies[]><unknown>null
}

// Obtiene todas las películas con más de 5 oscars
export const getLessOscars = async (): Promise<Movies[]> => {
    try {
        const response = await fetch('http://localhost:8000/movies/lessOscars/')
        const recents = response.json()
        return recents
    } catch (error) {
        console.error(error)
    }
    return <Movies[]><unknown>null
}

