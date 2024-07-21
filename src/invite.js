// A helper you may want to use when uploading new images to the server.
import { callAPIget, callAPIpost_withtoken } from "./API.js";
import { check_image, get_user_info } from "./profile.js";
import { get_now_user } from "./API.js";
import { get_now_channel } from "./API.js";
import { meet_error } from "./profile.js";
import { get_members } from "./inchannel.js";
import { refresh_channel_member } from "./inchannel.js";
// all user registed
let all_user = [];
// all user been the searched
let temp_window = [];
// all user in the invite container
let reday_for_invite = [];
// all user id in the inviter container
let ready_for_invite_id = [];
// all user
let all_user_in = [];
// all user been searched in created channel
let temp_window_in = [];
// all user in the invite container in created channel
let reday_for_invite_in = [];
// all user id in the inviter container in created channel
let ready_for_invite_id_in = [];
// get the conponment in the user
const usr_add = document.getElementById("usr_add");
// get the conponment to display temp invite user
const temp_added = document.getElementById("temp_added");
// clear all user in the temp invite area
export const clear_all_ready = () => {
  reday_for_invite.forEach((item) => item.remove());
  reday_for_invite = [];
  ready_for_invite_id = [];
};
// clear all user has been searched
const clear_temp_window = () => {
  temp_window.forEach((item) => item.remove());
  temp_window = [];
};
// clear all user in the temp invite area for created channel
export const clear_all_ready_in = () => {
  reday_for_invite_in.forEach((item) => item.remove());
  reday_for_invite_in = [];
  ready_for_invite_id_in = [];
};
// clear all user has been searched
export const clear_temp_window_in = () => {
  temp_window_in.forEach((item) => item.remove());
  temp_window_in = [];
};
// loading all basic information for all registed user
export const loading_all_user = () => {
  // reset all user
  all_user = [];
  // get the usr and the token
  const [usr, token] = get_now_user();
  // try to get all user information
  callAPIget("user", token)
    .then((response_out) => {
      // show all user
      response_out.users.forEach((element) => {
        // get the usr and the token
        const [usr, token] = get_now_user();
        // try to get the specific information of the current user
        callAPIget("user/" + element.id, token)
          .then((response) => {
            // get the specific information of the curent user
            const data = {
              id: element.id,
              name: response.name,
              image: response.image,
              email: response.email,
            };
            // add the user information to the array
            all_user.push(data);
          })
          // show error
          .catch((error) => {
            meet_error(error);
          });
      });
      console.log(all_user);
    })
    // show error
    .catch((error) => {
      meet_error(error);
    });
};
// get the searched user
const update_search = (search_info, container, isin, members) => {
  // <div class="temp_block">
  //   <img class="temp_block_icon">
  //   <p class="temp_block_name">YANG</p>
  // </div>
  //  the searched result
  let t_window = temp_window_in;
  //  user temp invited
  let reday_item = reday_for_invite_in;
  //   user temp invited with id
  let ready_id = ready_for_invite_id_in;
  //   set the container is the inchannel
  let add_container = temp_added;
  //   if the container flag is not inchannel
  if (isin === false) {
    // change the container to the creat one
    t_window = temp_window;
    reday_item = reday_for_invite;
    ready_id = ready_for_invite_id;
    add_container = usr_add;
  }
  console.log(ready_id);
  //  get current user
  const [usr, token] = get_now_user();
  //  get the search result
  let result = all_user.filter((item) => {
    return item.name.startsWith(search_info) && item.id != usr;
  });
  //  filter the temp invited user
  result = result.filter((item) => !ready_id.includes(item.id));
  //  if the channel has already been created then filter the user has already in
  //  the channel
  if (isin === true) {
    console.log(members);
    result = result.filter((item) => !members.includes(item.id));
  }
  //  sort all user with the name
  result.sort((a, b) => a.name.localeCompare(b.name, "en-US"));
  //   get the drop box
  const corrsponding_drop = document.getElementById(container);
  //  show all searched user
  result.forEach((item) => {
    // creat the block dom each block means a user
    const block = document.createElement("div");
    block.className = "temp_block";
    const img = document.createElement("img");
    check_image(img, item.image);
    img.className = "temp_block_icon";
    const p = document.createElement("p");
    p.className = "temp_block_name";
    p.innerText = item.name;
    const button = document.createElement("button");
    button.innerText = "Add";
    block.appendChild(img);
    block.appendChild(p);
    block.appendChild(button);
    //  append the block
    corrsponding_drop.appendChild(block);
    //  when the add button click
    button.addEventListener("click", () => {
      //  add the conponment to the temp invite
      const usr_cont = document.createElement("div");
      usr_cont.id = "ct " + item.id;
      //  creat the profilt
      const icon = document.createElement("img");
      //  creat the user_name
      const usr_name = document.createElement("p");
      usr_cont.className = "each_usr";
      icon.className = "each_usr";
      icon.style.transition = "src 0.5s, background-color 0.3s";
      check_image(icon, item.image);
      usr_name.className = "each_usr each_usr_b";
      usr_name.innerText = item.name;
      //  add the conponment to the container
      usr_cont.appendChild(icon);
      usr_cont.appendChild(usr_name);
      add_container.appendChild(usr_cont);
      // push the conponment to the array
      reday_item.push(usr_cont);
      //  when mouse move to the temp invited user icon then the icon ready for delete
      icon.addEventListener("mouseover", () => {
        icon.src = "src/img/DEL.png";
        icon.style.backgroundColor = "#727272";
      });
      //  when the mouse moveout the return to the original part
      icon.addEventListener("mouseout", () => {
        check_image(icon, item.image);
        icon.style.backgroundColor = "white";
      });
      //  when click the temp invited user icon then delete that user
      icon.addEventListener("click", () => {
        // get the choosed user id
        const id = icon.parentNode.id.split(" ")[1];
        // get the choosed conponment
        let id_index = ready_id.indexOf(Number(id));
        // if the id is valid then delete in the array
        if (id_index !== -1) {
          // remove in array
          ready_id.splice(id_index, 1);
        }
        // remove the choosed item
        icon.parentNode.remove();
        // get the user conponment
        let par_index = reday_item.indexOf(icon.parentNode);
        // delete the user conponment
        if (par_index !== -1) {
          // remove in array
          reday_item.splice(par_index, 1);
        }
      });
      //  remove the node in temp searched
      button.parentNode.remove();
      //  ready for invite user add one
      ready_id.push(item.id);
    });
    // searched user added
    t_window.push(block);
  });
};
// call the backend and try to invite the user
export const invite = (channelid, isin) => {
  // get current user
  const [usr, token] = get_now_user();
  //   get the ready for invite list
  let invite_list = ready_for_invite_id_in;
  if (isin === false) {
    // if the channel has been created change the array
    invite_list = ready_for_invite_id;
  }
  //   invite user for each user in array
  invite_list.forEach((item) => {
    callAPIpost_withtoken(
      "channel/" + channelid + "/invite",
      { userId: Number(item) },
      token
    )
      //  invite successful
      .then((response) => {
        console.log(response);
        console.log("invite_successful " + item);
      })
      //  show error
      .catch((error) => {
        meet_error(error);
      });
  });
  console.log(isin);
  //  if the channel has been created
  if (isin === true) {
    console.log(reday_for_invite_in);
    // refresh the channel number update the invite one
    console.log('-------------------'+ready_for_invite_id_in)
    refresh_channel_member(ready_for_invite_id_in);
    //  get the new added number
    const add_usr_num = ready_for_invite_id_in.length;
    const channel_person_number = document.getElementById("incn_num");
    //  get the original exist number
    let the_number = channel_person_number.innerText;
    the_number = the_number.substring(1, the_number.length - 1);
    // update the in channel person number
    channel_person_number.innerText =
      "(" + String(Number(the_number) + add_usr_num) + ")";
    clear_all_ready_in();
    clear_temp_window_in();
  }
  //   if the channel has been created
  else {
    // then clear the ready to invite list and the searched result
    clear_all_ready();
    clear_temp_window();
  }
};
// close the search reasult droplist
export const close_temp_search = () => {
  clear_temp_window();
  const corrsponding_drop = document.getElementById("temp_search");
  corrsponding_drop.style.display = "none";
};
// refresh the search result
const invite_add = document.getElementById("invite_add");
invite_add.addEventListener("input", () => {
  //  clear window and all result
  clear_temp_window_in();
  //   refresh the result
  update_search(invite_add.value, "current_search_result", true, get_members());
});
// when focus on the invite add then
// open the drop list and prepare to search the result 
invite_add.addEventListener("focus", () => {
  clear_temp_window_in();
  const corrsponding_drop = document.getElementById("current_search_result");
  corrsponding_drop.className = "drop_list_in";
  corrsponding_drop.style.display = "block";
  update_search(invite_add.value, "current_search_result", true, get_members());
});
//  close the temp_added part close the invite button
temp_added.addEventListener("click", () => {
  clear_temp_window_in();
  const corrsponding_drop = document.getElementById("current_search_result");
  corrsponding_drop.style.display = "none";
});
//  update the search result
const creat_invite = document.getElementById("creat_invite");
creat_invite.addEventListener("input", () => {
  clear_temp_window();
  update_search(creat_invite.value, "temp_search", false, []);
});
//  get the temp_msg_part
const temp_msg_part = document.getElementById("temp_search_part");
temp_msg_part.addEventListener("blur", () => {});
// when focus on the invite add then
// open the drop list and prepare to search the result 
creat_invite.addEventListener("focus", () => {
  clear_temp_window();
  const corrsponding_drop = document.getElementById("temp_search");
  corrsponding_drop.className = "drop_list";
  corrsponding_drop.style.display = "block";
  update_search(creat_invite.value, "temp_search", false, []);
});
//  close the search result window
usr_add.addEventListener("click", () => {
  clear_temp_window();
  const corrsponding_drop = document.getElementById("temp_search");
  corrsponding_drop.style.display = "none";
});
// when the invite user button click open the invite part
const invite_div = document.getElementById("invite_part");
document.getElementById("open_invite").addEventListener("click", () => {
  loading_all_user();
  invite_div.style.display = "flex";
  const bg_ = document.getElementById('bg_img');
  bg_.style.display='flex';
});

// when the invite cancel
const confirm_invite = document.getElementById("crf_invite");
const cel_invite = document.getElementById("cel_invite");
// when make sure to invite
confirm_invite.addEventListener("click", () => {
  const bg_ = document.getElementById('bg_img');
  bg_.style.display='none';
  //  call the invite
  const channelid = get_now_channel();
  invite(channelid, true);
  cel_invite.click();

});

// when the invite cancel
cel_invite.addEventListener("click", () => {
  clear_all_ready_in();
  clear_temp_window_in();
  invite_div.style.display = "none";
  const bg_ = document.getElementById('bg_img');
  bg_.style.display='none';
});
