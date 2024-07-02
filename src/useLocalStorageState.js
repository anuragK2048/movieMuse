import { useState, useEffect } from "react";
export default function useLocalStorageState (initialState, keyName) {
    const [value, setValue] = useState(function(){
        const unparsed = sessionStorage.getItem(`${keyName}`);
        return unparsed ? JSON.parse(unparsed) : initialState;
    });

    useEffect(function(){
        sessionStorage.setItem(`${keyName}`,JSON.stringify(value));
    },[value,keyName])

    return [value,setValue]
}