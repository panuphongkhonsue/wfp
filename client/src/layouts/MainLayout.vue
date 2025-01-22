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
                Panuphong Khonsue
              </div>
              <div style="margin-top: -4px" class="col-12 text-body2 text-grey-5 q-mt-md">
                <small> Position </small>
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "src/stores/authStore";
import { useMenuStore } from "src/stores/menuStore";
import EssentialLink from "components/EssentialLink.vue";
import { outlinedHome, outlinedDescription, outlinedBusiness, outlinedManageAccounts, outlinedAssessment, outlinedAssignment } from "@quasar/extras/material-icons-outlined";

const authStore = useAuthStore();
const menuStore = useMenuStore();

const leftDrawerOpen = ref(menuStore.getState());
const router = useRouter();
// const url = ref(null);

// const user = ref({
//   name: authStore.name,
//   position: authStore.position,
//   isAdmin: authStore.isAdmin,
//   roleId: authStore.roleId,
// });

const essentialLinksUser = ref([
  {
    title: "หน้าหลัก",
    icon: outlinedHome,
    to: "home",
  },
  {
    title: "สวัสดิการทั่วไป",
    icon: outlinedDescription,
    childs: [
      {
        title: "ค่าตรวจสุขภาพ",
        to: { name: "health_check_up_welfare_list" },
      },
      {
        title: "กรณีเจ็บป่วย",
        to: { name: "medical_welfare_list" },
      },
      {
        title: "ค่าทำฟัน",
        to: { name: "dental_care_welfare_list" },
      },
    ],
  },
  {
    title: "สวัสดิการค่าสงเคราะห์ต่าง ๆ",
    icon: "diversity_1",
    childs: [
      {
        title: "ค่าสงเคราะห์ต่าง ๆ",
        to: { name: "various_welfare_list" },
      },
      {
        title: "ค่าสงเคราะห์การเสียชีวิตครอบครัว",
        to: { name: "various_welfare_funeral_family_list" },
      },
    ],
  },
  {
    title: "สวัสดิการเกี่ยวกับการศึกษาของบุตร",
    icon: outlinedBusiness,
    to: 'children_edu_welfare_list',
  },
  {
    title: "สวัสดิการค่าสงเคราะห์การเสียชีวิต",
    icon: outlinedDescription,
    to: 'funeral_welfare_list',
  },
]);
const essentialLinksEditor = ref([
  {
    title: "จัดการข้อมูลการเบิกสวัสดิการ",
    icon: outlinedAssignment,
    to: "welfare_management_list",
  },
  {
    title: "จัดการข้อมูลบุคลากร",
    icon: outlinedManageAccounts,
    to: "user_management_list"
  },
  {
    title: "รายงาน",
    icon: outlinedAssessment,
    to: 'report',
  },
]);
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
