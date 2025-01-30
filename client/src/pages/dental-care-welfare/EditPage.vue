<template>
  <PageLayout title="เบิกสวัสดิการทั่วไป (ค่าทำฟันเพื่อการรักษา)">
    <template v-slot:page>
      <!--General Information Section -->
      <div class="row q-col-gutter-md q-pl-md q-pt-md">
        <div :class="isView ? 'col' : 'col-md-9 col-12'">
          <q-card flat bordered class="full-height">
            <q-card-section class="font-18 font-bold">
              <p class="q-mb-none">ข้อมูลผู้เบิกสวัสดิการ</p>
            </q-card-section>
            <q-separator />
            <q-card-section class="row wrap q-col-gutter-y-md q-pb-sm font-16 font-bold">
              <div class="col-12 row wrap q-col-gutter-y-md">
                <p class="col-lg-3 col-12 q-mb-none">
                  ชื่อ : <span class="font-medium font-16 text-grey-7">สุทะพัด บุญทัน</span>
                </p>
                <p class="col-lg-3 col-12 q-mb-none">
                  ตำแหน่ง : <span class="font-medium font-16 text-grey-7">รองศาสตราจารย์</span>
                </p>
                <p class="col-lg col-12 q-mb-none">
                  ประเภทบุคลากร : <span class="font-medium font-16 text-grey-7">พนักงานมหาวิทยาลัย</span>
                </p>
              </div>
              <div class="col-12 row wrap q-col-gutter-y-md">
                <p class="col-lg-3 col-12 q-mb-none">ส่วนงาน : <span
                    class="font-medium font-16 text-grey-7">สถาบันการศึกษา</span></p>
                <p class="col-lg col-12 q-mb-none">ภาควิชา : <span
                    class="font-medium font-16 text-grey-7">วิศวกรรมซอฟต์แวร์</span></p>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-md-3 col-12" v-if="!isView">
          <q-card flat bordered class="full-height">
            <q-card-section class="q-px-md font-18 font-bold">
              <p class="q-mb-none">สิทธิ์คงเหลือ</p>
            </q-card-section>
            <q-separator />
            <q-card-section class="row wrap q-col-gutter-y-md font-medium font-16 text-grey-7">
              <p class="col-12 q-mb-none">คงเหลือ - บาท</p>
              <p class="col-12 q-mb-none">คงเหลือจำนวน - ครั้ง</p>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <!-- Request Section -->
      <div class="row q-col-gutter-md q-pl-md q-pt-md">
        <div class="col-md-9 col-12">
          <q-card flat bordered class="full-height">
            <q-card-section class="q-px-md q-pt-md q-pb-md font-18 font-bold">
              <p class="q-mb-none">ข้อมูลการเบิกสวัสดิการ</p>
            </q-card-section>
            <q-card-section class="row wrap q-col-gutter-x-md font-medium q-pb-xs font-16 text-grey-9">
              <div class="col-12 col-lg">
                <InputGroup for-id="fund-receipt" is-dense v-model="model.claimFundByReceipt"
                  :data="model.claimFundByReceipt ?? '-'" is-require label="จำนวนเงินตามใบเสร็จ" placeholder="บาท"
                  type="number" class="" :is-view="isView">
                </InputGroup>
              </div>
              <div class="col-12 col-lg">
                <InputGroup for-id="fund-claim" is-dense v-model="model.claimFund" :data="model.claimFund ?? '-'"
                  is-require label="จำนวนเงินที่ต้องการเบิก" placeholder="บาท" type="number" class="" :is-view="isView">
                </InputGroup>
              </div>
              <div class="col-12 col-lg">
                <InputGroup more-class="font-16 font-medium" label="วันที่ร้องขอ" :is-view="isView" clearable
                  :data="model.date ?? '-'">
                  <DatePicker class="col-12" is-dense v-model:model="model.date" v-model:dateShow="model.date"
                    for-id="date" :no-time="true" />
                </InputGroup>
              </div>
            </q-card-section>
            <q-card-section class="q-pt-none font-medium font-16">
              <q-table flat bordered :rows="row ?? []" :columns="columns" row-key="index" :wrap-cells="$q.screen.gt.lg"
                table-header-class="font-bold bg-blue-10 text-white" separator="cell" hide-bottom :loading="isLoading"
                @request="onRequest" ref="tableRef">
                <template v-slot:body-cell-index="props">
                  <q-td :props="props">
                    {{ props.rowIndex + 1 }}
                  </q-td>
                </template>
                <template v-slot:no-data="{ icon }">
                  <div class="full-width row flex-center text-negative q-gutter-sm">
                    <q-icon size="2em" :name="icon" />
                    <span class="font-14 font-regular ">
                      ไม่พบข้อมูล
                    </span>
                  </div>
                </template>
              </q-table>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-md-3 col-12">
          <q-card flat bordered class="full-height">
            <q-card-section class="font-18 font-bold">
              <p class="q-mb-none">หลักฐานที่ต้องแนบ</p>
            </q-card-section>
            <q-separator />
            <q-card-section class="row wrap q-col-gutter-y-md font-medium font-16 text-grey-7">
              <p class="col-12 q-mb-none font-bold text-black">ประสบอุบัติเหตุขณะปฏิบัติหน้าที่</p>
              <p class="col-12 q-mb-none">1. ใบสำคัญรับเงิน</p>
              <p class="col-12 q-mb-none">2. ใบรับรองแพทย์</p>
              <p class="col-12 q-mb-none">3. หนังสือรับรองของหัวหน้าส่วนงาน</p>
              <p class="col-12 q-mb-none font-bold text-black">ค่าเยี่ยมไข้ผู้ปฏิบัติงาน</p>
              <p class="col-12 q-mb-none">1. ใบสำคัญรับเงิน</p>
              <p class="col-12 q-mb-none">2. ใบรับรองแพทย์</p>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </template>
    <!--Action Slot -->
    <template v-slot:action>
      <div class="justify-end row q-py-xs font-medium q-gutter-lg">
        <q-btn id="button-back" class="text-white font-medium font-16 weight-8 q-px-lg" dense type="button"
          style="background : #BFBFBF;" label="ย้อนกลับ" no-caps :to="{ name: 'dental_care_welfare_list' }" />
        <q-btn id="button-draft" class="text-white font-medium bg-blue-9 text-white font-16 weight-8 q-px-lg" dense
          type="submit" label="บันทึกฉบับร่าง" no-caps @click="submit(4)" v-if="!isView && !isLoading" />
        <q-btn id="button-approve" class="font-medium font-16 weight-8 text-white q-px-md" dense type="submit"
          style="background-color: #43a047" label="ส่งคำร้องขอ" no-caps @click="submit(3)"
          v-if="!isView && !isLoading" />
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

