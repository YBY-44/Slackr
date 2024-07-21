import { BACKEND_PORT } from "./config.js";
// convert the string to the time
export const show_time = (time_stamp) => {
  // Convert the timestamp to a Date object
  const dateObject = new Date(time_stamp);
  // Extract year, month, day, hours, minutes, and seconds
  const year = dateObject.getFullYear();
  const month = String(dateObject.getMonth() + 1).padStart(2, "0");
  const day = String(dateObject.getDate()).padStart(2, "0");
  const hours = String(dateObject.getHours()).padStart(2, "0");
  const minutes = String(dateObject.getMinutes()).padStart(2, "0");
  const seconds = String(dateObject.getSeconds()).padStart(2, "0");
  // Create a formatted time string
  const timeString = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  // Return the formatted time string
  return timeString;
};

// get the current user id
// if not loged in return null
export const get_now_user = () => {
  const devided = location.hash.split('/');
  if (devided.length > 0) {
    const seconde_devided = devided[0].split('=');
    const token = seconde_devided[2];
    const user = seconde_devided[1].split('#')[0];
    return [user, token];
  }
  return [null, null]; 
}
//  get the current channel id
//  if not in a channel return the null
export const get_now_channel=()=>{
  const splited = location.hash.split('/');
  if (splited.length>1){
    return splited[1].split('=')[1];
  }
  return null; 
}
// if the channel is changed then call this function
export const change_channel=(new_id)=>{
  const splited = location.hash.split('=');
  if (splited.length>1){
    // set the channel to the new channelid
    location.hash = splited[0] +'='+ splited[1]+'=' +splited[2]+'='+String(new_id);
  }
}


// all GET request send by this function
export const callAPIget = (path,token) => {
    return new Promise((success, error) => {
      fetch("http://localhost:"+String(BACKEND_PORT)+"/"+String(path), {
        method: 'GET',
        headers: {
          "Authorization": String(token)
        }
      })
        .then((response) => {
          if (response.ok) {
            console.log("success");
            return response.json();
          } else if (response.status === 400) {
            error("info");
          } else if (response.status === 403){
            error("access");
          }
          else {
            error("net");
          }
        })
        .then((body) => {
          success(body);
        })
        .catch((err) => {
          error(err);
        });
    });
  };

// all Get message request send by this function
export const callAPIget_msg = (path,token) => {
  return new Promise((success, error) => {
    fetch("http://localhost:"+String(BACKEND_PORT)+"/"+String(path), {
      method: 'GET',
      headers: {
        "Authorization": String(token)
      }
    })
      .then((response) => {
        if (response.ok) {
          console.log("success");
          return response.json();
        } else if (response.status === 400) {
          error("info");
        } else if (response.status === 403){
          error("access");
        }
        else {
          error("net");
        }
      })
      .then((body) => {
        success(body);
      })
      .catch((err) => {
        error(err);
      });
  });
};
// all post request send by this question 
  export const callAPIpost = (path, input_data) => {
    return new Promise((success, error) => {
      fetch("http://localhost:"+String(BACKEND_PORT)+"/" + String(path), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input_data),
      })
        .then((response) => {
          if (response.ok) {
            console.log("success");
            return response.json();
          } else if (response.status === 400) {
            error("info");
          } 
          else{
            error("net");
          }
        })
        .then((body) => {
          success(body);
        })
        .catch((err) => {
          error(err);
        });
    });
  };

// call post request with token send by this function
  export const callAPIpost_withtoken = (path, input_data,token) => {
    return new Promise((success, error) => {
      fetch("http://localhost:"+String(BACKEND_PORT)+"/" + String(path), {
        method: "POST",
        headers: { "Authorization": String(token) ,
                    "Content-Type": "application/json"
                },
        body: JSON.stringify(input_data),
      })
        .then((response) => {
          if (response.ok) {
            console.log("success");
            return response.json();
          } else if (response.status === 400) {
            error("info");
          } 
          else{
            error("net");
          }
        })
        .then((body) => {
          success(body);
        })
        .catch((err) => {
          error(err);
        });
    });
  };
//  all put request with token send by this message
export const callAPIput = (path, input_data,token) => {
  return new Promise((success, error) => {
    fetch("http://localhost:"+String(BACKEND_PORT)+"/" + String(path), {
      method: "PUT",
      headers: { "Authorization": String(token) ,
                  "Content-Type": "application/json"
              },
      body: JSON.stringify(input_data),
    })
      .then((response) => {
        if (response.ok) {
          console.log("success");
          return response.json();
        } else if (response.status === 400) {
          error("info");
        } 
        else if (response.status === 403) {
          error("info");
        } 
        else{
          error("net");
        }
      })
      .then((body) => {
        success(body);
      })
      .catch((err) => {
        error(err);
      });
  });
};

// All delete request send by this function
export const callAPIdelete = (path,token) => {
return new Promise((success, error) => {
  fetch("http://localhost:"+String(BACKEND_PORT)+"/"+String(path), {
    method: 'DELETE',
    headers: {
      "Authorization": String(token)
    }
  })
    .then((response) => {
      if (response.ok) {
        console.log("success");
        return response.json();
      } else if (response.status === 400) {
        error("info");
      } else if (response.status === 403){
        error("access");
      }
      else {
        error("net");
      }
    })
    .then((body) => {
      success(body);
    })
    .catch((err) => {
      error(err);
    });
});
};