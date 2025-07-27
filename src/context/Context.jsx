import { createContext, useState } from "react";
import runChat from "../config/Gemini";

export const Context = createContext();

export const ContextProvider = (props) => {

    // States
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

    // Function for typing effect
    const delayPara = (index, nextWord) => {
        setTimeout(function () {
            setResultData(prev => prev + nextWord)
        }, 75 * index);
    }

    const newChat = () => {
        setLoading(false);
        setShowResult(false);
    }

    // Function that will fetch prompt
    const onSent = async (prompt) => {
        setResultData("")
        setLoading(true)
        setShowResult(true)

        // Storing previous prompts in recent section
        let response;
        if (prompt !== undefined) {
            response = await runChat(prompt);
            setRecentPrompt(prompt);
        }
        else {
            setPrevPrompts(prev => [...prev, input]);
            setRecentPrompt(input);
            response = await runChat(input);
        }

        // Converting double star with bold tag
        let responseArray = response.split("**");
        let newResponse = " ";
        for (let i = 0; i < responseArray.length; i++) {
            if (i === 0 || i % 2 !== 1) {
                newResponse += responseArray[i];
            }
            else {
                newResponse += "<br> <b style='font-weight: 700;'>" + responseArray[i] + "</b>";
            }
        }
        let newResponse2 = newResponse.split("*").join("<br>")

        // Creating typing effect 
        let newResponseArray = newResponse2.split(" ");
        for (let i = 0; i < newResponseArray.length; i++) {
            const nextWord = newResponseArray[i];
            delayPara(i, nextWord + " ")
        }

        setLoading(false)
        setInput("")
        runChat(input)
    }

    const contextValue = {
        onSent,
        input,
        setInput,
        prevPrompts,
        setPrevPrompts,
        recentPrompt,
        setRecentPrompt,
        loading,
        showResult,
        resultData,
        newChat
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

