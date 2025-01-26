<!-- +page.svelte -->
<script lang="ts">
    import Header from './Header.svelte';
    import MovieCard from './MovieCard.svelte';
    import SearchBar from './SearchBar.svelte';
    import {isSearching, searchMovie, searchedMovie, filteredMovies } from '../lib/tmdb';
    import { fetchMovies, type Movie, type MovieCategory } from '../lib/tmdb';
    import { onMount } from 'svelte';
    import { currentVideo, seatNumber } from '../lib/tmdb';
    import VideoPlayer from './VideoPlayer.svelte';


    
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
    
    $inspect(categories);

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

    // let filteredMovies;
    // async function getFilteredMovies() {
    //     if (searchedMovie){
    //         filteredMovies = await searchMovie(searchedMovie);
    //     }
    // }


    // let allMovies = $derived([ ...new Set(categories.flatMap(category => (category.movies.map(el => el.title))))]); 
    
    // let filteredMovies = $state([]);
    // if (searchedMovie){
    //     filteredMovies = allMovies.match(searchedMovie);
    // }    
    $inspect($filteredMovies);
    function loadMore(category: Category) {
        category.page += 1;
        loadCategoryMovies(category);
    }

    onMount(async () => {
        await Promise.all(categories.map(loadCategoryMovies));
    });
    let seatspot = $state("");

</script>

{#if $seatNumber == null}
    <input type="text" bind:value={seatspot} placeholder="Enter your seat number"/>
    <button onclick={() =>{$seatNumber = seatspot}}>1</button>
{/if}

<!-- <button onclick={() =>{searchMovie("The")}}>test</button> -->

{#if $currentVideo != null}
    <VideoPlayer />
{/if}

<div class="min-h-screen bg-gradient-to-b from-slate-900 to-sky-900 text-white">
    <Header title="SkyCinema 🎥🍿" />

    <main class="p-8 max-w-7xl mx-auto">
        <SearchBar />

        <!-- <ChatBlob messages = {[{messager: "23A", message: "BOO"}, 
                                 {messager: "23A", message: "BOO"},
                                  {messager: "23B", message: "DSF"}]}

                colorMap = {[['23A', 'purple'], ["23B", "red"]]}      
        /> -->

        {#if $searchedMovie != null && JSON.stringify($searchedMovie) != JSON.stringify("")}
            <h2 class="text-2xl font-bold mb-6">Search Results</h2>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">

                {#each $filteredMovies.results as movie (movie.id)}
                    <MovieCard {movie} />
                {/each}
                <!-- <!-- <MovieCard {movie}/> -->
                
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