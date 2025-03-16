<template>
  <PageLayout title="เบิกสวัสดิการทั่วไป (ค่าตรวจสุขภาพ)">
    <template v-slot:page>
      <!--General Information Section -->
      <div class="row q-col-gutter-md q-pl-md q-pt-md">
        <div :class="isView ? 'col' : 'col-md-9 col-12'">
          <q-card flat bordered class="full-height">
            <q-card-section class="font-18 font-bold">
              <p class="q-mb-none">ข้อมูลผู้เบิกสวัสดิการ</p>
            </q-card-section>
            <q-separator />
            <q-card-section class="row wrap q-col-gutter-y-md q-pb-sm font-16 font-bold"
              :class="canCreateFor && !isView ? 'items-center' : ''">
              <div class="col-lg-5 col-12 col-xl-4 row q-gutter-y-md q-pr-sm"
                :class="canCreateFor && !isView ? 'items-center' : ''">
                <p class="col-auto q-mb-none">
                  ชื่อ-นามสกุล : <span v-show="!canCreateFor || isView" class="font-medium font-16 text-grey-7">{{
                    userData?.name ?? "-" }}</span>
                </p>
                <q-select v-if="canCreateFor && !isView" popup-content-class="font-14 font-regular" :loading="isLoading"
                  id="selected-status" class="col-lg q-px-lg-md col-12 font-regular" outlined for="selected-user"
                  v-model="model.createFor" :options="options" dense option-value="id" emit-value map-options
                  option-label="name" @filter="filterFn" use-input input-debounce="100" hide-bottom-space
                  :error="!!isError?.createFor" :rules="[(val) => !!val || '']" @filter-abort="abortFilterFn">
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey"> ไม่มีตัวเลือก </q-item-section>
                    </q-item>
                  </template>
                </q-select>
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
              <p class="col q-ma-none">
                {{ remainingText(remaining, remaining.categoryName) }}
              </p>
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
              <a class="q-mb-none font-regular font-16 text-blue-7 cursor-pointer"
                v-if="isView && (model.status == 'รอตรวจสอบ')" @click.stop.prevent="
                  downloadData()">
                <q-icon :name="outlinedDownload" />
                <span> Export</span>
              </a>
            </q-card-section>
            <q-card-section v-show="isView || isEdit" class="row wrap font-medium q-pb-xs font-16 text-grey-9">
              <p class="col-md-4 col-12 q-mb-none">เลขที่ใบเบิก : {{ model.reimNumber ?? "-" }}</p>
              <p class="col-md-4 col-12 q-mb-none">วันที่ร้องขอ : {{ formatDateThaiSlash(model.requestDate) ?? "-" }}
              </p>
              <p class="col-md-4 col-12 q-mb-none">สถานะ : <span :class="textStatusColor(model.status)">{{ model.status
                ?? "-"
                  }}</span> </p>
            </q-card-section>
            <q-card-section class="row wrap font-medium q-pb-xs font-16 text-grey-9">
              <InputGroup for-id="fund" is-dense v-model="model.fundReceipt" :data="model.fundReceipt ?? '-'" is-require
                label="จำนวนเงินตามใบเสร็จ (บาท)" placeholder="บาท" type="number" compclass="col-md-4 col-12" :rules="[
                  (val) => !!val || 'กรุณากรอกข้อมูลจำนวนเงินตามใบเสร็จ',
                  (val) => !isOver || 'จำนวนเงินตามใบเสร็จต้องมากกว่าเงินที่ได้รับจากสิทธิอื่น ๆ',
                ]" :is-view="isView" :error-message="isError?.fundReceipt" :error="!!isError?.fundReceipt">
              </InputGroup>

              <InputGroup for-id="fund" is-dense :data="model.fundSumRequest ?? '-'" is-require
                label="จำนวนที่ต้องการเบิก (บาท)" type="number" compclass="col-md-4 col-12" :is-view="isView"
                v-if="isView">
              </InputGroup>
            </q-card-section>
            <q-card-section class="q-pt-sm font-medium font-16">
              <q-table flat bordered :rows="row ?? []" :columns="columns" row-key="id" :wrap-cells="$q.screen.gt.lg"
                table-header-class="font-bold bg-blue-10 text-white" separator="cell" hide-bottom :loading="isLoading">
                <template v-slot:loading>
                  <q-inner-loading showing color="primary" />
                </template>
                <template v-slot:body-cell-fundEligibleName="props">
                  <q-td v-if="!props.row.isInput || isView" :props="props" class="text-center text-grey-9">
                    {{ props.row.fundEligibleName ?? "-" }}
                  </q-td>
                  <q-td v-else :props="props" class="text-grey-9">
                    <q-input class="font-14 font-regular" dense
                      v-model="model.claimByEligible[props.row.id - 1].fundEligibleName" outlined autocomplete="off"
                      hide-bottom-space :bottom-slots="false" color="dark" type="text"
                      :for="'input-fundEligibleName' + props.row.id" placeholder="">
                    </q-input>
                  </q-td>
                </template>
                <template v-slot:body-cell-fundEligible="props">
                  <q-td v-if="isView" :props="props" class="text-center text-grey-9">
                    {{ props.row.fundEligible ?? 0 }}
                  </q-td>
                  <q-td v-else :props="props" class="text-grey-9">
                    <q-input class="font-14 font-regular" dense
                      v-model="model.claimByEligible[props.row.id - 1].fundEligible" outlined autocomplete="off"
                      hide-bottom-space color="dark" type="number" :forId="'input-fundEligible' + props.row.id"
                      placeholder="0" :rules="[
                        (val) => (props.row.id === 2 && !val ? 'กรุณากรอกข้อมูลที่ต้องการเบิก' : true),
                        (val) => (props.row.id === 2 && isOverfundRemaining === 2 ? 'จำนวนที่ขอเบิกเกินจำนวนที่สามารถเบิกได้': true),
                        (val) => (props.row.id === 2 && isOverfundRemaining === 1 ? 'สามารถเบิกได้สูงสุด ' + remaining.perTimesRemaining + ' บาทต่อครั้ง': true),
                        (val) => (props.row.id === 2 && isOverfundRemaining === 3 ? 'คุณใช้จำนวนการเบิกครบแล้ว': true),
                        (val) => (props.row.id === 2 && isOverfundRemaining === 4 ? 'สามารถเบิกได้สูงสุด ' + fundEligibleSumValue + ' บาท': true),
                      ]">
                    </q-input>
                  </q-td>
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
              <p class="col-12 q-mb-none">1. ใบเสร็จรับเงิน</p>
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
          style="background : #BFBFBF;" label="ย้อนกลับ" no-caps :to="{ name: 'health_check_up_welfare_list' }" />
        <q-btn :disable="isValidate" id="button-draft"
          class="text-white font-medium bg-blue-9 text-white font-16 weight-8 q-px-lg" dense type="submit"
          label="บันทึกฉบับร่าง" no-caps @click="submit(1)" v-if="!isView && !isLoading" />
        <q-btn :disable="!canRequest || isValidate" id="button-approve"
          class="font-medium font-16 weight-8 text-white q-px-md" dense type="submit" style="background-color: #43a047"
          label="ส่งคำร้องขอ" no-caps @click="submit(2)" v-if="!isView && !isLoading" />
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
import Swal from "sweetalert2";
import { Notify } from "quasar";
import { formatDateThaiSlash, formatNumber } from "src/components/format";
import healthCheckUpWelfareService from "src/boot/service/healthCheckUpWelfareService";
import exportService from "src/boot/service/exportService";
import userManagementService from "src/boot/service/userManagementService";
import { outlinedDownload } from "@quasar/extras/material-icons-outlined";
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "src/stores/authStore";
import { textStatusColor } from "src/components/status";
import { remainingText } from "src/components/remaining";

