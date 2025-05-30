<template>
    <div class="p-4">
        <p class="mb-6 text-gray-600">{{ $t("Manage global placeholders that can be used in your HTTP monitor request bodies and headers. Use '{'{placeholder_key}'}' in your monitor configuration.") }}</p>

        <!-- Form to Add New Placeholder -->
        <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6">
            <h3 class="text-xl font-semibold mb-4">{{ $t("Add New Placeholder") }}</h3>
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="placeholderKey">
                    {{ $t("Placeholder Key") }}
                </label><br />
                <input v-model="newPlaceholder.key" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="placeholderKey" type="text" :placeholder="$t('e.g., MY_API_TOKEN')">
            </div>
            <div class="mb-6">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="placeholderValue">
                    {{ $t("Placeholder Value") }}
                </label><br />
                <input v-model="newPlaceholder.value" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="placeholderValue" type="text" :placeholder="$t('e.g., abc123xyz')">
            </div>
            <br />
            <div class="flex items-center justify-between">
                <button @click="addPlaceholder" class="btn btn-primary me-2" type="button">
                    {{ $t("Add Placeholder") }}
                </button>
            </div>
        </div>

        <br />
        <!-- List of Existing Placeholders -->
        <div>
            <h3 class="text-xl font-semibold mb-4">{{ $t("Existing Placeholders") }}</h3>
            <div v-if="!placeholders || placeholders.length === 0" class="text-gray-500">
                {{ $t("No placeholders defined yet.") }}
            </div>
            <ul v-else class="bg-white shadow-md rounded px-8 pt-6 pb-8">
                <li v-for="(placeholder, index) in placeholders" :key="index" class="flex justify-between items-center py-3 border-b last:border-b-0">
                    <div>
                        <strong class="text-gray-700">{{ placeholder.key }}</strong>: <span class="text-gray-600">{{ displayValue(placeholder) }}</span>
                    </div>
                    <button @click="deletePlaceholder(index)" class="btn btn-danger btn-sm" type="button">
                        {{ $t("Delete") }}
                    </button>
                </li>
            </ul>
        </div>

        <!-- Save Button -->
        <div class="mt-8 text-right">
            <button @click="savePlaceholders" class="btn btn-primary" type="button">
                {{ $t("Save All Placeholders") }}
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: "Placeholders",
    data() {
        return {
            newPlaceholder: {
                key: "",
                value: ""
            },
            placeholders: [] // This will hold { key: string, value: string } objects
        };
    },
    computed: {
        // Access settings and saveSettings from the correct parent (Settings.vue)
        parentSettings() {
            return this.$parent?.$parent?.$parent?.settings;
        },
        parentSettingsLoaded() {
            return this.$parent?.$parent?.$parent?.settingsLoaded;
        },
        parentSaveSettingsFunction() {
            return this.$parent?.$parent?.$parent?.saveSettings;
        }
    },
    watch: {
        parentSettingsLoaded: {
            handler(loaded) {
                if (loaded) {
                    this.loadPlaceholders();
                }
            },
            immediate: true
        }
    },
    methods: {
        isSensitiveKey(key) {
            if (!key) return false;
            const lowerKey = key.toLowerCase();
            return lowerKey.includes("token") || lowerKey.includes("password") || lowerKey.includes("secret");
        },
        displayValue(placeholder) {
            return this.isSensitiveKey(placeholder.key) ? "********" : placeholder.value;
        },
        loadPlaceholders() {
            if (this.parentSettingsLoaded && this.parentSettings) {
                this.placeholders = Array.isArray(this.parentSettings.requestPlaceholders) ? 
                                    JSON.parse(JSON.stringify(this.parentSettings.requestPlaceholders)) : 
                                    [];
            } else {
                this.placeholders = [];
            }
        },
        savePlaceholders() {
            if (!this.parentSettings) {
                this.$root.toastError("Parent settings not available. Cannot save.");
                return;
            }
            if (!this.parentSaveSettingsFunction) {
                this.$root.toastError("Parent save function not available. Cannot save.");
                return;
            }
            // Update the parent's settings object - this needs to be done carefully
            // Create a mutable copy of parentSettings to avoid direct mutation if it's complex/frozen
            let newParentSettings = { ...this.parentSettings };
            newParentSettings.requestPlaceholders = JSON.parse(JSON.stringify(this.placeholders));
            
            // It's better if parentSaveSettingsFunction can take the specific part to save,
            // or if Settings.vue internally updates its `this.settings` before saving.
            // For now, we are directly modifying a copy and hoping saveSettings uses it or has access to it.
            // A more robust way: Settings.vue should provide a method to update specific settings fields.
            // this.$parent.$parent.$parent.settings.requestPlaceholders = newParentSettings.requestPlaceholders;
            // The above line would be direct mutation. Instead, we pass the whole modified copy if necessary,
            // or ideally, parentSaveSettings takes the specific data.

            // The original Uptime Kuma saveSettings in Settings.vue saves `this.settings` directly.
            // So we need to update that specific object on the parent before calling save.
            this.$parent.$parent.$parent.settings.requestPlaceholders = JSON.parse(JSON.stringify(this.placeholders));

            this.parentSaveSettingsFunction((res) => {
                if (res.ok) {
                    // Optionally, reload or confirm
                } 
            });
        },
        addPlaceholder() {
            if (!this.newPlaceholder.key || !this.newPlaceholder.value) {
                this.$root.toastError(this.$t("Placeholder key and value cannot be empty."));
                return;
            }
            if (this.placeholders.find(p => p.key === this.newPlaceholder.key)) {
                this.$root.toastError(this.$t("Placeholder key must be unique."));
                return;
            }
            this.placeholders.push({ ...this.newPlaceholder });
            this.newPlaceholder.key = "";
            this.newPlaceholder.value = "";
        },
        deletePlaceholder(index) {
            this.placeholders.splice(index, 1);
        }
    },
    mounted() {
        if (this.parentSettingsLoaded) {
            this.loadPlaceholders();
        }
    }
};
</script>

<style scoped>
/* Tailwind is used via CDN, so most styles are utility classes in the template */
/* Add any additional custom styles here if needed */
input:focus {
    border-color: #4a90e2; /* Example focus color */
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.5); /* Example focus shadow */
}
</style> 