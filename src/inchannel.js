import { callAPIdelete, callAPIget } from './API.js';
import { callAPIpost_withtoken } from './API.js';
import { callAPIput } from './API.js';
import {
  delete_element,
  error_message,
  get_created_Elements_joined,
} from './main.js';
import { check_none } from './main.js';
import { check_image } from './profile.js';
import { get_now_user } from './API.js';
import { get_now_channel } from './API.js';
import { show_time } from './API.js';
import { meet_error } from './profile.js';
import { fileToDataUrl } from './helpers.js';
import { set_choosed_pos } from './message.js';
import { fetching_start } from './config.js';
import { fetching_end } from './config.js';
import { get_fetching_state } from './config.js';
import {
  clear_all_ready,
  clear_all_ready_in,
  clear_temp_window_in,
} from './invite.js';
// get all useful conponment in a conversion
const more = document.getElementById('more');
const detail = document.getElementById('right_bar');
const back_btn = document.getElementById('back');
const cn_content = document.getElementById('right_part');
const specific = document.getElementById('talk');
// all in channel image
let all_image = [];
// all message has been pinned in this channel
let all_pinned_message = [];
// all pinned message has been add to dom
let all_pinned_message_dom = [];
// all message in this channel sended by current user
let all_current_usr_message = [];
// all user in the current channel
let all_current_members = [];
// all user in the current channel with id
let current_channel_user = [];
// all loaded message in the current message
let all_message = [];
// all the loaded position
let pos = 0;
// the scroll loading status
let do_flag = true;
// current choosed message id
let current_msg = '';
// the channel whether complete the first loading
let initial_state = false;
// the pin visible status
let isOn = false;
// hidden the specific detail
specific.style.display = 'none';
// the last message id in the channel
let last_updated_msg = '';
const reactors = [0x1f929, 0x1f635, 0x1f497, 0x1f44d, 0x1f602];
// get the image array
export const logout_set = () => {
  all_message.forEach((item) => {
    item.remove();
  });
  all_image = [];
  all_pinned_message = [];
  all_pinned_message_dom = [];
  all_current_usr_message = [];
  all_current_members = [];
  current_channel_user = [];
  all_message = [];
  pos = 0;
  do_flag = true;
  current_msg = '';
  initial_state = false;
  isOn = false;
  specific.style.display = 'none';
  last_updated_msg = '';
  clear_all_pinned_dom();
  clear_all_pinned_message();
  clear_all_ready();
  clear_all_ready_in();
  clear_temp_window_in();
  refresh_user();
};
export const get_img_array = () => {
  return all_image;
};
// clear all pinned message
const clear_all_pinned_message = () => {
  all_pinned_message = [];
};
// clear all pinned dom added to html
const clear_all_pinned_dom = () => {
  all_pinned_message_dom.forEach((item) => {
    item.remove();
  });
};
export const get_members_id = () => {
  return current_channel_user;
};
// chang the pin open state to false
export const set_pin_to_false = () => {
  isOn = false;
};
// get all joined user id in the current channel
export const add_members = (user) => {
  all_current_members.push();
};
// get all joined user id in the current channel
export const get_members = () => {
  console.log(all_current_members);
  return all_current_members;
};
// clear the recorded last message
export const refresh_last_updated_message = () => {
  last_updated_msg = '';
};
// clear the recorded selected message
export const reset_current_msg = () => {
  current_msg = '';
};
// clear the current user's sended message
export const reset_current_usr_msg = () => {
  all_current_usr_message = [];
};
// when the button click show the specific information of this channel
more.addEventListener('click', () => {
  // change the show state
  const current_pos = detail.style.marginRight;
  // if shownd then hidden
  if (current_pos === '0px') {
    detail.style.marginRight = '-300px';
    setTimeout(() => {
      detail.style.display = 'none';
    }, 300);
  }
  // if hidden then showned
  else {
    detail.style.display = 'flex';
    requestAnimationFrame(() => {
      detail.style.marginRight = '0px';
    });
  }
});
// refresh all user in this channel
export const refresh_user = () => {
  current_channel_user.forEach((item) => {
    item.remove();
  });
  current_channel_user = [];
};
// this function used to close a channel and go back to the channel slection part
const back_to_channel = () => {
  // show the all public part
  cn_content.style.display = 'flex';
  // close the specific
  specific.style.display = 'none';
  // chang to unselected channel
  location.hash = location.hash.split('/')[0];
  // change the style of the details
  detail.style.marginRight = '-300px';
  detail.style.display = 'none';
  // hidden the edit part
  const edit_div = document.getElementById('edit_div');
  edit_div.style.display = 'none';
  // hidden the profile part
  const other_profile = document.getElementById('other_profile');
  other_profile.style.display = 'none';
  // clear all user invited user
  refresh_user();
  // reset all current user's message
  reset_current_usr_msg();
  // clear all pinned message
  clear_all_pinned_message();
  // clear all pinned dom added to html
  clear_all_pinned_dom();
  isOn = false;
  // change the pinned state
  change_pin_state();
  // clear all message added to channel
  all_message.forEach((item) => {
    item.remove();
  });
  all_message = [];
};
// go back to the main part
back_btn.addEventListener('click', () => {
  back_to_channel();
});
// get the width of the input
const get_width = (item) => {
  // calculate the input width
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = getComputedStyle(item).font;
  const textWidth = context.measureText(item.value).width;
  // retuen the width value
  return String(textWidth);
};

// set the width of inhead channel_name in the top
const inchannel_name = document.getElementById('inchannel_name');
inchannel_name.style.width = get_width(inchannel_name) + 'px';
// change the width with the input
inchannel_name.addEventListener('input', () => {
  let cur_width = get_width(inchannel_name);
  inchannel_name.style.width = cur_width + 'px';
});
// set the width of inhead channel_discription in the top
const dis_head = document.getElementById('inchannel_dis');
dis_head.style.width = get_width(dis_head) + 'px';
// change the width with the input
dis_head.addEventListener('input', () => {
  let cur_width = get_width(dis_head);
  dis_head.style.width = cur_width + 'px';
});

