<template>
  <q-page padding class="q-pt-none">
    <DynamicBreadcrumb />
    <div class="row">
      <div class="col-12 col-md">
        <q-card style="border-radius: 10px;">
          <!-- Title Section -->
          <q-card-section class="q-pa-sm bg-blue-10 text-white">
            <p class="text-h6 q-mb-none q-pl-sm">{{ title }}</p>
          </q-card-section>
          <!-- Page Section -->
          <div class="q-pa-md q-gutter-md" v-if="$slots['page']">
            <slot name="page"></slot>
          </div>
        </q-card>
        <q-card class="q-mt-md" v-if="$slots['action']" style="border-radius: 10px;">
          <!-- Action Section -->
          <q-card-section class="q-px-xl q-py-sm">
            <slot name="action"></slot>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import DynamicBreadcrumb from "components/DynamicBreadcrumb.vue";
defineProps({
  title: {
    type: String,
    default: "Request",
  },
  to: {
    type: String,
    default: "#",
  },
});
</script>
