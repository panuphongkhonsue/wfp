<template>
  <PageLayout title="เบิกสวัสดิการค่าสงเคราะห์ต่าง ๆ">
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
        <div class="col-md-3 col-12" v-if="!isView && !isLoading">
          <q-card flat bordered class="full-height">
            <q-card-section class="q-px-md q-py-md font-18 font-bold">
              <p class="q-mb-none">สิทธิ์คงเหลือ</p>
            </q-card-section>
            <q-separator />
            <q-card-section class="row wrap q-col-gutter-y-md q-px-md q-py-md font-medium font-16 text-grey-7">
              <p class="col-12 q-mb-none">
                ค่าสมรส : {{ remaining[4]?.fundRemaining ?? "-" }} บาท
                ({{ remaining[4]?.requestsRemaining ?? "-" }} ครั้ง)
              </p>
              <p class="col-12 q-mb-none">
                ค่าอุปสมบทหรือประกอบพิธีฮัจญ์ : {{ remaining[5]?.fundRemaining ?? "-" }} บาท
                ({{ remaining[5]?.requestsRemaining ?? "-" }} ครั้ง)
              </p>
              <p class="col-12 q-mb-none">
                ค่ารับขวัญบุตร : {{ remaining[6]?.fundRemaining ?? "-" }} บาท
                ({{ remaining[6]?.requestsRemaining ?? "-" }} ครั้ง)
              </p>
              <p class="col-12 q-mb-none">
                กรณีประสบภัยพิบัติ : {{ remaining[7]?.fundRemaining ?? "-" }} บาท
                ({{ remaining[7]?.requestsRemaining ?? "-" }} ครั้ง)
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
            <q-card-section class="row wrap q-col-gutter-y-md q-px-md q-py-md font-medium font-16 text-grey-9">
              <p class="col-12 q-mb-none">การเบิกสวัสดิการค่าสงเคราะห์ เนื่องในโอกาสต่างๆ</p>
              <div class="col-lg-6 col-12 q-mb-none">
                <q-option-group class="q-gutter-y-sm" v-model="model.categoryId" type="radio" :options="categoryOptions"
                  :disable="isView" />
              </div>
              <div class="col-6 row q-col-gutter-y-md q-mb-none" style="padding-top: 22px;">
                <p class="col-12 q-mb-none">(จ่ายไม่เกินคนละ 2,000 บาท)</p>
                <p class="col-12 q-mb-none">(จ่ายไม่เกินคนละ 2,000 บาท)</p>
                <p class="col-12 q-mb-none">(จ่ายไม่เกินคนละ 1,000 บาท)</p>
                <p class="col-12 q-mb-none">(จ่ายไม่เกินคนละ 10,000 บาท)</p>
              </div>
            </q-card-section>
            <q-card-section class="row wrap font-medium font-16 text-grey-9 q-pt-none">
              <div class="col-lg-4 col-12 ">
                <InputGroup for-id="fund" is-dense v-model="model.fundReceipt" :data="model.fundReceipt ?? '-'"
                  is-require label="จำนวนเงินตามใบเสร็จ" placeholder="บาท" type="number" class="" :is-view="isView">
                </InputGroup>
              </div>
              <div class="col-lg-2"></div>
              <div class="col-lg-4 col-12 ">
                <InputGroup for-id="fund" is-dense v-model="model.fundEligible" :data="model.fundEligible ?? '-'"
                  is-require label="จำนวนเงินที่ต้องการเบิก" placeholder="บาท" type="number" class="" :is-view="isView">
                </InputGroup>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-md-3 col-12">
          <!-- <div class="q-pb-md" v-if="!isView && !isLoading">
            <q-card flat bordered>
              <q-card-section class="q-px-md q-pt-md q-pb-md font-18 font-bold">
                <p class="q-mb-none">จำนวนเงินคงเหลือ</p>
              </q-card-section>
              <q-separator />
              <q-card-section class="row wrap q-col-gutter-y-md q-px-md q-py-md font-medium font-16 text-grey-7">
                <p class="col-12 q-mb-none">ค่าสมรส : 2,000</p>
                <p class="col-12 q-mb-none">ค่าอุปสมบทหรือประกอบพิธีฮัจญ์ : 2,000</p>
                <p class="col-12 q-mb-none">ค่ารับขวัญบุตร : 1,000</p>
                <p class="col-12 q-mb-none">กรณีประสบภัยพิบัติ : 10,000</p>
              </q-card-section>
            </q-card>
          </div> -->

          <q-card flat bordered>
            <q-card-section class="q-px-md q-pt-md q-pb-md font-18 font-bold">
              <p class="q-mb-none">หลักฐานที่ต้องแนบ</p>
            </q-card-section>
            <q-separator />
            <q-card-section class="row wrap q-col-gutter-y-md q-px-md q-py-md font-medium font-16 text-grey-7">
              <p class="col-12 q-mb-none font-18 font-bold text-black ">ค่าสมรสโดยนิตินัย</p>
              <p class="col-12 q-mb-none">1. ใบสำคัญรับเงิน</p>
              <p class="col-12 q-mb-none">2. สำเนาทะเบียนสมรส</p>
              <p class="col-12 q-mb-none font-18 font-bold text-black ">ค่าอุปสมบทหรือการไปประกอบพิธีฮัจญ์</p>
              <p class="col-12 q-mb-none">1. ใบสำคัญรับเงิน</p>
              <p class="col-12 q-mb-none">2. สำเนาคำสั่งลาอุปสมบท<br>หรือเอกสารประกอบพิธีฮัจญ์</p>
              <p class="col-12 q-mb-none font-18 font-bold text-black ">ค่ารับขวัญบุตรแรกเกิด</p>
              <p class="col-12 q-mb-none">1. ใบสำคัญรับเงิน</p>
              <p class="col-12 q-mb-none">2. สำเนาสูติบัตรบุตร<br>หรือสำเนาทะเบียนรับรองบุตร</p>
              <p class="col-12 q-mb-none font-18 font-bold text-black ">ค่าประสบภัยพิบัติ</p>
              <p class="col-12 q-mb-none">1. ใบสำคัญรับเงิน</p>
              <p class="col-12 q-mb-none">2. รูปภาพ</p>
              <p class="col-12 q-mb-none">3. สำเนาทะเบียนบ้าน</p>
            </q-card-section>
          </q-card>


        </div>
      </div>
    </template>
    <!--Action Slot -->
    <template v-slot:action>
      <div class="justify-end row q-py-xs font-medium q-gutter-lg">
        <q-btn id="button-back" class="text-white font-medium font-16 weight-8 q-px-lg" dense type="button"
          style="background : #BFBFBF;" label="ย้อนกลับ" no-caps :to="{ name: 'various_welfare_list' }" />
        <q-btn id="button-reject" class="text-white font-medium bg-blue-9 text-white font-16 weight-8 q-px-lg" dense
          type="submit" label="บันทึกฉบับร่าง" no-caps @click="submit(1)" v-if="!isView && !isLoading" />
        <q-btn id="button-approve" class="font-medium font-16 weight-8 text-white q-px-md" dense type="submit"
          style="background-color: #43a047" label="ส่งคำร้องขอ" no-caps @click="submit(2)"
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
import variousWelfareService from "src/boot/service/variousWelfareService";
defineOptions({
  name: "various_welfare_edit",
});
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const model = ref({
  fundReceipt: null,
  fundEligible: null,
  categoryId: null,
  createFor: null,
});
let options = ref([]);
const categoryOptions =
  [
    {
      label: 'การเบิกค่าสมรสโดยนิตินัย',
      value: 4
    },
    {
      label: 'การเบิกค่าอุปสมหรือการไปประกอบพิธีฮัจญ์',
      value: 5
    },
    {
      label: 'การเบิกค่ารับขวัญบุตรแรกเกิด',
      value: 6
    },
    {
      label: 'การเบิกสวัสดิการค่าสงเคราะห์ กรณีประสบภัยพิบัติ',
      value: 7
    }
  ]

