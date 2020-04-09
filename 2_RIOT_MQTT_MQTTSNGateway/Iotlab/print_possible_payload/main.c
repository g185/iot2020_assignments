/*
 * Copyright (C) 2014 Freie Universität Berlin
 *               2018 Inria
 *
 * This file is subject to the terms and conditions of the GNU Lesser
 * General Public License v2.1. See the file LICENSE in the top level
 * directory for more details.
 */

/**
 * @ingroup tests
 * @{
 *
 * @file
 * @brief       Test application for the LPS331AP/LPS25HB/LPS22HB pressure sensor
 *
 * @author      Hauke Petersen <hauke.petersen@fu-berlin.de>
 * @author      Alexandre Abadie <alexandre.abadie@inria.fr>
 *
 * @}
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <unistd.h>

#include "xtimer.h"
#include "lpsxxx.h"
#include "lpsxxx_params.h"
//Generating Random Values
int get_random(int min, int max) { 
    int randValue = (rand() % (max - min + 1)) + min;
    return randValue;
}

//Generating the payload with random values
void get_payload(char* payload, char* deviceId){
    lpsxxx_t dev;
    if (lpsxxx_init(&dev, &lpsxxx_params[0]) != LPSXXX_OK) {
        puts("Initialization failed");
    }
    int16_t temp;

    lpsxxx_enable(&dev);

    lpsxxx_read_temp(&dev, &temp);
    lpsxxx_disable(&dev);
        
    int temp_abs = temp / 100;
    temp -= temp_abs * 100;

    int hum = get_random(0,100);
    int win_dir = get_random(0,360);
    int win_int = get_random(0,100);
    int rain = get_random(0,50);
    time_t t = time(NULL);
    struct tm tm = *localtime(&t);


    sprintf(payload,"{\"deviceId\": \"%s\", \"humidity\": \"%d\", \"temperature\": \"%2i.%02i\", \"windDirection\": \"%d\", \"windIntensity\": \"%d\", \"rainHeigth\": \"%d\", \"datetime\": \"%d-%02d-%02d %02d:%02d:%02d\"}", deviceId, temp_abs, temp, hum, win_dir, win_int, rain, tm.tm_year + 1900, tm.tm_mon + 1, tm.tm_mday, tm.tm_hour, tm.tm_min, tm.tm_sec);

}

int main(void)
{
  
    char* topic = "topic";


    while (1) {
        char payload[500];
        get_payload(payload,"EnvironmentalStation_1");
        printf("pub with topic: %s and name %s and", topic, payload);

        xtimer_sleep(10); /* wait a bit for the measurements to complete */


        printf("Published %i bytes to topic '%s '\n",
                (int)strlen(payload), topic);

    }
    return 0;
}

