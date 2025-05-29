const NotificationProvider = require("./notification-provider");
const axios = require("axios");
const { DOWN, UP, log } = require("../../src/util");
let express = require("express");
const apicache = require("../modules/apicache");
const { UptimeKumaServer } = require("../uptime-kuma-server");
const StatusPage = require("../model/status_page");
const { allowDevAllOrigin, send403 } = require("../util-server");
const { R } = require("redbean-node");
const Monitor = require("../model/monitor");

class Teams extends NotificationProvider {
  name = "teams";

  /**
   * Generate the message to send
   * @param {const} status The status constant
   * @param {string} monitorName Name of monitor
   * @returns {string}
   */
  _statusMessageFactory = (status, monitorName, environment) => {
    if (environment) {
      environment = "on " + environment;
    } else {
      environment = "";
    }
    if (status === DOWN) {
      return `❌ [${monitorName}] went DOWN ${environment}❌ `;
    } else if (status === UP) {
      return `✅ [${monitorName}] is UP! ${environment}✅`;
    }
    return "Notification";
  };

  /**
   * Select theme color to use based on status
   * @param {const} status The status constant
   * @returns {string} Selected color in hex RGB format
   */
  _getThemeColor = (status) => {
    if (status === DOWN) {
      return "ff0000";
    }
    if (status === UP) {
      return "00e804";
    }
    return "008cff";
  };

  /**
   * Set json string of json define in .msteam tag
   * @param {Object} List of mention names which splitted.
   * @param {String} default domain name for email.
   * @returns {String} Json string of entities
   */
  _setMentionEntities = (mentionNames, defaultDomain) => {
    var mentionEntities = [];

    mentionNames.forEach((mentionName) => {
      var mentionEmail = mentionName + "@" + defaultDomain;
      var postdata = {
        text: "<at>" + mentionName + "</at>",
        mentioned: { name: mentionName, id: mentionEmail },
        type: "mention",
      };
      mentionEntities.push(postdata);
    });

    return mentionEntities;
  };

