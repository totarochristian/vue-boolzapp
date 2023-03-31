const {createApp} = Vue;
createApp({
    data(){
        return {
            contactOpened: { id: -1 },
            profile:{
                name: 'Christian',
                avatar: "./assets/images/profiles/avatar_2.jpg"
            },
            contacts: []
        }
    },
    methods:{
        
    },
    async created(){
        const tmp = await LoadJsonFile();
        //Deep-copy of tmp.contacts array in this.contacts var
        this.contacts = JSON.parse(JSON.stringify(tmp.contacts));
        //Set the opened contact as the first element of the contacts array
        this.contactOpened = this.contacts[0];
    }
}).mount("#app");