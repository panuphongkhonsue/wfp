<template>
  <PageLayout title="เบิกสวัสดิการค่าสงเคราะห์การเสียชีวิต">
    <template v-slot:page>
      <!--General Information Section -->
      <div class="row q-col-gutter-md q-pl-md q-pt-md">
        <div :class="{ 'col-12': isView || isLoading, 'col-md-9 col-12': !isView && !isLoading }">
          <q-card flat bordered class="full-height">
            <q-card-section class="font-18 font-bold">
              <p class="q-mb-none">ข้อมูลผู้เบิกสวัสดิการ</p>
            </q-card-section>
            <q-separator />
            <q-card-section class="row wrap q-col-gutter-y-md q-pb-sm font-16 font-bold"
              :class="canCreateFor && !isView ? 'items-center' : ''">
              <div class="col-lg-5 col-xl-4 col-12 row q-gutter-y-md q-pr-sm"
                :class="canCreateFor && !isView ? 'items-center' : ''">
                <p class="col-auto q-mb-none">
                  ชื่อ-นามสกุล : <span v-show="!canCreateFor || isView" class="font-medium font-16 text-grey-7">{{
                    userData?.name ?? "-" }}</span>
                </p>
                <q-select v-if="canCreateFor && !isView" popup-content-class="font-14 font-regular" :loading="isLoading"
                  id="selected-status" class="col-lg q-px-lg-md col-12 font-regular" outlined for="selected-user"
                  v-model="model.createFor" :options="options" dense option-value="id" emit-value map-options
                  option-label="name" @filter="filterFn" use-input input-debounce="100" hide-bottom-space
                  :clearable="true" :error="!!isError?.createFor" :rules="[(val) => !!val || '']"
                  @filter-abort="abortFilterFn">
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

        <div class="col-md-3 col-12" v-if="!isView && !isLoading">
          <q-card flat bordered class="full-height">
            <q-card-section class="q-px-md q-py-md font-18 font-bold">
              <p class="q-mb-none">สิทธิ์คงเหลือ</p>
            </q-card-section>
            <q-separator />
            <q-card-section class="row wrap q-col-gutter-y-md font-medium font-16 text-grey-7">
              <p class="col-12 q-mb-none">
                เบิกได้สูงสุดไม่เกิน :
                <span v-if="remaining[9]?.perTimesRemaining !== null">
                  {{ remaining[9]?.fundRemaining ? remaining[9]?.fundRemaining + " บาทต่อปี" :
                  remaining[9]?.perTimesRemaining ? remaining[9]?.perTimesRemaining + " บาทต่อครั้ง" :
                    "ไม่จำกัดจำนวนเงิน"
                }}</span>
                <span v-else>กรุณาเลือกผู้เสียชีวิต</span>
              </p>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Request Section -->
      <div class="row q-col-gutter-md q-pl-md q-pt-md">
        <div class="col-md-9 col-12">
          <q-card flat bordered class="full-height">
            <q-card-section class="col row flex justify-between q-pb-none">
              <div class="row">
                <p class="q-pb-md font-18 font-bold q-pb-md">ข้อมูลการเบิกสวัสดิการ</p>
                <p class="q-pl-md q-pb-md font-16 q-mb-none">(จ่ายไม่เกินคนละ {{ remaining[9]?.fund ? remaining[9]?.fund + " บาท" :
                  remaining[9]?.perTimesRemaining ? remaining[9]?.perTimesRemaining + " บาท" :
                    "กรุณาเลือกผู้เสียชีวิต" }})</p>
              </div>

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
              <p class="col-md-4 col-12 q-mb-none">สถานะ : {{ model.status ?? "-" }}</p>
            </q-card-section>
            <q-card-section class="row wrap q-col-gutter-y-md q-px-md q-py-md font-medium font-16 text-grey-9">
              <div class="col-lg-5 col-xl-4 col-12 q-mb-none q-pr-lg-xl">
                <InputGroup label="ชื่อ - นามสกุล" is-require :is-view="isView" :data="isView ? deceasedName : null">
                  <q-select v-model="model.deceased" :options="filteredOptions" :loading="isLoading" :clearable="true"
                    emit-value map-options option-value="id" option-label="name" :rules="[(val) => !!val || '']" dense
                    outlined use-input hide-selected fill-input input-debounce="100" hide-bottom-space
                    :error="!!isError?.deceased" @filter="filterFn" @filter-abort="abortFilterFn" />
                </InputGroup>
              </div>
              <q-card-section class="col-lg-7 col-12 row justify-around q-pt-none">
                <q-card-section class="col-12 row justify-around q-pt-none">
                  <div class="col-md-4 col-lg-4 col-xl-4 col-12 q-mb-none q-pt-md">
                    <InputGroup is-dense :data="positionName" label="ตำแหน่ง :" placeholder="" type="text" class=""
                      :is-view="true">
                    </InputGroup>
                  </div>
                  <div class="col-md-4 col-lg-4 col-xl-4 col-12 q-mb-none q-pt-md">
                    <InputGroup is-dense :data="sectorName" label="ภาควิชา :" placeholder="" type="text" class=""
                      :is-view="true">
                    </InputGroup>
                  </div>
                  <div class="col-md-4 col-lg-4 col-xl-4 col-12 q-mb-none q-pt-md text-black">
                    <InputGroup is-dense :data="departmentName" label="ส่วนงาน :" placeholder="" type="text" class=""
                      :is-view="true">
                    </InputGroup>
                  </div>
                </q-card-section>
              </q-card-section>
            </q-card-section>
            <q-card-section class="row wrap font-medium font-16 text-grey-9 q-pt-none">
              <div class="col-lg-5 col-xl-4 col-12 q-pr-lg-xl ">
                <InputGroup for-id="fund" is-dense v-model="model.organizer" :data="model.organizer ?? '-'" is-require
                  label="จ่ายให้กับผู้จัดการงานศพ" placeholder="ชื่อ-นามสกุล" type="text" class="" :is-view="isView"
                  :rules="[(val) => !!val || 'กรุณากรอกข้อมูลชื่อ - นามสกุลของผู้จัดการงานศพ']">
                </InputGroup>
              </div>
              <div class="col-lg-5 col-xl-4 col-12 q-pr-lg-xl  ">
                <InputGroup for-id="fund-receipt" is-dense v-model="model.fundReceipt" :data="model.fundReceipt ?? '-'"
                  is-require label="จำนวนเงินตามใบสำคัญรับเงิน (บาท)" placeholder="บาท" type="number" class="q-py-xs-md q-py-lg-none"
                  :is-view="isView" :rules="[(val) => !!val || 'กรุณากรอกข้อมูลจำนวนเงินตามใบสำคัญรับเงิน']"
                  :error-message="isError?.fundReceipt" :error="!!isError?.fundReceipt">
                </InputGroup>
              </div>
              <div class="col-lg-5 col-xl-4 col-12 q-pr-lg-xl ">
                <InputGroup for-id="fund-request" is-dense v-model="model.fundRequest" :data="model.fundRequest ?? '-'"
                  is-require label="จำนวนเงินที่ต้องการเบิก (บาท)" placeholder="บาท" type="number" class=""
                  :is-view="isView"  :rules="[(val) => !!val || 'กรุณากรอกข้อมูลจำนวนเงินที่ต้องการเบิก', (val) => !isOverRequest || 'จำนวนเงินที่ต้องการเบิกห้ามมากว่าจำนวนเงินตามใบเสร็จ'
                    , (val) => isOverfundRemaining !== 2 || 'จำนวนที่ขอเบิกเกินจำนวนที่สามารถเบิกได้', (val) => !isOverfundRemaining || 'สามารถเบิกได้สูงสุด ' + remaining[9].perTimesRemaining + ' บาทต่อครั้ง']"
                  :error-message="isError?.fundRequest" :error="!!isError?.fundRequest">
                </InputGroup>
              </div>
            </q-card-section>
            <q-card-section class="row wrap q-pt-none font-medium q-pb-xs font-16 text-grey-9 items-center "
              :class="isView ? '' : 'q-pl-sm '">
              <q-checkbox v-model="model.selectedWreath" v-if="!isView" />
              <p class="q-pb-md q-mb-none ">ค่าสนับสนุนค่าพวงหรีด (จ่ายไม่เกินคนละ {{ remaining[10]?.fund ? remaining[10]?.fund
                + " บาท" : remaining[10]?.perTimesRemaining ? remaining[10]?.perTimesRemaining + " บาท" : "กรุณาเลือกผู้เสียชีวิต" }}
                ในนามมหาวิทยาลัย และไม่เกิน
                {{ remaining[11]?.fund ? remaining[11]?.fund
                + " บาท" : remaining[11]?.perTimesRemaining ? remaining[11]?.perTimesRemaining + " บาท" : "กรุณาเลือกผู้เสียชีวิต" }} ในนามส่วนงาน)</p>
            </q-card-section>
            <q-card-section class="row wrap font-medium font-16 text-grey-9 q-pt-none q-pb-none q-pb-sm">
              <div class="col-lg-5 col-xl-4 col-12 q-pr-lg-xl ">
                <InputGroup for-id="fund-wreath-receipt" is-dense v-model="model.fundReceiptWreath"
                  :data="model.fundReceiptWreath ?? '-'" is-require label="จำนวนเงินตามใบสำคัญรับเงิน (บาท)"
                  placeholder="บาท" type="number" class="" :is-view="isView" :disable="!model.selectedWreath"
                  :rules="[(val) => !!val || 'กรุณากรอกข้อมูลจำนวนเงินตามใบสำคัญรับเงิน']"
                  :error-message="isError?.fundReceiptWreath" :error="!!isError?.fundReceiptWreath">
                </InputGroup>
              </div>
              <div class="col-lg-5 col-xl-4 col-12 q-pr-lg-xl ">
                <InputGroup for-id="fund-wreath-arrange" is-dense v-model="model.fundWreathArrange"
                  :data="model.fundWreathArrange ?? '-'" label="จำนวนเงินที่ต้องการเบิก (บาท) (ในนามส่วนงาน)"
                  placeholder="บาท" type="number" class="q-py-xs-md q-py-lg-none" :is-view="isView" :disable="!model.selectedWreath" :rules="[(val) => !!val || 'กรุณากรอกข้อมูลจำนวนที่ต้องการเบิก',
                  (val) => model.selectedWreath && !isOverWreathArrange || 'จำนวนเงินที่ต้องการเบิกห้ามมากว่าจำนวนเงินตามใบเสร็จ',
                    , (val) => isOverfundRemainingWreathArrange !== 2 || 'จำนวนที่ขอเบิกเกินจำนวนที่สามารถเบิกได้', (val) => !isOverfundRemainingWreathArrange || 'สามารถเบิกได้สูงสุด ' + remaining[10]?.perTimesRemaining + ' บาทต่อครั้ง'
                  ]" :error-message="isError?.fundWreathArrange" :error="!!isError?.fundWreathArrange">
                </InputGroup>
              </div>
              <div class="col-lg-5 col-xl-4 col-12 q-pr-lg-xl">
                <InputGroup for-id="fund-wreath-university" is-dense v-model="model.fundWreathUniversity"
                  :data="model.fundWreathUniversity ?? '-'" label="จำนวนเงินที่ต้องการเบิก (บาท) (ในนามมหาวิทยาลัย)"
                  placeholder="บาท" type="number" class="" :is-view="isView" style="white-space: nowrap;"
                  :disable="!model.selectedWreath" :rules="[(val) => !!val || 'กรุณากรอกข้อมูลจำนวนที่ต้องการเบิก',
                  (val) => model.selectedWreath && !isOverWreathUniversity || 'จำนวนเงินที่ต้องการเบิกห้ามมากว่าจำนวนเงินตามใบเสร็จ',
                    , (val) => isOverfundRemainingWreathUniversity !== 2 || 'จำนวนที่ขอเบิกเกินจำนวนที่สามารถเบิกได้', (val) => !isOverfundRemainingWreathUniversity || 'สามารถเบิกได้สูงสุด ' + remaining[11]?.perTimesRemaining + ' บาทต่อครั้ง'
                  ]" :error-message="isError?.fundWreathUniversity" :error="!!isError?.fundWreathUniversity">
                </InputGroup>
              </div>
            </q-card-section>
            <q-separator inset />

            <q-card-section class="row wrap font-medium q-pb-xs font-16 text-grey-9 items-center"
              :class="isView ? '' : 'q-pl-sm'">
              <q-checkbox v-if="!isView" v-model="model.selectedVehicle" />
              <p class="q-pb-md q-mb-none">ค่าสนับสนุนค่าพาหนะเหมาจ่าย (จ่ายจริงคนละไม่เกิน
                {{ remaining[12]?.fund ? remaining[12]?.fund
                + " บาท" : remaining[12]?.perTimesRemaining ? remaining[12]?.perTimesRemaining + " บาท" : "กรุณาเลือกผู้เสียชีวิต" }})</p>
            </q-card-section>

            <q-card-section class="row wrap font-medium font-16 text-grey-9 q-pt-none q-pb-sm">
              <div class="col-lg-5 col-xl-4 col-12 q-pr-lg-xl ">
                <InputGroup for-id="fund" is-dense v-model="model.fundReceiptVehicle"
                  :data="model.fundReceiptVehicle ?? '-'" is-require label="จำนวนเงินตามใบสำคัญรับเงิน (บาท)"
                  placeholder="บาท" type="number" class="" :is-view="isView" :disable="!model.selectedVehicle"
                  :rules="[(val) => !!val || 'กรุณากรอกข้อมูลจำนวนเงินตามใบสำคัญรับเงิน']"
                  :error-message="isError?.fundReceiptVehicle" :error="!!isError?.fundReceiptVehicle">
                </InputGroup>
              </div>
              <div class="col-lg-5 col-xl-4 col-12 q-pr-lg-xl">
                <InputGroup for-id="fund" is-dense v-model="model.fundVehicle" :data="model.fundVehicle ?? '-'"
                  is-require label="จำนวนเงินที่ต้องการเบิก (บาท)" placeholder="บาท" type="number" class="q-py-xs-md q-py-lg-none"
                  :is-view="isView" :disable="!model.selectedVehicle" :rules="[(val) => !!val || 'กรุณากรอกข้อมูลจำนวนที่ต้องการเบิก',
                  (val) => model.selectedVehicle && !isOverVehicle || 'จำนวนเงินที่ต้องการเบิกห้ามมากว่าจำนวนเงินตามใบเสร็จ',
                    , (val) => isOverfundRemainingVehicle !== 2 || 'จำนวนที่ขอเบิกเกินจำนวนที่สามารถเบิกได้', (val) => !isOverfundRemainingVehicle || 'สามารถเบิกได้สูงสุด ' + remaining[12]?.perTimesRemaining + ' บาทต่อครั้ง'
                  ]" :error-message="isError?.fundVehicle" :error="!!isError?.fundVehicle">
                </InputGroup>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-md-3 col-12">
          <q-card flat bordered class="full-height">
            <q-card-section class="q-px-md q-pt-md q-pb-md font-18 font-bold">
              <p class="q-mb-none">หลักฐานที่ต้องแนบ</p>
            </q-card-section>
            <q-separator />
            <q-card-section class="row wrap q-col-gutter-y-md q-px-md q-py-md font-medium font-16 text-grey-9">
              <p class="col-12 q-mb-none font-bold text-black font-18">ของผู้เสียชีวิต</p>
              <p class="col-12 q-mb-none">1. สำเนาใบมรณะบัตรผู้ปฏิบัติงาน</p>
              <p class="col-12 q-mb-none">2. สำเนาบัตรประจำตัวประชาชนผู้จัดการงานศพ</p>
              <p class="col-12 q-mb-none">3. ใบสำคัญรับเงินโดยผู้จัดการงานศพพร้อมคำรับรองการเป็นผู้จัดการงานศพ</p>
              <p class="col-12 q-mb-none font-bold text-black font-18">ค่าสนับสนุนค่าพวงหรีด</p>
              <p class="col-12 q-mb-none">1. ใบเสร็จรับเงิน</p>
              <p class="col-12 q-mb-none">2. ใบสำคัญรับเงิน
                (โดยเจ้าหน้าที่ผู้รับผิดชอบ
                ด้านบุคคล ลงนามรับเงิน)
              </p>
              <p class="col-12 q-mb-none font-bold text-black font-18">ค่าสนับสนุนค่าพาหนะเหมาจ่าย</p>
              <p class="col-12 q-mb-none">1. ใบสำคัญรับเงิน
                (โดยเจ้าหน้าที่ผู้รับผิดชอบ
                ด้านบุคคล ลงนามรับเงิน)
              </p>
              <p class="col-12 q-mb-none">2.ใบสำคัญรับเงินรับเงินหรือหลักฐานการจ่ายเงินอื่น</p>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </template>
    <!--Action Slot -->
    <template v-slot:action>
      <div class="justify-end row q-py-xs font-medium q-gutter-lg">
        <q-btn id="button-back" class="text-white font-medium font-16 weight-8 q-px-lg" dense type="button"
          style="background : #BFBFBF;" label="ย้อนกลับ" no-caps :to="{ name: 'funeral_welfare_list' }" />
        <q-btn :disable="isValidate" id="button-draft"
          class="text-white font-medium bg-blue-9 text-white font-16 weight-8 q-px-lg" dense type="submit"
          label="บันทึกฉบับร่าง" no-caps @click="submit(1)" v-if="!isView && !isLoading" />
        <q-btn :disable="isValidate" id="button-approve" class="font-medium font-16 weight-8 text-white q-px-md" dense
          type="submit" style="background-color: #43a047" label="ส่งคำร้องขอ" no-caps @click="submit(2)"
          v-if="!isView && !isLoading" />
      </div>
    </template>
  </PageLayout>