// this part is used to edit del and pin message
const set_change = (current_msg, message_body) => {
  // get the message id
  const new_id = message_body.parentNode.id;
  // if the current_msg not be assigned
  if (current_msg === '') {
    // directly show the new selected message and set the current message to the current message
    current_msg = new_id;
    const now = document.getElementById(String(current_msg));
    if (now) {
      now.querySelector('.hidden_set').style.display = 'flex';
    }
  }
  // if the selected message changed
  else if (current_msg != new_id) {
    // get the last selected message and set it to hidden
    const now = document.getElementById(String(current_msg));
    if (now) {
      now.querySelector('.hidden_set').style.display = 'none';
    }
    // get new selected message and set it to display
    const news = document.getElementById(String(new_id));
    if (news) {
      news.querySelector('.hidden_set').style.display = 'flex';
    }

    current_msg = new_id;
  }
  // if the selected message is same to the last
  else if (current_msg === new_id) {
    // if the message set not display then hidden it
    const now = document.getElementById(String(current_msg));
    if (now.querySelector('.hidden_set').style.display === 'none') {
      now.querySelector('.hidden_set').style.display = 'flex';
    }
    // else close the message part
    else {
      now.querySelector('.hidden_set').style.display = 'none';
    }
  }
  // return the new selected message id
  return current_msg;
};
// when message's sender name has been clicked show the specific info
const looking_owner_change = (userid, position) => {
  // show the specific user info
  const other_profile = document.getElementById('other_profile');
  if (other_profile.style.display === 'flex') {
    other_profile.style.display = 'none';
    return;
  }
  // get the infomation of the user
  const [usr, token] = get_now_user();
  callAPIget('user/' + String(userid), token)
    .then((response) => {
      // set the positon of the current user information
      const other_profile = document.getElementById('other_profile');
      other_profile.style.left = position.left - 100 + 'px';
      other_profile.style.top = position.bottom + 'px';
      // get all about the user info conponment
      const other_name = document.getElementById('other_name');
      const other_email = document.getElementById('other_email');
      const other_bio = document.getElementById('other_bio');
      const other_img = document.getElementById('other_img');
      // change the value to the name
      other_name.innerHTML = response.name;
      other_bio.innerHTML = 'NONE';
      // id the bio is corrent show it
      if (response.bio != '' || response.bio != NaN) {
        other_bio.innerHTML = response.bio;
        other_bio.in;
      }
      other_email.innerHTML = response.email;
      // check the image whether correct
      check_image(other_img, response.image);
      // display the profile
      other_profile.style.display = 'flex';
    })
    // when meet error go back
    .catch((error) => {
      meet_error(error);
    });
};

// get all conponment in the message edit box
const edit_div = document.getElementById('edit_div');
const edit_msgbox = document.getElementById('edit_container');
const edit_imgbox = document.getElementById('in_edit_img');
const checked_btn = document.getElementById('is-image');
const edit_msg_img = document.getElementById('edit_msg_img');
// when the edit_image button click chosse a new image
edit_imgbox.addEventListener('click', () => {
  // edit the image
  edit_msg_img.click();
});
// when the imagesrc changed show the new choosed image
edit_msg_img.addEventListener('change', () => {
  // get the new image
  const image_info = edit_msg_img.files[0];
  fileToDataUrl(image_info).then((response) => {
    edit_imgbox.src = response;
  });
});
// this button used to choose the message type photo or text
checked_btn.addEventListener('click', () => {
  // if the message type is text
  if (checked_btn.checked === false) {
    edit_imgbox.style.display = 'none';
    edit_msgbox.style.display = 'flex';
  }
  // if the message type is image
  else {
    edit_imgbox.style.display = 'flex';
    edit_msgbox.style.display = 'none';
  }
});

// this is to creat the image in a messagebox and set message type to image
const creat_image = (father, text) => {
  // get the parent node
  const message_body = father.parentNode;
  // add the image conponment to the messagebox
  const img = document.createElement('img');
  img.className = 'message_image';
  img.src = text;
  father.prepend(img);
  // if the image click then show or hidden the message change set
  img.addEventListener('click', () => {
    current_msg = set_change(current_msg, message_body);
    // loading the comfirm delete button
    remove_comfirm_del();
  });
  img.addEventListener('dblclick', () => {
    add_image_event(img);
  });
  // return the image conponment
  return img;
};
// this is to creat the text in a message and set the message type to text
const creat_text = (father, text) => {
  // get the parent node
  const message_body = father.parentNode;
  const txt = document.createElement('p');
  // add the message conponment to the messagebox
  txt.className = 'message_text';
  txt.style.backgroundColor = 'white';
  txt.innerHTML = text;
  father.prepend(txt);
  // if the message click then show or hidden the message change set
  txt.addEventListener('click', () => {
    current_msg = set_change(current_msg, message_body);
    // loading the comfirm delete button
    remove_comfirm_del();
  });
  // return the text conponment
  return txt;
};
// get the message text before edit
const get_orig_text = () => {
  const msg_box = document.getElementById(current_msg);
  const have_message = msg_box.querySelector('.message_text');
  if (have_message) {
    return have_message.innerHTML;
  }
  return '';
};
// get the message image before edit
const get_orig_imgsrc = () => {
  const msg_box = document.getElementById(current_msg);
  const have_img = msg_box.querySelector('.message_image');
  if (have_img) {
    return have_img.src;
  }
  return 'src/img/add_msg_img.png';
};
// get the current message id in the dataset
export const get_current_msg = () => {
  if (current_msg.endsWith('in')) {
    return current_msg.substring(0, current_msg.length - 2);
  }
  return current_msg;
};
// update the message
const update_msg = (data) => {
  // get now user and channel id
  const [usr, token] = get_now_user();
  const channel = get_now_channel();
  // flag is used to deteremine the request statue
  const flag = true;
  // get the choosed message id
  const msg_id = get_current_msg(current_msg);
  // edit the message
  callAPIput('message/' + channel + '/' + msg_id, data, token)
    .then((response) => {
      // if success then hidden the edit div and prompt the successful message
      edit_div.style.display = 'none';
      const msg_box = document.getElementById(msg_id);
      const msg_box_in = document.getElementById(msg_id + 'in');
      if (msg_box) {
        const message_timestamp = msg_box.querySelector('.time_stamp');
        message_timestamp.innerHTML = 'EditAt ' + show_time(Date.now());
      }
      if (msg_box_in) {
        const message_timestamp = msg_box_in.querySelector('.time_stamp');
        message_timestamp.innerHTML = 'EditAt ' + show_time(Date.now());
      }
      error_message('Message modified successful!');
    })
    // show error
    .catch((error) => {
      meet_error(error);
      flag = false;
    });
  // return the changed statues
  return flag;
};

// when edit message button click
const edit_message = (position, is_text_message) => {
  // set the edit_div position and show
  edit_div.style.left = position.left + 'px';
  edit_div.style.top = position.bottom - 20 + 'px';
  edit_div.style.display = 'flex';
  // initial the edit status
  edit_msgbox.value = '';
  edit_imgbox.src = 'src/img/add_msg_img.png';
  edit_msg_img.value = '';
  // if the message type is text
  if (is_text_message) {
    // set the edit box value is the orig value
    edit_imgbox.style.display = 'none';
    edit_msgbox.style.display = 'flex';
    edit_msgbox.value = get_orig_text();
    // set type is not message
    checked_btn.checked = false;
  }
  // if the messsage type is image
  else {
    // set the edit image box value is the orig image
    edit_imgbox.style.display = 'flex';
    edit_msgbox.style.display = 'none';
    edit_imgbox.src = get_orig_imgsrc();
    // set type is image
    checked_btn.checked = true;
  }
};
// this button is to make sure edit
const edit_sure = document.getElementById('cg_msg');
// this button is not edit
const edit_cancel = document.getElementById('cl_msg');