const userData = ref({});
const remaining = ref({
  4: { fundRemaining: "-", requestsRemaining: "-" },
  5: { fundRemaining: "-", requestsRemaining: "-" },
  6: { fundRemaining: "-", requestsRemaining: "-" },
  7: { fundRemaining: "-", requestsRemaining: "-" }
});
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
      const result = await variousWelfareService.dataById(route.params.id);
      console.log("API Response:", result.data?.datas);
      var returnedData = result.data.datas;
      if (returnedData) {
        model.value = {
          ...model.value,
          createFor: null,
          reimNumber: returnedData?.reimNumber,
          requestDate: returnedData?.requestDate,
          status: returnedData?.status,
          fundReceipt: returnedData?.fundReceipt,
          fundEligible: returnedData?.fundEligible,
          fundSumRequest: returnedData?.fundSumRequest,
          categoryId: returnedData?.categoryId,
        };
        userData.value = {
          name: returnedData?.user.name,
          position: returnedData?.user.position,
          employeeType: returnedData?.user.employeeType,
          sector: returnedData?.user.sector,
          department: returnedData?.user.department,
        };
      }
      console.log("Category ID after fetch:", model.value.categoryId);
    } catch (error) {
      router.replace({ name: "various_welfare_list" });
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
    const fetchRemaining = await variousWelfareService.getRemaining({ createFor: model.value.createFor });
    if (Array.isArray(fetchRemaining.data?.datas)) {
      fetchRemaining.data.datas.forEach((item) => {
        remaining.value[item.categoryId] = {
          requestsRemaining: item.requestsRemaining != null && !isNaN(Number(item.requestsRemaining))
            ? formatNumber(item.requestsRemaining)
            : "-",
          fundRemaining: item.fundRemaining != null && !isNaN(Number(item.fundRemaining))
            ? formatNumber(item.fundRemaining)
            : "-",
        };
      });
    }
    console.log("Updated Remaining Value:", remaining.value);
    canRequest.value = fetchRemaining.data?.canRequest;
  } catch (error) {
    Promise.reject(error);
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
  } if (!model.value.createFor && canCreateFor.value) {
    isError.value.createFor = "โปรดเลือกผู้ใช้งาน";
    let navigate = document.getElementById("selected-user");
    window.location.hash = "selected-user";
    navigate.scrollIntoView(false);
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
    fundEligible: model.value.fundEligible,
    createFor: model.value.createFor,
    categoryId: model.value.categoryId,
    actionId: actionId,
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
          fetch = await variousWelfareService.update(route.params.id, payload);
        }
        else {
          fetch = await variousWelfareService.create(payload);
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
        router.replace({ name: "various_welfare_list" });
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
      else {
        const result = await userManagementService.getUserInitialData({ keyword: null });
        userInitialData.value = result.data.datas;
      }
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
