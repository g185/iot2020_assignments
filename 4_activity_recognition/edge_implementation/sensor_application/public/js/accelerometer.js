//make connection to the backend
var ID = "myCell";
var socket = io();
var moving = 0;
var last10secMoving = "false";
var counter = 0;
let status = document.getElementById('status');
    if ( 'Accelerometer' in window ) {
      let sensor = new LinearAccelerationSensor({frequency:1});
      sensor.addEventListener('reading', function(e) {

        our_datetime = getDateTime();
        var absolute = Math.abs(e.target.x) + Math.abs(e.target.y) + Math.abs(e.target.z);
        if (absolute > 2){
          moving = moving + 1;
        }
        if (counter == 10){
          if(moving > counter  - counter / 5) {
            last10secMoving = "true";
            moving = 0;
          }else{
            last10secMoving = "false";
          }
          socket.emit('accelerometer', {
            type: "edge",
            id: ID,
            datetime: our_datetime,
            moving: last10secMoving
          })
          counter = 0;
        }
        counter = counter + 1;
        status.innerHTML = ' Moving: ' + last10secMoving;
      });
      sensor.start();
    }
    else status.innerHTML = 'Accelerometer not supported';


    //simulation
function getDateTime(){
  let date_ob = new Date();
            
  // current date
  // adjust 0 before single digit date
  let date = ("0" + date_ob.getDate()).slice(-2);

  // current month
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // current year
  let year = date_ob.getFullYear();

  // current hours since we are +1
  let hours = ("0" + date_ob.getHours()).slice(-2);

  // current minutes
  let minutes = ("0" + date_ob.getMinutes()).slice(-2);

  // current seconds
  let seconds = ("0" + date_ob.getSeconds()).slice(-2);

  let our_datetime = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
  
  return our_datetime;
  }