//
const imply_change_to_msg = (checked_btn, msg_box, msg_box_in, data) => {
  let content;
  let have_message;
  let have_img;
  let content_in;
  let have_img_in;
  let have_message_in;
  if (msg_box) {
    content = msg_box.querySelector('.message_content');
    // try to find the message
    have_message = msg_box.querySelector('.message_text');
    // try to find the image
    have_img = msg_box.querySelector('.message_image');
  }
  if (msg_box_in) {
    content_in = msg_box_in.querySelector('.message_content');
    // try to find the message
    have_message_in = msg_box_in.querySelector('.message_text');
    // try to find the image
    have_img_in = msg_box_in.querySelector('.message_image');
  }
  // define the orig img value and msg value
  console.log('change the message: ' + current_msg);
  // if the current type is image
  if (checked_btn.checked) {
    console.log('image');
    data = { image: edit_imgbox.src };
    // if the image src is not given
    if (
      edit_imgbox.src ===
      location.href.split('#')[0] + 'src/img/add_msg_img.png'
    ) {
      error_message('Invalid message !');
      return;
    }
    // if the message is in the conponment
    if (have_message || have_message_in) {
      // if the message update successful
      if (update_msg(data)) {
        if (content) {
          // remove the message part
          have_message.remove();
          // creat the image to the message
          creat_image(content, edit_imgbox.src);
        }
        if (content_in) {
          // remove the message part
          have_message_in.remove();
          // creat the image to the message
          creat_image(content_in, edit_imgbox.src);
        }
      }
    }
    // if the message is not in the conponment
    else {
      console.log('message');
      let current_img;
      if (have_img) {
        current_img = have_img;
      } else {
        current_img = have_img_in;
      }
      console.log(have_img);
      //  if the image src not change
      if (current_img.src === edit_imgbox.src) {
        // cannot change
        error_message('Have no change!');
        return;
      }
      // if the image update successful
      if (update_msg(data)) {
        // change the image src
        if (have_img) {
          have_img.src = edit_imgbox.src;
        }
        if (have_img_in) {
          have_img_in.src = edit_imgbox.src;
        }
      }
    }
  }
  // if the current type is message
  else {
    // if the message value is none
    if (edit_msgbox.value.trim() === '') {
      // cannot modify
      error_message('Invalid message !');
      return;
    }
    // if the image in the message
    if (have_img || have_img_in) {
      console.log('message');
      // if the message update successful
      if (update_msg(data)) {
        if (content) {
          // remove the image part
          have_img.remove();
          // add the text part to message
          creat_text(content, edit_msgbox.value);
        }
        if (content_in) {
          // remove the image part
          have_img_in.remove();
          // add the text part to message
          creat_text(content_in, edit_msgbox.value);
        }
      }
    }
    // if the text in the message
    else {
      let current_txt;
      if (have_message) {
        current_txt = have_message;
      } else {
        current_txt = have_message_in;
      }
      console.log(current_txt);
      console.log(current_txt.innerText, edit_msgbox.value);
      // if the message text have no change
      if (current_txt.innerText === edit_msgbox.value) {
        error_message('Have no change!');
        return;
      }
      // if the message update successful
      if (update_msg(data)) {
        if (content) {
          // set the new message text to the messagebox
          have_message.innerText = edit_msgbox.value;
        }
        if (content_in) {
          // set the new message text to the messagebox
          have_message_in.innerText = edit_msgbox.value;
        }
      }
    }
  }
};

// if edit button click
edit_sure.addEventListener('click', () => {
  // set the edit message
  let data = { message: edit_msgbox.value };
  // get the message conponment
  // get the messageID
  const msgID = get_current_msg(current_msg);
  // GET two different element
  const msg_box = document.getElementById(msgID);
  const msg_box_in = document.getElementById(msgID + 'in');
  imply_change_to_msg(checked_btn, msg_box, msg_box_in, data);
});

// if the edit has been calceled
edit_cancel.addEventListener('click', () => {
  // hidden the edit part
  edit_div.style.display = 'none';
});
// if the message has prepare to delete
const delete_message = (position) => {
  // show the confirm button
  const confirm_del = document.createElement('button');
  confirm_del.className = 'confirmdel';
  confirm_del.innerText = 'Comfirm Delete';
  document.body.appendChild(confirm_del);
  // set position of the confirm delete button
  confirm_del.style.left = position.left + 'px';
  confirm_del.style.top = position.bottom - 40 + 'px';
  // when the confirm delete click
  confirm_del.addEventListener('click', () => {
    // get the channel id and user id
    const channel_id = get_now_channel();
    const [usr, token] = get_now_user();
    // call backend to delete message
    const msgID = get_current_msg(current_msg);
    callAPIdelete('message/' + channel_id + '/' + msgID, token)
      .then((response) => {
        // remove the choosed message
        const delete_div = document.getElementById(msgID);
        const delete_div_in = document.getElementById(msgID + 'in');
        if (delete_div) {
          delete_div.remove();
        }
        if (delete_div_in) {
          delete_div_in.remove();
        }

        // current message has been delete
        current_msg = '';
        error_message('Delete one message');
        // remove the confirm del
        confirm_del.remove();
      })
      // show error
      .catch((error) => {
        meet_error(error);
      });
  });
};

// refresh the user icon
export const refresh_msg_user_info = (new_name, new_img) => {
  // for all message the sender is current user change the image src to update
  all_current_usr_message.forEach((item) => {
    const img = item.querySelector('.profile');
    const owner_name = item.querySelector('.message_owner');
    // change the profile and user name
    check_image(img, new_img);
    owner_name.innerText = new_name;
  });
};
// this function is to judge the pin state and display it
const pin_set = (pin, channel_id, token) => {
  // get all message box
  const msg_id = get_current_msg();
  const msg_box = document.getElementById(msg_id);
  const msg_box_in = document.getElementById(msg_id + 'in');
  const pin_tag = document.getElementById(msg_id + 'p');
  const pin_tag_in = document.getElementById(msg_id + 'pin');
  let pin_btn;
  let pin_btn_in;
  // if the selected message is not in pin
  if (msg_box) {
    pin_btn = msg_box.querySelectorAll('.msg_btn')[2];
    console.log(pin_btn);
  }
  // if the selected message is in pin
  if (msg_box_in) {
    pin_btn_in = msg_box_in.querySelectorAll('.msg_btn')[2];
    console.log(pin_btn_in);
  }
  console.log(pin_tag);
  console.log(pin_tag_in);
  console.log('use-pin');
  // if the message has been pinned
  if (pin.innerText === 'Pin') {
    // get the current message id
    const msg_id = get_current_msg(current_msg);
    // call AIP to pin the message
    callAPIpost_withtoken('message/pin/' + channel_id + '/' + msg_id, {}, token)
      .then((response) => {
        // set unpin to message
        if (pin_tag) {
          // set all pin button to unpin
          pin_btn.innerText = 'Unpin';
          // show the pin flag
          pin_tag.style.display = 'block';
        }
        // set unpin to message in pin page
        if (pin_tag_in) {
          pin_btn_in.innerText = 'Unpin';
          pin_tag_in.style.display = 'block';
        }
      })
      // send error
      .catch((error) => {
        meet_error(error);
      });
  }
  // if the messsage has not pinned
  else {
    // call API to unpin the message
    callAPIpost_withtoken(
      'message/unpin/' + channel_id + '/' + current_msg,
      {},
      token
    )
      .then((response) => {
        // set the pin button to pin and hidden the pin flag
        pin.innerText = 'Pin';
        if (pin_tag) {
          pin_btn.innerText = 'Pin';
          pin_tag.style.display = 'none';
        }
        // set the pin button to pin and hidden the pin flag in the pin page
        if (pin_tag_in) {
          pin_btn_in.innerText = 'Pin';
          // hidden the pin flag
          pin_tag_in.style.display = 'none';
        }
      })
      // send error
      .catch((error) => {
        meet_error(error);
      });
  }
};
// just delete the confirm del in the button
const remove_comfirm_del = () => {
  const del_btn = document.querySelector('.confirmdel');
  if (del_btn) {
    del_btn.remove();
  }
};
// set the new loading message height as 0
let temp_new_height = 0;
// This function initializes the react state for a given item and its reactors.
const initial_react_state = (
  item, // The item for which the react state is being initialized.
  x, // The index of the current reactor.
  all_responce, // An object containing response counts for each reactor.
  father, // The parent element where the react state elements will be inserted.
  insert_way // The insertion method ("in" indicates "inside").
) => {
  // Create a div container for the react state element.
  const div_cont = document.createElement('div');
  // Set the ID for the div container based on the item and reactor.
  div_cont.id = String(item.id) + String(reactors[x]);
  // If 'insert_way' is "in", append "in" to the ID for inside insertion.
  if (insert_way === 'in') {
    div_cont.id = String(item.id) + String(reactors[x]) + 'in';
  }
  // Set the class for the div container.
  div_cont.className = 'emj';
  // Hide the container if there are no responses for this reactor.
  if (all_responce[reactors[x]] === 0) {
    div_cont.style.display = 'none';
  }
  // Create a <p> element for the reactor emoji.
  const rea = document.createElement('p');
  rea.innerText = String.fromCodePoint(reactors[x]);
  rea.className = 'emj_out';
  // Create a <p> element to display the response count.
  const response_Number = document.createElement('p');
  response_Number.className = 'r_num';
  response_Number.innerText = String(all_responce[reactors[x]]);
  // Append the reactor emoji and response count to the container.
  div_cont.appendChild(rea);
  div_cont.appendChild(response_Number);
  // Append the container to the parent element.
  father.appendChild(div_cont);
};