</template>
<script setup>
import PageLayout from "src/layouts/PageLayout.vue";
import InputGroup from "src/components/InputGroup.vue";
import Swal from "sweetalert2";
import { Notify } from "quasar";
import { formatDateThaiSlash, formatNumber } from "src/components/format";
import userManagementService from "src/boot/service/userManagementService";
import { outlinedDownload } from "@quasar/extras/material-icons-outlined";
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "src/stores/authStore";
import funeralWelfareEmployeeDeceasedService from "src/boot/service/funeralWelfareEmployeeDeceasedService";
import exportService from "src/boot/service/exportService";
defineOptions({
  name: "funeral_welfare_edit",
});
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const model = ref({
  createFor: null,
  fundReceipt: null,
  fundRequest: null,
  deceased: null,
  organizer: null,
  fundReceiptWreath: null,
  fundWreathUniversity: null,
  fundWreathArrange: null,
  fundReceiptVehicle: null,
  fundVehicle: null,
  selectedWreath: false,
  selectedVehicle: false,
});
const options = ref([]);
const deceasedName = computed(() => {
  if (isView.value && model.value.deceased) {
    const found = options.value.find(option => option.id === model.value.deceased);
    return found ? found.name : "-";
  }
  return "";
});
const selectedUserData = computed(() => {
  if (!model.value.deceased) return {};

  const found = options.value.find(option => option.id === model.value.deceased);
  return found || {};
});

