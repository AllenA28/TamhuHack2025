
<script>
    import { Canvas } from '@threlte/core'
    import Scene from './Scene.svelte'
</script>


<header>
    <nav>
        <a href="/" class="button">Home</a>
    </nav>
</header>

<div style="width: 100svw; height: 100svh;">  
    <Canvas renderMode="on-demand">
        <Scene/>
    </Canvas>
</div>

<style>
    header {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        background-color: black;
        padding: 10px 0;
        z-index: 1000;
    }

    nav {
        display: flex;
        justify-content: center;
    }

    .button {
        display: inline-block;
        padding: 10px 20px;
        color: white;
        font-size: 15px;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
        transition: 0.3s ease;
    }

    .button:hover {
        padding: 15px 25px;
        font-size: 23px;
    }
    :global(body) {
    background-color: black;
    }

</style>
<!--<div>hello from svelte</div>

<div> 
    <h1> Flight Info </h1>
    <a class="bigButton" href="/"> Home </a>
</div>-->

  

