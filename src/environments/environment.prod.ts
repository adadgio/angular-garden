export const environment = {
    production: true,
    ARDUINO: {
        IP: "192.168.1.4",
        PORT: 80,
    },
    NODERED: {
        IP: "37.139.14.78",
        PORT: 1880,
    },
};

export const $conf = {
    ARDUINO: {
        HTTP_ENDPOINT: () => {
            return `http://${environment.ARDUINO.IP}:${environment.ARDUINO.PORT}`;
        }
    },
    NODERED: {
        HTTP_ENDPOINT: () => {
            return `http://${environment.NODERED.IP}:${environment.NODERED.PORT}`;
        },
        SOCKET_ENDPOINT: () => {
            return `ws://${environment.NODERED.IP}:${environment.NODERED.PORT}`;
        }
    }
}
