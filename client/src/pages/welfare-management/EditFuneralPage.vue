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
              <div class="col-lg-5 col-xl-4 col-12 row q-gutter-y-md q-pr-sm">
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

        <div class="col-md-3 col-12" v-if="!isView && !isLoading">
          <q-card flat bordered class="full-height">
            <q-card-section class="q-px-md q-py-md font-18 font-bold">
              <p class="q-mb-none">สิทธิ์คงเหลือ</p>
            </q-card-section>
            <q-separator />
            <q-card-section class="row wrap q-col-gutter-y-md font-medium font-16 text-grey-7">
              <p class="col-12 q-mb-none">
                ผู้ปฏิบัติงานเสียชีวิตเบิกได้สูงสุดไม่เกิน :
                {{ remaining[9]?.perTimesRemaining ?? "-" }}
                บาท 
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
              <p class="q-pl-md q-pb-md font-16 q-mb-none">(จ่ายจริงคนละไม่เกิน 10,000 บาท)</p>
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
            <q-card-section class="row wrap q-col-gutter-y-md q-px-md q-py-md font-medium font-16 text-grey-9">
              <div class="col-lg-4 col-12 q-mb-none">
                <InputGroup label="ชื่อ - นามสกุล" is-require :is-view="isView" :data="isView ? deceasedName : null">
                  <q-select v-model="model.deceased" :options="options"  :loading="isLoading"
                    :clearable="true" emit-value map-options option-value="id" option-label="name"
                    :rules="[(val) => !!val || '']" dense outlined use-input input-debounce="100" hide-bottom-space
                    :error="!!isError?.deceased" @filter="filterFn" />
                </InputGroup>
              </div>
              <q-card-section class="col-lg-8 col-12 row justify-around q-pt-none">
                <q-card-section class="col-12 row justify-around q-pt-none">
                  <div class="col-md-4 col-xl-4 col-12 q-mb-none q-pt-md">
                    <InputGroup is-dense :data="positionName" label="ตำแหน่ง :" placeholder="" type="text" class=""
                      :is-view="true">
                    </InputGroup>
                  </div>
                  <div class="col-md-4 col-xl-4 col-12 q-mb-none q-pt-md">
                    <InputGroup is-dense :data="sectorName" label="ภาควิชา :" placeholder="" type="text" class=""
                      :is-view="true">
                    </InputGroup>
                  </div>
                  <div class="col-md-4 col-xl-4 col-12 q-mb-none q-pt-md text-black">
                    <InputGroup is-dense :data="departmentName" label="ส่วนงาน :" placeholder="" type="text" class=""
                      :is-view="true">
                    </InputGroup>
                  </div>
                </q-card-section>
              </q-card-section>
              <q-card-section class="col-lg-4 col-12 q-mb-none q-px-none q-pb-none">
                <InputGroup for-id="fund" is-dense v-model="model.organizer" :data="model.organizer ?? '-'" is-require
                  label="จ่ายให้กับผู้จัดการงานศพ" placeholder="ชื่อ-นามสกุล" type="text" class="" :is-view="isView">
                </InputGroup>
              </q-card-section>
            </q-card-section>
            <q-card-section class="row wrap font-medium font-16 text-grey-9 q-pt-none">
              <div class="col-lg-4 col-12 ">
                <InputGroup for-id="fund" is-dense v-model="model.fundReceipt" :data="model.fund ?? '-'" is-require
                  label="จำนวนเงินตามใบเสร็จ" placeholder="บาท" type="number" class="" :is-view="isView">
                </InputGroup>
              </div>
              <div class="col-lg-2"></div>
              <div class="col-lg-4 col-12 ">
                <InputGroup for-id="fund" is-dense v-model="model.fundRequest" :data="model.fund ?? '-'" is-require
                  label="จำนวนเงินที่ต้องการเบิก" placeholder="บาท" type="number" class="" :is-view="isView">
                </InputGroup>
              </div>
            </q-card-section>
            <q-card-section class="row wrap font-medium font-16 text-grey-9 q-pt-none q-pb-none">
              <div class="q-pb-md q-mb-none font-16 font-bold text-black">
                <q-checkbox v-model="model.selectedWreath" val="wreathRequire" label="ค่าสนับสนุนค่าพวงหรีด"
                  :disable="isView" />
              </div>
              <p class="q-px-lg q-pt-sm q-pb-md font-16 q-mb-none ">(จ่ายไม่เกิน 2,000 บาท ในนามมหาวิทยาลัย และไม่เกิน
                2,000 บาท ในนามส่วนงาน)</p>
            </q-card-section>
            <q-card-section v-show="model.selectedWreath"
              class="row wrap font-medium font-16 text-grey-9 q-pt-none q-pb-none">
              <div class="col-lg-5 col-xl-4 col-12 q-pr-lg-xl ">
                <InputGroup for-id="fund" is-dense v-model="model.fundReceiptWreath" :data="model.fund ?? '-'"
                  is-require label="จำนวนเงินตามใบเสร็จ" placeholder="บาท" type="number" class="" :is-view="isView">
                </InputGroup>
              </div>
              <div class="col-lg-5 col-xl-4 col-12 q-pr-lg-xl">
                <InputGroup for-id="fund" is-dense v-model="model.fundWreathUniversity" :data="model.fund ?? '-'"
                  is-require label="จำนวนเงินที่ต้องการเบิก (ในนามมหาวิทยาลัย)" placeholder="บาท" type="number" class=""
                  :is-view="isView">
                </InputGroup>
              </div>
              <div class="col-lg-5 col-xl-4 col-12 q-pr-lg-xl ">
                <InputGroup for-id="fund" is-dense v-model="model.fundWreathArrange" :data="model.fund ?? '-'"
                  is-require label="จำนวนเงินที่ต้องการเบิกในนามส่วนงาน" placeholder="บาท" type="number" class=""
                  :is-view="isView">
                </InputGroup>
              </div>
            </q-card-section>

            <q-separator inset />
            <q-card-section class="col row">
              <div class=" q-pb-md q-mb-none font-16 font-bold">
                <q-checkbox v-model="model.selectedVehicle" label="ค่าสนับสนุนค่าพาหนะเหมาจ่าย" :disable="isView" />
              </div>
              <p class="q-px-lg q-pt-sm q-pb-md font-16 q-mb-none ">(จ่ายจริงคนละไม่เกิน 20,000 บาท)</p>
            </q-card-section>
            <q-card-section v-show="model.selectedVehicle"
              class="row wrap font-medium font-16 text-grey-9 q-pt-none q-pb-none">
              <div class="col-lg-5 col-xl-4 col-12 q-pr-lg-xl ">
                <InputGroup for-id="fund" is-dense v-model="model.fundReceiptVehicle" :data="model.fund ?? '-'"
                  is-require label="จำนวนเงินตามใบเสร็จ" placeholder="บาท" type="number" class="" :is-view="isView">
                </InputGroup>
              </div>
              <div class="col-lg-5 col-xl-4 col-12 q-pr-lg-xl">
                <InputGroup for-id="fund" is-dense v-model="model.fundVehicle" :data="model.fund ?? '-'" is-require
                  label="จำนวนเงินที่ต้องการเบิก" placeholder="บาท" type="number" class="" :is-view="isView">
                </InputGroup>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-md-3 col-12">
          <q-card flat bordered>
            <q-card-section class="q-px-md q-pt-md q-pb-md font-18 font-bold">
              <p class="q-mb-none">หลักฐานที่ต้องแนบ</p>
            </q-card-section>
            <q-separator />
            <q-card-section class="row wrap q-col-gutter-y-md q-px-md q-py-md font-medium font-16 text-grey-9">
              <p class="col-12 q-mb-none font-bold text-black font-18">ของผู้เสียชีวิต</p>
              <p class="col-12 q-mb-none">1. สำเนาใบมรณะบัตรผู้ปฏิบัติงาน</p>
              <p class="col-12 q-mb-none">2. สำเนาบัตรประจำตัวประชาชนผู้จัดการงานศพ</p>
              <p class="col-12 q-mb-none">3. ใบสำคัยรับเงินโดยผู้จัดการงานศพพร้อมคำรับรองการเป็นผู้จัดการงานศฑ</p>
              <p class="col-12 q-mb-none font-bold text-black font-18">ค่าสนับสนุนค่าพวงหรีด</p>
              <p class="col-12 q-mb-none">1. ใบเสร็จรับเงิน</p>
              <p class="col-12 q-mb-none">2. ใบสำคัญรับเงิน
                <br>(โดยเจ้าหน้าที่ผู้รับผิดชอบ
                <br>ด้านบุคคล ลงนามรับเงิน)
              </p>
              <p class="col-12 q-mb-none font-bold text-black font-18">ค่าสนับสนุนค่าพาหนะเหมาจ่าย</p>
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
          style="background : #BFBFBF;" label="ย้อนกลับ" no-caps :to="{ name: 'welfare_management_list' }" />
        <q-btn id="button-draft" class="text-white font-medium bg-blue-9 text-white font-16 weight-8 q-px-lg" dense
          type="submit" label="บันทึก" no-caps @click="submit()" v-if="!isView && !isLoading" />
        <q-btn id="button-approve" class="font-medium font-16 weight-8 text-white q-px-md" dense type="submit"
          style="background-color: #43a047" label="อนุมัติ" no-caps @click="submit(3)"
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
import { formatDateThaiSlash, } from "src/components/format";
import userManagementService from "src/boot/service/userManagementService";
import welfareManagementService from "src/boot/service/welfareManagementService";
import { outlinedDownload } from "@quasar/extras/material-icons-outlined";
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "src/stores/authStore";
import funeralWelfareEmployeeDeceasedService from "src/boot/service/funeralWelfareEmployeeDeceasedService";

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