  /**
   * Generate payload for notification
   * @param {const} status The status of the monitor
   * @param {string} monitorMessage Message to send
   * @param {string} monitorName Name of monitor affected
   * @param {string} monitorUrl URL of monitor affected
   * @returns {Object}
   */
  _notificationPayloadFactory = ({
    status,
    monitorMessage,
    monitorName,
    monitorUrl,
    monitorJSON,
    heartbeatJSON,
  }) => {
    console.log("monitorMessage:" + monitorMessage);

    const facts = [];
    const tags = [];
    var mentionDomain = [];
    var mentionEntities = [];
    var environment = "";
    var squad = "";
    var portfolio = "";
    const defaultDomain = "vng.com.vn";

    if (monitorName) {
      facts.push({
        title: "Monitor",
        value: monitorName,
      });
    }

    if (monitorUrl && monitorUrl !== "https://") {
      facts.push({
        title: "URL",
        value: monitorUrl,
      });
    }

    let mention = "";

    if (monitorJSON) {
      monitorJSON["tags"].forEach((tag) => {
        if (
          tag["name"] !== null &&
          tag["value"] !== null &&
          tag["name"].toLowerCase().trim() != "mention"
        ) {
          if (tag["name"].toLowerCase().trim() == "portfolio") {
            portfolio = tag["value"];
          }
          if (tag["name"].toLowerCase().trim() == "squad") {
            squad = tag["value"];
          }
          if (tag["name"].toLowerCase().trim() == "environment") {
            environment = tag["value"];
          }

          tags.push({
            title: tag["name"],
            value: tag["value"],
          });
        } else {
          mentionDomain = tag["value"];
          let mentionIDs = mentionDomain.trim().split(/\W+/);
          console.log("mentionIDs:" + JSON.stringify(mentionIDs));
          mentionEntities = this._setMentionEntities(mentionIDs, defaultDomain);
          mentionIDs.forEach((mentionID) => {
            mentionDomain = mentionDomain.replaceAll(
              mentionID,
              "<at>" + mentionID + "</at>"
            );
          });
          tags.push({
            title: tag["name"],
            value: mentionDomain,
          });
        }
      });
    }

    const notificationMessage = this._statusMessageFactory(
      status,
      monitorName,
      environment
    );

    return {
      type: "message",
      summary: notificationMessage,
      attachments: [
        {
          contentType: "application/vnd.microsoft.card.adaptive",
          content: {
            type: "AdaptiveCard",
            msteams: {
              entities: mentionEntities,
              width: "Full",
            },
            body: [
              {
                type: "ColumnSet",
                columns: [
                  {
                    type: "Column",
                    items: [
                      {
                        type: "Image",
                        style: "Person",
                        url: "https://user-images.githubusercontent.com/59863242/204816297-6d49e11a-4ffb-4bb5-9653-e2bbbcbbe247.png",
                        altText: "Katalon",
                        size: "Medium",
                      },
                    ],
                    width: "auto",
                  },
                  {
                    type: "Column",
                    items: [
                      {
                        type: "TextBlock",
                        size: "ExtraLarge",
                        weight: "Bolder",
                        text: "**Uptime Katalon Heartbeat Alert**",
                        wrap: true,
                        style: "heading",
                      },
                    ],
                    width: "stretch",
                  },
                ],
              },
              {
                type: "TextBlock",
                spacing: "None",
                text: " \n",
                isSubtle: true,
                wrap: true,
                separator: false,
              },
              {
                type: "TextBlock",
                weight: "Bolder",
                text: notificationMessage,
                wrap: true,
              },
              {
                type: "TextBlock",
                spacing: "None",
                text: " \n",
                isSubtle: true,
                wrap: true,
                separator: false,
              },
              {
                type: "TextBlock",
                text: "**Description**",
                separator: true,
                wrap: true,
              },
              {
                type: "TextBlock",
                text: monitorMessage,
                wrap: true,
              },
              {
                type: "FactSet",
                facts: facts,
                horizontalAlignment: "Left",
              },
              {
                type: "TextBlock",
                spacing: "None",
                text: " \n",
                isSubtle: true,
                wrap: true,
                separator: false,
              },
              {
                type: "FactSet",
                facts: tags,
                separator: true,
                horizontalAlignment: "Left",
              },
              {
                type: "TextBlock",
                text: "**View more Uptime Status at:**",
                separator: true,
                wrap: true,
              },
              {
                fontType: "Default",
                horizontalAlignment: "Left",
                spacing: "Small",
                size: "Default",
                color: "Default",
                weight: "Bolder",
                text: "- [Production Environment Uptime](http://uptime.pqe.vnpay.vn/status/production)\r- [Sandbox Environment Uptime](http://uptime.pqe.vnpay.vn/status/qc-environment)\r- [Admin only- Manage Status](http://uptime.pqe.vnpay.vn/manage-status-page)",
                type: "TextBlock",
                wrap: true,
                separator: false,
                bleed: false,
                isSubtle: true,
              },
              {
                type: "TextBlock",
                spacing: "None",
                text: " \n",
                isSubtle: true,
                wrap: true,
                separator: false,
              },
              {
                type: "TextBlock",
                spacing: "None",
                text: "By _PQE TestOps - 2022_",
                isSubtle: true,
                wrap: true,
                separator: true,
              },
            ],
            $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
            version: "1.3",
          },
        },
      ],
    };
  };

  /**
   * Send the notification
   * @param {string} webhookUrl URL to send the request to
   * @param {Object} payload Payload generated by _notificationPayloadFactory
   */
  _sendNotification = async (webhookUrl, payload) => {
    await axios.post(webhookUrl, payload);
  };

  /**
   * Send a general notification
   * @param {string} webhookUrl URL to send request to
   * @param {string} msg Message to send
   * @returns {Promise<void>}
   */
  _handleGeneralNotification = (webhookUrl, msg) => {
    const payload = this._notificationPayloadFactory({
      monitorMessage: msg,
    });

    return this._sendNotification(webhookUrl, payload);
  };

  async send(notification, msg, monitorJSON = null, heartbeatJSON = null) {
    let okMsg = "Sent Successfully.";
    console.log("UPTIME24H " + msg);
    try {
      if (heartbeatJSON == null || monitorJSON == null) {
        await this._handleGeneralNotification(notification.webhookUrl, msg);
        return okMsg;
      }

      let url;
      if (monitorJSON["type"] === "port") {
        url = monitorJSON["hostname"];
        if (monitorJSON["port"]) {
          url += ":" + monitorJSON["port"];
        }
      } else {
        url = monitorJSON["url"];
      }


      const payload = this._notificationPayloadFactory({
        monitorMessage: msg,
        monitorName: monitorJSON.name,
        monitorUrl: url,
        status: heartbeatJSON.status,
        monitorJSON: monitorJSON,
        heartbeatJSON: heartbeatJSON,
      });


      console.log("payload:" + JSON.stringify(payload));

      await this._sendNotification(notification.webhookUrl, payload);
      return okMsg;
    } catch (error) {
      this.throwGeneralAxiosError(error);
    }
  }
}

module.exports = Teams;
