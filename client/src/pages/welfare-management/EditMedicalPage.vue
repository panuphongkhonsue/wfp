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
              <div class="col-lg-5 col-12 col-xl-4 row q-gutter-y-md q-pr-sm">
                <p class="col-auto q-mb-none">
                  ชื่อ-นามสกุล : <span class="font-medium font-16 text-grey-7">{{
                    userData?.name ?? "-" }}</span>
                </p>
                
              </div>
              <p class="col-lg-3 col-xl-4 col-12 q-mb-none q-pr-sm text-no-wrap ellipsis"
                :title="userData?.position ?? '-'">
                ตำแหน่ง : <span class="font-medium font-16 text-grey-7">{{
                  userData?.position ?? "-" }}</span>
              </p>
              <p class="col-lg col-xl-4 col-12 q-mb-none text-no-wrap ellipsis" :title="userData?.employeeType ?? '-'">
                ประเภทบุคลากร : <span class="font-medium font-16 text-grey-7">{{
                  userData?.employeeType ?? "-" }}</span>
              </p>
              <p class="col-lg-5 col-xl-4 col-12 q-mb-none q-pr-sm">ส่วนงาน : <span
                  class="font-medium font-16 text-grey-7">{{
                    userData?.department ?? "-" }}</span></p>
              <p class="col-lg col-xl-4 col-12 q-mb-none q-pr-sm">ภาควิชา : <span
                  class="font-medium font-16 text-grey-7">{{
                    userData?.sector ?? "-" }}</span>
              </p>
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
              <p class="col-12 q-ma-none">ประสบอุบัติเหตุ :
                {{ remaining?.accident.fundRemaining ?? remaining?.accident.perTimesRemaining ?? "-" }}
                {{ "บาท ( " }}
                {{ remaining?.accident.requestsRemaining ?? '-' }} {{ " ครั้ง )" }}</p>
              <p class="col-12 q-ma-none">เยี่ยมไข้ :
                {{ remaining?.patientVisit.fundRemaining ?? remaining?.patientVisit.perTimesRemaining ?? "-" }}
                {{ "บาท ( " }}
                {{ remaining?.patientVisit.requestsRemaining ?? '-' }} {{ " ครั้ง )" }}</p>
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
                v-if="isView && (model.status == 'รอตรวจสอบ')"><q-icon :name="outlinedDownload" />
                <span> Export</span>
              </p>
            </q-card-section>
            <q-card-section v-show="isView || isEdit" class="row wrap font-medium q-pb-xs font-16 text-grey-9">
              <p class="col-md-4 col-12 q-mb-none">เลขที่ใบเบิก : {{ model.reimNumber ?? "-" }}</p>
              <p class="col-md-4 col-12 q-mb-none">วันที่ร้องขอ : {{ formatDateThaiSlash(model.requestDate) ?? "-" }}
              </p>
              <p class="col-md-4 col-12 q-mb-none">สถานะ : {{ model.status ?? "-" }}</p>
            </q-card-section>
            <q-card-section class="row wrap font-medium q-pb-xs font-16 text-grey-9 items-center"
              :class="isView ? '' : 'q-pl-sm'">
              <q-checkbox v-if="!isView" v-model="model.selectedAccident" />
              <p class="q-mb-none">ประสบอุบัติเหตุขณะปฏิบัติงานในหน้าที่ (จ่ายไม่เกินคนละ 1,000 บาท)</p>
            </q-card-section>
            <q-card-section class="row wrap font-medium q-pb-xs font-16 text-grey-9">
              <InputGroup for-id="fund-receipt-accident" is-dense v-model="model.fundReceipt"
                :data="model.fundReceipt ?? '-'" is-require label="จำนวนเงินตามใบสำคัญรับเงิน"
                :disable="!model.selectedAccident" placeholder="บาท" type="number" :is-view="isView"
                compclass="col-xs-12 col-lg-4 col-xl-2 q-mr-lg-xl"
                :rules="[(val) => !!val || 'กรุณากรอกข้อมูลจำนวนเงินตามใบสำคัญรับเงิน']"
                :error-message="isError?.fundReceipt" :error="!!isError?.fundReceipt">
              </InputGroup>
              <InputGroup for-id="fund-claim-accident" is-dense v-model="model.fundEligible"
                :data="model.fundEligible ?? '-'" is-require label="จำนวนเงินที่ต้องการเบิก" placeholder="บาท"
                type="number" :is-view="isView" compclass="col-xs-12 col-lg-4 col-xl-2 q-ml-lg-xl"
                :disable="!model.selectedAccident" :rules="[(val) => !!val || 'กรุณากรอกข้อมูลจำนวนเงินที่ต้องการเบิก']"
                :error-message="isError?.fundEligible" :error="!!isError?.fundEligible">
              </InputGroup>
            </q-card-section>
            <q-card-section class="row wrap q-pt-none font-medium q-pb-xs font-16 text-grey-9 items-center"
              :class="isView ? '' : 'q-pl-sm'">
              <q-checkbox v-if="!isView" v-model="model.selectedPatientVisit" />
              <p class="q-mb-none">ค่าเยี่ยมไข้ผู้ปฏิบัติงาน (กรณีผู้ป่วยใน) คนละไม่เกิน 1,000 บาท ต่อครั้ง ปีนึงไม่เกิน
                3 ครั้ง</p>
            </q-card-section>
            <q-card-section class="row wrap font-medium q-pb-sm font-16 text-grey-9">
              <InputGroup label="ตั้งแต่วันที่" :is-view="isView" compclass="col-xs-12 col-lg-4 col-xl-2 q-mr-lg-xl"
                clearable :data="model.startDate ?? '-'" is-require>
                <DatePicker :disabled="!model.selectedPatientVisit" class="col-12" is-dense
                  v-model:model="model.startDate" v-model:dateShow="model.startDate" for-id="start-date" :no-time="true"
                  :rules="[(val) => !!val || 'กรุณากรอก วัน/เดือน/ปี ตั้งแต่วันที่']"
                  :error-message="isError?.startDate" :error="!!isError?.startDate" />
              </InputGroup>
              <InputGroup label="ถึงวันที่" :is-view="isView" compclass="col-xs-12 col-lg-4 col-xl-2 q-ml-lg-xl"
                clearable :data="model.endDate ?? '-'" is-require>
                <DatePicker is-dense :disabled="!model.selectedPatientVisit" v-model:model="model.endDate"
                  v-model:dateShow="model.endDate" for-id="end-date" :no-time="true"
                  :rules="[(val) => !!val || 'กรุณากรอก วัน/เดือน/ปี ถึงวันที่']" :error-message="isError?.endDate"
                  :error="!!isError?.endDate" />
              </InputGroup>
            </q-card-section>
            <q-card-section class="q-pt-none row wrap font-medium q-pb-xs font-16 text-grey-9">
              <InputGroup for-id="fund-receipt-visit" is-dense v-model="model.fundReceiptPatientVisit"
                :data="model.fundReceiptPatientVisit ?? '-'" is-require label="จำนวนเงินตามใบสำคัญรับเงิน"
                :disable="!model.selectedPatientVisit" placeholder="บาท" type="number" :is-view="isView"
                compclass="col-xs-12 col-lg-4 col-xl-2 q-mr-lg-xl"
                :rules="[(val) => !!val || 'กรุณากรอกข้อมูลจำนวนเงินตามใบสำคัญรับเงิน']"
                :error-message="isError?.fundReceiptPatientVisit" :error="!!isError?.fundReceiptPatientVisit">
              </InputGroup>
              <InputGroup for-id="fund-claim-visit" is-dense v-model="model.fundSumRequestPatientVisit"
                :data="model.fundSumRequestPatientVisit ?? '-'" is-require label="จำนวนเงินที่ต้องการเบิก"
                placeholder="บาท" type="number" :is-view="isView" compclass="col-xs-12 col-lg-4 col-xl-2 q-ml-lg-xl"
                :disable="!model.selectedPatientVisit"
                :rules="[(val) => !!val || 'กรุณากรอกข้อมูลจำนวนเงินตามใบสำคัญรับเงิน']"
                :error-message="isError?.fundSumRequestPatientVisit" :error="!!isError?.fundSumRequestPatientVisit">
              </InputGroup>
            </q-card-section>
            <q-card-section class="q-pt-none font-medium font-16">
              <q-table flat bordered :rows="row ?? []" :columns="columns" row-key="index" :wrap-cells="$q.screen.gt.lg"
                table-header-class="font-bold bg-blue-10 text-white" separator="cell" hide-bottom :loading="isLoading">
                <template v-slot:body-cell-index="props">
                  <q-td :props="props">
                    {{ props.rowIndex + 1 }}
                  </q-td>
                </template>
                <template v-slot:body-cell-date="props">
                  <q-td :props="props" v-if="props.row.startDate && props.row.endDate">
                    {{ formatDateThaiSlash(props.row.startDate) + "-" + formatDateThaiSlash(props.row.endDate) }}
                  </q-td>
                  <q-td :props="props" v-else>
                    -
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
          style="background : #BFBFBF;" label="ย้อนกลับ" no-caps :to="{ name: 'welfare_management_list' }" />
        <q-btn id="button-draft" class="text-white font-medium bg-blue-9 text-white font-16 weight-8 q-px-lg" dense
          type="submit" label="บันทึก" no-caps @click="submit()" v-if="!isView && !isLoading" />
        <q-btn id="button-approve"
          class="font-medium font-16 weight-8 text-white q-px-md" dense type="submit" style="background-color: #43a047"
          label="อนุมัติ" no-caps @click="submit(3)" v-if="!isView" />
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
import { formatDateThaiSlash, formatNumber, formatDateSlash, formatDateServer } from "src/components/format";
import medicalWelfareService from "src/boot/service/medicalWelfareService";
import welfareManagementService from "src/boot/service/welfareManagementService";
import { outlinedDownload } from "@quasar/extras/material-icons-outlined";
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