const unreact = (channel_id, id, token, text) => {
  // Send a POST request to unreact a message
  callAPIpost_withtoken(
    'message/unreact/' + channel_id + '/' + id,
    { react: text },
    token
  )
    .then((response) => {
      // If the operation is successful, hide the reactions element
    })
    .catch((error) => {
      // Handle errors
      meet_error(error);
    });
};

const react = (channel_id, id, token, text) => {
  // Send a POST request to unreact to a message
  callAPIpost_withtoken(
    'message/react/' + channel_id + '/' + id,
    { react: text },
    token
  )
    .then((response) => {})
    .catch((error) => {
      // Handle errors
      meet_error(error);
    });
};
// add a button to dom
const add_button = (text, classname) => {
  const button = document.createElement('button');
  button.innerText = text;
  button.className = classname;
  return button;
};

const add_all_event = (edit, del, pin, channel_id, token) => {
  // Add a click event listener for the "Edit" button
  edit.addEventListener('click', () => {
    console.log('edit button');
    const position = edit.getBoundingClientRect();
    let message_content = get_orig_text();
    let is_text_message = true;
    // Check if the message content is empty (text or image)
    if (message_content === '') {
      message_content = get_orig_imgsrc();
      is_text_message = false;
    }
    console.log('use the edit once');
    // Call the edit_message function to handle the editing
    edit_message(position, is_text_message);
    // Hide the "Edit" button
    edit.parentNode.style.display = 'none';
  });
  // Add a click event listener for the "Delete" button
  del.addEventListener('click', () => {
    // Get the position of the "Delete" button
    const position = del.getBoundingClientRect();
    // Call the delete_message function to handle message deletion
    delete_message(position);
    // Hide the "Delete" button
    del.parentNode.style.display = 'none';
  });
  // Add a click event listener for the "Pin" button
  pin.addEventListener('click', () => {
    // Call the pin_set function to handle pinning
    pin_set(pin, channel_id, token);
  });
};

const add_btn_set = (object, message_body) => {
  // Add a click event listener to the provided object
  object.addEventListener('click', () => {
    // Set the current message (current_msg) to the message_body
    current_msg = set_change(current_msg, message_body);
    // Remove any confirmation for deletion (comfirm_del)
    remove_comfirm_del();
  });
};

const add_image_event = (message_image) => {
  // Add a double-click event listener to the message_image element
  message_image.addEventListener('dblclick', () => {
    // Get references to various DOM elements
    const bg = document.getElementById('bigimg');
    const canvss = document.getElementById('bg_img');
    const img_container = bg.querySelector('.show_img');
    // Display the image in a larger view
    bg.style.display = 'flex';
    canvss.style.display = 'flex';
    img_container.src = message_image.src;
    // Find all message_image elements within the message_container
    const message_container = document.getElementById('message_container');
    all_image = message_container.querySelectorAll('.message_image');
    // Determine the position of the clicked image
    for (let i = 0; i < all_image.length; i++) {
      if (all_image[i] === message_image) {
        set_choosed_pos(i);
        break;
      }
    }
  });
};
// Add a click event listener to the react_btn element
const add_react_event = (react_btn, reactions) => {
  // Check if the reactions element is currently displayed
  react_btn.addEventListener('click', () => {
    if (reactions.style.display === 'flex') {
      // If it's displayed, hide the reactions element with a fade-out effect
      setTimeout(() => {
        reactions.style.display = 'none';
      }, 300);
      reactions.style.opacity = '0';
    } else {
      // If it's not displayed, show the reactions element with a fade-in effect
      reactions.style.display = 'flex';
      setTimeout(() => {
        reactions.style.opacity = '1';
      }, 0);
    }
  });
};

const react_one_or_unreact_one = (reactions, reator, item_search) => {
  // Find the corresponding item in the DOM
  const num = item_search.querySelector('.r_num');
  const current_num = Number(num.innerText);
  // Check if the reator has already reacted to the message
  if (reator.style.border === '1px solid rgb(216, 0, 0)') {
    // Decrease the reaction count and hide the reaction if it's the last one
    num.innerText = String(current_num - 1);
    if (current_num == 1) {
      item_search.style.display = 'none';
    }
    setTimeout(() => {
      reactions.style.display = 'none';
    }, 300);
    reactions.style.opacity = '0';
    // Reset the border of the reator element
    reator.style.border = '1px solid rgb(101, 101, 101)';
  } else {
    // Set the reator border to show reaction and display the reaction count
    item_search.style.display = 'flex';
    num.innerText = String(current_num + 1);
    setTimeout(() => {
      reactions.style.display = 'none';
    }, 300);
    reactions.style.opacity = '0';
    // Reset the border of the reator element
    reator.style.border = '1px solid rgb(216, 0, 0)';
  }
};

const add_reactor_event = (reator, id, i) => {
  console.log(id);
  // Add a click event listener to the reator element
  reator.addEventListener('click', () => {
    console.log(1);

    const text = reator.innerText;
    const [usr, token] = get_now_user();
    const id_normal = String(id) + String(i);

    const id_in = String(id) + String(i) + 'in';

    const reactor_normal = document.getElementById(id_normal);
    const reactor_in = document.getElementById(id_in);
    const channel_id = get_now_channel();
    const bottom_reactor = String(id) + String(text.codePointAt(0));
    const bottom_reactor_in = String(id) + String(text.codePointAt(0)) + 'in';
    const bottom_out = document.getElementById(bottom_reactor);
    const bottom_in = document.getElementById(bottom_reactor_in);
    if (reator.style.border === '1px solid rgb(216, 0, 0)') {
      // Call the 'unreact' function to react
      unreact(channel_id, id, token, text);
    } else {
      // Call the 'react' function to unreact
      react(channel_id, id, token, text);
    }
    if (reactor_normal && bottom_out) {
      console.log(reactor_normal);
      const reactions_now = document.getElementById(id + 'reactions');
      console.log(bottom_out);
      if (reactions_now) {
        react_one_or_unreact_one(reactions_now, reactor_normal, bottom_out);
      }
    }
    if (reactor_in && bottom_in) {
      const reactions_now = document.getElementById(id + 'reactionsin');
      console.log(reactions_now);
      if (reactions_now) {
        react_one_or_unreact_one(reactions_now, reactor_in, bottom_in);
      }
    }
  });
};

