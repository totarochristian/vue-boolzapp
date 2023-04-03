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
        },
        SendNewMessage(){
            if(this.contactOpened.newMessageToSend){
                const tmpDate = GetCurrentDateTimeStringFormatted();
                const obj = {
                    date: tmpDate,
                    dateAbbreviation: GetContactLastMessageDate(tmpDate),
                    timeAbbreviation: GetCustomTimeString(new Date(tmpDate)),
                    message: this.contactOpened.newMessageToSend,
                    status: "sent"
                }
                this.contactOpened.messages.push(obj);
            }
        }
    },
    async created(){
        const tmp = await LoadJsonFile();
        //Deep-copy of tmp.contacts array in this.contacts var
        this.contacts = JSON.parse(JSON.stringify(tmp.contacts));

        //Update field used to set preview times
        this.contacts.forEach(function(contact) {
            contact.messages.forEach(function(message){
                message.dateAbbreviation = GetContactLastMessageDate(message.date);
                message.timeAbbreviation = GetCustomTimeString(new Date(message.date));
            });
        });
    }
}).mount("#app");