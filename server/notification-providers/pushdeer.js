const NotificationProvider = require("./notification-provider");
const axios = require("axios");
const { DOWN, UP } = require("../../src/util");

class PushDeer extends NotificationProvider {

    name = "PushDeer";

    async send(notification, msg, monitorJSON = null, heartbeatJSON = null) {
        let okMsg = "Sent Successfully.";
        let pushdeerlink = "https://api2.pushdeer.com/message/push";

        let valid = msg != null && monitorJSON != null && heartbeatJSON != null;

        let title;
        if (valid && heartbeatJSON.status === UP) {
            title = "## Uptime Katalon: " + monitorJSON.name + " up";
        } else if (valid && heartbeatJSON.status === DOWN) {
            title = "## Uptime Katalon: " + monitorJSON.name + " down";
        } else {
            title = "## Uptime Katalon Message";
        }

        let data = {
            "pushkey": notification.pushdeerKey,
            "text": title,
            "desp": msg.replace(/\n/g, "\n\n"),
            "type": "markdown",
        };

        try {
            let res = await axios.post(pushdeerlink, data);

            if ("error" in res.data) {
                let error = res.data.error;
                this.throwGeneralAxiosError(error);
            }
            if (res.data.content.result.length === 0) {
                let error = "Invalid PushDeer key";
                this.throwGeneralAxiosError(error);
            } else if (JSON.parse(res.data.content.result[0]).success !== "ok") {
                let error = "Unknown error";
                this.throwGeneralAxiosError(error);
            }
            return okMsg;
        } catch (error) {
            this.throwGeneralAxiosError(error);
        }
    }
}

module.exports = PushDeer;
