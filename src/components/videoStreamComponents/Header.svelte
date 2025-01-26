<script lang="ts">
    export let title: string;
</script>

<header class="p-6 flex justify-between items-center bg-slate-800/50 backdrop-blur-md sticky top-0 z-50">
    <div class="flex items-center gap-4">
        <i class="fas fa-plane text-2xl text-cyan-400"></i>
        <h1 class="text-2xl font-bold">{title}</h1>
    </div>

    <nav class="flex gap-4">
        <a href="flightInfo" class="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-700/50 transition-all">
            <i class="fas fa-plane text-lg"></i>
            Flight Info
        </a>
        <a href="parentalControl" class="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-slate-700/50 transition-all">
            <i class="fas fa-child text-lg"></i>
            Parental Controls
        </a>
    </nav>
</header>

<svelte:head>
    <title>SkyCinema ✈️</title>
    <script src="https://kit.fontawesome.com/your-kit-code.js" crossorigin="anonymous"></script>
</svelte:head>