const positionName = computed(() => {
  return selectedUserData.value?.position ?? "-";
});

const sectorName = computed(() => {
  return selectedUserData.value?.sector ?? "-";
});

const departmentName = computed(() => {
  return selectedUserData.value?.department ?? "-";
});
const isDeceasedClaimed = computed(() => {
  return remaining.value[9]?.requestsRemaining === 0;
});
const claimedUsers = ref([]);
const isError = ref({});
const remaining = ref({});
const isView = ref(false);
const isLoading = ref(false);
const userData = ref({});
const canRequest = ref({
  wreath: false,
  vehicle: false,
});
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
const filteredOptions = computed(() => {
  return options.value.filter((option) => {
    return !hasClaimed(option.id);
  });
});

function hasClaimed(userId) {
  const userClaims = claimedUsers.value;
  return userClaims.includes(userId);
}

const isValidate = computed(() => {
  let validate = false;
  if (!model.value.selectedWreath && !model.value.selectedVehicle && !model.value.deceased) {
    validate = true;
  }
  if (model.value.deceased) {
    if (!model.value.organizer) {
      validate = true;
    }
    if (!model.value.fundReceipt) {
      validate = true;
    }
    if (!model.value.fundRequest) {
      validate = true;
    }
  }
  if (isOverfundRemaining.value) {
    validate = true;
  }
  if (isOverRequest.value) {
    validate = true;
  }
  if (model.value.selectedWreath) {
    if (!model.value.fundReceiptWreath) {
      validate = true;
    }
    if (!model.value.fundWreathArrange) {
      validate = true;
    }
    if (!model.value.fundWreathUniversity) {
      validate = true;
    }
    if (isOverWreathArrange.value) {
      validate = true;
    }
    if (isOverWreathUniversity.value) {
      validate = true;
    }
    if (isOverfundRemainingWreathArrange.value) {
      validate = true;
    }
    if (isOverfundRemainingWreathUniversity.value) {
      validate = true;
    }
  }
  if (model.value.selectedVehicle) {
    if (!model.value.fundReceiptVehicle) {
      validate = true;
    }
    if (!model.value.fundVehicle) {
      validate = true;
    }
    if (isOverVehicle.value) {
      validate = true;
    }
    if (isOverfundRemainingVehicle.value) {
      validate = true;
    }
  }
  if (!model.value.createFor && canCreateFor.value) {
    validate = true;
  }
  return validate;
});
const isOverfundRemaining = computed(() => {
  const fundSumRequest = Number(model.value.fundRequest ?? 0);
  const perTimes = remaining.value[9]?.perTimesRemaining ? parseFloat(remaining.value[9]?.perTimesRemaining.replace(/,/g, "")) : null;
  const fundRemaining = remaining.value[9]?.fundRemaining ? parseFloat(remaining.value[9]?.fundRemaining.replace(/,/g, "")) : null;
  let check = false;
  if (Number(fundSumRequest) > perTimes && remaining.value[9]?.perTimesRemaining) {
    check = 1;
  }
  if (Number(fundSumRequest) > fundRemaining && remaining.value[9]?.fundRemaining) {
    check = 2;
  }
  return check;
});
const isOverfundRemainingWreathArrange = computed(() => {
  const fundSumRequest = Number(model.value.fundWreathArrange ?? 0);
  const perTimes = remaining.value[10]?.perTimesRemaining ? parseFloat(remaining.value[10]?.perTimesRemaining.replace(/,/g, "")) : null;
  const fundRemaining = remaining.value[10]?.fundRemaining ? parseFloat(remaining.value[10]?.fundRemaining.replace(/,/g, "")) : null;
  let check = false;
  if (Number(fundSumRequest) > perTimes && remaining.value[10]?.perTimesRemaining) {
    check = 1;
  }
  if (Number(fundSumRequest) > fundRemaining && remaining.value[10]?.fundRemaining) {
    check = 2;
  }
  return check;
});

