import { callAPIpost, get_now_channel, get_now_user,callAPIget } from "./API.js";
import { get_img_array } from "./inchannel.js";
import { error_message, get_created_Elements_joined, received_message } from "./main.js";
import { meet_error } from "./profile.js";
// get all conponment of the big image part
const left_one =  document.getElementById("goes_left");
const right_one =document.getElementById("goes_right");
const show_one = document.getElementById("center_now");
const bg_canvss=document.getElementById('bg_img');
const img_big_container=document.getElementById('bigimg');
const now_index_item=document.getElementById('now_index');
const total_index_item=document.getElementById('total_index');
let choosed_pos="";
// the image index in the array
let now_index=0;
// the image array
let now_img_array;
// get the current positon of the picture in all image array
export const set_choosed_pos=(number)=>{
    // get the image array
    now_img_array=get_img_array();
    // get the current index number of the image
    now_index=number;
    // the index of the current pictures
    now_index_item.innerText=String(number+1);
    // the number of pictures
    total_index_item.innerText=String(now_img_array.length);
}
// when click to the previous page
left_one.addEventListener('click',()=>{
    // set index-1
    now_index-=1;
    // check lower bound
    if(now_index<0){
        now_index = 0;
        return;
    }
    // update the index and the image
    now_index_item.innerText=now_index+1;
    console.log(now_img_array[now_index]);
    show_one.src = now_img_array[now_index].src;
    })
// when click to the next page
right_one.addEventListener('click',()=>{
    // set index+1
    now_index+=1;
    // check upper bound
    if(now_index>now_img_array.length-1){
        now_index = now_img_array.length - 1;
        return;
    }
    // update the index and the image
    now_index_item.innerText=now_index+1;
    show_one.src = now_img_array[now_index].src;
    
})
// when the big image click
show_one.addEventListener('click',()=>{
    // close the big image part
    choosed_pos="";
    img_big_container.style.display='none';
    bg_canvss.style.display='none';
})

let channel_last_info={}
export const initial_loading=()=>{
    get_created_Elements_joined().forEach(element => {
        const channel_name = element.querySelector('.channel_name_own');
        let name_txt="";
        if(channel_name){
            name_txt=channel_name.innerText+" : ";
        }
        const cn_id_obj = element.querySelector('.channel_dis_own');
        const cn_id = cn_id_obj.innerText.substring(3,9);
        const [user,token]=get_now_user();
        callAPIget(
            "message/" + String(cn_id) + "?start=0",
            token
          )
            // Request the backend to load the messages
            .then((response) => {
                const new_comp = response.messages[0];
                let newest = -1;
                if(new_comp){
                    newest = new_comp.id;
                }
                else{
                    newest=-1;
                }
                if(channel_last_info[cn_id]){
                    if (channel_last_info[cn_id]!=newest){
                        if(get_now_channel()!=cn_id){
                            received_message(name_txt + new_comp.message);
                            const tag = element.querySelector('.new_push');
                            tag.style.display='block';
                        }
                        channel_last_info[cn_id]=newest;
                    }
                }
                else{
                    channel_last_info[cn_id]=newest;
                }
            })
            .catch((error) => {
              meet_error(error);
            });
    });
}