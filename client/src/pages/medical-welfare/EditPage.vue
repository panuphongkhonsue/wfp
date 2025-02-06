<template>
  <PageLayout title="เบิกสวัสดิการทั่วไป (กรณีเจ็บป่วย)">
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
              <p class="col-lg-4 col-12 q-mb-none">
                ชื่อ : <span class="font-medium font-16 text-grey-7">สุทะพัด บุญทัน</span>
              </p>
              <p class="col-lg-4 col-12 q-mb-none">
                ตำแหน่ง : <span class="font-medium font-16 text-grey-7">รองศาสตราจารย์</span>
              </p>
              <p class="col-lg-4 col-12 q-mb-none">
                ประเภทบุคลากร : <span class="font-medium font-16 text-grey-7">พนักงานมหาวิทยาลัย</span>
              </p>
              <p class="col-lg-4 col-12 q-mb-none">ส่วนงาน : <span
                  class="font-medium font-16 text-grey-7">สถาบันการศึกษา</span></p>
              <p class="col-lg-4 col-12 q-mb-none">ภาควิชา : <span
                  class="font-medium font-16 text-grey-7">วิศวกรรมซอฟต์แวร์</span></p>
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
              <p class="col-12 q-mb-none">ประสบอุบัติเหตุฯ : 1,000 บาท (1 ครั้ง)</p>
              <p class="col-12 q-mb-none">เยี่ยมไข้ : 1,000 บาท (1 ครั้ง)</p>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <!-- Request Section -->
      <div class="row q-col-gutter-md q-pl-md q-pt-md">
        <div class="col-md-9 col-12">
          <q-card flat bordered class="full-height">
            <q-card-section class="flex justify-between q-px-md q-pt-md q-pb-md font-18 font-bold">
              <p class="q-mb-none">ข้อมูลการเบิกสวัสดิการ</p>
              <p class="q-mb-none font-regular font-16 text-blue-7 cursor-pointer"
                v-if="isView && (model.status == 'รอตรวจสอบ' || model.status == 'อนุมัติ')"><q-icon
                  :name="outlinedDownload" />
                <span> Export</span>
              </p>
            </q-card-section>
            <q-card-section v-show="isView" class="row wrap font-medium q-pb-xs font-16 text-grey-9">
              <p class="col-md-4 col-12 q-mb-none">เลขที่ใบเบิก : {{ model.reimNumber ?? "-" }}</p>
              <p class="col-md-4 col-12 q-mb-none">วันที่ร้องขอ : {{ model.requestDate ?? "-" }}</p>
              <p class="col-md-4 col-12 q-mb-none">สถานะ : {{ model.status ?? "-" }}</p>
            </q-card-section>
            <q-card-section class="row wrap font-medium q-pb-xs font-16 text-grey-9 items-center" :class="isView ? '' : 'q-pl-sm'">
              <q-checkbox v-if="!isView" v-model="model.accident.isSelected" />
              <p class="q-mb-none">ประสบอุบัติเหตุขณะปฏิบัติงานในหน้าที่ (จ่ายไม่เกินคนละ 1,000 บาท)</p>
            </q-card-section>
            <q-card-section class="row wrap font-medium q-pb-xs font-16 text-grey-9">
              <InputGroup for-id="fund-receipt-accident" is-dense v-model="model.accident.fundReceipt"
                :data="model.accident.fundReceipt ?? '-'" is-require label="จำนวนเงินตามใบสำคัญรับเงิน"
                :disable="!model.accident.isSelected" placeholder="บาท" type="number" :is-view="isView"
                compclass="col-xs-12 col-lg-4 col-xl-2 q-mr-lg-xl">
              </InputGroup>
              <InputGroup for-id="fund-claim-accident" is-dense v-model="model.accident.fundEligible"
                :data="model.accident.fundEligible ?? '-'" is-require label="จำนวนเงินที่ต้องการเบิก" placeholder="บาท"
                type="number" :is-view="isView" compclass="col-xs-12 col-lg-4 col-xl-2 q-ml-lg-xl"
                :disable="!model.accident.isSelected">
              </InputGroup>
            </q-card-section>
            <q-card-section class="row wrap q-pt-none font-medium q-pb-xs font-16 text-grey-9 items-center"
              :class="isView ? '' : 'q-pl-sm'">
              <q-checkbox v-if="!isView" v-model="model.visitPatien.isSelected" />
              <p class="q-mb-none">ค่าเยี่ยมไข้ผู้ปฏิบัติงาน (กรณีผู้ป่วยใน) คนละไม่เกิน 1,000 บาท ต่อครั้ง ปีนึงไม่เกิน
                3 ครั้ง</p>
            </q-card-section>
            <q-card-section class="row wrap font-medium q-pb-sm font-16 text-grey-9">
              <InputGroup label="ตั้งแต่วันที่" :is-view="isView" compclass="col-xs-12 col-lg-4 col-xl-2 q-mr-lg-xl"
                clearable :data="model.visitPatien.startDate ?? '-'" is-require>
                <DatePicker :disabled="!model.visitPatien.isSelected" class="col-12" is-dense
                  v-model:model="model.visitPatien.startDate" v-model:dateShow="model.visitPatien.startDate"
                  for-id="start-date" :no-time="true" />
              </InputGroup>
              <InputGroup label="ถึงวันที่" :is-view="isView" compclass="col-xs-12 col-lg-4 col-xl-2 q-ml-lg-xl"
                clearable :data="model.visitPatien.endDate ?? '-'" is-require>
                <DatePicker is-dense :disabled="!model.visitPatien.isSelected" v-model:model="model.visitPatien.endDate"
                  v-model:dateShow="model.visitPatien.endDate" for-id="end-date" :no-time="true" />
              </InputGroup>
            </q-card-section>
            <q-card-section class="q-pt-none row wrap font-medium q-pb-xs font-16 text-grey-9">
              <InputGroup for-id="fund-receipt-visit" is-dense v-model="model.visitPatien.fundReceiptPatientVisit"
                :data="model.visitPatien.fundReceiptPatientVisit ?? '-'" is-require label="จำนวนเงินตามใบสำคัญรับเงิน"
                :disable="!model.visitPatien.isSelected" placeholder="บาท" type="number" :is-view="isView"
                compclass="col-xs-12 col-lg-4 col-xl-2 q-mr-lg-xl">
              </InputGroup>
              <InputGroup for-id="fund-claim-visit" is-dense v-model="model.visitPatien.fundSumRequestPatientVisit"
                :data="model.visitPatien.fundSumRequestPatientVisit ?? '-'" is-require label="จำนวนเงินที่ต้องการเบิก"
                placeholder="บาท" type="number" :is-view="isView" compclass="col-xs-12 col-lg-4 col-xl-2 q-ml-lg-xl"
                :disable="!model.visitPatien.isSelected">
              </InputGroup>
            </q-card-section>
            <q-card-section class="q-pt-none font-medium font-16">
              <q-table flat bordered :rows="row ?? []" :columns="columns" row-key="index" :wrap-cells="$q.screen.gt.lg"
                table-header-class="font-bold bg-blue-10 text-white" separator="cell" hide-bottom ref="tableRef"
                :loading="isLoading" @request="onRequest">
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
        <div class="col-md-3 col-12 row">
          <q-card flat bordered class="col-12 full-height">
            <q-card-section class="font-18 font-bold">
              <p class="q-mb-none">หลักฐานที่ต้องแนบ</p>
            </q-card-section>
            <q-separator />
            <q-card-section class="row wrap q-col-gutter-y-md font-medium font-16 text-grey-7">
              <p class="col-12 q-mb-none">1. ใบเสร็จรับเงิน</p>
              <p class="col-12 q-mb-none">2. ใบรับรองแพทย์</p>
              <p class="col-12 q-mb-none">
                3. คำสั่งประโยชน์ทดแทนหรือใบยืนยันการใช้สิทธิประโยชน์ทแทน (จากเว็บประกันสังคม) (สถานะ อนุมัติ)
              </p>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </template>
    <!--Action Slot -->
    <template v-slot:action>
      <div class="justify-end row q-py-xs font-medium q-gutter-lg">
        <q-btn id="button-back" class="text-white font-medium font-16 weight-8 q-px-lg" dense type="button"
          style="background : #BFBFBF;" label="ย้อนกลับ" no-caps :to="{ name: 'medical_welfare_list' }" />
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