defineOptions({
  name: "MedicalfareEdit",
});
const router = useRouter();
const route = useRoute();
const model = ref({
  createFor: null,
  selectedAccident: false,
  selectedPatientVisit: false,
  fundReceipt: null,
  fundEligible: null,
  fundReceiptPatientVisit: null,
  fundSumRequestPatientVisit: null,
  startDate: null,
  endDate: null,
});
const userData = ref({});
const remaining = ref({
  accident: {},
  patientVisit: {},
});
const isLoading = ref(false);
const isError = ref({});
const canRequest = ref({
  accident: false,
  patientVisit: false,
});
const isView = ref(false);

const isEdit = computed(() => {
  return !isNaN(route.params.id);
});

onMounted(async () => {
  await init();
  isLoading.value = false;
});

onBeforeUnmount(() => {
  model.value = null;
});

watch(
  model,
  () => {
    if (!isView.value) {
      Object.keys(model.value).forEach((key) => {
        if (model.value[key] !== null) {
          delete isError.value[key];
        }
      });
    }
  },
  { deep: true }
);

watch(
  () => model.value.startDate,
  (newValue) => {
    if (model.value.endDate < newValue && newValue && model.value.endDate) {
      model.value.endDate = null;
    }
  }
);

watch(
  () => model.value.endDate,
  (newValue) => {
    if (newValue < model.value.startDate) {
      model.value.endDate = model.value.startDate;
    }
  }
);
watch(
  () => model.value.selectedAccident,
  (newValue) => {
    if (!newValue) {
      model.value.fundReceipt = null;
      model.value.fundEligible = null;
    }
  }
);
watch(
  () => model.value.selectedPatientVisit,
  (newValue) => {
    if (!newValue) {
      model.value.fundReceiptPatientVisit = null;
      model.value.fundSumRequestPatientVisit = null;
      model.value.startDate = null;
      model.value.endDate = null;
    }
  }
);
watch(
    () => model.value.createFor,
    async (newValue) => {
      if (newValue !== null) {
        await fetchRemaining();
      }
    }
  );
  async function fetchDataEdit() {
  setTimeout(async () => {
    try {
      const result = await welfareManagementService.dataMedicalById(route.params.id);
      var returnedData = result.data.datas;
      if (returnedData) {
        model.value = {
          ...model,
          createFor: returnedData?.user?.userId,
          reimNumber: returnedData?.reimNumber,
          requestDate: returnedData?.requestDate,
          selectedAccident: returnedData?.fundEligible ? true : false,
          selectedPatientVisit: returnedData?.fundSumRequestPatientVisit ? true : false,
          status: returnedData?.status,
          fundReceipt: returnedData?.fundReceipt,
          fundEligible: returnedData?.fundEligible,
          fundReceiptPatientVisit: returnedData?.fundReceiptPatientVisit,
          fundSumRequestPatientVisit: returnedData?.fundSumRequestPatientVisit,
          startDate: isView.value === true ? formatDateThaiSlash(returnedData?.startDate) : formatDateSlash(returnedData?.startDate),
          endDate: isView.value === true ? formatDateThaiSlash(returnedData?.endDate) : formatDateSlash(returnedData?.endDate),
          fundSumRequest: returnedData?.fundSumRequest,
          fundEligibleSum: returnedData?.fundEligibleSum,
        };
        userData.value = {
          name: returnedData?.user.name,
          position: returnedData?.user.position,
          employeeType: returnedData?.user.employeeType,
          sector: returnedData?.user.sector,
          department: returnedData?.user.department,
        };
        if (Array.isArray(returnedData?.requestData) && returnedData?.requestData.length > 0) {
          row.value = returnedData?.requestData ?? [
            {
              id: 1,
              startDate: null,
              endDate: null,
              fundSumRequestPatientVisit: "-",
            },
            {
              id: 2,
              startDate: null,
              endDate: null,
              fundSumRequestPatientVisit: "-",
            },
            {
              id: 3,
              startDate: null,
              endDate: null,
              fundSumRequestPatientVisit: "-",
            },
          ];
        }
        else {
          row.value = [
            {
              id: 1,
              startDate: null,
              endDate: null,
              fundSumRequestPatientVisit: "-",
            },
            {
              id: 2,
              startDate: null,
              endDate: null,
              fundSumRequestPatientVisit: "-",
            },
            {
              id: 3,
              startDate: null,
              endDate: null,
              fundSumRequestPatientVisit: "-",
            },
          ]
        }
      }
    } catch (error) {
      router.replace({ name: "medical_welfare_list" });
      Notify.create({
        message:
          error?.response?.data?.message ??
          "เกิดข้อผิดพลาดกรุณาลองอีกครั้ง",
        position: "bottom-left",
        type: "negative",
      });
    }
    isLoading.value = false;
  }, 100);
}

