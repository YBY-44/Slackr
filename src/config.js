export const BACKEND_PORT = 5005
// the fetching_flage is true when the channel is loading the message
// when the channel is loaded the fetching flag would be false
let fetching_flag=false;
// get fetching status
export const get_fetching_state=()=>{
    return fetching_flag;
}
// chang the value to true
export const fetching_start=()=>{
    fetching_flag=true;
}
// change the value to false
export const fetching_end=()=>{
    fetching_flag=false;
}