const isError = ref({});
const remaining = ref({
  9: { fundRemaining: "-", requestsRemaining: "-", perTimesRemaining: "-" },
  10: { fundRemaining: "-", requestsRemaining: "-", perTimesRemaining: "-" },
  11: { fundRemaining: "-", requestsRemaining: "-", perTimesRemaining: "-" },
  12: { fundRemaining: "-", requestsRemaining: "-", perTimesRemaining: "-" }
});
const isView = ref(false);
const isLoading = ref(false);
const userData = ref({});
const canRequest = ref({
  wreath: false,
  vehicle: false,
});

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
  () => model.value.createFor,
  (newValue) => {
    try {
        if ((newValue !== null && newValue !== undefined) && !isView.value) {
          fetchRemaining();
          fetchUserData(newValue);
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

async function fetchDeceasedName() {
  if (!model.value.deceased) {
    console.warn("No deceased ID found!");
    return;
  }

  try {
    console.log("Fetching deceased name for ID:", model.value.deceased);

    const response = await userManagementService.dataById(model.value.deceased);
    const deceasedData = response.data.datas;

    if (deceasedData) {
      console.log("Deceased data:", deceasedData);

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

async function fetchDataEdit() {
  setTimeout(async () => {
    try {
      const result = await welfareManagementService.dataFuneralById(route.params.id);
      var returnedData = result.data.datas;
      if (returnedData) {
        model.value = {
          ...model,
          createFor: null,
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
      router.replace({ name: "welfare_management_list" });
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
    const fetchedData = await funeralWelfareEmployeeDeceasedService.getRemaining({
      createFor: model.value.createFor
    });

    const deceaseData = fetchedData.data?.datas;

    if (Array.isArray(deceaseData)) {
      deceaseData.forEach((item) => {
        remaining.value[item.categoriesId] = {
          fundRemaining: item.fundRemaining != null ? item.fundRemaining : "-",
          requestsRemaining: item.requestsRemaining != null ? item.requestsRemaining : "-",
          perTimesRemaining: item.perTimesRemaining != null ? item.perTimesRemaining : 0,
        };

        if (item.canRequest) {
          canRequest.value[item.categoriesId] = true;
        }
      });
    }
  } catch (error) {
    console.error("fetchRemaining error:", error);
    Notify.create({
      message: error?.message || "เกิดข้อผิดพลาดในการดึงข้อมูลสิทธิ์คงเหลือ",
      position: "bottom-left",
      type: "negative",
    });
  }
}


async function filterFn(val, update) {
  try {
    setTimeout(async () => {
      const result = await userManagementService.getUserInitialData({ keyword: val });
      var returnedData = result.data.datas;

      update(() => {
        if (returnedData) {
          options.value = returnedData;
        }
      });
    }, 650);

  }
  catch (error) {
    Promise.reject(error);
  }
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

  }
  if (model.value.selectedVehicle) {
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
  if (model.value.selectedVehicle) {
    if (!model.value.fundReceiptVehicle) {
      isError.value.fundReceiptVehicle = "กรุณากรอกข้อมูลจำนวนเงินตามใบสำคัญรับเงินสนับสนุนค่าพาหนะ";
      validate = true;
    }
    if (!model.value.fundVehicle) {
      isError.value.fundVehicle = "กรุณากรอกข้อมูลจำนวนเงินที่ต้องการเบิกในส่วนสนับสนุนค่าพาหนะ";
      validate = true;
    }

  }
if (!model.value.fundReceipt || !model.value.fundRequest) {
    isError.value.fundRequest = "กรุณากรอกจำนวนเงินให้ครบถ้วน";
    validate = true;
} else if (Number(model.value.fundReceipt) < Number(model.value.fundRequest)) {
    isError.value.fundRequest = "จำนวนเงินที่ต้องการเบิกต้องไม่เกินจำนวนเงินตามใบเสร็จ";
}
  if (!model.value.fundReceipt) {
    isError.value.fundReceipt = "กรุณากรอกข้อมูลจำนวนเงินตามใบเสร็จ";
    let navigate = document.getElementById("fund");
    window.location.hash = "fund";
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
    createFor: model.value.createFor,
    actionId: actionId
  }
  console.log(payload)
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
          fetch = await welfareManagementService.updateFuneral(route.params.id, payload);
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
        router.replace({ name: "welfare_management_list" });
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
      fetchRemaining();
      fetchDataEdit();
    }
    else {
      fetchRemaining();
      fetchUserData(authStore.id);
    }
  }
  catch (error) {
    Promise.reject(error);
  }
  isLoading.value = false;
}

</script>
