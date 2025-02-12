<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-white text-dark">
      <q-toolbar class="q-py-sm q-px-md">
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title> </q-toolbar-title>
        <div>
          <div class="row q-btn--actionable items-center">
            <div class="row text-right q-mt-xs q-mr-sm">
              <div class="col-12 text-body2 text-grey-9 text-weight-bold">
                {{ user.name }}
              </div>
              <div style="margin-top: -4px" class="col-12 text-body2 text-grey-5 q-mt-md">
                <small> {{ user.position }} </small>
              </div>
            </div>
            <q-icon name="account_circle" size="md" />
          </div>
          <q-menu fit class="q-mt-md">
            <q-list>
              <q-item clickable v-close-popup @click="logout">
                <q-item-section>
                  <q-item-label>Logout</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer :width="250" v-model="leftDrawerOpen" show-if-above bordered
      class="bg-blue-9 text-white font-medium font-remark custom-scroll">
      <q-list>
        <q-item-label header class="bg-white q-px-lg q-pb-none" style="padding-top: 13px;">
          <div class="flex column text-blue-9 font-bold">
            <p class=" q-mb-xs font-24">ระบบเบิกสวัสดิการ</p>
            <div class="flex row q-col-gutter-x-sm items-center ">
              <p class="q-ma-none" style="font-size: 10px;">คณะวิทยาการสารสนเทศ</p>
              <img src="../assets/ifLogo.png" class="q-py-xs" width="35" height="23" />
            </div>
          </div>
        </q-item-label>

        <EssentialLink v-for="link in essentialLinksUser" :key="link.title" v-bind="link" />
        <q-separator v-if="essentialLinksEditor" inset size="1.5px" color="white" spaced="5px" />
        <EssentialLink v-for="link in essentialLinksEditor" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<style>
.custom-scroll::-webkit-scrollbar {
  width: 0;
}

.custom-scroll {
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */
}

.q-drawer__backdrop {
  background-color: transparent !important;
}

.back-color {
  background: #1a237e !important;
  background-color: #1a237e !important;
}

.q-drawer--left.q-drawer--bordered {
  border-right: 0 !important;
}
</style>
<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/authStore";
import { useMenuStore } from "src/stores/menuStore";
import EssentialLink from "components/EssentialLink.vue";
import { outlinedHome, outlinedDescription, outlinedBusiness, outlinedManageAccounts, outlinedAssessment, outlinedAssignment, outlinedSummarize } from "@quasar/extras/material-icons-outlined";
const authStore = useAuthStore();
const menuStore = useMenuStore();

const leftDrawerOpen = ref(menuStore.getState());
const router = useRouter();

const user = ref({
  name: authStore.name,
  position: authStore.position,
});

onMounted(async () => {
  if (!authStore.isLoggedIn) {
    router.push({ name: "login" });
  }
});
const iconMap = {
  outlinedHome,
  outlinedDescription,
  outlinedBusiness,
  outlinedAssignment,
  outlinedManageAccounts,
  outlinedAssessment,
  diversity_1: "diversity_1",
  outlinedSummarize
};
const rawMenuData = ref(menuStore.getPath());
const rawMenuEditorData = ref(menuStore.getPathEditor());
const essentialLinksUser = computed(() => {
  if (!rawMenuData.value) return []; // Ensure rawMenuData is not null
  return rawMenuData.value.map(item => ({
    ...item,
    icon: iconMap[item.icon] ?? null,
    childs: item.childs?.map(child => ({
      ...child,
      icon: iconMap[child.icon] ?? null
    })) || null,
  }));
});

const essentialLinksEditor = computed(() => {
  if (!rawMenuEditorData.value) return []; // Ensure rawMenuEditorData is not null
  return rawMenuEditorData.value.map(item => ({
    ...item,
    icon: iconMap[item.icon] ?? null,
    childs: item.childs?.map(child => ({
      ...child,
      icon: iconMap[child.icon] ?? null
    })) || null,
  }));
});

function toggleLeftDrawer() {
  menuStore.setState(!leftDrawerOpen.value);
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function logout() {
  authStore.clearToken();
  menuStore.clearState();
  router.push({ name: "login" });
}
</script>
