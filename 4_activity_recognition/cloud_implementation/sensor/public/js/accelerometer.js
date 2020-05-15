//make connection to the backend


var ID = "myCell";
var socket = io();
let status = document.getElementById('status');
if ( 'Accelerometer' in window ) {
  let sensor = new LinearAccelerationSensor({frequency:1});
  sensor.addEventListener('reading', function(e) {

    our_datetime = getDateTime();
    socket.emit('accelerometer', {
      id: ID,
      datetime: our_datetime,
      type: "raw",
      accx: e.target.x.toFixed(3).toString(),
      accy: e.target.y.toFixed(3).toString(), 
      accz: e.target.z.toFixed(3).toString()
    })
    
    status.innerHTML = 'x: ' + e.target.x + '<br> y: ' + e.target.y + '<br> z: ' + e.target.z;
  });
  sensor.start();
}
else status.innerHTML = 'Accelerometer not supported';


//this function returns current datetime
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