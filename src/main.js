import { callAPIget, callAPIpost_withtoken } from "./API.js";
import { callAPIpost } from "./API.js";
import { join_channel } from "./creat_cn.js";
import { show_specific_channel } from "./inchannel.js";
import { get_user_info } from "./profile.js";
import { get_now_user } from "./API.js";
import { get_now_channel } from "./API.js";
import { change_channel } from "./API.js";
import { refresh_user } from "./inchannel.js";
import { meet_error } from "./profile.js";
import { reset_current_msg } from "./inchannel.js";
import { reset_current_usr_msg } from "./inchannel.js";
import { loading_all_user } from "./invite.js";
import { clear_temp_window_in } from "./invite.js";
import { clear_all_ready_in } from "./invite.js";
import { set_pin_to_false } from "./inchannel.js";
import { change_pin_state } from "./inchannel.js";
import { get_fetching_state } from "./config.js";
import { logout_set } from "./inchannel.js";
import { initial_loading } from "./message.js";
// color array for channel
const color_set = [
  "#00ffa2",
  "#006cff",
  "#ffe400",
  "red",
  "orange",
  "#ff01c6",
  "purple",
  "#ca005f",
  "#756b00",
  "#e9b500",
];
// set interval
let interval_for_updating;
// update the newest data
const start_interval = () => {
  interval_for_updating = setInterval(() => {
    initial_loading();
  }, 2000);
}
// clear all channel invited user when change channel
const clear_channel_current_user=()=>{
  const container = document.getElementById("incn_usr_cont");
        const children = container.children;
        for (let i = children.length - 1; i >= 0; i--) {
          const child = children[i];
          if (child.id !== "pass") {
            container.removeChild(child);
          }
        }
}