const per_msg_show = (item, insert_way) => {
  // Define an object to store reaction counts
  let all_responce = {
    0x1f929: 0,
    0x1f635: 0,
    0x1f497: 0,
    0x1f44d: 0,
    0x1f602: 0,
  };

  // Create a container for reactions
  const reaction_area = document.createElement('div');
  reaction_area.className = 'reaction_area';
  // Get current user and token
  const [usr, token] = get_now_user();
  // Create an array to store the user's reactions
  const my_reacted = [];
  // Calculate reaction counts
  item.reacts.forEach((items) => {
    if (items.user === Number(usr)) {
      my_reacted.push(items.react);
    }
    const key = items.react.codePointAt(0);
    all_responce[key] += 1;
  });
  for (let x = 0; x < 5; x++) {
    // Initialize reaction elements for each reaction
    initial_react_state(item, x, all_responce, reaction_area, insert_way);
  }
  // Create a container for all reactions
  const reactions = document.createElement('div');
  reactions.className = 'reactions';
  reactions.id = item.id + 'reactions';
  if (insert_way === 'in') {
    reactions.id = item.id + 'reactionsin';
  }
  let reactor_array = [];
  // Loop through the reactions
  for (let i = 0; i < 5; i++) {
    const reator = document.createElement('p');
    reator.innerText = String.fromCodePoint(reactors[i]);
    // Check if the user has reacted to this message
    if (my_reacted.includes(reator.innerText)) {
      reator.style.border = '1px solid #d80000';
    }
    //
    reator.id = item.id + String(i);
    if (insert_way === 'in') {
      reator.id = item.id + String(i) + 'in';
    }
    reator.className = 'emj';
    reactions.appendChild(reator);
    reactor_array.push(reator);
    // Add click event listener for reactions
    add_reactor_event(reator, item.id, i);
  }
  const massage_container = document.getElementById('message_container');
  const pin_container = document.getElementById('pin_continer');
  // Create a container for the message
  const message_box = document.createElement('div');
  message_box.className = 'messagebox';
  message_box.id = String(item.id);
  if (insert_way === 'in') {
    message_box.id = String(item.id) + 'in';
  }
  // Create a profile image element
  const profile = document.createElement('img');
  profile.className = 'profile add_border nocursor';
  // Create a container for the message body
  const message_body = document.createElement('div');
  message_body.className = 'message_body';
  // Create a message header
  const msg_header = document.createElement('div');
  // Create a pin block
  const name_pin = document.createElement('div');
  name_pin.style.display = 'flex';
  // Create elements for message owner and timestamp
  const message_owner = document.createElement('p');
  const message_timestamp = document.createElement('p');
  const pin_tag = document.createElement('p');
  pin_tag.innerText = '[ PINNED ]';
  pin_tag.style.display = 'none';
  // Check if the message is pinned
  if (item.pinned === true) {
    pin_tag.style.display = 'block';
  }
  message_owner.className = 'message_owner';
  message_timestamp.className = 'time_stamp';
  pin_tag.className = 'message_owner';
  pin_tag.id = item.id + 'p';
  if (insert_way === 'in') {
    pin_tag.id = item.id + 'p' + 'in';
  }
  pin_tag.style.marginLeft = '5px';
  msg_header.className = 'msg_header';
  // Create a react button element
  const react_btn = document.createElement('img');
  react_btn.className = 'react';
  react_btn.src = 'src/img/react.png';
  // Set the message timestamp
  message_timestamp.innerHTML = 'SendAt ' + show_time(item.sentAt);
  // If the message is edited, display the edited timestamp
  if (item.edited) {
    message_timestamp.innerHTML = 'EditAt ' + show_time(item.editedAt);
  }
  // Create a container for the message owner and pin status
  name_pin.appendChild(message_owner);
  name_pin.appendChild(pin_tag);
  msg_header.appendChild(name_pin);
  msg_header.appendChild(message_timestamp);
  // Fetch user information and update the message owner's name
  callAPIget('user/' + String(item.sender), token)
    .then((response) => {
      message_owner.innerText = response.name;
      check_image(profile, response.image);
    })
    .catch((error) => {
      meet_error(error);
    });
  // Create a container for the message content
  const msg_content = document.createElement('div');
  msg_content.className = 'message_content';
  // Create a container for hidden message settings
  const hidden_set = document.createElement('div');
  hidden_set.className = 'hidden_set';
  // Create a paragraph element for displaying the message text
  const message_text = document.createElement('p');
  message_text.innerText = '';
  // Create an image element for displaying the message image
  const message_image = document.createElement('img');
  message_image.src = '';
  // Check if the message contains text content
  if (item.hasOwnProperty('message')) {
    // Display the message text in the paragraph element
    message_text.innerText = item.message;
    message_text.className = 'message_text';
    msg_content.appendChild(message_text);
    // If the sender is the current user, highlight the background and add button set
    if (item.sender == usr) {
      message_text.style.backgroundColor = 'white';
      add_btn_set(message_text, message_body);
    }
  } else {
    // Display the message image in the image element
    message_image.className = 'message_image';
    message_image.src = item.image;
    msg_content.appendChild(message_image);
    // If the sender is the current user, add button set and image event
    if (item.sender == usr) {
      add_btn_set(message_image, message_body);
    }
    add_image_event(message_image);
  }
  msg_content.appendChild(react_btn);
  msg_content.appendChild(reactions);
  // Check if the sender is the current user
  if (item.sender == usr) {
    // Create Edit, Delete, and Pin buttons
    const edit = add_button('Edit', 'msg_btn');
    const del = add_button('Del', 'msg_btn');
    const pin = document.createElement('button');
    pin.innerText = 'Pin';
    // If the message is already pinned, change the button text to "Unpin"
    if (item.pinned === true) {
      pin.innerText = 'Unpin';
    }
    pin.className = 'msg_btn';
    // Add the Edit, Delete, and Pin buttons to the hidden set
    hidden_set.appendChild(edit);
    hidden_set.appendChild(del);
    hidden_set.appendChild(pin);
    // Add message header, hidden set, and message content to the message body
    message_body.appendChild(msg_header);
    message_body.appendChild(hidden_set);
    message_body.appendChild(msg_content);
    // Add profile image and message body to the message box
    message_box.appendChild(profile);
    message_box.appendChild(message_body);
    // Add the message box to the array of current user messages
    all_current_usr_message.push(message_box);
    // Add a click event listener to the message header
    msg_header.addEventListener('click', () => {
      const position = msg_header.getBoundingClientRect();
      looking_owner_change(item.sender, position);
      remove_comfirm_del();
    });
    // Add event listeners for Edit, Delete, and Pin buttons
    add_all_event(edit, del, pin, get_now_channel(), token);
  } else {
    // If the sender is not the current user, add message header and content to the message body
    message_body.appendChild(msg_header);
    message_body.appendChild(msg_content);
    // Add profile image and message body to the message box
    message_box.appendChild(profile);
    message_box.appendChild(message_body);
  }
  // Add a click event listener to the React button
  add_react_event(react_btn, reactions);
  // Add the reaction area to the message body
  message_body.appendChild(reaction_area);
  // Determine where to insert the message box based on the "insert_way" parameter
  if (insert_way === 'true') {
    if (massage_container.childNodes.length >= 1) {
      // If there are other messages, insert the message box after the first child
      const firstChild = massage_container.querySelector('div');
      massage_container.insertBefore(message_box, firstChild.nextSibling);
    } else {
      // If there are no other messages, insert the message box before the pin container
      massage_container.insertBefore(message_box, pin_container);
    }
  } else if (insert_way === 'false') {
    // Insert the message box before the pin container
    massage_container.insertBefore(message_box, pin_container);
  } else {
    // If "insert_way" is not "true" or "false," add the message box to the pin container
    pin_container.appendChild(message_box);
    // If the message is pinned, add it to the array of pinned message DOM elements
    if (item.pinned) {
      all_pinned_message_dom.push(message_box);
    }
  }
  // Update the temporary new height and add the message box to the array of all messages
  temp_new_height += message_box.scrollHeight + 28;
  all_message.push(message_box);
  // Log a message to indicate that the message has been added to the DOM
  console.log('added_msg_to_dom');
};