const isOverfundRemainingWreathUniversity = computed(() => {
  const fundSumRequest = Number(model.value.fundWreathUniversity ?? 0);
  const perTimes = remaining.value[11]?.perTimesRemaining ? parseFloat(remaining.value[11]?.perTimesRemaining.replace(/,/g, "")) : null;
  const fundRemaining = remaining.value[11]?.fundRemaining ? parseFloat(remaining.value[11]?.fundRemaining.replace(/,/g, "")) : null;
  let check = false;
  if (Number(fundSumRequest) > perTimes && remaining.value[11]?.perTimesRemaining) {
    check = 1;
  }
  if (Number(fundSumRequest) > fundRemaining && remaining.value[11]?.fundRemaining) {
    check = 2;
  }
  return check;
});

const isOverfundRemainingVehicle = computed(() => {
  const fundSumRequest = Number(model.value.fundVehicle ?? 0);
  const perTimes = remaining.value[12]?.perTimesRemaining ? parseFloat(remaining.value[12]?.perTimesRemaining.replace(/,/g, "")) : null;
  const fundRemaining = remaining.value[12]?.fundRemaining ? parseFloat(remaining.value[12]?.fundRemaining.replace(/,/g, "")) : null;
  let check = false;
  if (Number(fundSumRequest) > perTimes && remaining.value[12]?.perTimesRemaining) {
    check = 1;
  }
  if (Number(fundSumRequest) > fundRemaining && remaining.value[12]?.fundRemaining) {
    check = 2;
  }
  return check;
});

