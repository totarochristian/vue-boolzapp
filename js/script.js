const {createApp} = Vue;
createApp({
    data(){
        return {
            splashVisibility: true,
            chatToSearch: '',
            tempModalResult: '',
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
            contacts: [],
            chatBackgrounds: ["allRed.png","forestDay.jpg","forestDayRed.jpg","forestHero.jpg","forestOrange.jpg","forestSunset.webp","manRed.webp","mine.webp","mountainsBirds.webp","riverSunset.webp"]
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
            //Scroll down the messages div
            this.MessagesScrollDown();
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
                //Scroll down the messages div
                this.MessagesScrollDown();
                //Start a timeout (with random time) before the simulation of a random message from the contact
                const index = this.contacts.indexOf(this.contactOpened);
                setTimeout(()=>{ this.RandomMessageByContact(index); },GetRandomInt(10000,1000));
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
            //Scroll down the messages div to see the new message if the contact 
            //that send the message is opened in the form right
            if(this.contacts[index].id==this.contactOpened.id)
                this.MessagesScrollDown();
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
        /**
         * Function used to delete a message using the index in the array of messages opened.
         * @param {*} index Index of the message to delete.
         */
        DeleteMessage(index){
            //Splice the messages array at the passed index
            this.contactOpened.messages.splice(index,1);
            //Play an audio to notify the user the deletion of a message
            PlayAudio(this.profile.sounds.deleteMessage);
            //Sort the contacts because of the deleting of a message
            this.SortContacts();
        },
        /**
         * Function used to sort the contacts in descending order.
         */
        SortContacts(){
            //Compare the dates defined in the descending order 
            this.contacts.sort((contact1,contact2)=>{
                const date1 = new Date(contact1.messages[contact1.messages.length-1].date);
                const date2 = new Date(contact2.messages[contact2.messages.length-1].date);
                return CompareDates(date1, date2, false);
            });
        },
        /**
         * Function used to close an opened chat.
         */
        CloseChat(){
            this.contactOpened = { id: -1 };
        },
        /**
         * Function used to set the tempModalResult var with a passed value.
         * @param {*} result Value to be saved in the temporary variable.
         */
        SetTempModalResult(result){
            this.tempModalResult = result;
        },
        /**
         * Function used when user open the modal to chose the new chat background.
         * This function will set the index in the temp modal result to visualize
         * the current background selected if inside the array (otherwise set the 0);
         */
        OpenModalChoseChatBackground(){
            let toSearch = this.contactOpened.backgroundImage.substring(this.contactOpened.backgroundImage.lastIndexOf('/') + 1, this.contactOpened.backgroundImage.length);
            this.tempModalResult = this.chatBackgrounds.indexOf(toSearch);
            //If not founded, set 0
            if(this.tempModalResult < 0)
                this.tempModalResult = 0;
        },
        /**
         * Function used to set the new chat background using the tempModalResult value stored previously.
         */
        SaveNewChatBackground(){
            //Set the contact opened background image using the index saved in the temp modal result var
            this.contactOpened.backgroundImage = './assets/images/backgrounds/' + this.chatBackgrounds[this.tempModalResult];
            //Reset to 0 the temp modal result saved
            this.SetTempModalResult(0);
        },
        /**
         * Function used to scroll down the messages
         */
        MessagesScrollDown(){
            this.$nextTick(()=>{
                this.$refs.chatMessages[this.$refs.chatMessages.length-1].scrollIntoView();
            });
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