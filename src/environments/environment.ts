// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,
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