// get all main conponment in html
const login = document.getElementById("login_div");
const regist = document.getElementById("regist_div");
const banner = document.getElementById("banner");
const inner = document.getElementById("logged_in");
const creat_channer = document.getElementById("creat_channel");
const spec_usr = document.getElementById("edit_user");
// get other conpoment in html
let eye = document.querySelectorAll(".eye");
let created_Elements_public = [];
let created_Elements_joined = [];
export const delete_element=(element)=>{
  const index = created_Elements_joined.indexOf(element);
  if (index!=-1){
    created_Elements_joined.splice(index,1);
  }
}
export const get_created_Elements_joined = ()=>{
  return created_Elements_joined;
}
// display all public channel
const show_public_channel = (name, state_p, person_num, joined) => {
  // <div class="public_c">
  //         <div class="left_color">
  //         </div>
  //         <div class="txt_par">
  //           <p class="channel_name zeropm">UNSW CHANNEL</p>
  //           <p class="channel_dis zeropm">A university in Australia</p>
  //         </div>
  //         <div class="right_par">
  //           <p class="numbers">99+</p>
  //           <button class="join">JOIN</button>
  //         </div>
  //       </div>
  //     </div>
  const channel_id = state_p.substring(3, 9);
  const container = document.getElementById("channel_container");
  const channel_self = document.createElement("div");
  channel_self.id = channel_id + "rp";
  channel_self.className = "public_c";
  const channel_left = document.createElement("div");
  channel_left.className = "left_color";
  channel_left.style.backgroundColor = color_set[Number(state_p[8])];
  const channel_text = document.createElement("div");
  channel_text.className = "txt_par";
  const c_name = document.createElement("p");
  c_name.className = "channel_name zeropm";
  c_name.innerHTML = name;
  const dis = document.createElement("p");
  dis.className = "channel_dis zeropm";
  dis.innerText = state_p;
  channel_text.appendChild(c_name);
  channel_text.appendChild(dis);
  const right = document.createElement("div");
  right.className = "right_par";
  const state = document.createElement("p");
  state.className = "numbers";
  state.innerText = String(person_num);
  const join = document.createElement("button");
  join.className = "join";

  // check join state
  if (joined === true) {
    join.innerText = "OPEN";
  } else {
    join.innerText = "JOIN";
  }
  // Add a "click" event listener to the element with the id "join"
  join.addEventListener("click", () => {
    // Check if the inner text of the element is "JOIN"
    if (join.innerText === "JOIN") {
      let [usr, token] = get_now_user();
      // Call the function "join_channel" with user, token, and channel_id
      join_channel(usr, token, channel_id);
      // ------------------------------------------------------------------
      callAPIget("channel/" + channel_id, token)
        .then((response) => {
          console.log(response);
          const owner =  response.creator;
          let state = "ID:" +channel_id;
          if(response.private){
            state = state+' private'
          }
          else{
            state = state+' public'
          }
          const name = response.name;
          show_joined_channel(owner,name,state);
        })
        .catch((error) => {
          meet_error();
        });
        join.innerText = "OPEN";
    } else {
      // Update the URL hash to include the channel ID
      location.hash = location.hash + "/channelID=" + String(channel_id);
    }
  });
  // add element to Dom
  right.appendChild(state);
  right.appendChild(join);
  channel_self.appendChild(channel_left);
  channel_self.appendChild(channel_text);
  channel_self.appendChild(right);
  container.appendChild(channel_self);
  // add element to the array
  created_Elements_public.push(channel_self);
};
// display all joined channel
const show_joined_channel = (owner, name, state_p) => {
  //   <div class="joined_block">
  //   <img src="src/img/msg.png" class="channel_img_own">
  //   <div class="own_txt">
  //     <p class="channel_name_own">UNSW</p>
  //     <p class="channel_dis_own">A university in Australia</p>
  //   </div>
  // </div>
  // get the channelid
  const channel_id = state_p.substring(3, 9);
  // Determine if the current user is the channel creator
  let info = "";
  if (owner === true) {
    info = "yours";
  } else {
    info = "joined";
  }
  // add the channel to the dom
  const container = document.getElementById(info);
  let block = document.createElement("div");
  block.id = channel_id + "l";
  block.className = "joined_block";
  let icon = document.createElement("img");
  icon.className = "channel_img_own";
  icon.src = "src/img/msg.png";
  let in_txt = document.createElement("div");
  in_txt.className = "own_txt";
  let c_name = document.createElement("p");
  c_name.className = "channel_name_own";
  c_name.innerText = name;
  let state = document.createElement("p");
  state.className = "channel_dis_own";
  state.innerText = state_p;
  in_txt.appendChild(c_name);
  in_txt.appendChild(state);
  block.appendChild(icon);
  block.appendChild(in_txt);
  const new_push=document.createElement('p');
  new_push.innerText="News";
  new_push.className="new_push";
  block.appendChild(new_push);
  container.appendChild(block);
  // add element to an array
  created_Elements_joined.push(block);
  // add click event to this channel
  block.addEventListener("click", () => {
    // when there is another chaneel are loading user cannot change channel
    if (get_fetching_state()) {
      error_message("Click too Fast !");
      return;
    }
    const tag = block.querySelector('.new_push');
    tag.style.display='none';
    created_Elements_joined.forEach((item)=>{
      item.style.backgroundColor = "#007676";
    })
    block.style.backgroundColor = "#00b4b4";
    // change the channel in the url if the channel is changed
    if (get_now_channel() != channel_id) {
      if (location.hash.split("/").length === 1) {
        location.hash = location.hash + "/channelID=" + String(channel_id);
      } else {
        // update the information of all user in this channel
        refresh_user();
        // clear all message in this channel
        reset_current_msg();
        // clear all message in this channel and the sender is current user
        reset_current_usr_msg();
        // clear all user has already be selected but not invited to the channel
        clear_all_ready_in();
        // clear all user in the invited search window
        clear_temp_window_in();
        // hidden the invite window
        const invite_div = document.getElementById("invite_part");
        invite_div.style.display = "none";
        // clear the user in current channel
        clear_channel_current_user();
        }
        // hidden the details bar
        const hidden_right = document.getElementById("right_bar");
        hidden_right.style.display = "none";
        hidden_right.style.marginRight = "-300px";
        // change the channelid
        change_channel(channel_id);
      }
  });
};
// when the user has not join any channel or has not creat any channel
const when_none = (item) => {
  // remove the none attention first
  const elementToRemove = item.querySelector(".nonetxt");
  if (elementToRemove) {
    elementToRemove.remove();
  }
  // if no child in the element then show the none attention text
  if (item.children.length === 0) {
    const noneText = document.createElement("p");
    noneText.id = "none" + String(item.id);
    noneText.className = "nonetxt";
    noneText.textContent = "Have Nothing!";
    item.appendChild(noneText);
  }
};
//  check whether the conponment has no child dom
export const check_none = () => {
  let yours = document.getElementById("yours");
  let others = document.getElementById("joined");
  let public_channels = document.getElementById("channel_container");
  // if exist element has no child then call when_none
  when_none(yours);
  when_none(others);
  when_none(public_channels);
};
// this function is used to get and display all channel
export const get_all_channel = (usr, token) => {
  // clear all public channel last time loaded
  created_Elements_public.forEach((item) => {
    console.log("clear");
    item.remove();
  });
  created_Elements_public = [];
  // clear all joined or created channel last time loaded
  created_Elements_joined.forEach((item) => {
    console.log("clear");
    item.remove();
  });
  created_Elements_joined = [];
  // request all channel from backend
  callAPIget("channel", token)
    .then((response) => {
      // for each channel we show it in the screen
      response.channels.forEach((item) => {
        // get the current channel info
        let name = item.name;
        let state = item.private;
        let state_info = "ID:" + String(item.id) + "  (public)";
        if (state === true) {
          state_info = "ID:" + String(item.id) + "  (private)";
        }
        let person = item.members;
        // first assume current user not join this channel
        let joined = false;
        // when we find the current user in members we set it joined this channel
        for (let member in person) {
          if (String(person[member]) === String(usr)) {
            joined = true;
            break;
          }
        }
        // if the channel is public and the user joined this channel
        if (state === false || joined === true) {
          // show the channel in public area
          show_public_channel(name, state_info, person.length, joined);
        }
        // if the user joined this channel
        if (joined === true) {
          // get whether the user is the owner of this channel
          let owner_state = String(item.creator) === String(usr);
          // show the channel in the joined area;
          show_joined_channel(owner_state, name, state_info);
        }
      });
      // check whether has a part has none child
      check_none();
    })
    // if meet error
    .catch((error) => {
      console.log(error);
      let error_text = "";
      switch (error) {
        case "info":
          error_text = "Input error!";
          break;
        case "access":
          error_text = "Access error!";
        default:
          error_text = "Network error! Please try again.";
          break;
      }
      // print error message
      error_message(String(error_text));
    });
};
// this function is used to determine whether to show joined channel
const check_joinshow = () => {
  // get two btn  used to display or hidden joined channel
  let others = document.getElementById("joined");
  let joined_btn = document.getElementById("join_head");
  // set the bar state to determine whether show the channel;
  if (localStorage.getItem("join_show") === "true") {
    others.style.display = "none";
    joined_btn.querySelector("img").style.transform = "rotate(-90deg)";
    joined_btn.querySelector("img").style.transition = "transform 0.3s";
  } else {
    others.style.display = "flex";
    joined_btn.querySelector("img").style.transform = "rotate(0deg)";
    joined_btn.querySelector("img").style.transition = "transform 0.3s";
  }
};
// this function is used to determine whether to show created channel
const check_yourshow = () => {
  // get two btn  used to display or hidden joined channel
  const yours = document.getElementById("yours");
  const your_btn = document.getElementById("your_head");
  // set the bar state to determine whether show the channel;
  if (localStorage.getItem("your_show") === "true") {
    yours.style.display = "none";
    yours.style.transition = "transform 0.3s";
    your_btn.querySelector("img").style.transform = "rotate(-90deg)";
    your_btn.querySelector("img").style.transition = "transform 0.3s";
  } else {
    yours.style.display = "flex";
    your_btn.querySelector("img").style.transform = "rotate(0deg)";
    your_btn.querySelector("img").style.transition = "transform 0.3s";
  }
};
// this function would be called when the user log successful
const when_logged = () => {
  let [usr, token] = get_now_user();
  // get the current information
  get_user_info(usr, token);
  // intiial the display state
  if (localStorage.getItem("join_show") === NaN) {
    localStorage.setItem("join_show", "false");
  }
  if (localStorage.getItem("your_show") === NaN) {
    localStorage.setItem("your_show", "false");
  }
  // set the show state
  check_joinshow();
  check_yourshow();
};
// this two buttton is to control the left part with the
// your channel and joined channel and whehter display their child
const your_btn = document.getElementById("your_head");
const joined_btn = document.getElementById("join_head");
// when click this two button the visible states would changed
joined_btn.addEventListener("click", () => {
  console.log("click_once");
  if (localStorage.getItem("join_show") === "true") {
    localStorage.setItem("join_show", "false");
  } else {
    localStorage.setItem("join_show", "true");
  }
  check_joinshow();
});
your_btn.addEventListener("click", () => {
  if (localStorage.getItem("your_show") === "true") {
    localStorage.setItem("your_show", "false");
  } else {
    localStorage.setItem("your_show", "true");
  }
  check_yourshow();
});

