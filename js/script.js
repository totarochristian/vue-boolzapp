async function LoadJsonFile(){
    const response = await fetch("../assets/data/data.json");
    const json = await response.json();
    return json;
}

const {createApp} = Vue;
createApp({
    data(){
        return {
            
        }
    },
    methods:{
        
    }
}).mount("#app");