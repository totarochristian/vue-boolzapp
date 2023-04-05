import Picker from '../components/vue3-emoji-picker/emoji-picker.js';

const {createApp} = Vue;
createApp({
    data(){
        return {
            splashVisibility: true,
            chatToSearch: '',
            modalTypeOpened: 0,
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
            chatBackgrounds: ["allRed.png","forestDay.jpg","forestDayRed.jpg","forestHero.jpg","forestOrange.jpg","forestSunset.webp","manRed.webp","mine.webp","mountainsBirds.webp","riverSunset.webp"],
            profilePictures: ["avatar_1.jpg","avatar_2.jpg","avatar_3.jpg","avatar_4.jpg","avatar_5.jpg","avatar_6.jpg","avatar_7.jpg","avatar_8.jpg","avatar_9.jpg"],
            accessStates: ["Sta scrivendo ...","Online"],
            messagesToReturn: ["Ok","Va bene","Nessun problema","Ma stai bene?","Per caso sei caduto dalle scale?","Sei nato stupido o ti sei impegnato per diventarlo?","A volte non so se risponderti o continuare a farmi i cavoli miei!","Potresti pensare prima di parlare?","A volte non capisco se ci sei o ci fai...","Buongiorno!","Alla buon ora...","Non ci posso credere...","No!","Sei libero il prossimo sabato?","Vediamoci una di queste sere","Ah, ma allora mi pensi ogni tanto.. non ci sentiamo da un sacco di tempo!","Guarda chi è resuscitato dalla tomba! Come stai?"]
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
                //Gets the id of the contact opened and call the Random Message By Contact method
                const id = this.contactOpened.id;
                this.RandomMessageByContact(id);
            }
        },
        RandomMessageByContact(tmp){
            const id = JSON.parse(JSON.stringify(tmp));
            //Wait for a random number of seconds before set the lastAccess as "Online"
            setTimeout(()=>{
                //Update the last access of the contacts that is sending the new message to "Online"
                this.contacts[this.GetIndexOfContactById(id)].lastAccess = this.accessStates[1];
                //Wait for a random number of seconds before set the lastAccess as "Sta scrivendo ..."
                setTimeout(()=>{
                    //Update the last access of the contacts that is sending the new message to "Sta scrivendo ..."
                    this.contacts[this.GetIndexOfContactById(id)].lastAccess = this.accessStates[0];
                    //Start a timeout (with random time) before the simulation of a random message from the contact
                    setTimeout(()=>{
                        const tmpDate = GetCurrentDateTimeStringFormatted();
                        const obj = {
                            date: tmpDate,
                            dateAbbreviation: GetContactLastMessageDate(tmpDate),
                            timeAbbreviation: GetCustomTimeString(new Date(tmpDate)),
                            message: this.GetRandomMessageToReturn(),
                            status: "received",
                            toRead: this.contactOpened.id == id ? false : true
                        }
                        //Add the message to the array of messages
                        this.contacts[this.GetIndexOfContactById(id)].messages.push(obj);
                        //Update the last access of the contact that sented the message to "Online"
                        this.contacts[this.GetIndexOfContactById(id)].lastAccess = this.accessStates[1];
                        //Play an audio to notify the user the new message
                        PlayAudio(this.profile.sounds.newMessage);
                        //Sort the contacts because of the new message
                        this.SortContacts();
                        //Scroll down the messages div to see the new message if the contact 
                        //that send the message is opened in the form right
                        if(this.contacts[this.GetIndexOfContactById(id)].id==this.contactOpened.id)
                            this.MessagesScrollDown();
    
                        //After sending the message, wait random  um of seconds before set the state as "offi alle xx:yy"
                        setTimeout(()=>{
                             //Update the last access of the contact that sented the message with the current time
                            this.contacts[this.GetIndexOfContactById(id)].lastAccess = "oggi alle " + GetCustomTimeString(new Date(tmpDate));
                        },GetRandomInt(5000,1000));
                    },GetRandomInt(5000,1000));
                },GetRandomInt(10000,1000));
            },GetRandomInt(5000,1000));
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
                const date1 = contact1.messages.length > 0 ? new Date(contact1.messages[contact1.messages.length-1].date) : new Date();
                const date2 = contact2.messages.length > 0 ? new Date(contact2.messages[contact2.messages.length-1].date) : new Date();
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
            this.modalTypeOpened = 0;
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
                if(this.$refs.chatMessages.length>0)
                    this.$refs.chatMessages[this.$refs.chatMessages.length-1].scrollIntoView();
            });
        },
        /**
         * Function used to search the index of the contact with the passed id inside the contacts list.
         * @param {*} id Id to be searched inside the contacts array.
         */
        GetIndexOfContactById(id){
            let res = 0;
            this.contacts.forEach((contact,index)=>{
                if(contact.id == id){
                    res = index;
                    return;
                }
            });
            return res;
        },
        /**
         * Function used to return a random message from the array messagesToReturn.
         * @returns String containing a random message
         */
        GetRandomMessageToReturn(){
            return this.messagesToReturn[GetRandomInt(this.messagesToReturn.length-1,0)];
        },
        /**
         * Function used when user open the modal to chose the new profile picture.
         * This function will set the index in the temp modal result to visualize
         * the current profile image selected if inside the array (otherwise set the 0);
         */
        OpenModalChoseProfilePicture(){
            this.modalTypeOpened = 1;
            let toSearch = this.profile.avatar.substring(this.profile.avatar.lastIndexOf('/') + 1, this.profile.avatar.length);
            this.tempModalResult = this.profilePictures.indexOf(toSearch);
            //If not founded, set 0
            if(this.tempModalResult < 0)
                this.tempModalResult = 0;
        },
        /**
         * Function used to set the new profile picture using the tempModalResult value stored previously.
         */
        SaveNewProfilePicture(){
            //Set the contact opened background image using the index saved in the temp modal result var
            this.profile.avatar = './assets/images/profiles/' + this.profilePictures[this.tempModalResult];
            //Reset to 0 the temp modal result saved
            this.SetTempModalResult(0);
        },
        /**
         * Function used to delete all the messages contained in the opened chat
         */
        DeleteChatMessages(){
            this.contactOpened.messages.splice(0,this.contactOpened.messages.length);
        },
        /**
         * Function used to delete all the chats messages
         */
        DeleteForEachChatAllMessages(){
            this.contacts.forEach((contact)=>{
                contact.messages.splice(0,contact.messages.length);
            });
        },
        /**
         * Function used to close the opened chat and delete all the contacts
         */
        DeleteAllContacts(){
            this.CloseChat();
            this.contacts.splice(0,this.contacts.length);
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