import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";

defineOptions({
  name: "DentalCareWelfareEdit",
});
const router = useRouter();
const route = useRoute();
const model = ref({
  date: null,
  claimFundByReceipt: null,
  claimFund: null,
});
const tableRef = ref();
const isError = ref({});

const isView = ref(false);
const isLoading = ref(false);

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
async function fetchFromServer() {
  try {
    // const result = await GspcApproveSerivce.list({
    //   pageNo: page,
    //   itemPerPage: count,
    //   keyword: filter.value.keyword,
    //   dateSelected: formatDateServer(filter.value.dateSelected),
    //   endDate: formatDateServer(filter.value.endDate),
    // });
    console.log(true);
    return;
  } catch (error) {
    Notify.create({
      message:
        error?.response?.data?.message ??
        "Something wrong please try again later.",
      position: "bottom-left",
      type: "negative",
    });
  }
}

function onRequest() {
  isLoading.value = true;
  setTimeout(async () => {
    try {
      const returnedData = await fetchFromServer();
      if (returnedData) row.value.splice(0, row.value.length, ...returnedData);
    } catch (error) {
      Promise.reject(error)
    }
    isLoading.value = false;
  }, 100);
}

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

const row = ref([
  {
    id: 1,
    date: new Date(),
    claimFund: 3000,
  },
  {
    id: 2,
    date: new Date(),
    claimFund: 3000,
  },
  {
    id: 3,
    date: new Date(),
    claimFund: null,
  },
]);
const columns = ref([
  {
    name: "index",
    label: "เบิกครั้งที่",
    align: "center",
    field: "index",
    classes: "ellipsis",
  },
  {
    name: "date",
    label: "วัน/เดือน/ปี",
    align: "left",
    field: (row) => row.date ?? "-",
    format: (val) => formatDateThaiSlash(val),
    classes: "ellipsis",
  },
  {
    name: "claimFund",
    label: "จำนวนเงิน (บาท)",
    align: "right",
    field: (row) => row.claimFund ?? "-",
    format: (val) => {
      const number = Number(val); // Convert to number
      if (!isNaN(number)) {
        return number.toLocaleString("en-US"); // Format as '3,000'
      }
      return `${val}`; // If conversion fails, return a fallback value
    },
    classes: "ellipsis",
  },
]);
async function init() {
  await tableRef.value.requestServerInteraction();
  isView.value = route.meta.isView;
  isLoading.value = true;
}
</script>
