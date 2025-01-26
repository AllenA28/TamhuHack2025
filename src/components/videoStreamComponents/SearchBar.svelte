<script>
    import {searchedMovie, isSearching, filteredMovies, searchMovie, watching, watchPartyMode, watchingTime, currentVideo } from "../lib/tmdb";
    import { getChatGPTResponse }  from '../chatBot/openAi.svelte.js';

    // Add magical state
    let isMagical = $state(false);
    
    async function getMovies(movieid){
        $filteredMovies = await searchMovie(movieid);
    }

    $effect(() => {
        getMovies($searchedMovie);
    });

    let watchPartyScreen = $state(false);
    function toggleModal() {
        watchPartyScreen = !watchPartyScreen;
    }

    let allParties = $state([]);
    async function getParties(){
        allParties = await fetch("/api/chat/getAllRooms", {
            method: "GET"
        });
        allParties = await allParties.json();
    }
    
    function enableParties(){
        watchPartyScreen = true;
        getParties();
    }
    
    function joinParty(owner, watchTime, videokey, videoname){
        $watching = owner;
        $watchingTime = watchTime;
        $currentVideo = {
            results: [
                {
                    key: videokey,
                    name: videoname
                }
            ]
        };
        $watchPartyMode = true;
    }

    async function geminiEnhance(){
        let data = await getChatGPTResponse($searchedMovie);
        console.log(data);
        $searchedMovie = data;
        isMagical = true; // Activate magical effect
    }
</script>

<div class="mb-8 flex gap-4 items-center bg-slate-800/50 p-4 rounded-xl {isMagical ? "magical-input" : ""}">
    <i class="fas fa-search text-xl ml-2 {isMagical ? "text-purple-400" : ""}"></i>
    <input
        type="text"
        bind:value={$searchedMovie}
        onkeydown={() => isMagical = false}
        placeholder="Search movies..."
        class="flex-1 bg-transparent outline-none placeholder-slate-400 relative {isMagical ? "magical-input" : ""}" 
    />
    
    <button onclick={enableParties} class="bg-cyan-600 hover:bg-cyan-500 text-white py-2 px-4 rounded-lg transition-colors">
        Watch Party 🎉
    </button>
    
    <button 
        onclick={geminiEnhance}
        class="gemini-button ml-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-2 px-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center"
    >
        <span class="mr-2">Gemini AI</span>
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
    </button>
</div>

<!-- Create a moadal to show the watch party screen -->
{#if watchPartyScreen}
<div
class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-10 flex items-center justify-center p-4"
>
<div class="relative bg-slate-800 rounded-xl w-2/3 h-2/3 ">
    <div>
        <button onclick={toggleModal} class="absolute top-4 left-4 justify-center bg-cyan-600 hover:bg-cyan-500 text-white py-2 px-4 rounded-lg transition-colors z-10">
            <img src="/back.png" alt="back" class="w-4 h-4"/>  
        </button>
        <button class="absolute top-4 right-10 justify-center bg-cyan-600 hover:bg-cyan-500 text-white py-2 px-4 rounded-lg transition-colors z-10" onclick={() => {getParties()}}>
            <img src="/refresh.svg" alt="refresh" class="w-4 h-4"/>
        </button>

    </div>
    
    <!-- move to right and have big text -->
    <div class="text-center m-4 text-3xl" >Join A Watch Party!</div>
    

    <ul class="grid grid-cols-2 gap-4 overflow-scroll">
        {#each allParties as party}
            <li>
                <button onclick={() => {joinParty(party.owner, party.videotime, party.video, party.videotitle)}} class="w-full h-full bg-cyan-600 hover:bg-cyan-500 text-white py-2 px-4 rounded-lg transition-colors">
                    <div class="text-white font-bold text-2xl">{party.owner}</div>
                    <div class="text-white font-bold text-2xl">{party.videotitle}</div>
                    <div class="text-white font-bold text-2xl">{Math.floor(party.videotime/60)}:{Math.ceil(party.videotime%60)}</div>
                </button>
            </li>
        {/each}
    </ul>
</div>
</div>
{/if}   

<style>
    /* Magical Input Effects */
    .magical-input {
        background: linear-gradient(45deg, #8b5cf6, #6366f1, #a855f7) !important;
        box-shadow: 0 0 20px rgba(168, 85, 247, 0.5);
        animation: magical-glow 2s infinite, float 3s ease-in-out infinite;
        padding: 0.75rem 1rem;
        border-radius: 0.5rem;
        transition: all 0.3s ease;
    }

    .magical-input::before {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        background: linear-gradient(45deg, #8b5cf6, #6366f1, #a855f7);
        z-index: -1;
        filter: blur(10px);
        opacity: 0.7;
    }

    .magical-input::after {
        content: '✨';
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        animation: sparkle 1.5s infinite;
    }

    @keyframes magical-glow {
        0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.5); }
        50% { box-shadow: 0 0 40px rgba(168, 85, 247, 0.8); }
    }

    @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-3px); }
    }

    @keyframes sparkle {
        0% { opacity: 0; transform: scale(0.8); }
        50% { opacity: 1; transform: scale(1.2); }
        100% { opacity: 0; transform: scale(0.8); }
    }

    /* Gemini Button Animation */
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
    }
    .gemini-button {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
</style>