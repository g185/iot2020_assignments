
## Assignment 3: LoRa devices connected to AWS cloud MQTT using TTN
## The Assignment
This project is the solution for the Third Assignment of IoT 2020 course in Sapienza University. It consisted in the implementation of a LoRaWAN and TheThingsNetwork structure. This repository contains the code for the application deployed on iot-lab nodes and the python bridge used in order to enstablish a connection between TTN and AWS. The scripts can be found in the directories above. In particular, I implemented a python bridge that was able to retrieve the data from a The Things Network application using their API, and then published these information on the MQTT offered by AWS. The other component of the project is a the firmware that is running on the iot-lab test-bed, consisting in a RIOT-OS application that simulate an environmental station. This script is able to retrieve real data from real sensor and combine them with some random data, simulating different metrics values. The functionalities are explained in the video below. An Hands-on Tutorial can be found below, where I presented a step-to-step guide that expains in depth the concept and implementation of the code above. 


## Dashboard Web-App
Link to Public Dashboard
>http://iot2020dashboard.s3-website-us-east-1.amazonaws.com/

## Hands-on Tutorial
Link to Hands-On Tutorial
>https://www.linkedin.com/pulse/using-lorawan-things-network-connect-real-sensors-aws-martinelli/

## Video Demostration
Link to Video Demostration
>https://youtu.be/41lUHV0RVnY

