<script lang="ts">
    import { searchedMovie, searchTerm, isSearching, searchMovie } from "../lib/tmdb";
    // $inspect($searchTerm);
    $inspect($searchedMovie);

    async function fetchMovie(){
        if ($searchTerm){
            $searchedMovie = await searchMovie($searchTerm);
            console.log($searchedMovie)
        }
    }

</script>

<div class="mb-8 flex gap-4 items-center bg-slate-800/50 p-4 rounded-xl">
    <i class="fas fa-search text-xl ml-2"></i>
    <input
        type="text"
        bind:value={$searchTerm}
        placeholder="Search movies..."
        class="flex-1 bg-transparent outline-none placeholder-slate-400"
    />
    {#if $isSearching}
        <button onclick={() => {
            $isSearching = false;
            $searchTerm = ""
        }}>
            <img src="/close.svg" alt="close" class="w-4 h-4"/>
        </button>
    {:else}
        <button onclick={() => {
            $isSearching = true;
            fetchMovie();

        }}>
            <img src="/search.svg" alt="search" class="w-4 h-4"/>
        </button>
    {/if}
</div>