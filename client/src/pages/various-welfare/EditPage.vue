<template>
  <PageLayout title="เบิกสวัสดิการค่าสงเคราะห์ต่าง ๆ">
    <template v-slot:page>
      <!--General Information Section -->
      <div class="row q-col-gutter-md q-pl-md q-pt-md">
        <div :class="{ 'col-12': isView || isLoading, 'col-md-9 col-12': !isView && !isLoading }">
          <q-card flat bordered class="full-height">
            <q-card-section class="q-px-md q-py-md font-18 font-bold">
              <p class="q-mb-none">ข้อมูลผู้เบิกสวัสดิการ</p>
            </q-card-section>
            <q-separator />
            <q-card-section class="row wrap q-col-gutter-y-md q-px-md q-pt-md q-pb-sm font-16 font-bold">
              <div class="col-12 row wrap q-col-gutter-y-md">
                <p class="col-lg-3 col-12 q-mb-none">
                  ชื่อ : <span class="font-medium font-16 text-grey-7">สุทธพัฒน์ บุญทัน</span>
                </p>
                <p class="col-lg-3 col-12 q-mb-none">
                  ตำแหน่ง : <span class="font-medium font-16 text-grey-7">รองศาสตราจารย์</span>
                </p>
                <p class="col-lg col-12 q-mb-none">
                  ประเภทบุคลากร : <span class="font-medium font-16 text-grey-7">พนักงานมหาวิทยาลัย</span>
                </p>
              </div>
              <div class="col-12 row wrap q-col-gutter-y-md">
                <p class="col-lg-3 col-12 q-mb-none">
                  ส่วนงาน : <span class="font-medium font-16 text-grey-7">สถาบันการศึกษา</span>
                </p>
                <p class="col-lg col-12 q-mb-none">
                  ภาควิชา : <span class="font-medium font-16 text-grey-7">วิศวกรรมซอฟต์แวร์</span>
                </p>
              </div>
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
              <p class="col-12 q-mb-none">ค่าสมรส : 1</p>
                <p class="col-12 q-mb-none">ค่าอุปสมบทหรือประกอบพิธีฮัจญ์ : 1</p>
                <p class="col-12 q-mb-none">ค่ารับขวัญบุตร : -</p>
                <p class="col-12 q-mb-none">กรณีประสบภัยพิบัติ : -</p>
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
            <q-card-section class="row wrap q-col-gutter-y-md q-px-md q-py-md font-medium font-16 text-grey-9">
              <p class="col-12 q-mb-none">การเบิกสวัสดิการค่าสงเคราะห์ เนื่องในโอกาสต่างๆ</p>
              <div class="col-lg-6 col-12 q-mb-none">
                <q-option-group class="q-gutter-y-sm" v-model="selection" type="radio" :options="options" />
              </div>
              <div class="col-6 row q-col-gutter-y-md q-mb-none" style="padding-top: 22px;">
                <p class="col-12 q-mb-none">(จ่ายไม่เกินคนละ 2,000 บาท)</p>
                <p class="col-12 q-mb-none">(จ่ายไม่เกินคนละ 2,000 บาท)</p> 
                <p class="col-12 q-mb-none">(จ่ายไม่เกินคนละ 2,000 บาท)</p>
                <p class="col-12 q-mb-none">(จ่ายไม่เกินคนละ 10,000 บาท)</p>
              </div>
            </q-card-section>
            <q-card-section class="row wrap font-medium font-16 text-grey-9 q-pt-none">
                <div class="col-lg-4 col-12 ">
                  <InputGroup for-id="fund" is-dense v-model="model.fund1" :data="model.fund ?? '-'" is-require
                    label="จำนวนเงินตามใบเสร็จ" placeholder="บาท" type="number" class="" :is-view="isView">
                  </InputGroup>
                </div>
                <div class="col-lg-2"></div>
                <div class="col-lg-4 col-12 ">
                  <InputGroup for-id="fund" is-dense v-model="model.fund2" :data="model.fund ?? '-'" is-require
                    label="จำนวนเงินที่ต้องการเบิก" placeholder="บาท" type="number" class="" :is-view="isView">
                  </InputGroup>
                </div>
              </q-card-section>
          </q-card>
        </div>
        <div class="col-md-3 col-12">
          <div class="q-pb-md" v-if="!isView && !isLoading">
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
          </div>

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
          type="submit" label="บันทึกฉบับร่าง" no-caps @click="submit(4)" v-if="!isView && !isLoading" />
        <q-btn id="button-approve" class="font-medium font-16 weight-8 text-white q-px-md" dense type="submit"
          style="background-color: #43a047" label="ส่งคำร้องขอ" no-caps @click="submit(3)"
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

import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";

defineOptions({
  name: "various_welfare_edit",
});
const router = useRouter();
const route = useRoute();
const model = ref({
  fund1: null,
  fund2: null,
});

const options = [
  {
    label: 'การเบิกค่าสมรสโดยนิตินัย',
    value: 'การเบิกค่าสมรสโดยนิตินัย'
  },
  {
    label: 'การเบิกค่าอุปสมหรือการไปประกอบพิธีฮัจญ์',
    value: 'การเบิกค่าอุปสมหรือการไปประกอบพิธีฮัจญ์'
  },
  {
    label: 'การเบิกค่ารับขวัญบุตรแรกเกิด',
    value: 'การเบิกค่ารับขวัญบุตรแรกเกิด'
  },
  {
    label: 'การเบิกสวัสดิการค่าสงเคราะห์ กรณีประสบภัยพิบัติ',
    value: 'การเบิกสวัสดิการค่าสงเคราะห์ กรณีประสบภัยพิบัติ'
  }
]
const selection = ref(null)

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
        router.replace({ name: "various_welfare_list" });
      });
    }
  });
}

async function init() {
  isView.value = route.meta.isView;
  isLoading.value = true;
}

// const options = [
//         { label: 'Battery too low', value: 'bat'},
//         { label: 'Friend request', value: 'friend'},
//         { label: 'Picture uploaded', value: 'upload'}
//       ]
</script>
