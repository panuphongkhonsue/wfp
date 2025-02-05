<template>
  <PageLayout title="จัดการข้อมูลบุคลากร">
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
                label="บัญชีผู้ใช้งาน" placeholder="" type="text" :is-view="isView" :error-message="isError?.username"
                :error="!!isError?.username" :rules="[(val) => !!val || 'กรุณากรอกบัญชีผู้ใช้งาน']">
              </InputGroup>
              <InputGroup for-id="name" is-dense v-model="model.name" :data="model.name ?? '-'" is-require
                label="ชื่อ - นามสกุล (ไม่ต้องมีคำนำหน้า)" placeholder="" type="text" :is-view="isView"
                :error-message="isError?.name" :error="!!isError?.name"
                :rules="[(val) => !!val || 'กรุณากรอกชื่อ - นามสกุล']">
              </InputGroup>
              <InputGroup for-id="position" :data="model.positionsName ?? '-'" is-require label="ตำแหน่ง"
                :is-view="isView">
                <q-select popup-content-class="font-14 font-regular" class="font-14 font-regular" :loading="isLoading"
                  for="selected-status" outlined v-model="model.positionId" :options="optionsPosition" dense clearable
                  option-value="id" emit-value map-options option-label="name" :error-message="isError?.positionId"
                  :error="!!isError?.positionId" :rules="[(val) => !!val || 'กรุณาเลือกตำแหน่ง']">
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey font-14 font-regular"> ไม่มีตัวเลือก </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </InputGroup>
              <InputGroup for-id="employee-type" :data="model.employeeTypeName ?? '-'" is-require label="ประเภทบุคลากร"
                :is-view="isView">
                <q-select popup-content-class="font-14 font-regular" class="font-14 font-regular" :loading="isLoading"
                  for="selected-employee-type" outlined v-model="model.employeeTypeId" :options="optionsemployeeType"
                  dense clearable option-value="id" emit-value map-options option-label="name"
                  :error-message="isError?.employeeTypeId" :error="!!isError?.employeeTypeId"
                  :rules="[(val) => !!val || 'กรุณาเลือกประเภทบุคลากร']">
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey font-14 font-regular"> ไม่มีตัวเลือก </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </InputGroup>
              <InputGroup for-id="department" :data="model.departmentName ?? '-'" is-require label="ส่วนงาน"
                :is-view="isView">
                <q-select popup-content-class="font-14 font-regular" class="font-14 font-regular" :loading="isLoading"
                  id="selected-department" outlined v-model="model.departmentId" :options="optionsDepartment" dense
                  clearable option-value="id" emit-value map-options option-label="name"
                  :error-message="isError?.departmentId" :error="!!isError?.departmentId"
                  :rules="[(val) => !!val || 'กรุณาเลือกส่วนงาน']">
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey font-14 font-regular"> ไม่มีตัวเลือก </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </InputGroup>
              <InputGroup for-id="sector" :data="model.sectorName ?? '-'" is-require label="ภาควิชา" :is-view="isView">
                <q-select popup-content-class="font-14 font-regular" class="font-14 font-regular" :loading="isLoading"
                  id="selected-sector" outlined v-model="model.sectorId" :options="optionsSection" dense clearable
                  option-value="id" emit-value map-options option-label="name" :error-message="isError?.sectorId"
                  :error="!!isError?.sectorId" :rules="[(val) => !!val || 'กรุณาเลือกภาควิชา']">
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey font-14 font-regular"> ไม่มีตัวเลือก </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </InputGroup>
              <InputGroup for-id="first-working-date" label="วันที่เข้าปฏิบัติงาน" is-require :is-view="isView"
                clearable :data="model.firstWorkingDate ?? '-'">
                <DatePicker is-dense v-model:model="model.firstWorkingDate" v-model:dateShow="model.firstWorkingDate"
                  for-id="first-working-date" :no-time="true" :err="isError?.firstWorkingDate"
                  :rules="[(val) => !!val || 'กรุณาเลือกวันที่เข้าปฏิบัติงาน']" />
              </InputGroup>
            </q-card-section>
            <q-card-section class="row column wrap font-medium q-pt-none q-pb-sm font-16 text-grey-9">
              <p class="q-mb-sm require">บทบาท</p>
              <q-option-group v-if="!isView && !isLoading" v-model="model.roleId" :options="optionRole"
                option-value="id" option-label="name" :color="isError.roleId ? 'red' : 'primary'"
                :keep-color="isError.roleId ?? false" id="role" />
              <p v-else> {{ model.roleName }} </p>
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
              <InputGroup v-if="!isView && !isLoading" for-id="child-name" is-dense v-model="item.name"
                :data="item.name ?? '-'" label="ชื่อ - นามสกุล (ไม่ต้องมีคำนำหน้า)" placeholder="" type="text"
                :is-view="isView">
              </InputGroup>
              <InputGroup v-else for-id="child-name" is-dense v-model="item.name" :data="item.name ?? '-'"
                label="ชื่อ - นามสกุล" placeholder="" type="text" :is-view="isView">
              </InputGroup>
              <InputGroup label="เกิดเมื่อ" :is-view="isView" clearable :data="item.birthday ?? '-'">
                <DatePicker is-dense v-model:model="item.birthday" v-model:dateShow="item.birthday" for-id="birthday"
                  :no-time="true" />
              </InputGroup>
              <div>
                <q-btn v-if="index > 0 && !isView && !isLoading" color="red" @click="removeChildForm(index)"
                  class="q-mt-sm">ลบ</q-btn>
              </div>
            </q-card-section>
            <div v-if="!isView && !isLoading">
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
          type="submit" label="บันทึก" no-caps @click="submit()" v-if="!isView && !isLoading" />
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
import { formatDateThaiSlash } from "src/components/format";