// request the backend to loading the message
const loading_message = (p) => {
  console.log('loading message' + String(p));
  return new Promise((resolve, reject) => {
    // get the user and token
    const [usr, token] = get_now_user();
    // get the position
    const start_Pos = String(p);
    // request the backend to loading the message
    callAPIget(
      'message/' + String(get_now_channel()) + '?start=' + start_Pos,
      token
    )
      // Request the backend to load the messages
      .then((response) => {
        // Check if it's the first batch of messages and there are messages
        if (p == 0 && response.messages.length > 0) {
          last_updated_msg = response.messages[0].id;
          console.log(last_updated_msg);
        }
        // Store the ID of the last updated message
        console.log(response);
        // Set a loading message in the buffer element
        buffer.innerText = 'Loading...';
        // Check if there are no more messages
        if (response.messages.length < 25) {
          const buffer = document.getElementById('buffer');
          buffer.innerText = 'NO MORE MESSAGES';
          buffer.style.display = 'block';
        }
        temp_new_height = 0;
        // Display each message
        response.messages.forEach((item) => {
          per_msg_show(item, 'true');
        });
        // Resolve the promise with the number of messages loaded
        resolve(response.messages.length);
      })
      .catch((error) => {
        meet_error(error);
        reject(error);
      });
  });
};
// This function retrieves and filters all pinned messages in the current channel.
export const filiter_all_pin_msg = () => {
  // Get the current user and token
  const [usr, token] = get_now_user();
  // Initialize the position and flag
  let inner_pos = 0;
  let flag = true;
  // Create a recursive function for processing messages
  const process = () => {
    if (flag) {
      // Make an API call to fetch a batch of messages
      callAPIget(
        'message/' + String(get_now_channel()) + '?start=' + inner_pos,
        token
      )
        .then((response) => {
          // Iterate through the messages and add pinned messages to the beginning of the array
          response.messages.forEach((item) => {
            if (item.pinned) {
              all_pinned_message.unshift(item);
            }
          });
          // Check if the batch of messages is less than 25, indicating no more messages
          if (response.messages.length < 25) {
            flag = false;
          }
          // Update the position
          inner_pos += response.messages.length;
          // Recursively process the next batch of messages
          process();
        })
        .catch((error) => {
          // Handle any errors that occur during the API call
          meet_error(error);
        });
    }
  };
  process();
};

const toggleContainer = document.getElementById('toggle-c');
const toggleButton = document.getElementById('toggle-b');
// This function toggles the display of pinned messages based on the value of 'isOn'.
export const change_pin_state = () => {
  // Get the container where pinned messages will be displayed
  const pin_container = document.getElementById('pin_continer');
  // Check the state - whether it's currently turned on or off
  if (isOn) {
    // If it's turned on, create a message header for pinned messages
    const pin_message_test = document.createElement('p');
    pin_message_test.innerText =
      '----------------------- ALL PIN MESSAGES BELOW -----------------------';
    pin_message_test.style.display = 'block';
    pin_message_test.className = 'buffer';
    pin_message_test.id = 'message_info_test';
    // Clear all previously displayed pinned messages and DOM elements
    clear_all_pinned_message();
    clear_all_pinned_dom();

    // Load pinned messages with a delay
    const loading_all_pin = new Promise((resolve, reject) => {
      filiter_all_pin_msg();
      setTimeout(() => resolve(), 500);
    });

    // After loading pinned messages, display them
    loading_all_pin
      .then(() => {
        // Append the message header to the container
        pin_container.appendChild(pin_message_test);
        // Display each pinned message
        all_pinned_message.forEach((item) => {
          per_msg_show(item, 'in');
        });
        // Scroll down the container
        scroll_down();
      })
      .catch((error) => {
        error_message(error);
      });
  } else {
    // If it's turned off, remove the pinned message header (if it exists)
    const pin_message_test = document.getElementById('message_info_test');
    if (pin_message_test) {
      pin_message_test.remove();
    }
    // Remove all previously displayed pinned message DOM elements
    all_pinned_message_dom.forEach((item) => {
      item.remove();
    });
  }
  // Toggle the state of the container and button
  toggleContainer.classList.toggle('on', isOn);
  toggleButton.classList.toggle('on', isOn);
};
// change the pin set
toggleContainer.addEventListener('click', () => {
  // if the fetching is ongoing then return
  if (get_fetching_state()) {
    error_message('Loading...');
    return;
  }
  isOn = !isOn;
  change_pin_state();
});
// set the scroll to the end
const scroll_down = () => {
  const message_container = document.getElementById('message_container');
  const scrollHeight = massage_container.scrollHeight;
  console.log('scrollHeight: ' + scrollHeight);
  message_container.scrollTop = scrollHeight;
};

