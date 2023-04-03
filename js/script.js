const {createApp} = Vue;
createApp({
    data(){
        return {
            splashVisibility: true,
            chatToSearch: '',
            contactOpened: { id: -1 },
            profile:{
                name: 'Christian',
                avatar: "./assets/images/profiles/avatar_2.jpg",
                sounds: {
                    newMessage: "../assets/sounds/new/newMessage1.wav",
                    deleteMessage: "../assets/sounds/delete/deleteMessage1.wav",
                    saveMessage: ""
                }
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
            //Reset the messages to read when user open the chat
            this.contactOpened.messages.forEach(function(message){
                if(message.toRead)
                    message.toRead = false;
            });
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
                    status: "sent",
                    toRead: false
                }
                //Add the message to the array of messages
                this.contactOpened.messages.push(obj);
                //Cancel the value inside the newMessageToSend
                this.contactOpened.newMessageToSend = '';
                //Sort the contacts because of the new message
                this.SortContacts();
                //Start a timeout (with random time) before the simulation of a random message from the contact
                const index = this.contacts.indexOf(this.contactOpened);
                setTimeout(()=>{this.RandomMessageByContact(index)},GetRandomInt(10000,1000));
            }
        },
        RandomMessageByContact(index){
            const tmpDate = GetCurrentDateTimeStringFormatted();
            const obj = {
                date: tmpDate,
                dateAbbreviation: GetContactLastMessageDate(tmpDate),
                timeAbbreviation: GetCustomTimeString(new Date(tmpDate)),
                message: "ok",
                status: "received",
                toRead: this.contactOpened.id == this.contacts[index].id ? false : true
            }
            //Add the message to the array of messages
            this.contacts[index].messages.push(obj);
            //Play an audio to notify the user the new message
            PlayAudio(this.profile.sounds.newMessage);
            //Sort the contacts because of the new message
            this.SortContacts();
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
        },
        DeleteMessage(index){
            //Splice the messages array at the passed index
            this.contactOpened.messages.splice(index,1);
            //Play an audio to notify the user the deletion of a message
            PlayAudio(this.profile.sounds.deleteMessage);
            //Sort the contacts because of the deleting of a message
            this.SortContacts();
        },
        SortContacts(){
            //Compare the dates defined in the descending order 
            this.contacts.sort((contact1,contact2)=>{
                const date1 = new Date(contact1.messages[contact1.messages.length-1].date);
                const date2 = new Date(contact2.messages[contact2.messages.length-1].date);
                return CompareDates(date1, date2, false);
            });
        },
        CloseChat(){
            this.contactOpened = { id: -1 };
        }
    },
    async created(){
        const tmp = await LoadJsonFile();
        //Deep-copy of tmp.contacts array in this.contacts var
        this.contacts = JSON.parse(JSON.stringify(tmp.contacts));

        //Do a series of operations on the contacts elements
        this.contacts.forEach(function(contact) {
            //Update field used to set preview times
            contact.messages.forEach(function(message){
                message.dateAbbreviation = GetContactLastMessageDate(message.date);
                message.timeAbbreviation = GetCustomTimeString(new Date(message.date));
            });
            //Sort the messages arrays in the ascending order using dates
            contact.messages.sort((mess1,mess2)=>{
                const date1 = new Date(mess1.date);
                const date2 = new Date(mess2.date);
                return CompareDates(date1, date2, true);
            });
        });

        //Sort the contacts array to order the chats after the re-ordering of the messages arrays.
        this.SortContacts();
    },
    mounted(){
        setTimeout(this.ToggleSplashScreen,3000);
    }
}).mount("#app");