import { ref, computed, onMounted, watch, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import userManagementService from "src/boot/service/userManagementService";
import departmentService from "src/boot/service/departmentService";
import sectorService from "src/boot/service/sectorService";
import positionService from "src/boot/service/positionService";
import employeeTypeService from "src/boot/service/employeeTypeService";
import roleService from "src/boot/service/roleService";

defineOptions({
  name: "MedicalfareEdit",
});
const router = useRouter();
const route = useRoute();
const model = ref({
  id: null,
  username: null,
  name: null,
  positionId: null,
  positionsName: null,
  employeeTypeId: null,
  employeeTypeName: null,
  departmentId: null,
  departmentName: null,
  sectorId: null,
  sectorName: null,
  firstWorkingDate: null,
  roleId: null,
  roleName: null,
  child: [
    {
      name: null,
      birthday: null,
    },
  ],
});


const isLoading = ref();
const isError = ref({});
const isView = ref(false);

const isEdit = computed(() => {
  return !isNaN(route.params.id);
});

onMounted(async () => {
  await init();
  isLoading.value = false;
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
    birthday: null,
  });
}
function removeChildForm(index) {
  model.value.child.splice(index, 1);
};


watch(
  model,
  () => {
    Object.keys(model.value).forEach((key) => {
      if (model.value[key] !== null) {
        delete isError.value[key];
      }
    });
  },
  { deep: true }
);

