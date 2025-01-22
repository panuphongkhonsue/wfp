<template>
  <q-expansion-item class="q-py-none font-14 font-semi-bold" active-class="text-blue-1" :content-inset-level="1.5"
    v-bind="expansionProps" :class="to === route.name ? 'bg-blue-8' : 'bg-blue-9 '" expand-icon-class="text-white">
    <template v-slot:header>
      <q-item-section avatar>
        <q-avatar :icon="icon" text-color="white" size="55px"/>
      </q-item-section>

      <q-item-section>
        {{ title }}
      </q-item-section>
    </template>
    <div v-if="childs">
      <q-expansion-item class="text-white font-14 q-py-xs" :to="e.to" active-class="text-blue-1"
        header-class="q-px-none q-py-none" hide-expand-icon v-for="(e, i) in childs" :key="i">
        <template v-slot:header>
          <div class="flex full-width full-height font-14 text-right" style="padding: 6px 0px 6px 0px;"
            :class="e.to?.name === route.name ? 'menu-link' : ''">
            <q-item-section avatar v-if="e.icon">
              <q-avatar :icon="e.icon" text-color="white" size="lg" />
            </q-item-section>

            <q-item-section class="font-medium q-pr-md q-py-sm">
              {{ e.title }}
            </q-item-section>
          </div>
        </template>
      </q-expansion-item>
    </div>
  </q-expansion-item>
</template>
<style scoped>
.menu-link {
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  background: #e3f2fd1c !important;
}
</style>
<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
defineOptions({
  name: 'EssentialLink',
});
const route = useRoute();

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    default: "",
  },
  link: {
    type: String,
    default: "#",
  },
  to: {
    type: String,
  },
  icon: {
    type: String,
    default: "",
  },
  childs: Array,
});
const expansionProps = computed(() =>
  props.childs
    ? { defaultOpened: childIsActive }
    : { 'hide-expand-icon': true, to: { name: props.to } }
);
let childIsActive = false;
if (props.childs) {
  childIsActive = props.childs.some((child) => child.to?.name === route.name);
}
</script>
