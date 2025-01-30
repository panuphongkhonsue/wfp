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
            <q-card-section class="row wrap q-col-gutter-y-md font-medium q-pb-xs font-16 text-grey-9">
              <InputGroup for-id="fund-claim" is-dense v-model="model.claimFund" :data="model.claimFund ?? '-'"
                is-require label="จำนวนเงินที่ต้องการเบิก" placeholder="บาท" type="number" class="" :is-view="isView"
                compclass="col-xs-12 col-lg-3 col-xl-2">
              </InputGroup>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 font-18 font-bold">
          <p class="q-mb-none">จัดการข้อมูลบุตร</p>
        </div>
        <!-- Child Section -->
        <div class="col-12">
          <q-card flat bordered class="full-height">
            <q-card-section class="row wrap font-medium q-pb-xs font-16 text-grey-9">
              <InputGroup more-class="font-16 font-medium" label="วันที่ร้องขอ" :is-view="isView"
                compclass="col-xs-12  col-lg-3 col-xl-2 q-mr-xl" clearable :data="model.startDate ?? '-'">
                <DatePicker class="col-12" is-dense v-model:model="model.startDate" v-model:dateShow="model.startDate"
                  for-id="start-date" :no-time="true" />
              </InputGroup>
              <InputGroup more-class="font-16 font-medium" label="ถึงวันที่" :is-view="isView"
                compclass="col-xs-12  col-lg-3 col-xl-2" clearable :data="model.endDate ?? '-'">
                <DatePicker is-dense v-model:model="model.endDate" v-model:dateShow="model.endDate" for-id="end-date"
                  :no-time="true" />
              </InputGroup>
            </q-card-section>
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
  employeeTypesId: null,
  departmentId: null,
  sectorId: null,
  firstWorkingDate: null,
  roleId: null,
  child: [],
});
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
