
<template>
    <span :class="className" :title="this.type + $t('-hour')" :style="this.enableDefault">{{ uptimeGroup }}</span>
</template>

<script>
import { log } from "../util.ts";
// var status = "danger";

export default {
    props: {
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
        uptimeList: {
            type: Object,
            default: null,
        }
    },
    computed: {

        color() {
            return status;
        },
        className() {
            let status = "secondary";
            let average = this.uptimeGroupAverage(this.uptimeList, this.type);
            if (average === this.$t("statusMaintenance") || average === this.$t("notAvailableShort")) status = "secondary";
            if (average >= 0.999) {
                status = "primary";
            } else if (average < 0.999 && average >= 0.995) {
                status = "secondary";
            } else if (average < 0.995 && average >= 0.90) {
                status = "warning";
            } else if (average < 0.90) {
                status = "danger";
            } else {
                status = "maintenance";
            }
            return `badge rounded-pill bg-${status}`;

        },
        enableDefault() {
            if (this.type === this.uptimeDefault) {
                return "";
            } else {
                return "display: none"
            };
        },
        uptimeGroup() {
            let average = this.uptimeGroupAverage(this.uptimeList, this.type);
            if (average === this.$t("statusMaintenance") || average === this.$t("notAvailableShort")) return average;
            return Math.round((average) * 10000) / 100 + "%";;

        },

    },
    methods: {
        uptimeGroupAverage(uptimeList, type) {
            let s = [];
            if (this.type === "maintenance") {
                return this.$t("statusMaintenance");
            }
            uptimeList.forEach(ut => {
                let key = ut.id + "_" + type;
                if (this.$root.uptimeList[key] !== undefined) {
                    s.push(this.$root.uptimeList[key]);
                } else {
                    return this.$t("notAvailableShort");
                }
            });
            var sum = 0;
            s.forEach(function (num) { sum += num });

            return sum / s.length;

        },

    },
};
</script>

<style>
.badge {
    min-width: 62px;
}
</style>