defineOptions({
  name: "healthCheckUpWelfareEdit",
});
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const model = ref({
  createFor: null,
  fundReceipt: null,
  claimByEligible: [
    {
      fundEligible: null,
      fundEligibleName: null,
    },
    {
      fundEligible: null,
      fundEligibleName: null,
    },
    {
      fundEligible: null,
      fundEligibleName: null,
    }
  ],
});
const userData = ref({});
const remaining = ref({});
let options = ref([]);
const isLoading = ref(false);
const isError = ref({});
const canRequest = ref(false);
const isView = ref(false);
const userInitialData = ref([]);
const isEdit = computed(() => {
  return !isNaN(route.params.id);
});
const canCreateFor = computed(() => {
  return authStore.isEditor;
});

onMounted(async () => {
  await init();
  isLoading.value = false;
});

onBeforeUnmount(() => {
  model.value = null;
});
const isValidate = computed(() => {
  let validate = false;
  if (!model.value.fundReceipt) {
    validate = true;
  }
  if (!model.value.createFor && canCreateFor.value) {
    validate = true;
  }
  if (model.value.claimByEligible[2].fundEligible && !model.value.claimByEligible[2].fundEligibleName) {
    validate = true;
  }
  if (!model.value.claimByEligible[2].fundEligible && model.value.claimByEligible[2].fundEligibleName) {
    validate = true;
  }
  if (isOver.value) {
    validate = true;
  }
  if (isOverfundRemaining.value) {
    validate = true;
  }
  return validate;
});