// this function is used to prompt any information including error and Other operating tips
export const error_message = (text) => {
  let body_main = document.querySelector("body");
  let div = document.createElement("div");
  let para = document.createElement("p");
  para.textContent = text;
  para.className = "error";
  div.className = "error-message";
  let btn = document.createElement("button");
  btn.innerText = "Close";
  btn.className = "close-button";
  div.appendChild(para);
  div.appendChild(btn);
  body_main.appendChild(div);
  // when click close the message would be removed
  btn.addEventListener("click", () => {
    body_main.removeChild(div);
  });
  // when press 'x' the message would be removed
  window.addEventListener("keydown", (event) => {
    if (event.key === "x" && body_main.contains(div)) {
      body_main.removeChild(div);
    }
  });
};

export const received_message = (text) => {
  let body_main = document.querySelector("body");
  let div = document.createElement("div");
  let para = document.createElement("p");
  para.className="top_text";
  para.textContent = text;
  div.className = "received_msg";
  let btn = document.createElement("button");
  btn.innerText = "Close";
  btn.className = "close-button-r";
  div.appendChild(para);
  div.appendChild(btn);
  body_main.appendChild(div);
  // when click close the message would be removed
  btn.addEventListener("click", () => {
    body_main.removeChild(div);
  });
  // when press 'x' the message would be removed
  window.addEventListener("keydown", (event) => {
    if (event.key === "x" && body_main.contains(div)) {
      body_main.removeChild(div);
    }
  });
};

