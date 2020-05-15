/*
this function 
-scans the database
-process the latest accelerometer values of last hour 
-encode in json
*/

exports.handler = (event, context, callback) => {
    let responseBody = '';
    var AWS = require('aws-sdk');
    var dbClient = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName: "iot_topic"
    };
    dbClient.scan(params, function(err, data) {
        if (err) {
            callback(err, null);
        }
        else {
            responseBody = data.Items;
            
            //last hour accelerometer values list
            let hour = []
            
            //find last hour values
            let dt = getDatetime()
            for (let i = 0; i < responseBody.length; i++) {
                if(responseBody[i].datetime > dt && responseBody[i].payload.type == "raw"){
                hour.push([responseBody[i].datetime,responseBody[i].payload.id,responseBody[i].payload.accx, responseBody[i].payload.accy, responseBody[i].payload.accz])
                }
            }
            
            //sort the list 
            hour = getSorted(hour);
            
            
            //temporary accumulator of accelerometer values
            let counter = [];
            
            //accumulator of processed values
            let result = [];
            
            //for each 10 values, call the function to classify them 
            for (let i = 0; i < hour.length; i++) {
                
                //counter records last hour values
                counter.push(hour[i])
                
                //when we have 10 records we process and empty counter
                if (counter.length == 10 ) {
                result.push(process(counter))
                counter = []
                }
            }
            
            //payload
            let new_response = []
            
            //create payload
            new_response.push(result)
            var response = {
                "statusCode": 200,
                "headers": {
                    'Access-Control-Allow-Origin': "*"
                },
                "body": JSON.stringify(new_response),
                //"body": new_response,
                "isBase64Encoded": false
            };
            callback(null, response);
        }
    });
};


//this function sorts and return a map, useful in order to pass a corrct json
function getSorted(obj) {
    obj.sort(function(a, b) {if (a[0] > b[0]){
              return -1;   
            }else  {
              return 1   
            }
});  
let obj2 = []
for (let i = 0; i < obj.length; i++){
    let payload = {}
    payload["datetime"] = obj[i][0]
    payload["id"] = obj[i][1]
    payload["accx"] = obj[i][2]
    payload["accy"] = obj[i][3]
    payload["accz"] = obj[i][4]
    obj2.push(payload)
            }
return obj2
}


//this function return datetime (+0)
function getDatetime(){
    let date_ob = new Date();
            
    // current date
    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);

    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let year = date_ob.getFullYear();

    // current hours since we are +1
    let hours = ("0" + (date_ob.getHours() )).slice(-2);

    // current minutes
    let minutes = ("0" + date_ob.getMinutes()).slice(-2);

    // current seconds
    let seconds = ("0" + (date_ob.getSeconds()) ).slice(-2);

    let our_datetime = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
    
    console.log(our_datetime)    
    return our_datetime
} 

//processes 10 values and returns a map with the processed 
function process(useful){
    let map = {};
    
    //accumulator of moving classificatttions
    let moving = 0;
    
    //list of values processed in order to evaluate if the user is moving
    let accelerometer_values = [];
    
    
    //compute absolute movement value and collect accelerometer values
    for (let i = 0; i < useful.length; i++) {
                
        //absolute value of the movement in all the axis
        let absolute_movement = Math.abs(useful[i].accx) + Math.abs(useful[i].accy) + Math.abs(useful[i].accz);
                    
        //2 is an empirical value, walking the sensor has a value of 3
        if (absolute_movement > 2){
            moving = moving + 1;
        }
                    
        //add the values in the list of processed
        accelerometer_values.push([useful[i].datetime, useful[i].accx, useful[i].accy, useful[i].accz])
    }
    
    //compute if last 10 activity logs classify as moving
    let moved = "false";
            
    //I chose to use 8 as a treshold, empirical value, 
    //If the user is moving 8 times over 10, it is actually not still
    if (moving > 8){
        moved = "true";
    }
    
    map["moving"] = moved;
    map["datetime"] = useful[0].datetime;
    map["array"] = accelerometer_values;
    return map;
}

            
