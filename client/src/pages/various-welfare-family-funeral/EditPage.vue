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
            <q-card-section class="row wrap q-col-gutter-y-md q-pb-sm font-16 font-bold">
              <p class="col-lg-4 col-12 q-mb-none">
                ชื่อ : <span class="font-medium font-16 text-grey-7">สุทธพัฒน์ บุญทัน</span>
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
        <div class="col-md-3 col-12" v-if="!isView && !isLoading">
          <q-card flat bordered class="full-height">
            <q-card-section class="q-px-md q-py-md font-18 font-bold">
              <p class="q-mb-none">สิทธิ์คงเหลือ</p>
            </q-card-section>
            <q-separator />
            <q-card-section class="row wrap q-col-gutter-y-md q-px-md q-py-md font-medium font-16 text-grey-7">
              <p class="col-12 q-mb-none">คงเหลือ 3,000 บาท</p>
              <p class="col-12 q-mb-none">คงเหลือจำนวน 1 ครั้ง</p>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Request Section -->
      <div class="row q-col-gutter-md q-pl-md q-pt-md">
        <div class="col-md-9 col-12">
          <q-card flat bordered class="full-height">
            <q-card-section class="col row q-pb-none">
              <p class="q-pb-md font-18 font-bold q-pb-md">ข้อมูลการเบิกสวัสดิการ</p>
              <p class="q-pl-md q-pb-md font-16 q-mb-none">(จ่ายจริงคนละไม่เกิน 5,000 บาท)</p>
            </q-card-section>
            <q-card-section class="row wrap q-col-gutter-y-md q-px-md q-py-md  font-medium font-16 text-grey-9">
              <p class="col-12 q-mb-none q-pt-none">การเบิกสวัสดิการค่าสงเคราะห์ เนื่องในโอกาสต่างๆ</p>
              <!-- <div class="col-6 row q-col-gutter-y-md q-mb-none" style="padding-top: 22px;">
                <q-input v-if="selection" v-model="nameInput" outlined dense label="ชื่อ-นามสกุล" class="" />
              </div> -->
              <div v-for="option in options" :key="option.value" class="col-12 row q-mb-none">
                <div class="col-md-2"><q-radio v-model="selection" :val="option.value" :label="option.label"
                    class="q-mr-md" />
                </div>
                <q-input v-if="selection === option.value" v-model="inputValues[option.value]" :data="model.fund ?? '-'"
                  outlined dense placeholder="ชื่อ-นามสกุล" class="q-ml-md" />
              </div>
            </q-card-section>
            <q-card-section class="row wrap font-medium font-16 text-grey-9 q-pt-none">
              <div class="col-lg-4 col-12 ">
                <InputGroup for-id="fund" is-dense v-model="model.fund1" :data="model.fund ?? 'พรี่มอส'" is-require
                  label="จำนวนเงินตามใบเสร็จ" placeholder="บาท" type="number" class="" :is-view="isView">
                </InputGroup>
              </div>
              <div class="col-lg-2"></div>
              <div class="col-lg-4 col-12 ">
                <InputGroup for-id="fund" is-dense v-model="model.fund2" :data="model.fund ?? '-'" is-require
                  label="จำนวนเงินที่ต้องการเบิก" placeholder="บาท" type="number" class="" :is-view="isView">
                </InputGroup>
              </div>
              <div class="q-pb-md q-mb-none font-16 font-bold text-black">
                <q-radio v-model="supwreath" val="wreathRequire" label="ค่าสนับสนุนค่าพวงหรีด" />
              </div>
              <p class="q-px-lg q-pt-sm q-pb-md font-16 q-mb-none ">(จ่ายไม่เกิน 2,000 บาท ในนามมหาวิทยาลัย และไม่เกิน
                2,000 บาท ในนามส่วนงาน)</p>
            </q-card-section>
            <q-separator inset />
            <q-card-section class="col row">
              <div class=" q-pb-md q-mb-none font-16 font-bold">
                <q-checkbox v-model="suptransportation" label="ค่าสนับสนุนค่าพาหนะเหมาจ่าย" />
              </div>
              <p class="q-px-lg q-pt-sm q-pb-md font-16 q-mb-none ">(จ่ายจริงคนละไม่เกิน 5,000 บาท)</p>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-md-3 col-12">
          <q-card flat bordered>
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
    label: 'บิดา',
    value: '1'
  },
  {
    label: 'มารดา',
    value: '2'
  },
  {
    label: 'คู่สมรส',
    value: '3'
  },
  {
    label: 'บุตร',
    value: '4'
  }
]
const selection = ref(null)
const suptransportation = ref(false)
const inputValues = ref({});
const supwreath = ref('wreathRequire')

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
        router.replace({ name: "various_welfare_funeral_family_list" });
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


// const handleSelection = (value) => {
//   if (!inputValues.value[value]) {
//     inputValues.value[value] = "";
//   }
// };
</script>