// this is to set the passward visible state
eye.forEach((eye) => {
  // when click it the visible state would be changed
  eye.addEventListener("click", () => {
    if (String(eye.src).endsWith("/src/img/eye.png")) {
      eye.src = "src/img/eye-closed.png";
      document.getElementById("pwd-" + eye.id).type = "password";
    } else {
      eye.src = "src/img/eye.png";
      document.getElementById("pwd-" + eye.id).type = "text";
    }
  });
});
// this is to tip the user they has registed successful
const showAlert = (message) => {
  const alertDiv = document.createElement("div");
  alertDiv.style.textAlign = "center";
  alertDiv.textContent = message;
  alertDiv.style.width = "90%";
  alertDiv.style.fontSize = "20px";
  alertDiv.style.position = "fixed";
  alertDiv.style.top = "50px";
  alertDiv.style.left = "5%";
  alertDiv.style.padding = "20px";
  alertDiv.style.backgroundColor = "white";
  alertDiv.style.color = "#007979";
  alertDiv.style.borderRadius = "35px";
  alertDiv.style.border = "0px";
  document.body.appendChild(alertDiv);
  // after 10s the message would disappear
  setTimeout(() => {
    alertDiv.style.display = "none";
  }, 10000);
};

const login_success = () => {
  // clear all last time loaded information
  created_Elements_public.forEach((item) => {
    console.log("clear");
    item.remove();
  });
  created_Elements_public = [];
  created_Elements_joined.forEach((item) => {
    console.log("clear");
    item.remove();
  });
  created_Elements_joined = [];
  const [usr, tokens] = get_now_user();
  // get all public channel and all joined channel
  get_all_channel(usr, tokens);
};

