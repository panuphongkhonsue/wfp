<template>
  <div class="q-py-md">
    <q-breadcrumbs separator="|"  class="font-medium font-16 text-blue-8" active-color="grey-7">
      <q-breadcrumbs-el v-for="(crumb, index) in breadcrumbs" :key="index" :label="crumb.name ?? crumb"
        :to="crumb.path ?? null" />
    </q-breadcrumbs>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
defineOptions({
  name: 'DynamicBreadcrumb',
});
const breadcrumbs = ref([]);
const route = useRoute();

const generateBreadcrumbs = (currentRoute) => {
  const newBreadcrumbs = [];
  if (currentRoute.meta?.breadcrumbs) {
    currentRoute.meta.breadcrumbs.forEach((b) => {
      newBreadcrumbs.push(b);
    });
  }
  breadcrumbs.value = newBreadcrumbs;
};

// Watch the route and call generateBreadcrumbs immediately
watch(
  route,
  (to) => {
    generateBreadcrumbs(to);
  },
  { immediate: true }
);
</script>