async function fetchRemaining() {
  try {
    const fetchRemaining = await medicalWelfareService.getRemaining({ createFor: model.value.createFor });
    const accidentData = fetchRemaining.data?.datas[0];
    const patientVisitData = fetchRemaining.data?.datas[1];
    if (accidentData.requestsRemaining != null && !isNaN(Number(accidentData.requestsRemaining))) {
      remaining.value.accident.requestsRemaining = formatNumber(accidentData.requestsRemaining);
    }
    if (accidentData.fundRemaining != null && !isNaN(Number(accidentData.fundRemaining))) {
      remaining.value.accident.fundRemaining = formatNumber(accidentData.fundRemaining);
    }
    if (accidentData.perTimesRemaining != null && !isNaN(Number(accidentData.perTimesRemaining))) {
      remaining.value.accident.perTimesRemaining = formatNumber(accidentData.perTimesRemaining);
    }
    if (patientVisitData.requestsRemaining != null && !isNaN(Number(patientVisitData.requestsRemaining))) {
      remaining.value.patientVisit.requestsRemaining = formatNumber(patientVisitData.requestsRemaining);
    }
    if (patientVisitData.fundRemaining != null && !isNaN(Number(patientVisitData.fundRemaining))) {
      remaining.value.patientVisit.fundRemaining = formatNumber(patientVisitData.fundRemaining);
    }
    if (patientVisitData.perTimesRemaining != null && !isNaN(Number(patientVisitData.perTimesRemaining))) {
      remaining.value.patientVisit.perTimesRemaining = formatNumber(patientVisitData.perTimesRemaining);
    }
    canRequest.value.accident = accidentData.canRequest;
    canRequest.value.patientVisit = patientVisitData.canRequest;
    if (Array.isArray(patientVisitData?.requestData) && patientVisitData?.requestData.length > 0) {
      row.value = patientVisitData?.requestData ?? [
        {
          id: 1,
          startDate: null,
          endDate: null,
          fundSumRequestPatientVisit: "-",
        },
        {
          id: 2,
          startDate: null,
          endDate: null,
          fundSumRequestPatientVisit: "-",
        },
        {
          id: 3,
          startDate: null,
          endDate: null,
          fundSumRequestPatientVisit: "-",
        },
      ];
    }
    else {
      row.value = [
        {
          id: 1,
          startDate: null,
          endDate: null,
          fundSumRequestPatientVisit: "-",
        },
        {
          id: 2,
          startDate: null,
          endDate: null,
          fundSumRequestPatientVisit: "-",
        },
        {
          id: 3,
          startDate: null,
          endDate: null,
          fundSumRequestPatientVisit: "-",
        },
      ]
    }
  } catch (error) {
    Promise.reject(error);
  }
}