// when the brose refreshed or the url changed this function would be run
const when_reloaded = () => {
  // get current hash state
  let current_state = window.location.hash;
  current_state = window.location.hash.substring(0, 6);
  console.log(current_state);
  // clear all last time loaded information
  created_Elements_public.forEach((item) => {
    console.log("clear");
    item.remove();
  });
  created_Elements_public = [];
  created_Elements_joined.forEach((item) => {
    console.log("clear");
    item.remove();
  });
  created_Elements_joined = [];
  // get the token and the user
  const token = localStorage.getItem("token");
  const token_owner = localStorage.getItem("token_owner");
  // determine which page should display
  switch (current_state) {
    // if in the login page
    case "#Login":
      // only display login
      login.style.display = "flex";
      regist.style.display = "none";
      banner.style.display = "none";
      inner.style.display = "none";
      spec_usr.style.display = "none";
      creat_channer.style.display = "none";
      if (token) {
        // change the hash
        location.hash =
          "#user=" + String(token_owner) + "#token=" + String(token);
        break;
      }
      // if the user and the password has already been remembered
      let login_info = login.querySelectorAll(
        "input[type='text'], input[type='password']"
      );
      if (localStorage.getItem("user")){
          login_info[0].value=localStorage.getItem("user");
          login_info[1].value=localStorage.getItem("password");
      }
      // if the user is remembered then set the remember button to True
      if (String(login_info[0].value) === localStorage.getItem("user")) {
        let remember = login.querySelector("input[type='checkbox']");
        remember.checked = true;
      }
      break;
    // if the current state is regist
    case "#Regis":
      // set all main part to there state
      login.style.display = "none";
      regist.style.display = "flex";
      banner.style.display = "none";
      inner.style.display = "none";
      spec_usr.style.display = "none";
      creat_channer.style.display = "none";
      break;
    case "#user=":
      // if the state is loged set the main part to there own state
      login.style.display = "none";
      regist.style.display = "none";
      banner.style.display = "flex";
      inner.style.display = "flex";
      // loading all user in this application prepare for the invite
      loading_all_user();
      //
      const [usr, tokens] = get_now_user();
      // get all public channel and all joined channel
      get_all_channel(token_owner, token);
      // call the logged function reload all things
      when_logged();
      // judge the whether the url include the channel
      if (get_now_channel() != null) {
        // show the specific channel
        show_specific_channel(get_now_channel());
        // set show pin flag to false
        set_pin_to_false();
        // set show pin flag to true
        change_pin_state();
      } else {
        // hidden the talk part
        const talk = document.getElementById("talk");
        talk.style.display = "none";
        // show the channel part
        const righr_ = document.getElementById("right_part");
        righr_.style.display = "flex";
      }
      start_interval();
      break;
  }
};

