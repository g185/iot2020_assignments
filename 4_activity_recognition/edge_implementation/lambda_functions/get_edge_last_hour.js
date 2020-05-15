/*
this function 
-scans the database
-process the latest activity values of last hour from the edge ones
-encode in json
*/

//main function
exports.handler = (event, context, callback) => {
    let responseBody = '';
    var AWS = require('aws-sdk');
    var dbClient = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName: "iot_topic"
    };
    
    //db scan
    dbClient.scan(params, function(err, data) {
        if (err) {
            callback(err, null);
        }
        else {
            responseBody = data.Items;
            
            //array of last hour activities
            let status = [];
            
            //compute last our activities
            let dt = getDatetime()
            for (let i = 0; i < responseBody.length; i++) {
                
                //if they are from last hour and they are edge computed
                if(responseBody[i].datetime > dt && responseBody[i].payload.type == "edge"){
                     
                    //record them into the list
                    status.push([responseBody[i].datetime,responseBody[i].payload.moving,responseBody[i].payload.id, "Moving"])
                }
            
            }
            
            //payload
            let new_response = []
            
            //sort last hour detected activities by
            status = getSorted(status)
            
            
            //create payload
            if(status.length != 0){
                new_response.push(status)
            }
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
    payload["value"] = obj[i][1]
    payload["deviceId"] = obj[i][2]
    payload["obj"] = obj[i][3]
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
    let hours = ("0" + (date_ob.getHours() + 1)).slice(-2);

    // current minutes
    let minutes = ("0" + date_ob.getMinutes()).slice(-2);

    // current seconds
    let seconds = ("0" + date_ob.getSeconds()).slice(-2);

    let our_datetime = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
    
    console.log(our_datetime)    
    return our_datetime
}
