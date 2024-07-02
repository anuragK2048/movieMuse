import { useEffect } from "react";

export default function useKey (pressedKey, action, value=true) {
    function callback(e){
        if(e.code.toLowerCase()===pressedKey.toLowerCase()){
            value ? action() : action(value);
        }
    }
    useEffect(function(){
        document.addEventListener("keydown",callback);
        return ()=>document.removeEventListener("keydown",callback)
    },[])
} 