async function submit() {
  let validate = false;
  if (!model.value.username) {
    isError.value.username = "กรุณากรอกข้อมูลบัญชีผู้ใช้";
    validate = true;
  }
  if (!model.value.name) {
    isError.value.name = "กรุณากรอกชื่อ - นามสกุล";
    validate = true;
  }
  if (!model.value.positionId) {
    isError.value.positionId = "กรุณาเลือกตำแหน่ง";
    validate = true;
  }
  if (!model.value.employeeTypeId) {
    isError.value.employeeTypeId = "กรุณาเลือกประเภทบุคลากร";
    validate = true;
  }
  if (!model.value.departmentId) {
    isError.value.departmentId = "กรุณาเลือกส่วนงาน";
    validate = true;
  }
  if (!model.value.sectorId) {
    isError.value.sectorId = "กรุณาเลือกภาควิชา";
    validate = true;
  }
  if (!model.value.firstWorkingDate) {
    isError.value.firstWorkingDate = "กรุณาเลือกวันที่เข้าปฏิบัติงาน";
    validate = true;
  }
  if (!model.value.roleId) {
    isError.value.roleId = true;
    validate = true;
  }
  if (validate === true) {
    let navigate = document.getElementById("username");
    window.location.hash = "username";
    navigate.scrollIntoView(false);
    Notify.create({
      message: "กรุณากรอกข้อมูลให้ถูกต้อง",
      position: "bottom-left",
      type: "negative",
    });
    return;
  }
  const hasNull = model.value.child.some(item =>
    Object.values(item).some(value => value === null || value === "")
  );
  if (hasNull) {
    delete model.value.child;
  }
  let isValid = false;
  var fetch;
  Swal.fire({
    title: "ยืนยันการทำรายการหรือไม่ ???",
    html: `โปรดตรวจสอบข้อมูลให้แน่ใจก่อนยืนยัน`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "ยืนยัน",
    cancelButtonText: "ยกเลิก",
    showLoaderOnConfirm: true,
    reverseButtons: true,
    customClass: {
      confirmButton: "save-button",
      cancelButton: "cancel-button",
    },
    preConfirm: async () => {
      try {
        if (isEdit.value) {
          fetch = await userManagementService.update(route.params.id, model.value);
        }
        else {
          fetch = await userManagementService.create(model.value);
        }
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
        Notify.create({
          message: `[ผิดพลาด].บันทึกข้อมูลไม่สำเร็จ กรุณาลองอีกครั้ง`,
          position: "bottom-left",
          type: "negative",
        });
      }
    },
  }).then((result) => {
    if (isValid && result.isConfirmed) {
      console.log(fetch);
      Swal.fire({
        html: fetch.data?.message ?? `บันทึกข้อมูลสำเร็จ`,
        icon: "success",
        confirmButtonText: "ตกลง",
        customClass: {
          confirmButton: "save-button",
        },
      }).then(() => {
        router.replace({ name: "user_management_list" });
      });
    }
    else {
      model.value.child = [];
      addChildForm()
    }
  });
}
const optionsPosition = ref([]);
const optionsemployeeType = ref([]);
const optionsDepartment = ref([]);
const optionsSection = ref([]);
const optionRole = ref([]);
async function fetchInitialData() {
  try {
    const [fetchPosition, fetchDepartment, fetchSector, fetchemployeeType, fetchRole] = await Promise.all([
      positionService.list(),
      departmentService.list(),
      sectorService.list(),
      employeeTypeService.list(),
      roleService.list(),
    ]);

    optionsPosition.value = fetchPosition.data;
    optionsemployeeType.value = fetchemployeeType.data;
    optionsDepartment.value = fetchDepartment.data;
    optionsSection.value = fetchSector.data;
    optionRole.value = fetchRole.data;
  } catch (error) {
    return Promise.reject(error);
  }
}
async function init() {
  isView.value = route.meta.isView;
  isLoading.value = true;
  await fetchInitialData();
  if (isEdit.value) {
    try {
      let res = await userManagementService.dataById(route.params.id);
      const dataBinding = res.data.datas;
      const convertDate = isView.value === true ? formatDateThaiSlash(dataBinding.firstWorkingDate) : dataBinding.firstWorkingDate;
      const childData = [{
        name: null,
        birthday: null,
      }]
      model.value = {
        id: dataBinding.id,
        name: dataBinding.name,
        username: dataBinding.username,
        firstWorkingDate: convertDate,
        positionId: dataBinding.position.id,
        positionsName: dataBinding.position.name,
        employeeTypeId: dataBinding.employeeType.id,
        employeeTypeName: dataBinding.employeeType.name,
        departmentId: dataBinding.department.id,
        departmentName: dataBinding.department.name,
        sectorId: dataBinding.sector.id,
        sectorName: dataBinding.sector.name,
        roleId: dataBinding.role.id,
        roleName: dataBinding.role.name,
        child: Array.isArray(dataBinding.children) && dataBinding.children.length > 0 ? dataBinding.children : childData,
      };

      isLoading.value = false;
    } catch (error) {
      console.log(error);
      Notify.create({
        message:
          error.response?.data?.errors ??
          "เกิดข้อผิดพลาดกรุณาลองอีกครั้ง",
        position: "bottom-left",
        type: "negative",
      });
      router.replace({ name: "user_management_list" });
    }
  }
  else {
    isLoading.value = false;
  }

}
</script>