// when the brose refreshed or the url changed this function would be run
const when_hash_changed = () => {
  // get current hash state
  let current_state = window.location.hash;
  current_state = window.location.hash.substring(0, 6);
  console.log(current_state);
  // determine which page should display
  switch (current_state) {
    // if in the login page
    case "#Login":
      // only display login
      login.style.display = "flex";
      regist.style.display = "none";
      banner.style.display = "none";
      inner.style.display = "none";
      spec_usr.style.display = "none";
      creat_channer.style.display = "none";
      // get the token and the user
      const token = localStorage.getItem("token");
      const token_owner = localStorage.getItem("token_owner");
      if (token) {
        // change the hash
        location.hash =
          "#user=" + String(token_owner) + "#token=" + String(token);
        break;
      }
      // if the user and the password has already been remembered
      let login_info = login.querySelectorAll(
        "input[type='text'], input[type='password']"
      );
      if (localStorage.getItem("user")){
        login_info[0].value=localStorage.getItem("user");
        login_info[1].value=localStorage.getItem("password");
      }
      // if the user is remembered then set the remember button to True
      if (login_info[0].value === localStorage.getItem("user")) {
        let remember = login.querySelector("input[type='checkbox']");
        remember.checked = true;
      }
      else{
        remember.checked = false;
      }
      break;
    // if the current state is regist
    case "#Regis":
      // set all main part to there state
      login.style.display = "none";
      regist.style.display = "flex";
      banner.style.display = "none";
      inner.style.display = "none";
      spec_usr.style.display = "none";
      creat_channer.style.display = "none";
      break;
    case "#user=":
      // if the state is loged set the main part to there own state
      login.style.display = "none";
      regist.style.display = "none";
      banner.style.display = "flex";
      inner.style.display = "flex";
      // call the logged function reload all things
      when_logged();
      // judge the whether the url include the channel
      if (get_now_channel() != null) {
        // show the specific channel
        show_specific_channel(get_now_channel());
        // set show pin flag to false
        set_pin_to_false();
        // set show pin flag to true
        change_pin_state();
      } else {
        // hidden the talk part
        const talk = document.getElementById("talk");
        talk.style.display = "none";
        // show the channel part
        const righr_ = document.getElementById("right_part");
        righr_.style.display = "flex";
      }
      break;
  }
};

// when the hash value has changed
window.onhashchange = () => {
  console.log("nomal");
  // loading();
  // when_reloaded();
  when_hash_changed();
};
if (location.hash == "") {
  location.hash = "#Login";
  console.log("tui-k");
  // run the reloded
  when_reloaded();
}
console.log("cc");
when_reloaded();
// login logic part
let login_button = document.getElementById("login_botton");
// check the login state
const check_login = () => {
  // get the input user name and password
  let login_info = login.querySelectorAll(
    "input[type='text'], input[type='password']"
  );
  // get the remeber button
  let remember = login.querySelector("input[type='checkbox']");
  let usr_name = login_info[0];
  let pwd = login_info[1];
  // construct the login data to transmit
  const loginData = {
    email: String(usr_name.value),
    password: String(pwd.value),
  }
  // call the backend to request login
  callAPIpost("auth/login", loginData)
    .then((response) => {
      loading();
      // if success login
      console.log("API Loged", response);
      console.log(remember.checked);
      // choose whether to remember the current user
      if (remember.checked) {
        localStorage.setItem("user", usr_name.value);
        localStorage.setItem("password", pwd.value);
        console.log('checked');
      } 
      else {
        // if the user choose not to remember and the user has already remembered
        if (login_info[0].value === localStorage.getItem("user")) {
          // clear the remember
          localStorage.removeItem("user");
          localStorage.removeItem("password");
        }
      }

      // hidden the error messahe
      login.querySelector(".error").style.display = "none";
      // change the hash value
      location.hash =
        "#user=" + String(response.userId) + "#token=" + String(response.token);
      //  set the user information and token
      localStorage.setItem("token", response.token);
      localStorage.setItem("token_owner", response.userId);
      login_success();
      start_interval();
    })
    .catch((error) => {
      // when meet error
      let error_text = "";
      switch (error) {
        case "info":
          error_text = "Invalid Username or Password";
          break;
        default:
          error_text = "Network error! Please try again.";
          break;
      }
      error_message(String(error_text));
      // show the login error
      let login_error = login.querySelector(".error");
      login_error.style.display = "block";
      login_error.innerText = error_text;
    });
};
// when the login button click check the login state
login_button.addEventListener("click", () => {
  
  check_login();
});

