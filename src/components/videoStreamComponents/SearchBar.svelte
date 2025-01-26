<script lang="ts">
    import { searchTerm } from "../lib/tmdb";
    // $inspect(searchTerm);
</script>

<div class="mb-8 flex gap-4 items-center bg-slate-800/50 p-4 rounded-xl">
    <i class="fas fa-search text-xl ml-2"></i>
    <input
        type="text"
        bind:value={$searchTerm}
        placeholder="Search movies..."
        class="flex-1 bg-transparent outline-none placeholder-slate-400"
    />
</div>