export const show_specific_channel = (channel_id) => {
  // Set a flag to indicate that not loading data auto
  do_flag = false;
  // Remove all existing messages from the DOM
  all_message.forEach((item) => {
    item.remove();
  });
  all_message = [];
  // Clear the pinned DOM elements and pinned messages
  clear_all_pinned_dom();
  clear_all_pinned_message();
  // Reset the position and get user information
  pos = 0;
  const [usr, token] = get_now_user();
  // Trigger the start of the fetching process
  fetching_start();
  // Fetch channel information
  callAPIget('channel/' + channel_id, token)
    .then((response) => {
      // Get references to HTML elements
      const cn_content = document.getElementById('right_part');
      const specific = document.getElementById('talk');
      // Hide the channel content and show the specific channel content
      cn_content.style.display = 'none';
      specific.style.display = 'flex';
      loading_message(0).then((result) => {
        pos = Number(result);
        // Set the flag to indicate that the action is complete
        do_flag = true;
        initial_state = true;
        setTimeout(() => {
          scroll_down();
        }, 100);
        // Set the channel details
        channel_details_set(response);
        // Fetch and filter pinned messages
        filiter_all_pin_msg();
        // Log a message indicating the channel is opened
        console.log('channel_opened');
        // Set a timeout to indicate the end of fetching
        setTimeout(() => {
          fetching_end();
        }, 1000);
      });
    })
    .catch((error) => {
      meet_error(error);
      fetching_end();
    });
};
// Function to refresh the display of channel members
export const refresh_channel_member = (all_usr) => {
  for (let item in all_usr) {
    const [usr, token] = get_now_user();
    // Call an API to fetch user information for the specified user in the channel
    callAPIget('user/' + String(all_usr[item]), token)
      .then((response) => {
        // Get a reference to the container for channel members
        const container = document.getElementById('incn_usr_cont');
        // Create a new container for the user
        const usr_cont = document.createElement('div');
        usr_cont.id = all_usr[item];
        usr_cont.style.order = '0';
        const icon = document.createElement('img');
        const usr_name = document.createElement('p');
        // Set class names for styling
        usr_cont.className = 'each_usr';
        icon.className = 'each_usr';
        usr_name.className = 'each_usr';
        // Check and set the user's image
        check_image(icon, response.image);

        // Set the user's name
        usr_name.innerText = response.name;
        // Append the icon and name to the user's container
        usr_cont.appendChild(icon);
        usr_cont.appendChild(usr_name);
        // Append the user's container to the member container
        container.appendChild(usr_cont);
        console.log(usr_cont);
        // Store the user's container in the "current_channel_user" array
        current_channel_user.push(usr_cont);
        all_current_members.push(all_usr[item]);
      })
      .catch((error) => {
        meet_error(error);
      });
  }
  console.log(current_channel_user);
  console.log(all_current_members);
};
// Function to retrieve and set the name of a channel owner
const get_name_of_owner = (creator, token, obj) => {
  // Call an API to fetch user information for the specified creator
  callAPIget('user/' + creator, token)
    .then((response) => {
      // Set the inner text of the provided object (obj) to the owner's name from the API response
      obj.innerText = response.name;
    })
    .catch((error) => {
      // Handle and display an error message if there's an issue with the API call
      error_message(error);
    });
};

export const channel_details_set = (channel_info) => {
  // Log the provided channel_info
  console.log(channel_info);
  // Get references to various elements in the channel details section
  const name_head = document.getElementById('inchannel_name');
  const dis_head = document.getElementById('inchannel_dis');
  const channel_number_person = document.getElementById('incn_num');
  // Set the number of channel members in parentheses
  channel_number_person.innerText = '(' + channel_info.members.length + ')';
  // Set the channel name and adjust its width
  name_head.value = channel_info.name;
  name_head.style.width = get_width(name_head) + 'px';
  // Set the channel description and adjust its width
  dis_head.value = channel_info.description;
  dis_head.style.width = get_width(dis_head) + 'px';
  // Get a reference to the right bar
  const hidden_right = document.getElementById('right_bar');
  // Get input elements within the right bar
  const input_bar = hidden_right.querySelectorAll('.val_incn');
  // Set the input values for the channel name and description
  input_bar[0].value = channel_info.name;
  input_bar[1].value = channel_info.description;
  // Get the current user and token
  const [usr, token] = get_now_user();
  // Retrieve and set the name of the channel owner
  get_name_of_owner(channel_info.creator, token, input_bar[2]);
  // Set the channel's visibility as "public" or "private"
  input_bar[3].innerText = 'public';
  if (channel_info.private === true) {
    input_bar[3].innerText = 'private';
  }
  // Format and set the creation date of the channel
  const dateString = channel_info.createdAt;
  const dateObject = new Date(dateString);
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const date = dateObject.toLocaleDateString(undefined, options);
  input_bar[4].innerText = date;
  // Get the list of all channel members and store it in a global variable
  const all_usr = channel_info.members;
  all_current_members = all_usr;
  // <div class="each_usr">
  //     <img src="src/img/add_usr.png" class="each_usr">
  //     <p class="each_usr">Invite</p>
  // </div>
  // Refresh the display of channel members
  refresh_channel_member(all_usr);
};
// Add a click event listener to the "leave" element
const leave = document.getElementById('leave');
//

