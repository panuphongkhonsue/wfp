<template>
    <q-page padding class="q-pt-none">
        <DynamicBreadcrumb />
            <div class="row items-center">
                <slot name="filter"></slot>
            </div>
    </q-page>
</template>

<script setup>
import DynamicBreadcrumb from "components/DynamicBreadcrumb.vue";
</script>