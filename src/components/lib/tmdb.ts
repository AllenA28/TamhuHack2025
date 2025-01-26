export const API_KEY = "f4a59a5c1693ff9fb6c8c6b7e70b2180";
export const BASE_URL = "https://api.themoviedb.org/3/movie";
import { writable } from "svelte/store";

export const currentVideo: any = writable(null);

export type MovieCategory = 'popular' | 'top_rated' | 'now_playing' | 'upcoming';


export interface Movie {
    id: number;
    title: string;
    poster_path: string;
    release_date: string;
    vote_average: number;
    backdrop_path: string;
    overview: string;
}

export async function fetchMovies(category: MovieCategory, page: number = 1): Promise<Movie[]> {
    const response = await fetch(`${BASE_URL}/${category}?api_key=${API_KEY}&page=${page}`);
    const data = await response.json();
    return data.results;
}

// Add to tmdb.ts
export async function fetchMovieDetails(id: number): Promise<Movie> {
    const response = await fetch(`${BASE_URL}/${id}?api_key=${API_KEY}&append_to_response=videos`);
    return response.json();
}

export async function fetchVideos(id: number) {
    // calls http://api.themoviedb.org/3/movie/157336/videos?api_key=###
    const response = await fetch(`${BASE_URL}/${id}/videos?api_key=${API_KEY}`);
    return response.json();
}