leave.addEventListener('click', () => {
  // Get the current user and token
  const [usr, token] = get_now_user();
  callAPIpost_withtoken('channel/' + get_now_channel() + '/leave', {}, token)
    .then((response) => {
      const channel_id = get_now_channel();
      // get the left part channel id and change the name
      // channel_id + 'l'
      // channel_name_own
      const joined_channel_modify = document.getElementById(channel_id + 'l');
      // Go back to the channel interface
      back_to_channel();
      if (joined_channel_modify) {
        const channel_state =
          joined_channel_modify.querySelector('.channel_dis_own');
        const state = String(channel_state.innerText.split('(')[1]);
        delete_element(joined_channel_modify);
        joined_channel_modify.remove();

        check_none();
        const public_channel_modify = document.getElementById(
          channel_id + 'rp'
        );
        if (public_channel_modify) {
          if (state.startsWith('pr')) {
            public_channel_modify.remove();
          } else {
            const join_btn = public_channel_modify.querySelector('.join');
            join_btn.innerText = 'JOIN';
          }
        }
      }
      // After successfully leaving the channel, perform these actions:
      // Display a success message
      error_message(String('Leave successful!'));
    })
    .catch((error) => {
      meet_error(error);
    });
});
// Function to change channel information
const change_channel_info = (name_txt, dis_txt) => {
  // Create an object with the new name and description data
  const data = {
    name: name_txt,
    description: dis_txt,
  };
  // Get the current user and token
  const [usr, token] = get_now_user();
  // Call an API to update the channel information with the new data
  callAPIput('channel/' + get_now_channel(), data, token)
    .then((response) => {
      // Get references to elements in the right bar
      const hidden_right = document.getElementById('right_bar');
      const input_bar = hidden_right.querySelectorAll('.val_incn');
      // Update input fields with new data
      inchannel_name.value = name_txt;
      dis_head.value = dis_txt;
      // Adjust the width of input fields based on content
      inchannel_name.style.width = get_width(inchannel_name) + 'px';
      dis_head.style.width = get_width(dis_head) + 'px';
      // Update input values in the input bar
      input_bar[0].value = name_txt;
      input_bar[1].value = dis_txt;
      // -----------------------------------------------------------------------------------------------
      // to do
      // sub element is "channel_name zeropm"
      //  channel_id + "rp"
      // get the public channel id and change the name if public
      const public_channel_modify = document.getElementById(
        get_now_channel() + 'rp'
      );
      if (public_channel_modify) {
        const text = public_channel_modify.querySelector(
          '.channel_name.zeropm'
        );
        text.innerText = name_txt;
      }
      // get the left part channel id and change the name
      // channel_id + 'l'
      // channel_name_own
      const joined_channel_modify = document.getElementById(
        get_now_channel() + 'l'
      );
      if (public_channel_modify) {
        const text = joined_channel_modify.querySelector('.channel_name_own');
        text.innerText = name_txt;
      }
    })
    // show error message
    .catch((error) => {
      meet_error(error);
    });
};
// change the chhannel info when the input blur
inchannel_name.addEventListener('blur', () => {
  change_channel_info(inchannel_name.value, dis_head.value);
});
// change the chhannel info when the input blur
dis_head.addEventListener('blur', () => {
  change_channel_info(inchannel_name.value, dis_head.value);
});
// change the chhannel info when the input blur
const hidden_right = document.getElementById('right_bar');
const input_bar = hidden_right.querySelectorAll('.val_incn');
input_bar[0].addEventListener('blur', () => {
  change_channel_info(input_bar[0].value, dis_head.value);
});
// change the chhannel info when the input blur
input_bar[1].addEventListener('blur', () => {
  change_channel_info(inchannel_name.value, input_bar[1].value);
});
// get the new msg container and bottom div
const new_msg_container = document.getElementById('msg_container');
const bottom_message = document.getElementById('bottom_part');
// auto set the height of the input text bar
export const auto_height = () => {
  // get the current height
  new_msg_container.style.height = 'auto';
  const scrollHeight = new_msg_container.scrollHeight;
  // set the height to msg container
  new_msg_container.style.height = scrollHeight + 'px';
  // set the height to the bottom message height
  bottom_message.style.height =
    String(new_msg_container.style.height + 14) + 'px';
};
// when input to the message sender bar the height would auto change
new_msg_container.addEventListener('input', () => {
  auto_height();
});
// when the mouse move first time the container goes down
const massage_container = document.getElementById('message_container');
// massage_container.addEventListener("mousemove", () => {
//   if (initial_state === true) {
//     initial_state = false;
//     scroll_down();
//   }
// });
// Add a scroll event listener to the "massage_container" element
massage_container.addEventListener('scroll', () => {
  // Hide the "other_profile" element when scrolling
  other_profile.style.display = 'none';
  // Get the "edit_div" element and hide it
  const edit_div = document.getElementById('edit_div');
  edit_div.style.display = 'none';
  // Remove the "del_btn" element if it exists
  const del_btn = document.querySelector('.confirmdel');
  if (del_btn) {
    del_btn.remove();
  }
  // Get the current scroll position of the "massage_container"
  const scrollTop = massage_container.scrollTop;
  // Check if the scroll position is at the top
  if (scrollTop <= 0) {
    // if the message is load once
    if (do_flag === true) {
      // display the buffer
      const buffer = document.getElementById('buffer');
      buffer.style.display = 'block';
      // get the father container
      const message_container = document.getElementById('message_container');
      console.log('loading one');
      // loading message
      loading_message(pos).then((result) => {
        // if the message not all loaded
        if (Number(result) == 25) {
          buffer.style.display = 'none';
        }
        // if the message not all loaded
        else {
          do_flag = false;
        }
        // get new position
        pos = pos + Number(result);
        // set the scroll top value
        message_container.scrollTop = temp_new_height;
      });
    }
  }
});
// try to loading the new message
const loading_new_message = (p) => {
  return new Promise((resolve, reject) => {
    // Get the current user and token
    const [usr, token] = get_now_user();
    const start_Pos = String(p);
    // Call an API to retrieve new messages based on the provided starting position
    callAPIget('message/' + get_now_channel() + '?start=' + start_Pos, token)
      .then((response) => {
        // Initialize a temporary variable to store new height
        temp_new_height = 0;
        // Initialize a flag variable
        let flag = false;
        // Initialize an array to store new messages
        let temp_msg = [];
        // Initialize an array to store new messages
        console.log('last_msg ' + last_updated_msg);
        response.messages.forEach((item) => {
          // Set the flag to true when the last updated message is found
          if (item.id === last_updated_msg) {
            flag = true;
          }
          // Add messages to the temporary array until the last updated message is found
          if (flag === false) {
            temp_msg.unshift(item);
          }
        });
        console.log(temp_msg);
        if (temp_msg.length > 0) {
          // Update the last updated message ID
          last_updated_msg = temp_msg[temp_msg.length - 1].id;
          // Log the message to be displayed
          temp_msg.forEach((item) => {
            console.log('show ' + item);
            // Call a function to display the message
            per_msg_show(item, 'false');
          });
          // Update the position
          pos += temp_msg.length;
          // Clear the temporary message array
          temp_msg = [];
          // Log the updated position
          console.log('pos=' + pos);
        }
        // Resolve the promise when messages are successfully loaded
        resolve();
      })
      .catch((error) => {
        console.log(error);
        let error_text = '';
        // Set error_text based on the type of error
        switch (error) {
          case 'info':
            error_text = 'Input error!';
            break;
          case 'access':
            error_text = 'Access error!';
            break;
          default:
            error_text = 'Network error! Please try again.';
            break;
        }
        error_message(String(error_text)); // Display an error message
        reject(error); // Reject the promise in case of an error
      });
  });
};
// get all conponment about add the new image
const img_button = document.getElementById('sed_img');
const file_area = document.getElementById('msg_new_img');
const new_img = document.getElementById('new_img');
// when add image added,
img_button.addEventListener('click', () => {
  // click the add image file
  file_area.value = '';
  file_area.click();
});
// when the file content change
file_area.addEventListener('change', () => {
  // get the file information
  const image_info = file_area.files[0];
  console.log(image_info);
  // set the  new image src
  fileToDataUrl(image_info).then((response) => {
    new_img.src = response;
  });
  // show the image
  if (new_img.src != '') {
    new_img.style.display = 'block';
  }
});

// add the msg and send it
const add_msg = (data) => {
  // get now user and token
  const [usr, token] = get_now_user();
  callAPIpost_withtoken('message/' + get_now_channel(), data, token)
    .then((response) => {
      // loading the new message
      loading_new_message(0)
        // scrolling down to the end
        .then((response) => {
          scroll_down();
        });
      // clear the msg_container
      document.getElementById('msg_container').value = '';
      // clear the message src
      new_img.src = '';
      // hidden the new send image
      new_img.style.display = 'none';
    })
    // show error
    .catch((error) => {
      console.log(error);
      let error_text = '';
      switch (error) {
        case 'info':
          error_text = 'Input error!';
          break;
        case 'access':
          error_text = 'Access error!';
        default:
          error_text = 'Network error! Please try again.';
          break;
      }
      error_message(String(error_text));
    });
};

// get the send msg button
const sed_msg = document.getElementById('sed_msg');
// ready to send the message
const prepare_to_send = () => {
  // get the text and image
  const txt = document.getElementById('msg_container').value;
  const img = new_img.src;
  // if the txt is none and no image added then cannot send the message
  if (txt.trim() === '' && img === location.href.split('#')[0]) {
    error_message('NO message to send !');
    return;
  }
  // if the txt is none then send the message
  if (txt.trim() != '') {
    const data = {
      message: String(document.getElementById('msg_container').value),
    };
    add_msg(data);
  }
  // if the image is none then send the image
  if (img != location.href.split('#')[0]) {
    const data = { image: img };
    add_msg(data);
  }
};

// when the send_msg click
sed_msg.addEventListener('click', () => {
  prepare_to_send();
});
// If the Shift and Enter keys are pressed at the same time,
// execute the prepare_to_send() function
document
  .getElementById('msg_container')
  .addEventListener('keydown', (event) => {
    if (event.shiftKey && event.key === 'Enter') {
      prepare_to_send();
    }
  });
// when the window size changed
window.addEventListener('resize', function () {
  // hidden some page
  // hidden the profile page
  const other_profile = document.getElementById('other_profile');
  other_profile.style.display = 'none';
  // hidden the edit div part
  const edit_div = document.getElementById('edit_div');
  edit_div.style.display = 'none';
  // hidden the confirm delete button
  const del_btn = document.querySelector('.confirmdel');
  if (del_btn) {
    del_btn.remove();
  }
});
