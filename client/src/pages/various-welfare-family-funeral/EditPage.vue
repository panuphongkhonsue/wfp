<template>
  <PageLayout title="สวัสดิการค่าสงเคราะห์การเสียชีวิตครอบครัว">
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
              <p class="col-12 q-mb-none">
                บิดา : {{ remaining[3]?.fundRemaining ? remaining[3]?.fundRemaining + " บาท" :
                  remaining[3]?.perTimesRemaining ? remaining[3]?.perTimesRemaining + " บาท" :
                    "ไม่จำกัดจำนวนเงิน"
                }}
                {{ remaining[3]?.requestsRemaining ? "( " + remaining[3]?.requestsRemaining + " ครั้ง)" :
                  '(ไม่จำกัดครั้ง)' }}
              </p>
              <p class="col-12 q-mb-none">
                มารดา : {{ remaining[4]?.fundRemaining ? remaining[4]?.fundRemaining + " บาท" :
                  remaining[4]?.perTimesRemaining ? remaining[4]?.perTimesRemaining + " บาท" :
                    "ไม่จำกัดจำนวนเงิน"
                }}
                {{ remaining[4]?.requestsRemaining ? "( " + remaining[4]?.requestsRemaining + " ครั้ง)" :
                  '(ไม่จำกัดครั้ง)' }}
              </p>
              <p class="col-12 q-mb-none">
                คู่สมรส : {{ remaining[5]?.fundRemaining ? remaining[5]?.fundRemaining + " บาท" :
                  remaining[5]?.perTimesRemaining ? remaining[5]?.perTimesRemaining + " บาท" :
                    "ไม่จำกัดจำนวนเงิน"
                }}
                {{ remaining[5]?.requestsRemaining ? "( " + remaining[5]?.requestsRemaining + " ครั้ง)" :
                  '(ไม่จำกัดครั้ง)' }}
              </p>
              <p class="col-12 q-mb-none">
                บุตร : {{ remaining[6]?.fundRemaining ? remaining[6]?.fundRemaining + " บาท" :
                  remaining[6]?.perTimesRemaining ? remaining[6]?.perTimesRemaining + " บาท" :
                    "ไม่จำกัดจำนวนเงิน"
                }}
                {{ remaining[6]?.requestsRemaining ? "( " + remaining[6]?.requestsRemaining + " ครั้ง)" :
                  '(ไม่จำกัดครั้ง)' }}
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
                <p class="q-pl-md q-pb-md font-16 q-mb-none">(จ่ายจริงคนละไม่เกิน 5,000 บาท)</p>
              </div>

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
            <q-card-section class="row wrap q-col-gutter-y-md q-px-md q-py-md  font-medium font-16 text-grey-9">
              <p class="col-12 q-mb-none q-pt-none">การเบิกสวัสดิการค่าสงเคราะห์ เนื่องในโอกาสต่างๆ</p>
              <div v-for="option in deceaseOptions" :key="option.value" class="col-12 row q-mb-none">
                <div class="col-md-2">
                  <q-radio v-model="model.deceasedType" :val="option.value" :label="option.label" class="q-mr-md"
                    :disable="isView" />
                </div>
                <InputGroup label="" v-if="model.deceasedType === option.value" v-model="model.decease"
                  :data="model.fund ?? '-'" placeholder="ชื่อ-นามสกุล" type="text" class="col-md-4 q-ml-md"
                  :is-view="isView" is-dense>
                </InputGroup>
              </div>
            </q-card-section>
            <q-card-section class="row wrap font-medium font-16 text-grey-9 q-pt-none q-pb-none">
              <div class="col-lg-5 col-xl-4 col-12 q-pr-lg-xl">
                <InputGroup for-id="fund-receipt" is-dense v-model="model.fundReceipt" :data="model.fundReceipt ?? '-'"
                  is-require label="จำนวนเงินตามใบเสร็จ (บาท)" placeholder="บาท" type="number" class=""
                  :is-view="isView" :rules="[(val) => !!val || 'กรุณากรอกข้อมูลจำนวนเงินตามใบสำคัญรับเงิน']"
                  :error-message="isError?.fundReceipt" :error="!!isError?.fundReceipt">
                </InputGroup>
              </div>
              <div class="col-lg-5 col-xl-4 col-12 q-pr-lg-xl">
                <InputGroup for-id="fund-request" is-dense v-model="model.fundDecease" :data="model.fundDecease ?? '-'"
                  is-require label="จำนวนเงินที่ต้องการเบิก (บาท)" placeholder="บาท" type="number" class=""
                  :is-view="isView"
                  :rules="[(val) => !!val || 'กรุณากรอกข้อมูลจำนวนเงินที่ต้องการเบิก', (val) => !isOverDecease || 'จำนวนเงินที่ต้องการเบิกห้ามมากกว่าจำนวนเงินตามใบเสร็จ']"
                  :error-message="isError?.fundEligible" :error="!!isError?.fundDecease">
                </InputGroup>
              </div>
            </q-card-section>
            <q-card-section class="row wrap font-medium q-pb-xs font-16 text-grey-9 items-center"
            :class="isView ? '' : 'q-pl-sm'">
                <q-checkbox v-if="!isView" v-model="model.selectedWreath"  />
              <p class="q-pb-md q-mb-none">ค่าสนับสนุนค่าพวงหรีด (จ่ายไม่เกิน 2,000 บาท
                ในนามมหาวิทยาลัย และไม่เกิน
                2,000 บาท ในนามส่วนงาน)</p>
            </q-card-section>
            <q-card-section class="row wrap font-medium font-16 text-grey-9 q-pt-none q-pb-none">
              <div class="col-lg-5 col-xl-4 col-12 q-pr-lg-xl ">
                <InputGroup for-id="fund-wreath-receipt" is-dense v-model="model.fundReceiptWreath"
                  :data="model.fundReceiptWreath ?? '-'" is-require label="จำนวนเงินตามใบเสร็จ (บาท)" placeholder="บาท"
                  type="number" class="" :is-view="isView" :disable="!model.selectedWreath"
                  :rules="[(val) => !!val || 'กรุณากรอกข้อมูลจำนวนเงินตามใบสำคัญรับเงิน']"
                  :error-message="isError?.fundReceiptWreath" :error="!!isError?.fundReceiptWreath">
                </InputGroup>
              </div>
              <div class="col-lg-5 col-xl-4 col-12 q-pr-lg-xl ">
                <InputGroup for-id="fund-wreath-arrange" is-dense v-model="model.fundWreathArrange"
                  :data="model.fundWreathArrange ?? '-'" label="จำนวนเงินที่ต้องการเบิก (บาท) (ในนามส่วนงาน)"
                  placeholder="บาท" type="number" class="" :is-view="isView" :disable="!model.selectedWreath"
                  :rules="[(val) => !!val || 'กรุณากรอกข้อมูลจำนวนที่ต้องการเบิก', (val) => model.selectedWreath && !isOverWreathArrange || 'จำนวนเงินที่ต้องการเบิกห้ามมากกว่าจำนวนเงินตามใบเสร็จ']"
                  :error-message="isError?.fundWreathArrange" :error="!!isError?.fundWreathArrange">
                </InputGroup>
              </div>
              <div class="col-lg-5 col-xl-4 col-12 q-pr-lg-xl">
                <InputGroup for-id="fund-wreath-university" is-dense v-model="model.fundWreathUniversity"
                  :data="model.fund ?? '-'" label="จำนวนเงินที่ต้องการเบิก (บาท) (ในนามมหาวิทยาลัย)" placeholder="บาท"
                  type="number" class="font-14" :is-view="isView" style="white-space: nowrap;"
                  :disable="!model.selectedWreath"
                  :rules="[(val) => !!val || 'กรุณากรอกข้อมูลจำนวนที่ต้องการเบิก', (val) => model.selectedWreath && !isOverWreathUniversity || 'จำนวนเงินที่ต้องการเบิกห้ามมากกว่าจำนวนเงินตามใบเสร็จ']"
                  :error-message="isError?.fundWreathUniversity" :error="!!isError?.fundWreathUniversity">
                </InputGroup>
              </div>
            </q-card-section>
            <q-separator inset />
            <q-card-section class="row wrap font-medium q-pb-xs font-16 text-grey-9 items-center"
            :class="isView ? '' : 'q-pl-sm'">
                <q-checkbox v-if="!isView" v-model="model.selectedVechicle" />
              <p class="q-pb-md q-mb-none ">ค่าสนับสนุนค่าพาหนะเหมาจ่าย (จ่ายจริงคนละไม่เกิน
                10,000
                บาท)</p>
            </q-card-section>
            <q-card-section class="row wrap font-medium font-16 text-grey-9 q-pt-none q-pb-none">
              <div class="col-lg-5 col-xl-4 col-12 q-pr-lg-xl">
                <InputGroup for-id="fund" is-dense v-model="model.fundReceiptVechicle"
                  :data="model.fundReceiptVechicle ?? '-'" is-require label="จำนวนเงินตามใบเสร็จ (บาท)"
                  placeholder="บาท" type="number" class="" :is-view="isView" :disable="!model.selectedVechicle"
                  :rules="[(val) => !!val || 'กรุณากรอกข้อมูลจำนวนเงินตามใบสำคัญรับเงิน']"
                  :error-message="isError?.fundReceiptVechicle" :error="!!isError?.fundReceiptVechicle">
                </InputGroup>
              </div>
              <div class="col-lg-5 col-xl-4 col-12 q-pr-lg-xl">
                <InputGroup for-id="fund" is-dense v-model="model.fundVechicle" :data="model.fundVechicle ?? '-'"
                  is-require label="จำนวนเงินที่ต้องการเบิก (บาท)" placeholder="บาท" type="number" class=""
                  :is-view="isView" :disable="!model.selectedVechicle"
                  :rules="[(val) => !!val || 'กรุณากรอกข้อมูลจำนวนที่ต้องการเบิก', (val) => model.selectedVechicle && !isOverVechicle || 'จำนวนเงินที่ต้องการเบิกห้ามมากกว่าจำนวนเงินตามใบเสร็จ']"
                  :error-message="isError?.fundVechicle" :error="!!isError?.fundVechicle">
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
            <q-card-section class="row wrap q-col-gutter-y-md q-px-md q-py-md font-medium font-16 text-grey-7">
              <p class="col-12 q-mb-none font-18 font-bold text-black ">บิดา-มารดา</p>
              <p class="col-12 q-mb-none">1. สำเนาทะเบียนบ้านผู้เบิก</p>
              <p class="col-12 q-mb-none font-18 font-bold text-black ">คู่สมรส</p>
              <p class="col-12 q-mb-none">1. สำเนาทะเบียนสมรส</p>
              <p class="col-12 q-mb-none font-18 font-bold text-black ">บุตร</p>
              <p class="col-12 q-mb-none">1. สำเนาสูติบัตร</p>
              <p class="col-12 q-mb-none font-18 font-bold text-black ">ค่าสนับสนุนค่าพวงหรีด</p>
              <p class="col-12 q-mb-none">1. ใบเสร็จรับเงิน</p>
              <p class="col-12 q-mb-none">2. ใบสำคัญรับเงิน
                <br>(โดยเจ้าหน้าที่ผู้รับผิดชอบ
                <br>ด้านบุคคล ลงนามรับเงิน)
              </p>
              <p class="col-12 q-mb-none font-18 font-bold text-black ">ค่าสนับสนุนค่าพาหนะเหมาจ่าย</p>
              <p class="col-12 q-mb-none">1. ใบสำคัญรับเงิน
                <br>(โดยเจ้าหน้าที่ผู้รับผิดชอบ
                <br>ด้านบุคคล ลงนามรับเงิน)
              </p>
              <p class="col-12 q-mb-none">2.ใบเสร็จรับเงินหรือหลักฐานการจ่ายเงินอื่น</p>
            </q-card-section>
          </q-card>


        </div>
      </div>
    </template>
    <!--Action Slot -->
    <template v-slot:action>
      <div class="justify-end row q-py-xs font-medium q-gutter-lg">
        <q-btn id="button-back" class="text-white font-medium font-16 weight-8 q-px-lg" dense type="button"
          style="background : #BFBFBF;" label="ย้อนกลับ" no-caps
          :to="{ name: 'various_welfare_funeral_family_list' }" />
        <q-btn :disable="isValidate" id="button-draft"
          class="text-white font-medium bg-blue-9 text-white font-16 weight-8 q-px-lg" dense type="submit"
          label="บันทึกฉบับร่าง" no-caps @click="submit(1)" v-if="!isView && !isLoading" />
        <q-btn :disable="(!canRequest.wreath && !canRequest.vechicle) || isValidate" id="button-approve"
          class="font-medium font-16 weight-8 text-white q-px-md" dense type="submit" style="background-color: #43a047"
          label="ส่งคำร้องขอ" no-caps @click="submit(2)" v-if="!isView && !isLoading" />
      </div>
    </template>
  </PageLayout>
