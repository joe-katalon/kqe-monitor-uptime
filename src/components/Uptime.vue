<template>
    <span :class="className" :title="this.type + $t('-hour')" :style="this.enableDefault">{{ uptime }}</span>
</template>

<script>
import { log } from "../util.ts";

export default {
    props: {
        /** Monitor this represents */
        monitor: {
            type: Object,
            default: null,
        },
        /** Type of monitor */
        type: {
            type: String,
            default: null,
        },
        /** Is this a pill? */
        pill: {
            type: Boolean,
            default: false,
        },
        uptimeDefault: {
            type: String,
            default: "24",
        },
        monitorList: {
            type: Object,
            default: null,
        },
    },
    computed: {
        uptime() {

            if (this.type === "maintenance") {
                return this.$t("statusMaintenance");
            }

            let key = this.monitor.id + "_" + this.type;

            if (this.$root.uptimeList[key] !== undefined) {
                return Math.round(this.$root.uptimeList[key] * 10000) / 100 + "%";
            }

            return this.$t("notAvailableShort");
        },

        color() {
            if (this.type === "maintenance" || this.monitor.maintenance) {
                return "maintenance";
            }

            if (this.lastHeartBeat.status === 0) {
                return "danger";
            }

            if (this.lastHeartBeat.status === 1) {
                return "primary";
            }

            if (this.lastHeartBeat.status === 2) {
                return "warning";
            }

            return "secondary";
        },

        lastHeartBeat() {
            if (this.monitor.id in this.$root.lastHeartbeatList && this.$root.lastHeartbeatList[this.monitor.id]) {
                return this.$root.lastHeartbeatList[this.monitor.id];
            }

            return {
                status: -1,
            };
        },

        enableDefault() {
            if (this.type === this.uptimeDefault || !this.pill) {
                return "";
            } else {
                return "display: none"
            };
        },

        className() {
            if (this.pill) {
                return `badge rounded-pill bg-${this.color}`;
            }

            return "";
        },
    },
};
</script>

<style>
.badge {
    min-width: 62px;
}
</style>
