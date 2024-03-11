import { component$ } from '@builder.io/qwik';

export const Header = component$(() => {
  return (
    <header class="text-center py-8">
      <img class="image" src="/poppopfilm.PNG" alt="" />
      <h2 class="text-3xl text-white">Gestión de películas</h2>
    </header>
  )
});