const isOver = computed(() => {
  const fundEligibleSum = Number(model.value.fundReceipt) - (Number(model.value.claimByEligible[0].fundEligible) + Number(model.value.claimByEligible[2].fundEligible));
  return fundEligibleSum <= 0;
});

const fundEligibleSumValue = computed(() => {
  return Number(model.value.fundReceipt) - (Number(model.value.claimByEligible[0].fundEligible) + Number(model.value.claimByEligible[2].fundEligible));
});

const isOverfundRemaining = computed(() => {
  let check = false;
  const fundEligibleSum = Number(model.value.fundReceipt) - (Number(model.value.claimByEligible[0].fundEligible) + Number(model.value.claimByEligible[2].fundEligible));
  const perTimes = remaining.value.perTimesRemaining ? parseFloat(remaining.value.perTimesRemaining.replace(/,/g, "")) : null;
  const fundRemaining = remaining.value.fundRemaining ? parseFloat(remaining.value.fundRemaining.replace(/,/g, "")) : null;
  if (Number(model.value.claimByEligible[1].fundEligible) > fundRemaining && remaining.value.fundRemaining) {
    check = 2;
  }
  else if (Number(model.value.claimByEligible[1].fundEligible) > perTimes && remaining.value.perTimesRemaining) {
    check = 1;
  }
  else if (model.value.claimByEligible[1].fundEligible > fundEligibleSum) {
    return check = 4;
  }
  if (!canRequest.value && isFetchRemaining.value) {
    check = 3;
  }
  return check;
});


