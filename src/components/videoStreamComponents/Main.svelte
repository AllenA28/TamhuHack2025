<!-- +page.svelte -->
<script lang="ts">
    import Header from './Header.svelte';
    import MovieCard from './MovieCard.svelte';
    import SearchBar from './SearchBar.svelte';
    import { searchTerm, isSearching, searchMovie } from '../lib/tmdb';
    import { fetchMovies, type Movie, type MovieCategory } from '../lib/tmdb';
    import { onMount } from 'svelte';
    import { currentVideo } from '../lib/tmdb';
    
    type Category = {
        id: MovieCategory;
        title: string;
        movies: Movie[];
        page: number;
    };

    let categories: Category[] = $state([
        { id: 'popular', title: 'Popular on SkyCinema', movies: [], page: 1 },
        { id: 'now_playing', title: 'Now Playing', movies: [], page: 1 },
        { id: 'top_rated', title: 'Top Rated', movies: [], page: 1 },
        { id: 'upcoming', title: 'New Releases', movies: [], page: 1 }
    ]);

    let isLoading = $state(false);
    
    async function loadCategoryMovies(category: Category) {
        isLoading = true;
        try {
            const newMovies = await fetchMovies(category.id, category.page);
            category.movies = [...category.movies, ...newMovies];
            categories = categories; // Trigger reactivity
        } finally {
            isLoading = false;
        }
    }

    
    

    function loadMore(category: Category) {
        category.page += 1;
        loadCategoryMovies(category);
    }

    onMount(async () => {
        await Promise.all(categories.map(loadCategoryMovies));
    });
</script>


<!-- <button onclick={() =>{searchMovie("The Godfather")}}>test</button> -->

{#if $currentVideo != null}
<div class="sticky top-0 left-0 w-full h-full bg-black/50 backdrop-blur-sm z-[60]">
    <iframe width={window.innerWidth} height={window.innerHeight} src="https://www.youtube.com/embed/{$currentVideo.results[0].key}?&controls=1&modestbranding=1&showinfo=0&rel=0&autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
    <button class="absolute top-4 left-4 justify-center bg-cyan-600 hover:bg-cyan-500 text-white py-2 px-4 rounded-lg transition-colors z-30">
        <img onclick={() => {$currentVideo = null}} src="/back.png" alt="back" class="w-4 h-4"/>
    </button>
</div>
{/if}

<div class="min-h-screen bg-gradient-to-b from-slate-900 to-sky-900 text-white">
    <Header title="SkyCinema ✈️" />

    <main class="p-8 max-w-7xl mx-auto">
        <SearchBar />

        {#if $isSearching}
            <h2 class="text-2xl font-bold mb-6">Search Results</h2>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                <!-- {#each filteredMovies as movie (movie.id)}
                    <MovieCard {movie} />
                {/each} -->
                <!-- <MovieCard {movie}/> -->
                
            </div>
        {:else}
            <div class="space-y-8">
                {#each categories as category}
                    <section class="group">
                        <div class="flex justify-between items-center mb-4">
                            <h2 class="text-xl font-bold hover:text-cyan-400 transition-colors">
                                {category.title}
                            </h2>
                            <button
                                onclick={() => loadMore(category)}
                                class="opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400 hover:text-cyan-300 text-sm"
                            >
                                See More <i class="fas fa-chevron-right ml-2"></i>
                            </button>
                        </div>

                        <div class="relative">
                            <div class="flex overflow-x-auto pb-4 gap-4 scrollbar-hide">
                                {#each category.movies as movie (movie.id)}
                                    <div class="w-48 flex-shrink-0">
                                        <MovieCard {movie} />
                                    </div>
                                {/each}
                            </div>
                        </div>
                    </section>
                {/each}
            </div>
        {/if}

        {#if isLoading}
            <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center">
                <i class="fas fa-spinner fa-spin text-4xl text-cyan-400"></i>
            </div>
        {/if}
    </main>
</div>