// regist login
// get the regist button and input information
let regist_button = document.getElementById("regist_botton");
let all_element = regist.querySelectorAll(
  "input[type='text'], input[type='password']"
);
// get all error tips
let all_error = regist.querySelectorAll(".error");
// hidden all error tips
const all_error_disappear = () => {
  all_error.forEach((item) => (item.style.display = "none"));
};
// set the eyes position
const eye_move = (...args) => {
  eye[1].style.top = String(args[0]) + "px";
  eye[2].style.top = String(args[1]) + "px";
};
// when the regisit button click
regist_button.addEventListener("click", () => {
  // hidden all error
  all_error_disappear();
  // if the user email invalid
  if (all_element[0].value === "") {
    all_error[0].style.display = "block";
    eye_move(410, 480);
  }
  // if the user name invalid
  else if (
    all_element[1].value.length < 3 ||
    all_element[1].value.length > 16
  ) {
    all_error[1].style.display = "block";
    eye_move(410, 480);
  }
  //  if the password invlid
  else if (
    all_element[2].value.length < 6 ||
    all_element[2].value.length > 16
  ) {
    all_error[2].style.display = "block";
    eye_move(400, 480);
  }
  // if the repeat password invalid
  else if (all_element[3].value != all_element[2].value) {
    error_message(String("Two password not equal!"));
    all_error[3].style.display = "block";
    eye_move(400, 470);
  }
  // if all information is correct
  else {
    eye_move(400, 470);
    regist_button.disabled = false;
    // save the regist data
    const registData = {
      email: String(all_element[0].value),
      password: String(all_element[2].value),
      name: String(all_element[1].value),
    };
    // call the backend to request regist
    callAPIpost("auth/register", registData)
      .then((response) => {
        console.log("API Regist", response);
        // show the regist user information
        showAlert(
          "Dear " +
            all_element[1].value +
            " you have succesfully join SLACKR, now you can use your email address ' " +
            all_element[0].value +
            " ' login to SLACKR!"
        );
        // go back to login part
        location.hash = "#Login";
        // clear login input
        regist.querySelectorAll("input").forEach((item) => {
          item.value = "";
        });
      })
      //  show error
      .catch((error) => {
        let error_text = "";
        switch (error) {
          case "info":
            error_text = "Email already beem used";
            break;
          default:
            error_text = "Network error! Please try again.";
            break;
        }
        error_message(String(error_text));
        // regist error text show
        all_error[3].style.display = "block";
        all_error[3].innerText = error_text;
      });
  }
});
// get the top search bar
const search_channel = document.getElementById("search");
// logout button get
const logout = document.getElementById("logout");
// when the logout button click
logout.addEventListener("click", () => {
  loading();
  // request backend to logout
  callAPIpost_withtoken("auth/logout", {}, localStorage.getItem("token"))
    .then(() => {
      // temp save the user name
      const saved_user_name = localStorage.getItem("user");
      const saved_pwd = localStorage.getItem("password");
      // clear all save user name
      localStorage.clear();
      clear_channel_current_user();
      logout_set();
      // if there exist some remember thing save it
      if (saved_user_name) {
        localStorage.setItem("user", saved_user_name);
        localStorage.setItem("password", saved_pwd);
      }
      const all_input= document.querySelectorAll('input, textarea');
      all_input.forEach((item)=>{item.value=""});
      clearInterval(interval_for_updating);
      search_channel.value="";
      // go back to login
      location.hash = "#Login";
    })
    .catch((error) => {
      meet_error(error);
    });
});
// when the window is loading
const loading = () => {
  // get the loading part
  document.querySelector(".loader_bg").style.display = "block";
  // loading 1s
  setTimeout(() => {
    document.querySelector(".loader_bg").style.display = "none";
  }, 1000);
};

// when the search bar is changed
search_channel.addEventListener("input", () => {
  // filter the slected channel
  const search_key = search_channel.value;
  created_Elements_public.forEach((item) => {
    const channel_name = String(
      item.querySelector(".channel_name.zeropm").innerText
    );
    // filter the bar
    if (channel_name.startsWith(search_key)) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
});
// when the window is loading then load it
window.onload = () => {
  loading();
};
