from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient
import time
import json
import datetime
import random 

def return_params():

	params = {}
	params['host'] = "a2z25wkbsy932x-ats.iot.us-east-1.amazonaws.com"
	params['certPath'] = "/home/giuliano/Desktop/IOT/cert/"
	params['rootCA'] = params['certPath'] + "root-CA.crt"
	params['privateKey'] = params['certPath'] + "446f93cefd-private.pem.key"
	params['cert'] = params['certPath'] + "446f93cefd-certificate.pem.crt"
	params['clientId'] = "EnvironmentalStation_2"
	params['topic'] = "topic"

	return params




def connect_to_MQTT(params):

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

def generate_sensor_values():
	values = {}
	values['temperature'] = random.randint(-50,50)
	values['humidity'] = random.randint(0,100)
	values['wind_dir'] = random.randint(0,360)
	values['wind_int'] = random.randint(0,100)
	values['rain_hgt'] = random.randint(0,50)
	return values



def build_message(values):
	msg = {}
	msg['deviceId'] = params['clientId']
	msg['humidity'] = str(values['humidity'])
	msg['temperature'] = str(values['temperature'])
	msg['windDirection'] = str(values['wind_dir'])
	msg['windIntensity'] = str(values['wind_int'])
	msg['rainHeigth'] = str(values['rain_hgt'])
	msg['datetime'] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
	return msg

"""++++++++++++++++++++++++++++MAIN+++++++++++++++++++++"""

params = return_params()
MQTTClient = connect_to_MQTT(params)
while True:
	values = generate_sensor_values()
	message = build_message(values)
	messageJson = json.dumps(message)
	MQTTClient.publish(params['topic'] , messageJson, 1)
	print('Published topic %s: %s\n' % (params['topic'] , messageJson))
	time.sleep(10)
