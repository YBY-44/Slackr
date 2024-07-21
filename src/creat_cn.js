import { callAPIpost_withtoken } from "./API.js";
import { get_all_channel } from "./main.js";
import { error_message } from "./main.js";
import { get_now_user } from "./API.js";
import {close_temp_search} from "./invite.js";
import { clear_all_ready } from "./invite.js";
import {invite} from "./invite.js";
import {loading_all_user} from "./invite.js";
// get all corresponding button
let ct_channel_btn = document.getElementById("ct_channel");
let ct_channel_div=document.getElementById("creat_channel");
let creat = document.getElementById("ct_cn");
let cancel = document.getElementById("cl_cn");
// this function is used when a creat channel been canceled
const cancel_create = ()=>{
    // clear all searched user 
    close_temp_search();
    // clear all prepared user
    clear_all_ready();
    // let the creat channel part to none
    ct_channel_div.style.display='none';
    // select all input conponment
    let all_input = ct_channel_div.querySelectorAll("input");
    // initial the creat part
    all_input.forEach((item)=>{
        //  if the conponment is checkbox
        if (item.type==='checkbox'){
            
          item.checked=false;
        }
        // other case type is input
        else{
            item.value="";
        }
    })
    // set the button darker
    ct_channel_btn.style.filter='brightness(0.9)';
} 
// when the add channel button click
ct_channel_btn.addEventListener('click',()=>{
    // open the creat channel part if closed
    if (ct_channel_div.style.display==='flex'){
        ct_channel_btn.style.filter='brightness(0.9)';
        cancel_create();
    }
    // close the creat channel part if open
    else{
        ct_channel_btn.style.filter='brightness(1)';
        ct_channel_div.style.display='flex';
        // loading all user in this application prepare for the invite
        loading_all_user();
    }
})
// when the cancel button click run cancel
cancel.addEventListener('click',cancel_create);
// when the creat button click creat a new channel
creat.addEventListener('click',()=>{
    // select the all_input
    let all_input = ct_channel_div.querySelectorAll("input");
    // construct the new channel data
    const new_channel_info = {
        "name": String(all_input[0].value),
        "private": all_input[2].checked,
        "description": String(all_input[1].value)
    }
    console.log(new_channel_info);
    // get current user and token
    let [usr,token] = get_now_user();
    // call the backend to creat new channel
    callAPIpost_withtoken("channel",new_channel_info,token)
    .then((response) => {
        console.log(response.channelId);
        // call invite to invite all user in the waiting list
        invite(response.channelId,false);
        // close the creat part
        cancel_create();
        // clear all searched user
        close_temp_search();
        // show all channel
        get_all_channel(usr,token);
        // set the button style to unopen
        ct_channel_btn.style.filter='brightness(0.9)';
      })
      // show error
    .catch((error) => {
        console.log(error);
        let error_text = "";
        switch (error) {
          case "info":
            error_text = "Input error!";
            break;
          case"access":
            error_text = "Access error!";
          default:
            error_text = "Network error! Please try again.";
            break;
        }
        error_message(String(error_text));
    });
});
// when a user try to join the channel this function run
export const join_channel=(usr,token,id)=>{
    callAPIpost_withtoken('channel/'+id+'/join',{},token)
    .then((response) => {
        // get_all_channel(usr,token);
      })
      // show error
    .catch((error) => {
        console.log(error);
        document.getElementById('1').inn
        let error_text = "";
        switch (error) {
          case "info":
            error_text = "Input error!";
            break;
          case"access":
            error_text = "Access error!";
          default:
            error_text = "Network error! Please try again.";
            break;
        }
        error_message(String(error_text));
    });
};
