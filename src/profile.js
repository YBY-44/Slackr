import { callAPIget, get_now_channel, get_now_user } from "./API.js";
import { callAPIput } from "./API.js";
import { error_message } from "./main.js";
import { fileToDataUrl } from "./helpers.js";
import { refresh_msg_user_info } from "./inchannel.js";
// get all componment about the profile part
const specific_user_info = document.getElementById("edit_user");
const save_btn = document.getElementById("change_botton");
const cancel_btn = document.getElementById("close_botton");
const open_spec = document.getElementById("profile");
const edit_img = document.getElementById("edit_image");
const icon_upload = document.getElementById("icon_upload");
const pro_img = specific_user_info.querySelector("img");
const all_input = specific_user_info.querySelectorAll("input");
const bio_ = specific_user_info.querySelector("textarea");
// hidden the file input
icon_upload.style.display = "none";
// check whether the image is valid
export const check_image = (item, image_info) => {
  //  if the resource is none then put the default image
  if (image_info === null) {
    item.src = "src/img/proicon.png";
  } else {
    item.src = image_info;
  }
};
// when meet error then show the error
export const meet_error = (error) => {
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
  error_message(String(error_text));
};
// when the icon has been click
open_spec.addEventListener("click", () => {
  // when the specific_user_info is flex then do nothing
  if (specific_user_info.style.display === "flex") {
    return;
  }
  // show the specific part
  specific_user_info.style.display = "flex";
  const bg = document.getElementById("bg_img");
  bg.style.display = "flex";
  // get the user and token
  const [usr, token] = get_now_user();
  // get user specific info
  callAPIget("user/" + usr, token)
    // set the value to the corrsponding part
    .then((response) => {
      all_input[1].value = response.email;
      all_input[2].value = response.name;
      bio_.value = response.bio;
      check_image(pro_img, response.image);
    })
    // show error
    .catch((error) => {
      meet_error(error);
    });
});
// hidden the specific info part
cancel_btn.addEventListener("click", () => {
  specific_user_info.style.display = "none";
  const bg = document.getElementById("bg_img");
  bg.style.display = "none";
});
// when edit profile click then call and click the upload file part
edit_img.addEventListener("click", () => {
  icon_upload.click();
});
// when the file bar changed then get the new image as the profile
icon_upload.addEventListener("change", () => {
  const image_info = icon_upload.files[0];
  console.log(image_info);
  fileToDataUrl(image_info).then((response) => {
    pro_img.src = response;
  });
});
// change the banner info when the profile changed
const log_info_banner = (current_name, current_email, current_image) => {
  // get banner user name and email
  const name = document.getElementById("banner-name");
  const email = document.getElementById("banner-email");
  const profile_image = document.getElementById("profile");
  // set the new value
  name.innerText = current_name;
  email.innerHTML = current_email;
  // set the profile image
  check_image(profile_image, current_image);
};
// get the current user infomation in the banner
export const get_user_info = (usr, token) => {
  // request the user infromation
  callAPIget("user/" + String(usr), String(token))
    .then((response) => {
      let nm = response.name;
      let em = response.email;
      // change the login banner info
      log_info_banner(nm, em, response.image);
    })
    .catch((error) => {
      meet_error(error);
    });
};
// when the profile change has been saved
save_btn.addEventListener("click", () => {
  // initial the modify flag to the true
  let modify_flag = true;
  // initial the image_src
  const img_src = pro_img.src;
  // save all error conponment
  const all_error = specific_user_info.querySelectorAll(".error");
  // if the image_src is default set it to null
  if (img_src === "src/img/proicon.png") {
    img_src = "";
  }
  // save the changed data
  const data = {
    name: all_input[2].value,
    bio: bio_.value,
    image: img_src,
  };
  // display all error message to null
  all_error.forEach((item) => {
    item.style.display = "none";
  });
  // if the email is changed
  if (all_input[1].value != document.getElementById("banner-email").innerText) {
    // if the email is not null
    if (all_input[1].value.length > 0) {
      data.email = all_input[1].value;
    }
    // if the email is null
    else {
      all_error[0].style.display = "block";
      modify_flag = false;
    }
  }
  // if the user name is invaild
  else if (all_input[2].value.length < 3 || all_input[2].value.length > 16) {
    // rise the error message
    all_error[1].style.display = "block";
    modify_flag = false;
  }
  // if the new passward not null
  else if (all_input[3].value != "") {
    // if the new passward is not valid
    if (all_input[3].value.length < 6 || all_input[3].value.length > 16) {
      // rise the error message
      all_error[2].style.display = "block";
      modify_flag = false;
    } else {
      data.password = all_input[3].value;
    }
  }
  // the modify flag still true all information is valid
  if (modify_flag === true) {
    // get the current user and password
    const [usr, token] = get_now_user();
    // try to modify the profile
    callAPIput("user", data, token)
      .then((response) => {
        // modify successful
        console.log("successful!");
        error_message("Modify successful!");
        // hidden the modify profile part
        specific_user_info.style.display = "none";
        const [usr, token] = get_now_user();
        // chang the new user information
        get_user_info(usr, token);
        const channel = get_now_channel();
        // if the channel is not null
        if (channel != null) {
          // change all message sender profile to the newest one
          const [usr, token] = get_now_user();
          // get the banner profile
          const inchannel_icon = document.getElementById(usr);
          const new_icon = inchannel_icon.querySelector("img");
          const new_name = inchannel_icon.querySelector("p");
          check_image(new_icon, data.image);
          new_name.innerText = data.name;
          // refresh all sender's message to the new version
          refresh_msg_user_info(data.name, data.image);
        }
        const bg = document.getElementById("bg_img");
        bg.style.display = "none";
      })
      // show error
      .catch((error) => {
        meet_error(error);
      });
  }
});
