/*
 * Copyright (C) 2018 Inria
 *
 * This file is subject to the terms and conditions of the GNU Lesser
 * General Public License v2.1. See the file LICENSE in the top level
 * directory for more details.
 */

#include <string.h>

#include <time.h>
#include <unistd.h>
#include "xtimer.h"

#include "net/loramac.h"
#include "semtech_loramac.h"

#include "hts221.h"
#include "hts221_params.h"

#include "board.h"

/* Declare globally the loramac descriptor */
static semtech_loramac_t loramac;

/* Declare globally the sensor device descriptor */
static hts221_t hts221;

/* Device and application informations required for OTAA activation */
static const uint8_t deveui[LORAMAC_DEVEUI_LEN] = { 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 };
static const uint8_t appeui[LORAMAC_APPEUI_LEN] = { 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 };
static const uint8_t appkey[LORAMAC_APPKEY_LEN] = { 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 };

//Generating Random Values
int get_random(int min, int max) { 
    int randValue = (rand() % (max - min + 1)) + min;
    return randValue;
}

static void sender(void)
{
    while (1) {
        /* sleep 20 secs */
        xtimer_sleep(20);
        char payload[300];

        /* do some measurements */
        uint16_t humidity = 0;
        int16_t temperature = 0;
        if (hts221_read_humidity(&hts221, &humidity) != HTS221_OK) {
            puts(" -- failed to read humidity!");
        }
        if (hts221_read_temperature(&hts221, &temperature) != HTS221_OK) {
            puts(" -- failed to read temperature!");
        }

        char* deviceId = "EnvironmentalStation_2";
        int win_dir = get_random(0,360);
        int win_int = get_random(0,100);
        int rain = get_random(0,50);
        time_t t = time(NULL);
        struct tm tm = *localtime(&t);


        sprintf(payload,"{\"deviceId\": \"%s\", \"humidity\": \"%u.%u\", \"temperature\": \"%u.%u\", \"windDirection\": \"%d\", \"windIntensity\": \"%d\", \"rainHeigth\": \"%d\", \"datetime\": \"%d-%02d-%02d %02d:%02d:%02d\"}", deviceId, (humidity / 10), (humidity % 10), (temperature / 10), (temperature % 10), win_dir, win_int, rain, tm.tm_year + 1900, tm.tm_mon + 1, tm.tm_mday, tm.tm_hour, tm.tm_min, tm.tm_sec);
        //sprintf(payload,"{deviceId": "%s", "humidity": "%u.%u", "temperature": "%u.%u", "windDirection": "%d", "windIntensity": "%d", "rainHeigth": "%d", "datetime": "%d-%02d-%02d %02d:%02d:%02d}"}, deviceId, (humidity / 10), (humidity % 10), (temperature / 10), (temperature % 10), win_dir, win_int, rain, tm.tm_year + 1900, tm.tm_mon + 1, tm.tm_mday, tm.tm_hour, tm.tm_min, tm.tm_sec);

        printf("Sending data: %s\n", payload);

        /* send the LoRaWAN message */
        semtech_loramac_send(&loramac, (uint8_t *)payload,
                                           strlen(payload));

        semtech_loramac_recv(&loramac);
    }

    /* this should never be reached */
    return;
}

int main(void)
{
    if (hts221_init(&hts221, &hts221_params[0]) != HTS221_OK) {
        puts("Sensor initialization failed");
        LED3_TOGGLE;
        return 1;
    }
    if (hts221_power_on(&hts221) != HTS221_OK) {
        puts("Sensor initialization power on failed");
        LED3_TOGGLE;
        return 1;
    }
    if (hts221_set_rate(&hts221, hts221.p.rate) != HTS221_OK) {
        puts("Sensor continuous mode setup failed");
        LED3_TOGGLE;
        return 1;
    }

    /* initialize the loramac stack */
    semtech_loramac_init(&loramac);

    /* use a fast datarate so we don't use the physical layer too much */
    semtech_loramac_set_dr(&loramac, 5);

    /* set the LoRaWAN keys */
    semtech_loramac_set_deveui(&loramac, deveui);
    semtech_loramac_set_appeui(&loramac, appeui);
    semtech_loramac_set_appkey(&loramac, appkey);

    /* start the OTAA join procedure */
    puts("Starting join procedure");
    if (semtech_loramac_join(&loramac, LORAMAC_JOIN_OTAA) != SEMTECH_LORAMAC_JOIN_SUCCEEDED) {
        puts("Join procedure failed");
        return 1;
    }

    puts("Join procedure succeeded");

    /* call the sender */
    sender();

    return 0; /* should never be reached */
}

