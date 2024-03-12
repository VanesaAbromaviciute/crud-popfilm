import { component$, useStore, useVisibleTask$, $, useSignal } from '@builder.io/qwik';
import { Movies } from '~/models/movies';
import { addMovie, deleteMovie, getLessOscars, getMovies, getOlds, getOscars, getRecents, updateMovie } from '~/utils/users-provider';

export const UsersList = component$(() => {

    const store = useStore<{ movies: Movies[] }>({
        movies: []
    })

    const form = useStore({
        movie: '',
        duration: '',
        director: '',
        oscar: 0,
        genre: '',
        release_date: ''
    })

    const addOrModify = useSignal("Añadir")

    const oldName = useSignal("")

    const Movies = useSignal("Todos")

    useVisibleTask$(async () => {
        console.log("Desde useVisibleTask")
        store.movies = await getMovies()
    })

    const handleSubmit = $(async (event) => {
        event.preventDefault() //Evita el comportamiento por defecto
        if (addOrModify.value === 'Añadir') {
            await addMovie(form)
        } else {
            await updateMovie(oldName.value, form)
            addOrModify.value = "Añadir"
        }
    })

    const handleInputChange = $((event: any) => {
        const target = event.target as HTMLInputElement
        form[target.name] = target.value
    })

    const copyForm = $((movie: Movies) => {
        form.movie = movie.movie
        form.duration = movie.duration
        form.director = movie.director
        form.oscar = movie.oscar
        form.genre = movie.genre
        form.release_date = movie.release_date

    })

    const cleanForm = $(() => {
        form.movie = ""
        form.duration = ""
        form.director = ""
        form.oscar = 0
        form.genre = ""
        form.release_date = ""

    })


    const deleteMovies = $(async (movie: string) => {
        await deleteMovie(movie)
        store.movies = await getMovies()
    })

    return (
        <div class="flex justify-center">
            <div>
                <div class="tabla px-6 py-4 rounded-lg ">
                    <table class="border-separate border-spacing-2">
                        <thead>
                            <tr>
                                <th class="tittle">Movie</th>
                                <th class="tittle">Duration</th>
                                <th class="tittle">Director</th>
                                <th class="tittle">Oscars</th>
                                <th class="tittle">Genre</th>
                                <th class="tittle">Release Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {store.movies.map((movie) => (
                                <tr key={movie.movie}>
                                    <td>{movie.movie}</td>
                                    <td>{movie.duration}</td>
                                    <td>{movie.director}</td>
                                    <td>{movie.oscar}</td>
                                    <td>{movie.genre}</td>
                                    <td>{movie.release_date}</td>
                                    <td>
                                        <button class="bg-red-600" onClick$={() => deleteMovies(movie.movie)}><i class="fa-solid fa-trash"></i>Borrar</button>
                                    </td>
                                    <td>
                                        <button class="bg-orange-600" onClick$={() => { addOrModify.value = 'Modificar'; oldName.value = movie.movie; copyForm(movie) }}><i class="fa-solid fa-pen"></i>Modificar</button>
                                    </td>
                                </tr>))}
                            <tr>
                                <form onSubmit$={handleSubmit}>
                                    <td><input name='movie' type="text" value={form.movie} onInput$={handleInputChange} /></td>
                                    <td><input name='duration' type="text" value={form.duration} onInput$={handleInputChange} /></td>
                                    <td><input name='director' type="text" value={form.director} onInput$={handleInputChange} /></td>
                                    <td><input name='oscar' type="number" value={form.oscar} onInput$={handleInputChange} /></td>
                                    <td><select name='genre' value={form.genre} onInput$={handleInputChange}>
                                        <option value="Action">Action</option>
                                        <option value="Comedy">Comedy</option>
                                        <option value="Drama">Drama</option>
                                        <option value="Fantasy">Fantasy</option>
                                        <option value="Horror">Horror</option>
                                        <option value="Mystery">Mystery</option>
                                        <option value="Romance">Romance</option>
                                        <option value="Thriller">Thriller</option>
                                        <option value="Western">Western</option>
                                        <option value="Adventure">Adventure</option>
                                        <option value="Crime and mystery">Crime and mystery</option>
                                        <option value="Historical">Historical</option>
                                        <option value="Satire">Satire</option>
                                        <option value="Science fiction">Science fiction</option>
                                        <option value="Cyberpunk">Cyberpunk</option>
                                        <option value="Musical">Musical</option>
                                        </select></td>
                                    <td><input name='release_date' type="date" value={form.release_date} onInput$={handleInputChange} /></td>
                                    <td><button class="bg-green-600" type='submit'><i class="fa-solid fa-check"></i>Aceptar</button></td>
                                    <td><span class="button bg-red-600" style={`visibility: ${addOrModify.value === 'Añadir' ? 'hidden' : 'visible'}`} onClick$={() => { addOrModify.value = "Añadir"; cleanForm() }}><i class="fa-solid fa-xmark"></i>Cancelar</span></td>
                                </form>
                            </tr>
                        </tbody>
                    </table>
                </div >
                <button class={Movies.value === 'Todos' ? 'button-age-hightlighted' : 'button-age'} onClick$={async () => { Movies.value = 'Todos'; store.movies = await getMovies()}}><i class="fa-solid fa-photo-film"></i>Todos</button>
                <button class={Movies.value === 'Recientes' ? 'button-age-hightlighted' : 'button-age'} onClick$={async () => { Movies.value = 'Recientes'; store.movies = await getRecents()}}><i class="fa-solid fa-video"></i>Películas Recientes</button>
                <button class={Movies.value === 'Antiguas' ? 'button-age-hightlighted' : 'button-age'} onClick$={async () => { Movies.value = 'Antiguas'; store.movies = await getOlds()}}><i class="fa-solid fa-film"></i>Películas Antiguas</button>
                <button class={Movies.value === 'Oscars' ? 'button-age-hightlighted' : 'button-age'} onClick$={async () => { Movies.value = 'Oscars'; store.movies = await getOscars()}}><i class="fa-solid fa-video"></i>Películas con más oscars</button>
                <button class={Movies.value === 'MenosOscars' ? 'button-age-hightlighted' : 'button-age'} onClick$={async () => { Movies.value = 'MenosOscars'; store.movies = await getLessOscars()}}><i class="fa-solid fa-film"></i>Películas con menos oscars</button>
            </div>
        </div>
    )
});