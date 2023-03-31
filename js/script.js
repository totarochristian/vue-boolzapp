const {createApp} = Vue;
createApp({
    data(){
        return {
            contacts: []
        }
    },
    methods:{
        
    },
    async created(){
        const tmp = await LoadJsonFile();
        //Deep-copy of tmp.contacts array in this.contacts var
        this.contacts = JSON.parse(JSON.stringify(tmp.contacts));
    }
}).mount("#app");