async function submit(actionId) {
  let validate = false;
  if (!model.value.selectedAccident && !model.value.selectedPatientVisit) {
    Notify.create({
      message: "กรุณากรอกสวัสดิการที่ต้องการเบิก",
      position: "bottom-left",
      type: "negative",
    });
    return;
  }
  if (model.value.selectedAccident) {
    if (!model.value.fundReceipt) {
      isError.value.fundReceipt = "กรุณากรอกข้อมูลจำนวนเงินตามใบสำคัญรับเงิน";
      validate = true;
    }
    if (!model.value.fundEligible) {
      isError.value.fundEligible = "กรุณากรอกข้อมูลจำนวนเงินที่ต้องการเบิก";
      validate = true;
    }
  }
  if (model.value.selectedPatientVisit) {
    if (!model.value.fundReceiptPatientVisit) {
      isError.value.fundReceiptPatientVisit = "กรุณากรอกข้อมูลจำนวนเงินตามใบสำคัญรับเงิน";
      validate = true;
    }
    if (!model.value.fundSumRequestPatientVisit) {
      isError.value.fundSumRequestPatientVisit = "กรุณากรอกข้อมูลจำนวนเงินที่ต้องการเบิก";
      validate = true;
    }
    if (!model.value.startDate) {
      isError.value.startDate = "กรุณากรอก วัน/เดือน/ปี ตั้งแต่วันที่";
      validate = true;
    }
    if (!model.value.endDate) {
      isError.value.endDate = "กรุณากรอก วัน/เดือน/ปี ถึงวันที่";
      validate = true;
    }
  }
  if (validate === true) {
    Notify.create({
      message: "กรุณากรอกข้อมูลให้ครบถ้วน",
      position: "bottom-left",
      type: "negative",
    });
    return;
  }
  let isValid = false;
  let payload = {
    selectedAccident: model.value.selectedAccident,
    selectedPatientVisit: model.value.selectedPatientVisit,
    fundReceipt: model.value.fundReceipt,
    fundEligible: model.value.fundEligible,
    fundReceiptPatientVisit: model.value.fundReceiptPatientVisit,
    fundSumRequestPatientVisit: model.value.fundSumRequestPatientVisit,
    startDate: model.value.startDate ? formatDateServer(model.value.startDate) : null,
    endDate: model.value.endDate ? formatDateServer(model.value.endDate) : null,
    actionId: actionId
  }
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
          fetch = await welfareManagementService.updateMedical(route.params.id, payload);
        }
        else {
          fetch = await medicalWelfareService.create(payload);
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
        Swal.showValidationMessage(error?.response?.data?.message ?? `เกิดข้อผิดพลาด กรุณาลองอีกครั้ง`);
        Notify.create({
          message:
            error?.response?.data?.message ??
            "บันทึกข้อมูลไม่สำเร็จ กรุณาลองอีกครั้ง",
          position: "bottom-left",
          type: "negative",
        });
      }
    },
  }).then((result) => {
    if (isValid && result.isConfirmed) {
      Swal.fire({
        html: fetch.data?.message ?? `สำเร็จ`,
        icon: "success",
        confirmButtonText: "ตกลง",
        customClass: {
          confirmButton: "save-button",
        },
      }).then(() => {
        router.replace({ name: "welfare_management_list" });
      });
    }
  });
}


const row = ref([
  {
    id: 1,
    startDate: null,
    endDate: null,
    fundSumRequestPatientVisit: "-",
  },
  {
    id: 2,
    startDate: null,
    endDate: null,
    fundSumRequestPatientVisit: "-",
  },
  {
    id: 3,
    startDate: null,
    endDate: null,
    fundSumRequestPatientVisit: "-",
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
    field: (row) => row.startDate ?? "",
    classes: "ellipsis",
  },
  {
    name: "fundSumRequestPatientVisit",
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
  isView.value = route.meta.isView;
  isLoading.value = true;
  try {
    if (isView.value) {
      fetchDataEdit();
    }
    else if (isEdit.value) {
        fetchDataEdit();
    }
  }
  catch (error) {
    Promise.reject(error);
  }
  isLoading.value = false;
}
</script>
