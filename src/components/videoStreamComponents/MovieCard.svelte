<script lang="ts">
    import {fetchVideos} from "../lib/tmdb";
    import { currentVideo } from "../lib/tmdb";
    import type { Movie } from "../lib/tmdb";
    const prop = $props();
    let movie: Movie = prop.movie;

    let moadalVisible = $state(false); 

    function toggleModal() {
        moadalVisible = !moadalVisible;
    }
    async function getVideo(){        
        $currentVideo = await fetchVideos(movie.id)
        console.log(JSON.stringify($currentVideo))
        moadalVisible = false;
    }

    async function playVideo(){
        console.log($currentVideo)
    }
</script>



<button onclick={toggleModal}>
    <article class="relative aspect-[2/3] bg-slate-800 rounded-lg overflow-hidden transition-transform hover:scale-105 hover:z-10">
        <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            class="w-full h-full object-cover"
        />
        
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-4 flex flex-col justify-end">
            <h3 class="font-bold truncate">{movie.title}</h3>
            <div class="flex justify-between text-slate-300 text-sm mt-2">
                <span class="flex items-center gap-1">
                    <i class="fas fa-star text-amber-400"></i>
                    {movie.vote_average.toFixed(1)}
                </span>
                <span>{movie.release_date?.split('-')[0]}</span>
            </div>
        </div>
    </article>
</button>


{#if moadalVisible}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
    class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-10 flex items-center justify-center p-4"
    >
    <div class="relative bg-slate-800 rounded-xl max-w-2xl w-full overflow-hidden shadow-xl">
        <div class="relative aspect-video bg-slate-700">
            <div class="absolute inset-0  bg-clip-content">
                <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                class="w-full h-full object-cover z-[8] bg-slate-900/80 blur-sm"
                />    
            </div>
            <div class="absolute w-full h-full z-[9]">
                <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    class="w-full h-full object-contain z-[9]"
                />
            </div>
            <button onclick={toggleModal} class="absolute top-4 left-4 justify-center bg-cyan-600 hover:bg-cyan-500 text-white py-2 px-4 rounded-lg transition-colors z-10">
                <img src="/back.png" alt="back" class="w-4 h-4"/>  
            </button>
            <div class="absolute mb-[-10px] inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
        </div>

        <div class="p-6 space-y-4">
            <div class="flex justify-between items-start">
                <h2 class="text-2xl font-bold">{movie.title} ({movie.release_date?.split('-')[0]})</h2>
                <!-- svelte-ignore a11y_consider_explicit_label -->
                <button
                    class="text-slate-300 hover:text-cyan-400 transition-colors"
                >
                    <i class="fas fa-times text-xl" />
                    
                </button>
                <div class="grid grid-cols-2 gap-2">
                    <button onclick={getVideo} class="bg-cyan-600 hover:bg-cyan-500 text-white py-2 px-4 rounded-lg transition-colors">
                        <img src="/play.svg" alt="play" class="w-5 h-5 mx-auto" /> 
                    </button>
                    <button class="w-full bg-cyan-700 hover:bg-cyan-500 text-white py-2 px-4 rounded-lg transition-colors">
                        <img src="/party.svg" alt="play" class="w-5 h-5 mx-auto" />
                    </button>
                </div>
            </div>

            <div class="flex items-center space-x-4 text-slate-300">
                <span class="flex items-center space-x-1">
                    <i class="fas fa-star text-amber-400" />
                    <span>{movie.vote_average.toFixed(1)}/10</span>
                </span>
                <span>•</span>
                <span>{movie.release_date}</span>
            </div>

            <p class="text-slate-300 leading-relaxed">{movie.overview}</p>
        </div>
    </div>
    </div>
{/if}

<style>
    /* Add smooth scrolling behavior */
html {
    scroll-behavior: smooth;
}

/* Custom scrollbar for browsers that support it */
@media (min-width: 768px) {
    ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }

    ::-webkit-scrollbar-track {
        background: #0f172a;
    }

    ::-webkit-scrollbar-thumb {
        background: #1e293b;
        border-radius: 4px;
    }
}
</style>