<template>
  <PageLayout title="เบิกสวัสดิการทั่วไป (ค่าตรวจสุขภาพ)">
    <template v-slot:page>
      <!--General Information Section -->
      <div class="row q-col-gutter-md q-pl-md q-pt-md">
        <div class="col-md-9 col-12">
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
        <div class="col-md-3 col-12">
          <q-card flat bordered class="full-height">
            <q-card-section class="q-px-md font-18 font-bold">
              <p class="q-mb-none">สิทธิ์คงเหลือ</p>
            </q-card-section>
            <q-separator />
            <q-card-section class="row wrap q-col-gutter-y-md font-medium font-16 text-grey-7">
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
            <q-card-section class="q-px-md q-pt-md q-pb-md font-18 font-bold">
              <p class="q-mb-none">ข้อมูลการเบิกสวัสดิการ</p>
            </q-card-section>
            <q-card-section class="row wrap font-medium q-pb-xs font-16 text-grey-9">
              <InputGroup for-id="fund" is-dense v-model="model.fund" :data="model.fund ?? '-'" is-require label="จำนวนเงินตามใบเสร็จ"
                placeholder="บาท" type="number" class="" :is-view="isView">
              </InputGroup>
            </q-card-section>
            <q-card-section class="q-pt-none font-medium font-16">
              <q-table flat bordered :rows="row ?? []" :columns="columns" row-key="id" :wrap-cells="$q.screen.gt.lg"
                table-header-class="font-bold bg-blue-10 text-white" separator="cell" hide-bottom>
                <template v-slot:body-cell-claimName="props">
                  <q-td v-if="props.row.claimName" :props="props" class="text-center text-grey-9">
                    {{ props.row.claimName }}
                  </q-td>
                  <q-td v-else :props="props" class="text-grey-9">
                    <q-input class="font-14 font-regular" dense v-model="model.claimName" outlined autocomplete="off"
                      color="dark" type="number" :for="'input-claimName' + props.row.id" placeholder="0">
                    </q-input>
                  </q-td>
                </template>
                <template v-slot:body-cell-claimFund="props">
                  <q-td v-if="props.row.claimFund" :props="props" class="text-center text-grey-9">
                    {{ props.row.claimFund }}
                  </q-td>
                  <q-td v-else :props="props" class="text-grey-9">
                    <q-input class="font-14 font-regular" dense v-model="model.claimFund[props.row.id]" outlined
                      autocomplete="off" color="dark" type="number" :for="'input-claimFund' + props.row.id"
                      placeholder="0">
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
              <p class="q-mb-none">สิทธิ์คงเหลือ</p>
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
        <q-btn id="button-reject" class="text-white font-medium bg-blue-9 text-white font-16 weight-8 q-px-lg" dense
          type="submit" label="บันทึกฉบับร่าง" no-caps @click="submit(4)" v-if="!isView && !isLoadings" />
        <q-btn id="button-approve" class="font-medium font-16 weight-8 text-white q-px-md" dense
          type="submit" style="background-color: #43a047" label="ส่งคำร้องขอ" no-caps @click="submit(3)"
          v-if="!isView && !isLoadings" />
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


import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";

defineOptions({
  name: "healthCheckUpWelfareEdit",
});
const router = useRouter();
const route = useRoute();
const model = ref({
  fund: null,
  claimName: null,
  claimFund: {
    first: null,
    second: null,
    thrid: null,
  },
});

const isError = ref({});

const isView = ref(false);
const isLoadings = ref(false);

const isEdit = computed(() => {
  return !isNaN(route.params.id);
});

onMounted(async () => {
  await init();
  isLoadings.value = false;
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

const row = ref([
  {
    id: 1,
    claimName: 'ได้รับเงินจากสิทธิที่เบิกได้ตามพระราชกฤษฎีกาเงินสวัสดิการเกี่ยวกับการรักษาพยาบาล',
    claimFund: null,
  },
  {
    id: 2,
    claimName: 'เบิกได้ตามประกาศสวัสดิการคณะกรรมการสวัสดิการ มหาวิทยาลัยบูรพา',
    claimFund: null,
  },
  {
    id: 3,
    claimName: null,
    claimFund: null,
  },
]);
const columns = ref([
  {
    name: "claimName",
    label: "ชื่อสิทธิ",
    align: "left",
    field: (row) => row.tools ?? "-",
    format: (val) => `${val}`,
    classes: "ellipsis",
  },
  {
    name: "claimFund",
    label: "จำนวนเงิน (บาท)",
    align: "right",
    field: (row) => row.tools ?? "-",
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
  isLoadings.value = true;
}
</script>