watch(
  () => model.value.claimByEligible,
  () => {
    if (!model.value.claimByEligible[2]?.fundEligible && !model.value.claimByEligible[2]?.fundEligibleName) return;
    setTimeout(async () => {
      try {
        if (model.value.claimByEligible[2]?.fundEligible && !model.value.claimByEligible[2]?.fundEligibleName) {
          Notify.create({
            message:
              "กรุณากรอกชื่อสิทธิ อื่น ๆ",
            position: "bottom-left",
            type: "negative",
          });
        }
        if (!model.value.claimByEligible[2]?.fundEligible && model.value.claimByEligible[2]?.fundEligibleName) {
          Notify.create({
            message:
              "กรุณากรอกจำนวนเงินที่เบิกตามสิทธิอื่น ๆ",
            position: "bottom-left",
            type: "negative",
          });
        }
      } catch (error) {
        Promise.reject(error);
      }
      isLoading.value = false;
    }, 2000);
    if (isOver.value) {
      isError.value.fundReceipt = "จำนวนตามใบเสร็จต้องมากกว่าเงินที่ได้รับจากสิทธิอื่น ๆ";
    }
    else {
      isError.value.fundReceipt = null;
    }
  },
  { deep: true }
);
watch(
  () => model.value.fundReceipt,
  (newValue) => {
    if (newValue !== null) {
      delete isError.value.fundReceipt;
    }
  }
);
watch(
  () => model.value.createFor,
  (newValue) => {
    try {
      if (canCreateFor.value) {
        if ((newValue !== null && newValue !== undefined) && !isView.value) {
          fetchRemaining();
          fetchUserData(newValue);
        }
      }
    }
    catch (error) {
      Notify.create({
        message:
          error?.response?.data?.message ??
          "ไม่พบข้อมูลสิทธิ์คงเหลือของผู้ใช้งาน",
        position: "bottom-left",
        type: "negative",
      });
    }
  }
);
async function fetchDataEdit() {
  setTimeout(async () => {
    try {
      const result = await healthCheckUpWelfareService.dataById(route.params.id);
      var returnedData = result.data.datas;
      if (returnedData) {
        model.value = {
          ...model,
          createFor: returnedData?.user.userId,
          reimNumber: returnedData?.reimNumber,
          requestDate: returnedData?.requestDate,
          status: returnedData?.status,
          fundReceipt: returnedData?.fundReceipt,
          fundSumRequest: returnedData?.fundSumRequest,
          claimByEligible: [
            {
              fundEligible: returnedData?.fundDecree,
            },
            {
              fundEligible: returnedData?.fundUniversity,
            },
            {
              fundEligible: returnedData?.fundEligible,
              fundEligibleName: returnedData?.fundEligibleName,
            }
          ],
        };
        userData.value = {
          name: returnedData?.user.name,
          position: returnedData?.user.position,
          employeeType: returnedData?.user.employeeType,
          sector: returnedData?.user.sector,
          department: returnedData?.user.department,
        };
        row.value[0].fundEligible = returnedData?.fundDecree;
        row.value[0].isInput = false;
        row.value[1].fundEligible = returnedData?.fundUniversity;
        row.value[1].isInput = false;
        row.value[2].isInput = true;
        row.value[2].fundEligible = returnedData?.fundEligible;
        row.value[2].fundEligibleName = returnedData?.fundEligibleName;
      }
    } catch (error) {
      router.replace({ name: "health_check_up_welfare_list" });
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
async function fetchUserData(id) {
  try {
    const result = await userManagementService.dataById(id);
    var returnedData = result.data.datas;
    if (returnedData) {
      userData.value = {
        name: returnedData?.name,
        position: returnedData?.position.name,
        employeeType: returnedData?.employeeType.name,
        sector: returnedData?.sector.name,
        department: returnedData?.department.name,
      };
    }
  }
  catch (error) {
    Promise.reject(error);
  }
}
const isFetchRemaining = ref(false);
async function fetchRemaining() {
  try {
    const fetchRemaining = await healthCheckUpWelfareService.getRemaining({ createFor: model.value.createFor });
    if (fetchRemaining.data?.datas?.requestsRemaining != null && !isNaN(Number(fetchRemaining.data?.datas?.requestsRemaining))) {
      remaining.value.requestsRemaining = formatNumber(fetchRemaining.data?.datas?.requestsRemaining);
    }
    if (fetchRemaining.data?.datas?.fundRemaining != null && !isNaN(Number(fetchRemaining.data?.datas?.fundRemaining))) {
      remaining.value.fundRemaining = formatNumber(fetchRemaining.data?.datas?.fundRemaining);
    }
    if (fetchRemaining.data?.datas?.perTimesRemaining != null && !isNaN(Number(fetchRemaining.data?.datas?.perTimesRemaining))) {
      remaining.value.perTimesRemaining = formatNumber(fetchRemaining.data?.datas?.perTimesRemaining);
    }
    if (fetchRemaining.data?.datas?.categoryName != null) {
      remaining.value.categoryName = fetchRemaining.data?.datas?.categoryName;
    }
    canRequest.value = fetchRemaining.data?.canRequest;
    isFetchRemaining.value = true;
  } catch (error) {
    Promise.reject(error);
  }
}
async function downloadData() {
  const notify = Notify.create({
    message: "กรุณารอสักครู่ ระบบกำลังทำการดาวน์โหลด",
    position: "top-right",
    spinner: true,
    type: 'info',
  });
  try {
    const result = await exportService.healthCheckup(route.params.id);
    let filename = null;
    const contentDisposition = result.headers["content-disposition"];
    if (contentDisposition) {
      const matches = contentDisposition.match(/filename="?([^"]+)"?/);
      if (matches && matches[1]) {
        filename = decodeURIComponent(matches[1]);
      }
    }

    const blob = new Blob([result.data], { type: "application/pdf" });

    const a = document.createElement("a");
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
  catch (error) {
    console.log(error);
    Notify.create({
      message:
        error?.response?.data?.message ??
        "ดาวน์โหลดไม่สำเร็จกรุณาลองอีกครั้ง",
      position: "top-right",
      type: "primary",
    });
  }
  finally {
    notify();
  }
}
async function filterFn(val, update) {
  try {
    setTimeout(async () => {

      update(() => {
        if (val === '') {
          options.value = userInitialData.value;
        }
        else {
          options.value = userInitialData.value.filter(v => v.name.includes(val));
        }
      });
    }, 650);

  }
  catch (error) {
    Promise.reject(error);
  }
}
function abortFilterFn() {
  // console.log('delayed filter aborted')
}

async function submit(actionId) {
  let validate = false;
  if (!model.value.fundReceipt) {
    isError.value.fundReceipt = "กรุณากรอกข้อมูลจำนวนเงินตามใบเสร็จ";
    let navigate = document.getElementById("fund");
    window.location.hash = "fund";
    navigate.scrollIntoView(false);
    validate = true;
  }
  if (!model.value.createFor && canCreateFor.value) {
    isError.value.createFor = "โปรดเลือกผู้ใช้งาน";
    let navigate = document.getElementById("selected-user");
    window.location.hash = "selected-user";
    navigate.scrollIntoView(false);
    validate = true;
  }
  if (model.value.claimByEligible[2].fundEligible && !model.value.claimByEligible[2].fundEligibleName) {
    validate = true;
  }
  if (!model.value.claimByEligible[2].fundEligible && model.value.claimByEligible[2].fundEligibleName) {
    validate = true;
  }
  if (isOverfundRemaining.value) {
    if (isOverfundRemaining.value === 2) {
      isError.value.fundEligible = "จำนวนที่ขอเบิกเกินจำนวนที่สามารถเบิกได้";
    }
    else if (isOverfundRemaining.value === 1) {
      isError.value.fundEligible = "สามารถเบิกได้สูงสุด " + remaining.value.perTimesRemaining + " บาทต่อครั้ง";
    }
    else {
      isError.value.fundEligible = "คุณใช้จำนวนการเบิกครบแล้ว";
    }
    validate = true;
  }
  if (isOver.value) {
    isError.value.fundReceipt = "จำนวนเงินตามใบเสร็จต้องมากกว่าเงินที่ได้รับจากสิทธิอื่น ๆ";
    validate = true;
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
    fundReceipt: model.value.fundReceipt,
    fundDecree: model.value.claimByEligible[0].fundEligible,
    fundUniversity: model.value.claimByEligible[1].fundEligible,
    fundEligible: model.value.claimByEligible[2].fundEligible,
    fundEligibleName: model.value.claimByEligible[2].fundEligibleName,
    createFor: canCreateFor.value ? model.value.createFor : null,
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
          fetch = await healthCheckUpWelfareService.update(route.params.id, payload);
        }
        else {
          fetch = await healthCheckUpWelfareService.create(payload);
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
        router.replace({ name: "health_check_up_welfare_list" });
      });
    }
  });
}
async function init() {
  isView.value = route.meta.isView;
  isLoading.value = true;
  try {
    if (isView.value) {
      fetchDataEdit();
    }
    else if (isEdit.value) {
      if (!canCreateFor.value) {
        fetchRemaining();
      }
      const result = await userManagementService.getUserInitialData({ keyword: null });
      userInitialData.value = result.data.datas;
      options.value = result.data.datas;
      fetchDataEdit();
    }
    else {
      if (!canCreateFor.value) {
        fetchRemaining();
        fetchUserData(authStore.id);
      }
      else {
        const result = await userManagementService.getUserInitialData({ keyword: null });
        userInitialData.value = result.data.datas;
      }
    }
  }
  catch (error) {
    Promise.reject(error);
  }
  isLoading.value = false;
}
const columns = ref([
  {
    name: "fundEligibleName",
    label: "ชื่อสิทธิ",
    align: "left",
    field: (row) => row.fundEligibleName ?? "-",
    format: (val) => `${val}`,
    classes: "ellipsis",
  },
  {
    name: "fundEligible",
    label: "จำนวนเงิน (บาท)",
    align: "right",
    field: (row) => row.fundEligible ?? "-",
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
const row = ref([
  {
    id: 1,
    isInput: false,
    fundEligibleName: 'ได้รับเงินจากสิทธิที่เบิกได้ตามพระราชกฤษฎีกาเงินสวัสดิการเกี่ยวกับการรักษาพยาบาล',
    fundEligible: null,
  },
  {
    id: 2,
    isInput: false,
    fundEligibleName: 'เบิกได้ตามประกาศสวัสดิการคณะกรรมการสวัสดิการ มหาวิทยาลัยบูรพา',
    fundEligible: null,
  },
  {
    id: 3,
    isInput: true,
    fundEligibleName: null,
    fundEligible: null,
  },
]);
</script>
