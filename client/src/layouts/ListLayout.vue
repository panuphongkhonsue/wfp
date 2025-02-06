<template>
  <q-page padding class="q-pt-none">
    <DynamicBreadcrumb />
    <q-card class="col" style="border-radius: 10px;">
      <!-- Title Section -->
      <q-card-section flat class="q-pa-sm bg-blue-10 text-white">
        <p class="text-h6 q-mb-none q-pl-sm">{{ title }}</p>
      </q-card-section>
      <q-separator />
      <!-- Filter Section -->
      <q-card-section v-if="$slots['filter']" flat class="col q-pb-md">
        <div class="row q-col-gutter-md items-center">
          <slot name="filter"></slot>
        </div>
      </q-card-section>
      <q-card-section v-if="$slots['toolbar']" flat class="col q-pb-md">
        <div class="row q-col-gutter-x-md items-center">
          <slot name="toolbar"></slot>
        </div>
      </q-card-section>
      <!-- Table Section -->
      <div class="q-px-md" :class="$slots['table'] ? 'q-pb-md' : 'q-pb-sm'">
        <slot name="table"></slot>
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import DynamicBreadcrumb from "components/DynamicBreadcrumb.vue";
defineProps({
  title: {
    type: String,
    default: "Search Filter",
  },
});
</script>