</template>
<script setup>
import PageLayout from "src/layouts/PageLayout.vue";
import InputGroup from "src/components/InputGroup.vue";
import Swal from "sweetalert2";
import { Notify } from "quasar";
import { formatDateThaiSlash } from "src/components/format";
import userManagementService from "src/boot/service/userManagementService";
import { outlinedDownload } from "@quasar/extras/material-icons-outlined";
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "src/stores/authStore";
import variousWelfareFuneralFamilyService from "src/boot/service/variousWelfareFuneralFamilyService";

defineOptions({
  name: "various_welfare_funeral_family_edit",
});
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const model = ref({
  createFor: null,
  fundReceipt: null,
  fundDecease: null,
  fundReceiptWreath: null,
  fundWreathUniversity: null,
  fundWreathArrange: null,
  fundReceiptVechicle: null,
  fundVechicle: null,
  selectedWreath: false,
  selectedVechicle: false,
  deceasedType: null,
  decease: null,
});
let options = ref([]);
const deceaseOptions = [
  {
    label: 'บิดา',
    value: 3
  },
  {
    label: 'มารดา',
    value: 4
  },
  {
    label: 'คู่สมรส',
    value: 5
  },
  {
    label: 'บุตร',
    value: 6
  }
]
const isError = ref({});
const isView = ref(false);
const isLoading = ref(false);
const userData = ref({});
const remaining = ref({});
const canRequest = ref({
  wreath: false,
  vechicle: false,
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

const isValidate = computed(() => {
  let validate = false;
  if (!model.value.selectedWreath && !model.value.selectedVechicle && !model.value.deceasedType) {
    validate = true;
  }
  if (model.value.deceasedType) {
    if (!model.value.fundReceipt) {
      validate = true;
    }
    if (!model.value.fundDecease) {
      validate = true;
    }
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
  }
  if (model.value.selectedVechicle) {
    if (!model.value.fundReceiptVechicle) {
      validate = true;
    }
    if (!model.value.fundVechicle) {
      validate = true;
    }
    if (isOverVechicle.value) {
      validate = true;
    }
  }
  if (!model.value.createFor && canCreateFor.value) {
    validate = true;
  }
  return validate;
});
const isOverDecease = computed(() => {
  return Number(model.value.fundDecease) > Number(model.value.fundReceipt);
});
const isOverWreathArrange = computed(() => {
  return Number(model.value.fundWreathArrange) > Number(model.value.fundReceiptWreath);
});
const isOverWreathUniversity = computed(() => {
  return Number(model.value.fundWreathUniversity) > Number(model.value.fundReceiptWreath);
});
const isOverVechicle = computed(() => {
  return Number(model.value.fundVechicle) > Number(model.value.fundReceiptVechicle);
});
watch(
  () => model.value.deceasedType,
  (newValue) => {
    if (newValue && !model.value.decease) {
      model.value.decease = "";  // รีเซ็ตค่า
    }
  }
);
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
  () => model.value.selectedVechicle,
  (newValue) => {
    if (!newValue) {
      model.value.fundReceiptVechicle = null;
      model.value.fundVechicle = null;
    }
  }
);
async function fetchDataEdit() {
  setTimeout(async () => {
    try {
      const result = await variousWelfareFuneralFamilyService.dataById(route.params.id);
      var returnedData = result.data.datas;
      if (returnedData) {
        model.value = {
          ...model,
          createFor: returnedData?.user.userId,
          reimNumber: returnedData?.reimNumber,
          requestDate: returnedData?.requestDate,
          selectedWreath: returnedData?.fundWreathUniversity && returnedData?.fundWreathArrange ? true : false,
          selectedVechicle: returnedData?.fundVechicle ? true : false,
          status: returnedData?.status,
          deceasedType: returnedData?.deceasedType,
          decease: returnedData?.decease,
          fundReceipt: returnedData?.fundReceipt,
          fundDecease: returnedData?.fundDecease,
          fundReceiptWreath: returnedData?.fundReceiptWreath,
          fundWreathArrange: returnedData?.fundWreathArrange,
          fundWreathUniversity: returnedData?.fundWreathUniversity,
          fundReceiptVechicle: returnedData?.fundReceiptVechicle,
          fundVechicle: returnedData?.fundVechicle,
        };
        userData.value = {
          name: returnedData?.user.name,
          position: returnedData?.user.position,
          employeeType: returnedData?.user.employeeType,
          sector: returnedData?.user.sector,
          department: returnedData?.user.department,
        };
      }

    } catch (error) {
      router.replace({ name: "various_welfare_funeral_family_list" });
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
async function fetchRemaining() {
  try {
    const fetchRemainingData = await variousWelfareFuneralFamilyService.getRemaining({ createFor: model.value.createFor });
    const deceaseData = fetchRemainingData.data?.datas ?? [];
    remaining.value = {};
    deceaseData.forEach((item) => {
      if (Array.isArray(item)) {
        item.forEach((subItem) => {
          remaining.value[subItem.subCategoriesId] = {
            requestsRemaining: subItem.requestsRemaining,
            fundRemaining: subItem.fundRemaining,
            perTimesRemaining: subItem.perTimesRemaining,
          };
          canRequest.value[subItem.subCategoriesId] = subItem.canRequest;
        });
      } else {
        remaining.value[item.subCategoriesId] = {
          requestsRemaining: item.requestsRemaining,
          fundRemaining: item.fundRemaining,
          perTimesRemaining: item.perTimesRemaining,
        };
        canRequest.value[item.subCategoriesId] = item.canRequest;
      }
    });
    isLoading.value = false;
  } catch (error) {
    console.error("Error fetching remaining data:", error);
    isLoading.value = false;
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
  if (!model.value.selectedWreath && !model.value.selectedVechicle && !model.value.deceasedType) {
    Notify.create({
      message: "กรุณากรอกสวัสดิการที่ต้องการเบิก",
      position: "bottom-left",
      type: "negative",
    });
    return;
  }
  if (model.value.deceasedType) {
    if (!model.value.decease) {
      isError.value.decease = "กรุณากรอกข้อมูลชื่อ - นามสกุลของผู้เสียชีวิต";
      validate = true;
    }
  }
  if (model.value.selectedVechicle) {
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
  }
  if (model.value.selectedVechicle) {
    if (!model.value.fundReceiptVechicle) {
      isError.value.fundReceiptVechicle = "กรุณากรอกข้อมูลจำนวนเงินตามใบสำคัญรับเงินสนับสนุนค่าพาหนะ";
      validate = true;
    }
    if (!model.value.fundVechicle) {
      isError.value.fundVechicle = "กรุณากรอกข้อมูลจำนวนเงินที่ต้องการเบิกในส่วนสนับสนุนค่าพาหนะ";
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
  if (!model.value.fundReceipt) {
    isError.value.fundReceipt = "กรุณากรอกข้อมูลจำนวนเงินตามใบเสร็จ";
    let navigate = document.getElementById("fund");
    window.location.hash = "fund";
    navigate.scrollIntoView(false);
    validate = true;
  }
  if (isOverDecease.value) {
    isError.value.fundDecease = "จำนวนเงินที่ต้องการเบิกห้ามมากว่าจำนวนเงินตามใบเสร็จ";
    validate = true;
  }
  if (isOverWreathArrange.value) {
    isError.value.fundWreathArrange = "จำนวนเงินที่ต้องการเบิกห้ามมากว่าจำนวนเงินตามใบเสร็จ";
    validate = true;
  }
  if (isOverWreathUniversity.value) {
    isError.value.fundWreathUniversity = "จำนวนเงินที่ต้องการเบิกห้ามมากว่าจำนวนเงินตามใบเสร็จ";
    validate = true;
  }
  if (isOverVechicle.value) {
    isError.value.fundVechicle = "จำนวนเงินที่ต้องการเบิกห้ามมากว่าจำนวนเงินตามใบเสร็จ";
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
    fundDecease: model.value.fundDecease,
    deceasedType: model.value.deceasedType,
    decease: model.value.decease,
    selectedWreath: model.value.selectedWreath,
    selectedVechicle: model.value.selectedVechicle,
    fundReceiptWreath: model.value.fundReceiptWreath,
    fundWreathUniversity: model.value.fundWreathUniversity,
    fundWreathArrange: model.value.fundWreathArrange,
    fundReceiptVechicle: model.value.fundReceiptVechicle,
    fundVechicle: model.value.fundVechicle,
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
          fetch = await variousWelfareFuneralFamilyService.update(route.params.id, payload);
        }
        else {
          fetch = await variousWelfareFuneralFamilyService.create(payload);
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
        router.replace({ name: "various_welfare_funeral_family_list" });
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
</script>