const isOverRequest = computed(() => {
  return Number(model.value.fundRequest) > Number(model.value.fundReceipt);
});
const isOverWreathArrange = computed(() => {
  return Number(model.value.fundWreathArrange) > Number(model.value.fundReceiptWreath);
});
const isOverWreathUniversity = computed(() => {
  return Number(model.value.fundWreathUniversity) > Number(model.value.fundReceiptWreath);
});
const isOverVehicle = computed(() => {
  return Number(model.value.fundVehicle) > Number(model.value.fundReceiptVehicle);
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
  () => model.value.createFor,
  (newValue) => {
    try {
      if (canCreateFor.value) {
        if ((newValue !== null && newValue !== undefined) && !isView.value) {
          // fetchRemaining();
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
watch(
  () => model.value.selectedWreath,
  (newValue) => {
    if (!newValue) {
      model.value.fundReceiptWreath = null;
      model.value.fundWreathUniversity = null;
      model.value.fundWreathArrange = null;

    }
  }
);
watch(
  () => model.value.selectedVehicle,
  (newValue) => {
    if (!newValue) {
      model.value.fundReceiptVehicle = null;
      model.value.fundVehicle = null;
    }
  }
);
async function downloadData() {
  const notify = Notify.create({
    message: "กรุณารอสักครู่ ระบบกำลังทำการดาวน์โหลด",
    position: "top-right",
    spinner: true,
    type: 'info',
  });
  try {
    const result = await exportService.funeralDeceaseEmployee(route.params.id);
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
async function fetchDeceasedName() {
  if (!model.value.deceased) {
    console.warn("No deceased ID found!");
    return;
  }

  try {
    const response = await userManagementService.dataById(model.value.deceased);
    const deceasedData = response.data.datas;
    if (deceasedData) {
      const newDeceased = {
        id: deceasedData.id,
        name: deceasedData.name,
        position: deceasedData.position?.name ?? "-",
        sector: deceasedData.sector?.name ?? "-",
        department: deceasedData.department?.name ?? "-",
      };

      options.value = [newDeceased, ...options.value];
      model.value.deceased = deceasedData.id;
    }
  } catch (error) {
    console.error("Error fetching deceased name:", error);
  }
}
watch(
  () => model.value.deceased,
  async (newValue) => {
    if (newValue) {
      await fetchRemaining(newValue);
    } else {
      resetRemaining();
    }
  }
);
async function resetRemaining() {
  remaining.value = {
    9: { perTimesRemaining: null },
  };
}
async function fetchDataEdit() {
  setTimeout(async () => {
    try {
      const result = await funeralWelfareEmployeeDeceasedService.dataById(route.params.id);
      var returnedData = result.data.datas;
      if (returnedData) {
        model.value = {
          ...model,
          createFor: returnedData?.user.userId,
          reimNumber: returnedData?.reimNumber,
          requestDate: returnedData?.requestDate,
          selectedWreath: returnedData?.fundWreathUniversity && returnedData?.fundWreathArrange ? true : false,
          selectedVehicle: returnedData?.fundVehicle ? true : false,
          status: returnedData?.status,
          organizer: returnedData?.organizer,
          deceased: returnedData?.deceased ?? null,
          fundReceipt: returnedData?.fundReceipt,
          fundRequest: returnedData?.fundRequest,
          fundReceiptWreath: returnedData?.fundReceiptWreath,
          fundWreathArrange: returnedData?.fundWreathArrange,
          fundWreathUniversity: returnedData?.fundWreathUniversity,
          fundReceiptVehicle: returnedData?.fundReceiptVehicle,
          fundVehicle: returnedData?.fundVehicle,
        };
        userData.value = {
          name: returnedData?.user.name,
          position: returnedData?.user.position,
          employeeType: returnedData?.user.employeeType,
          sector: returnedData?.user.sector,
          department: returnedData?.user.department,
        };
        if (model.value.deceased) {
          await fetchDeceasedName();
        }
      }
    } catch (error) {
      router.replace({ name: "funeral_welfare_list" });
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
async function fetchRemaining(deceasedId) {
  try {
    const fetchedData = await funeralWelfareEmployeeDeceasedService.getRemaining({
      createFor: model.value.createFor,
      deceasedId: deceasedId,
    });

    const deceaseData = fetchedData.data?.datas;

    // กำหนด canRequest สำหรับแต่ละประเภท
    canRequest.value.wreath = deceaseData.some(item => item.subCategoriesId === 7 || item.subCategoriesId === 8);
    canRequest.value.vehicle = deceaseData.some(item => item.subCategoriesId === 9);

    // ตรวจสอบและอัปเดต remaining สำหรับแต่ละ subCategoriesId
    if (Array.isArray(deceaseData)) {
      deceaseData.forEach((item) => {
        remaining.value[item.categoriesId] = {
          perTimesRemaining: formatNumber(item.perTimesRemaining) ?? null,
        };
      });
    }


  } catch (error) {
    console.error("Error fetching remaining data:", error);
    Notify.create({
      message: error?.message ?? "เกิดข้อผิดพลาดในการดึงข้อมูลสิทธิ์คงเหลือ",
      position: "bottom-left",
      type: "negative",
    });
  }
}



async function filterFn(val, update) {
  try {
    setTimeout(async () => {
      if (userInitialData.value.length === 0) {
        const result = await userManagementService.getUserInitialData({ keyword: null });
        userInitialData.value = result.data.datas;
      }

      update(() => {
        if (val === '') {
          options.value = userInitialData.value;
        } else {
          options.value = userInitialData.value.filter(v => v.name.includes(val));
        }
      });
    }, 650);
  } catch (error) {
    Promise.reject(error);
  }
}


function abortFilterFn() {
  // console.log('delayed filter aborted')
}
async function submit(actionId) {
  let validate = false;
  if (!model.value.selectedWreath && !model.value.selectedVehicle && !model.value.deceased) {
    Notify.create({
      message: "กรุณากรอกสวัสดิการที่ต้องการเบิก",
      position: "bottom-left",
      type: "negative",
    });
    return;
  }
  if (model.value.deceased) {
    if (!model.value.deceased) {
      isError.value.deceased = "กรุณาเลือกข้อมูลชื่อ - นามสกุลของผู้เสียชีวิต";
      validate = true;
    }
    if (isOverfundRemaining.value) {
      isError.value.fundRequest = "จำนวนที่ขอเบิกเกินจำนวนที่สามารถเบิกได้";
      validate = true;
    }
  }
  if (model.value.selectedWreath) {
    if (!model.value.fundReceiptWreath) {
      isError.value.fundReceiptWreath = "กรุณากรอกข้อมูลจำนวนเงินตามใบสำคัญรับเงินสนับสนุนค่าพวงหลีด";
      validate = true;
    }
    if (!model.value.fundWreathUniversity) {
      isError.value.fundWreathUniversity = "กรุณากรอกข้อมูลจำนวนเงินที่ต้องการเบิกในนามมหาวิทยาลัย";
      validate = true;
    }
    if (!model.value.fundWreathArrange) {
      isError.value.fundWreathArrange = "กรุณากรอกข้อมูลจำนวนเงินที่ต้องการเบิกในนามส่วนงาน";
      validate = true;
    }
    if (isOverfundRemainingWreathArrange.value) {
      if (isOverfundRemainingWreathArrange.value === 2) {
        isError.value.fundWreathArrange = "จำนวนที่ขอเบิกเกินจำนวนที่สามารถเบิกได้";
      }
      else {
        isError.value.fundWreathArrange = "สามารถเบิกได้สูงสุด " + remaining.value[7]?.perTimesRemaining + " บาทต่อครั้ง";
      }
      validate = true;
    }
    if (isOverfundRemainingWreathUniversity.value) {
      if (isOverfundRemainingWreathUniversity.value === 2) {
        isError.value.fundWreathUniversity = "จำนวนที่ขอเบิกเกินจำนวนที่สามารถเบิกได้";
      }
      else {
        isError.value.fundWreathUniversity = "สามารถเบิกได้สูงสุด " + remaining.value[8]?.perTimesRemaining + " บาทต่อครั้ง";
      }
      validate = true;
    }
  }
  if (model.value.selectedVehicle) {
    if (!model.value.fundReceiptVehicle) {
      isError.value.fundReceiptVehicle = "กรุณากรอกข้อมูลจำนวนเงินตามใบสำคัญรับเงินสนับสนุนค่าพาหนะ";
      validate = true;
    }
    if (!model.value.fundVehicle) {
      isError.value.fundVehicle = "กรุณากรอกข้อมูลจำนวนเงินที่ต้องการเบิกในส่วนสนับสนุนค่าพาหนะ";
      validate = true;
    }
    if (isOverfundRemainingVehicle.value) {
      if (isOverfundRemainingVehicle.value === 2) {
        isError.value.fundVehicle = "จำนวนที่ขอเบิกเกินจำนวนที่สามารถเบิกได้";
      }
      else {
        isError.value.fundVehicle = "สามารถเบิกได้สูงสุด " + remaining.value[9]?.perTimesRemaining + " บาทต่อครั้ง";
      }
      validate = true;
    }
  }
  
  if (!model.value.createFor && canCreateFor.value) {
    isError.value.createFor = "โปรดเลือกผู้ใช้งาน";
    let navigate = document.getElementById("fund-receipt");
    window.location.hash = "fund-receipt";
    navigate.scrollIntoView(false);
    validate = true;
  }
  if (isOverRequest.value) {
    isError.value.fundDecease = "จำนวนเงินที่ต้องการเบิกห้ามมากว่าจำนวนเงินตามใบสำคัญรับเงิน";
    validate = true;
  }
  if (isOverWreathArrange.value) {
    isError.value.fundWreathArrange = "จำนวนเงินที่ต้องการเบิกห้ามมากว่าจำนวนเงินตามใบสำคัญรับเงิน";
    validate = true;
  }
  if (isOverWreathUniversity.value) {
    isError.value.fundWreathUniversity = "จำนวนเงินที่ต้องการเบิกห้ามมากว่าจำนวนเงินตามใบสำคัญรับเงิน";
    validate = true;
  }
  if (isOverVehicle.value) {
    isError.value.fundVehicle = "จำนวนเงินที่ต้องการเบิกห้ามมากว่าจำนวนเงินตามใบสำคัญรับเงิน";
    validate = true;
  }
  if (isDeceasedClaimed.value) {
    isError.value.deceased = "ผู้เสียชีวิตเคยเบิกสิทธิ์ไปแล้ว";
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
    fundRequest: model.value.fundRequest,
    organizer: model.value.organizer,
    deceased: model.value.deceased,
    selectedWreath: model.value.selectedWreath,
    selectedVehicle: model.value.selectedVehicle,
    fundReceiptWreath: model.value.fundReceiptWreath,
    fundWreathUniversity: model.value.fundWreathUniversity,
    fundWreathArrange: model.value.fundWreathArrange,
    fundReceiptVehicle: model.value.fundReceiptVehicle,
    fundVehicle: model.value.fundVehicle,
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
          fetch = await funeralWelfareEmployeeDeceasedService.update(route.params.id, payload);
        }
        else {
          fetch = await funeralWelfareEmployeeDeceasedService.create(payload);
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
        router.replace({ name: "funeral_welfare_list" });
      });
    }
  });
}
async function init() {

  isView.value = route.meta.isView;
  isLoading.value = true;
  try {
    if (isView.value) {
      await fetchDataEdit();
    }
    else if (isEdit.value) {
      // if (!canCreateFor.value) {
      //   fetchRemaining();
      // }
      const result = await userManagementService.getUserInitialData({ keyword: null });
      userInitialData.value = result.data.datas;
      options.value = result.data.datas;
      fetchDataEdit();
    }
    else {
      if (!canCreateFor.value) {
        fetchUserData(authStore.id);
      }
      else {
        const result = await userManagementService.getUserInitialData({ keyword: null });
        userInitialData.value = result.data.datas;
        options.value = result.data.datas;
      }
    }
  }
  catch (error) {
    Promise.reject(error);
  }
  isLoading.value = false;
}

</script>