import { formatDateThaiSlash } from "src/components/format";

import Swal from "sweetalert2";
import { Notify } from "quasar";
import { outlinedDownload } from "@quasar/extras/material-icons-outlined";

import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

defineOptions({
  name: "MedicalfareEdit",
});
const router = useRouter();
const route = useRoute();
const model = ref({
  reimNumber: null,
  requestDate: null,
  status: null,
  accident: {
    isSelected: false,
    fundReceipt: null,
    fundEligible: null,
  },
  visitPatien: {
    isSelected: false,
    fundReceiptPatientVisit: null,
    fundSumRequestPatientVisit: null,
    startDate: null,
    endDate: null,
  },
});
const isLoading = ref(false);
const tableRef = ref();
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
        error?.response?.data?.errors ??
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
        Notify.create({
          message: `[ผิดพลาด].บันทึกข้อมูลไม่สำเร็จ กรุณาลองอีกครั้ง`,
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

watch(
  () => model.value.visitPatien.startDate,
  (newValue) => {
    if (model.value.visitPatien.endDate < newValue && newValue && model.value.visitPatien.endDate) {
      model.value.visitPatien.endDate = null;
    }
  }
);

watch(
  () => model.value.visitPatien.endDate,
  (newValue) => {
    if (newValue < model.value.visitPatien.startDate) {
      model.value.visitPatien.endDate = model.value.visitPatien.startDate;
    }
  }
);

const row = ref([
  {
    id: 1,
    date: {
      startDate: new Date(),
      endDate: new Date()
    },
    fundSumRequestPatientVisit: 3000,
  },
  {
    id: 2,
    date: {
      startDate: new Date(),
      endDate: new Date()
    },
    fundSumRequestPatientVisit: 3000,
  },
  {
    id: 3,
    date: null,
    fundSumRequestPatientVisit: null,
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
    format: (val) => {
      if (val && val !== "-") {
        const startDate = formatDateThaiSlash(val.startDate);
        const endDate = formatDateThaiSlash(val.endDate);
        return `${startDate} - ${endDate}`;
      }
      return "-";
    },
    classes: "ellipsis",
  },
  {
    name: "claimFund",
    label: "จำนวนเงิน (บาท)",
    align: "right",
    field: (row) => row.fundSumRequestPatientVisit ?? "-",
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
