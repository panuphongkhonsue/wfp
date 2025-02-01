<template>
  <PageLayout title="เบิกสวัสดิการทั่วไป (กรณีเจ็บป่วย)">
    <template v-slot:page>
      <!--User Information Section -->
      <div class="row q-col-gutter-md q-pl-md q-pt-md">
        <div class="col-12 font-18 font-bold">
          <p class="q-mb-none">จัดการข้อมูลบุคลากร</p>
        </div>
        <div class="col-12">
          <q-card flat bordered class="full-height">
            <q-card-section
              class="row wrap q-col-gutter-y-sm q-col-gutter-x-md font-medium q-pb-xs font-16 text-grey-9">
              <InputGroup for-id="username" is-dense v-model="model.username" :data="model.username ?? '-'" is-require
                label="บัญชีผู้ใช้งาน" placeholder="" type="text" :is-view="isView">
              </InputGroup>
              <InputGroup for-id="name" is-dense v-model="model.name" :data="model.name ?? '-'" is-require
                label="ชื่อ-นามสกุล (ไม่ต้องมีคำนำหน้า)" placeholder="" type="text" :is-view="isView">
              </InputGroup>
              <InputGroup for-id="position" :data="model.positionsName ?? '-'" is-require label="ตำแหน่ง"
                :is-view="isView">
                <q-select :loading="isLoading" id="selected-status" outlined v-model="model.positionsId"
                  :options="optionsPosition" label="สถานะ" multiple dense clearable option-value="id" emit-value
                  map-options option-label="name">
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey"> No option </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </InputGroup>
              <InputGroup for-id="employee-type" :data="model.employeeTypesName ?? '-'" is-require label="ประเภทบุคลากร"
                :is-view="isView">
                <q-select :loading="isLoading" id="selected-status" outlined
                  v-model="model.employeeTypesId" :options="optionsEmployeeType" label="สถานะ" multiple dense clearable
                  option-value="id" emit-value map-options option-label="name">
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey"> No option </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </InputGroup>
              <InputGroup for-id="department" is-dense v-model="model.name" :data="model.name ?? '-'" is-require
                label="ส่วนงาน" placeholder="" type="text" :is-view="isView">
              </InputGroup>
              <InputGroup for-id="sector" is-dense v-model="model.name" :data="model.name ?? '-'" is-require
                label="ภาควิชา" placeholder="" type="text" :is-view="isView">
              </InputGroup>
              <InputGroup label="วันที่เข้าปฏิบัติงาน" is-require :is-view="isView" clearable
                :data="model.firstWorkingDate ?? '-'">
                <DatePicker is-dense v-model:model="model.firstWorkingDate" v-model:dateShow="model.firstWorkingDate"
                  for-id="first-working-date" :no-time="true" />
              </InputGroup>
            </q-card-section>
            <q-card-section class="row column wrap font-medium q-pt-none q-pb-sm font-16 text-grey-9">
              <p class="q-mb-sm">บทบาท</p>
              <q-option-group v-model="model.roleId" :options="optionRole" option-value="id" option-label="name"
                color="primary" />
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 font-18 font-bold">
          <p class="q-mb-none">จัดการข้อมูลบุตร</p>
        </div>
        <!-- Child Section -->
        <div class="col-12">
          <q-card flat bordered class="full-height">
            <q-card-section
              class="row items-center wrap q-col-gutter-md wrap font-medium q-pt-sm q-pb-none font-16 text-grey-9"
              v-for="(item, index) in model.child" :key="index">
              <p class="col-12 q-mb-none">บุตรคนที่ {{ index + 1 }}</p>
              <InputGroup for-id="child-name" is-dense v-model="item.name" :data="item.name ?? '-'" is-require
                label="ชื่อ (ไม่ต้องมีคำนำหน้า)" placeholder="" type="text" :is-view="isView">
              </InputGroup>
              <InputGroup for-id="child-surname" is-dense v-model="item.surname" :data="item.surname ?? '-'" is-require
                label="นามสกุล" placeholder="" type="text" :is-view="isView">
              </InputGroup>
              <InputGroup label="เกิดเมื่อ" is-require :is-view="isView" clearable
                :data="model.firstWorkingDate ?? '-'">
                <DatePicker is-dense v-model:model="item.birthDay" v-model:dateShow="item.birthDay" for-id="birthday"
                  :no-time="true" />
              </InputGroup>
              <div>
                <q-btn v-if="index > 0" color="red" @click="removeChildForm(index)" class="q-mt-sm">ลบ</q-btn>
              </div>
            </q-card-section>
            <div v-if="!isView">
              <q-separator inset class="q-mt-md" />
              <q-card-section class="row justify-end">
                <q-btn icon="add" id="add-req" @click="addChildForm" class=" bg-blue-10 text-white">เพิ่ม</q-btn>
              </q-card-section>
            </div>
          </q-card>
        </div>
      </div>
    </template>
    <!--Action Slot -->
    <template v-slot:action>
      <div class="justify-end row q-py-xs font-medium q-gutter-lg">
        <q-btn id="button-back" class="text-white font-medium font-16 weight-8 q-px-md" dense type="button"
          style="background : #BFBFBF;" label="ย้อนกลับ" no-caps :to="{ name: 'user_management_list' }" />
        <q-btn id="button-save" class="text-white font-medium bg-blue-9 text-white font-16 weight-8 q-px-lg" dense
          type="submit" label="บันทึก" no-caps @click="submit(4)" v-if="!isView && !isLoading" />
      </div>
    </template>
  </PageLayout>
