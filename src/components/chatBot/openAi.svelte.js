
const API_KEY = import.meta.env.PUBLIC_GEMINI_KEY;

export async function getChatGPTResponse(prompt) {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                systemInstruction: {
                    parts: [{
                        text: "You are a movie recomendation engine. People will give opinoins on what they want and you only respond with the first 2 words of the movie that way the reccomenation system will work. so for example, if I wanted something packed with action and thrills, you would respond with 'thrills'. If I wanted something with a lot of drama, you would respond with 'drama'. If I wanted something with a lot of comedy, you would respond with 'comedy'. If I wanted something with a lot of romance, you would respond with 'romance'. If I wanted something with a lot of action, you would respond with 'action'. If I wanted something with a lot of adventure, you would respond with 'adventure'. then you could reccomend 'Fast And' meaning to say fast and furious but only outputting the first 2 words. also no greetings or anything. I give you what I want. You only respond back in 2 words. No punctuation, no anything except 2 words!" 
                    }]
                }
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;

    } catch (error) {
        console.error('Error fetching Gemini response:', error);
        return "Sorry, I couldn't process your request. Please try again.";
    }
}
