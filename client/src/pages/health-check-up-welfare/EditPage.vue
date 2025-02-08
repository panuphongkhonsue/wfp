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
            <q-card-section class="row wrap font-medium q-pb-xs font-16 text-grey-9">
              <InputGroup for-id="fund" is-dense v-model="model.fundReceipt" :data="model.fundReceipt ?? '-'" is-require
                label="จำนวนเงินตามใบเสร็จ" placeholder="บาท" type="number" compclass="col-xs-12 col-lg-3 col-xl-2"
                :is-view="isView">
              </InputGroup>
            </q-card-section>
            <q-card-section class="q-pt-none font-medium font-16">
              <q-table flat bordered :rows="row ?? []" :columns="columns" row-key="id" :wrap-cells="$q.screen.gt.lg"
                table-header-class="font-bold bg-blue-10 text-white" separator="cell" hide-bottom ref="tableRef"
                :loading="isLoading" @request="onRequest">
                <template v-slot:loading>
                  <q-inner-loading showing color="primary" />
                </template>
                <template v-slot:body-cell-fundEligibleName="props">
                  <q-td v-if="props.row.fundEligibleName" :props="props" class="text-center text-grey-9">
                    {{ props.row.fundEligibleName }}
                  </q-td>
                  <q-td v-else :props="props" class="text-grey-9">
                    <q-input class="font-14 font-regular" dense
                      v-model="model.claimByEligible[props.row.id - 1].fundEligibleName" outlined autocomplete="off"
                      color="dark" type="text" :for="'input-fundEligibleName' + props.row.id" placeholder="">
                    </q-input>
                  </q-td>
                </template>
                <template v-slot:body-cell-fundEligible="props">
                  <q-td v-if="props.row.fundEligible" :props="props" class="text-center text-grey-9">
                    {{ props.row.fundEligible }}
                  </q-td>
                  <q-td v-else :props="props" class="text-grey-9">
                    <q-input class="font-14 font-regular" dense
                      v-model="model.claimByEligible[props.row.id - 1].fundEligible" outlined autocomplete="off"
                      color="dark" type="number" :forId="'input-fundEligible' + props.row.id" placeholder="0">
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
const tableRef = ref();
const isLoading = ref(false);
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

const row = ref([
  {
    id: 1,
    fundEligibleName: 'ได้รับเงินจากสิทธิที่เบิกได้ตามพระราชกฤษฎีกาเงินสวัสดิการเกี่ยวกับการรักษาพยาบาล',
    fundEligible: null,
  },
  {
    id: 2,
    fundEligibleName: 'เบิกได้ตามประกาศสวัสดิการคณะกรรมการสวัสดิการ มหาวิทยาลัยบูรพา',
    fundEligible: null,
  },
  {
    id: 3,
    fundEligibleName: null,
    fundEligible: null,
  },
]);
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
async function init() {
  await tableRef.value.requestServerInteraction();
  isView.value = route.meta.isView;
  isLoading.value = true;
}
</script>