</template>
<style scoped>
.q-table--bordered {
  border-radius: 0;
}
</style>
<script setup>
import PageLayout from "src/layouts/PageLayout.vue";
import InputGroup from "src/components/InputGroup.vue";
import DatePicker from "src/components/DatePicker.vue";


import Swal from "sweetalert2";
import { Notify } from "quasar";


import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";

defineOptions({
  name: "MedicalfareEdit",
});
const router = useRouter();
const route = useRoute();
const model = ref({
  username: null,
  name: null,
  positionsId: null,
  positionsName: null,
  employeeTypesId: null,
  employeeTypesName: null,
  departmentId: null,
  sectorId: null,
  firstWorkingDate: null,
  roleId: null,
  child: [
    {
      name: null,
      surname: null,
      birthDay: null,
    }
  ],
});
const optionRole = ref(
  [
    {
      name: 'บุคลากรทั่วไป',
      id: 1
    },
    {
      name: 'เจ้าหน้าที่ตรวจสอบ',
      id: 2
    },
    {
      name: 'ตัวแทนผู้เบิก',
      id: 3
    }
  ]
)
let optionsPosition = [
  { id: 1, name: "อาจารย์" },
];
let optionsEmployeeType = [
  { id: 1, name: "ข้าราชการ" },
  { id: 2, name: "พนักงานมหาวิทยาลัย (สิทธิข้าราชการบำนาญ)" },
  { id: 3, name: "พนักงานมหาวิทยาลัย" },
  { id: 3, name: "ลูกจ้างมหาวิทยาลัย" },
];

const isLoading = ref(false);
const isError = ref({});
const isView = ref(false);

const isEdit = computed(() => {
  return !isNaN(route.params.id);
});

onMounted(async () => {
  await init();
  isLoading.value = false;
  isEdit.value = false;
});

onBeforeUnmount(() => {
  clearData(model);
});

const resetObject = (obj) => {
  for (const key in obj) {
    if (obj[key] && typeof obj[key] === "object") {
      // Recursively reset nested objects
      resetObject(obj[key]);
    } else {
      // Set primitive values to null
      obj[key] = null;
    }
  }
};
function clearData(model) {
  resetObject(model.value);
}
function addChildForm() {
  model.value.child.push({
    name: null,
    surname: null,
    birthDay: null,
  });
}
function removeChildForm(index) {
  model.value.child.splice(index, 1);
};
async function submit() {
  let validate = false;
  // if (!model.value.gspc?.equipment?.equipmentId) {
  //   isError.value.equipmentId.messageError = "IT Asset No. Is Required";
  //   let navigate = document.getElementById("selected-it-asset");
  //   window.location.hash = "selected-it-asset";
  //   navigate.scrollIntoView(false);
  //   validate = true;
  // }
  if (validate === true) {
    Notify.create({
      message: "Please Correct Input",
      position: "bottom-left",
      type: "negative",
    });
    return;
  }
  let isValid = false;
  Swal.fire({
    title: "Do you want to save the changes??",
    html: `You won't be able to revert this!`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "Cancel",
    showLoaderOnConfirm: true,
    reverseButtons: true,
    customClass: {
      confirmButton: "save-button",
      cancelButton: "cancel-button",
    },
    preConfirm: async () => {
      try {
        // code
        isValid = true;
      } catch (error) {
        if (error?.response?.status == 400) {
          if (Object.keys(error?.response?.data?.errors ?? {}).length) {
            isError.value = {
              ...isError.value,
              ...error.response?.data?.errors,
            };
          }
        }
        Swal.showValidationMessage(
          `Save Data Failed. ${error.response?.data?.message ??
          "Something wrong please try again later."
          }`
        );
        Notify.create({
          message:
            error?.response?.data?.message ??
            "Something wrong please try again later.",
          position: "bottom-left",
          type: "negative",
        });
      }
    },
  }).then((result) => {
    if (isValid && result.isConfirmed) {
      Swal.fire({
        html: `Request Save.`,
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "save-button",
        },
      }).then(() => {
        router.replace({ name: "health_check_up_welfare_list" });
      });
    }
  });
}
async function init() {
  isView.value = route.meta.isView;
  isLoading.value = true;
}
</script>
