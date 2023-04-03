const {createApp} = Vue;
createApp({
    data(){
        return {
            chatToSearch: '',
            contactOpened: { id: -1 },
            profile:{
                name: 'Christian',
                avatar: "./assets/images/profiles/avatar_2.jpg"
            },
            contacts: []
        }
    },
    methods:{
        OpenContact(index){
            //Set the opened contact as the index-element of the contacts array
            this.contactOpened = this.contacts[index];
        }
    },
    async created(){
        const tmp = await LoadJsonFile();
        //Deep-copy of tmp.contacts array in this.contacts var
        this.contacts = JSON.parse(JSON.stringify(tmp.contacts));

        this.contacts.forEach(function(contact) {
            contact.messages.forEach(function(message){
                message.dateAbbreviation = GetContactLastMessageDate(message.date);
            });
        });
    }
}).mount("#app");