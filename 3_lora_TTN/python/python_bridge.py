import time
import ttn
from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient
import time
import json
import datetime
import random 
import re

#connection parameters
def return_params():

	params = {}
	params['host'] = "a2z25wkbsy932x-ats.iot.us-east-1.amazonaws.com"
	params['certPath'] = "/home/giuliano/Desktop/IOT/cert/"
	params['rootCA'] = params['certPath'] + "root-CA.crt"
	params['privateKey'] = params['certPath'] + "446f93cefd-private.pem.key"
	params['cert'] = params['certPath'] + "446f93cefd-certificate.pem.crt"
	params['clientId'] = "EnvironmentalStation_1"
	params['topic'] = "topic"
	params['ttnAppId'] = "iot2020_g185"
	params['ttnAccessKey'] = "ttn-account-v2.dCCFE7rEKTmOcv-CvCemDezpK5acV2bUmXmL7F2gSPg"

	return params

#connect to aws mqtt and return handler
def connect_to_AWS_MQTT(params):

	myAWSIoTMQTTClient = AWSIoTMQTTClient(params['clientId'])
	myAWSIoTMQTTClient.configureEndpoint(params['host'], 8883)
	myAWSIoTMQTTClient.configureCredentials(params['rootCA'],params['privateKey'],params['cert'])

	# AWSIoTMQTTClient connection configuration
	myAWSIoTMQTTClient.configureAutoReconnectBackoffTime(1, 32, 20)
	myAWSIoTMQTTClient.configureOfflinePublishQueueing(-1)  # Infinite offline Publish queueing
	myAWSIoTMQTTClient.configureDrainingFrequency(2)  # Draining: 2 Hz
	myAWSIoTMQTTClient.configureConnectDisconnectTimeout(10)  # 10 sec
	myAWSIoTMQTTClient.configureMQTTOperationTimeout(5)  # 5 sec
	myAWSIoTMQTTClient.connect()

	return myAWSIoTMQTTClient

#connect to ttn mqtt and return handler
def connect_to_TTN_MQTT(params):
	handler = ttn.HandlerClient(params["ttnAppId"], params["ttnAccessKey"])
	# using mqtt client
	mqtt_client = handler.data()
	mqtt_client.set_uplink_callback(uplink_callback)
	return mqtt_client

#uplink message goes from ttn to aws
def uplink_callback(msg, client):
  	print("Received uplink from ", msg.dev_id)
  	messageJson = json.dumps(msg.payload_fields[0])
  	msg = messageJson.replace("\\", "")
  	msg = re.sub('([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]) [0-9:]*.[0-9]*)', datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S\""), msg)
  	AWS_MQTT_client.publish(params['topic'] ,msg[1:-1], 1)
  	print('Published topic %s: %s\n' % (params['topic'] , msg))


params = return_params()
AWS_MQTT_client = connect_to_AWS_MQTT(params)
TTN_MQTT_client = connect_to_TTN_MQTT(params)
TTN_MQTT_client.connect()
time.sleep(300)