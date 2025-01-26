<script lang="ts">
    import type { MovieCategory } from "../lib/tmdb";
    
    export let selectedCategory: MovieCategory;
    const categories: MovieCategory[] = ['popular', 'top_rated', 'now_playing', 'upcoming'];
    
    const categoryLabels = {
        popular: '🔥 Popular',
        top_rated: '⭐ Top Rated',
        now_playing: '🎬 Now Playing',
        upcoming: '📅 Upcoming'
    };
</script>

<div class="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
    {#each categories as category}
        <button
            class:bg-cyan-600={selectedCategory === category}
            class="px-6 py-3 rounded-full whitespace-nowrap bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
            on:click={() => selectedCategory = category}
        >
            {categoryLabels[category]}
        </button>
    {/each}
</div>