const {createApp} = Vue;
createApp({
    data(){
        return {
            splashVisibility: true,
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
        /**
         * Function used to open a contact in the form right div.
         * @param {*} index Index of the contact (in the array of contacts) to be opened.
         */
        OpenContact(index){
            //Set the opened contact as the index-element of the contacts array.
            this.contactOpened = this.contacts[index];
        },
        /**
         * Function used to send a new message to an opened contact.
         */
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
                //Add the message to the array of messages
                this.contactOpened.messages.push(obj);
                //Cancel the value inside the newMessageToSend
                this.contactOpened.newMessageToSend = '';
            }
        },
        /**
         * Function used to toggle the splash screen.
         */
        ToggleSplashScreen(){
            this.splashVisibility = !this.splashVisibility;
        },
        /**
         * Function used to set visible or invisible a contact searched in the search bar.
         */
        SearchContact(){
            const text = this.chatToSearch.toLowerCase();
            this.contacts.forEach(function(contact){
                if(text=='' || contact.name.toLowerCase().includes(text))
                    contact.visible = true;
                else
                    contact.visible = false;
            });
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
    },
    mounted(){
        setTimeout(this.ToggleSplashScreen,3000);
    }
}).mount("#app");