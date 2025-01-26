<script>
    import {
        currentVideo,
        watchPartyMode,
        watching,
        seatNumber,
        watchingTime,
        colormap,
    } from "../lib/tmdb";
    import { onDestroy, onMount } from "svelte";


    let chatMessage = $state({
        messager: $seatNumber,
        message: "",
    });
    let chatEnabled = $state(false);
    let allChats = $state([]);
    let intervalId;

    $inspect("colormap", $colormap);
    $inspect("allChats", allChats);
    // $inspect(allChats);
    async function updateChats() {
        allChats = await fetch("/api/chat/getRoomMessages?owner=" + $watching);
        allChats = await allChats.json();
        for (let i = 0; i < allChats.length; i++){
            if($colormap[allChats[i].messager] == undefined){
                let randomcol = "hsl(" + Math.floor(Math.random() * 360) +", 78% , 46%)"     
                $colormap[allChats[i].messager] = randomcol;
            }else{
                allChats[i].color = $colormap[allChats[i].messager];
            }
        }
        // also update video time for owner
        if(JSON.stringify($watching) == JSON.stringify($seatNumber)){
            let data = await fetch("/api/chat/syncVideo?owner=" + $seatNumber, {
                method: "POST",
                body: JSON.stringify({
                    owner: $seatNumber,
                    videotime: player.playerInfo.currentTime,
                }),
            });
            // for other people sync to owner time if it is 10 seconds or more off
        }else {
            let data = await fetch("/api/chat/getRoomInfo?owner=" + $watching)
            data = await data.json()
            if(Math.abs(player.playerInfo.currentTime - data.videotime) > 10){
                player.seekTo(Math.ceil(data.videotime), true);  
            }
        }
    }

    async function closeVideo() {
        let data = await fetch("/api/chat/closeRoom?owner=" + $seatNumber);
        $watching = "";
        $watchPartyMode = false;
        $currentVideo = null;
    }

    onMount(() => {
        intervalId = setInterval(updateChats, 1000);
    });

    onDestroy(() => {
        if (intervalId) {
            clearInterval(intervalId);
        }
        closeVideo();
    });

    function sendMessage() {
        fetch("/api/chat/addChat", {
            method: "POST",
            body: JSON.stringify({
                owner: $watching,
                message: chatMessage,
            }),
        });
        chatMessage = {
            messager: $seatNumber,
            message: "",
        };
        updateChats();
    }

    let player;
    let ytScriptLoaded = false;

    async function initializePlayer() {
        if (typeof YT === "undefined" || typeof YT.Player === "undefined") {
            if (!ytScriptLoaded) {
                await new Promise((resolve) => {
                    const tag = document.createElement("script");
                    tag.src = "https://www.youtube.com/iframe_api";
                    const firstScriptTag =
                        document.getElementsByTagName("script")[0];
                    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
                    ytScriptLoaded = true;
                    tag.onload = resolve;
                });
            }
            await new Promise(
                (resolve) => (window.onYouTubeIframeAPIReady = resolve),
            );
        }

        if (player) {
            player.destroy();
        }

        player = new YT.Player("yt", {
            height: window.innerHeight,
            width: window.innerWidth,
            videoId: $currentVideo.results[0].key,
            playerVars: {
                controls: 1,
                modestbranding: 1,
                showinfo: 0,
                rel: 0,
                autoplay: 1,
                start: (JSON.stringify($watching) != JSON.stringify($seatNumber)) ? Math.ceil($watchingTime) : 0,  
            },
        });
    }

    $effect(() => {
        if ($currentVideo?.results[0]?.key) {
            initializePlayer();
        }
    });

    onDestroy(() => {
        if (player) {
            player.destroy();
            player = null;
        }
        if (intervalId) clearInterval(intervalId);
        closeVideo();
    });

    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    }

</script>

<div
    class="sticky top-0 left-0 w-full h-full bg-black/50 backdrop-blur-sm z-[60]"
>
    <div id="yt"></div>
    <!-- <button class="absolute top-4 left-4 justify-center bg-cyan-600 hover:bg-cyan-500 text-white py-2 px-4 rounded-lg transition-colors z-30" onclick={getCurrentTime}>testbutton</button> -->
    <!-- <iframe id="yt" width={window.innerWidth} height={window.innerHeight} src="https://www.youtube.com/embed/{$currentVideo.results[0].key}?&controls=1&modestbranding=1&showinfo=0&rel=0&autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe> -->
    <button
        class="absolute top-4 left-4 justify-center bg-cyan-600 hover:bg-cyan-500 text-white py-2 px-4 rounded-lg transition-colors z-30"
    >
        <img
            onclick={() => {
                $currentVideo = null;
            }}
            src="/back.png"
            alt="back"
            class="w-4 h-4"
        />
    </button>
    {#if $watchPartyMode}
        {#if chatEnabled}
            <div
                class="absolute top-4 right-4 h-[90%] w-96 bg-gradient-to-b from-cyan-800/20 to-slate-600/20 rounded-lg flex flex-col-reverse"
            >
                

                <!-- <div>
                    <input
                        type="text"
                        bind:value={chatMessage.message}
                        placeholder="Enter your message here..."
                        class="w-full h-10 bg-transparent outline-none placeholder-slate-400 text-white"
                    />
                    <button onclick={sendMessage} class="text-white font-bold">
                        <img src="/send.svg" alt="send" class="w-4 h-4"/>
                    </button>
                </div> -->

                <div class="w-full bg-cyan-800/20 p-4 rounded-lg">
                    <input 
                        type="text"
                        bind:value={chatMessage.message}
                        onkeydown={handleKeyPress}
                        placeholder="Type your message..."
                        class="w-full p-3 text-white bg-gray-100/20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                <div class="text-white font-bold flex flex-col gap-2 ml-4 w-4/5">
                    <!-- <ChatHistory messages = $allChats /> -->
                     <!-- {JSON.stringify(allChats)} -->
                      {#each allChats as m}
                        <div class="flex items-start gap-2.5">
                            <div style="background-color: {m.color};" class= {`flex flex-col w-full max-w-[320px] p-1 rounded-e-xl rounded-es-xl`}
                                 >
                                <div class="flex items-center space-x-2 rtl:space-x-reverse">
                                    <span class="text-sm font-semibold text-gray-900 dark:text-white"> {m.messager} |</span>
                                    <p class="text-sm font-normal py-2 text-gray-900 dark:text-white"> {m.message}</p>
                                </div>
                            </div>
                        </div>


                      {/each}
                </div>
            </div>

            <button
                class="absolute top-4 right-4 justify-center bg-cyan-600 hover:bg-cyan-500 text-white py-2 px-4 rounded-lg transition-colors z-30"
                onclick={() => {
                    chatEnabled = false;
                }}
            >
                <img src="/close.svg" alt="chat" class="w-4 h-4" />
            </button>
        {:else}
            <button
                class="absolute top-4 right-4 justify-center bg-cyan-600 hover:bg-cyan-500 text-white py-2 px-4 rounded-lg transition-colors z-30"
                onclick={() => {
                    chatEnabled = true;
                }}
            >
                <img src="/chat.svg" alt="chat" class="w-4 h-4" />
            </button>
        {/if}
    {/if}
</div>
