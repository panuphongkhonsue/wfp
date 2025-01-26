<template>
  <q-page padding class="q-pt-none q-mb-lg">
    <DynamicBreadcrumb />

    <div class="row q-pb-md">
      <div class="col-md-8 col-12">
        <p class="q-mb-none col-8 q-mb-md">สิทธิ์คงเหลือ</p>
        <!-- card แถวที่ 1 -->
        <div class="row q-pb-md">
          <div class="col-12 col-md q-mr-md">
            <q-card class="border-card bg-blue-9 q-ms-md">
              <q-card-section class="q-px-lg row items-center justify-between">
                <!-- ข้อความ -->
                <div>
                  <p class="q-mb-none text-white font-20 font-bold q-pb-md">ทำฟัน</p>
                  <p class="q-mb-none text-white font-16 q-pb-sm">เงินคงเหลือ 2000 บาท</p>
                  <p class="q-mb-none text-white font-16">จำนวน 3 ครั้ง</p>
                </div>
                <!-- รูปภาพ -->
                <img src="../../assets/dentalwork.svg" alt="dental-work" class="q-pt-xl" />
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-md q-mr-md">
            <q-card class="border-card bg-blue-9" :class="{'q-mt-md': $q.screen.lt.md}">
              <q-card-section class="q-px-lg row items-center justify-between">
                <!-- ข้อความ -->
                <div>
                  <p class="q-mb-none text-white font-20 font-bold q-pb-md">ตรวจสุขภาพประจำปี</p>
                  <p class="q-mb-none text-white font-16 q-pb-sm">เงินคงเหลือ 2000 บาท</p>
                  <p class="q-mb-none text-white font-16">จำนวน - ครั้ง</p>
                </div>
                <!-- รูปภาพ -->
                <img src="../../assets/health-check.svg" alt="dental-work" class="q-pt-xl" />
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- card แถวที่ 2 -->
        <div class="row">
          <div class="col-12 col-md q-mr-md">
            <q-card class="border-card bg-blue-9">
              <q-card-section class="q-px-lg row items-center justify-between">
                <!-- ข้อความ -->
                <div>
                  <p class="q-mb-none text-white font-20 font-bold q-pb-md">สมรสโดยนิตินัย</p>
                  <p class="q-mb-none text-white font-16 q-pb-sm">เงินคงเหลือ 2000 บาท</p>
                  <p class="q-mb-none text-white font-16">จำนวน 3 ครั้ง</p>
                </div>
                <!-- รูปภาพ -->
                <img src="../../assets/marriage.svg" alt="dental-work" class="q-pt-xl" />
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-md q-mr-md">
            <q-card class="border-card bg-blue-9" :class="{'q-mt-md': $q.screen.lt.md}">
              <q-card-section class="q-px-lg row items-center justify-between">
                <!-- ข้อความ -->
                <div>
                  <p class="q-mb-none text-white font-20 font-bold q-pb-md">การศึกษาบุตร</p>
                  <p class="q-mb-none text-white font-16 q-pb-sm">เงินคงเหลือ 2000 บาท</p>
                  <p class="q-mb-none text-white font-16">จำนวน 3 ครั้ง</p>
                </div>
                <!-- รูปภาพ -->
                <img src="../../assets/child-education.svg" alt="dental-work" class="q-pt-xl" />
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <!-- ส่วนที่ 2: card ที่มีปุ่มดาวน์โหลด -->
      <div class="col-md-4 col-12">
        <div class="row q-mb-md items-center justify-between" :class="{'q-mt-md': $q.screen.lt.md}">
  <p class="q-mb-none col-4">ระเบียบการเบิกสวัสดิการ</p>
  <!-- แสดงปุ่มแก้ไขเมื่อไม่อยู่ในโหมดแก้ไข -->
  <q-btn
    v-if="!isEditing"
    color="orange-4"
    text-color="white"
    label="แก้ไข"
    class="font-14 border-button-edit"
    @click="toggleEdit"
  />
  <!-- แสดงปุ่มอัปโหลดและบันทึกเมื่ออยู่ในโหมดแก้ไข -->
  <div v-else class="row q-gutter-sm">
    <q-btn
      color="blue-10"
      text-color="white"
      label="อัปโหลด"
      class="font-14 border-button-edit"
    />
    <q-btn
      color="green-6"
      text-color="white"
      label="บันทึก"
      class="font-14 border-button-edit"
      @click="toggleEdit"
    />
  </div>
</div>
        <div class="col-4 col-md q-pb-sm">
          <q-card class="bg-grey-11 no-shadow no-border-radius">
            <q-card-section class="q-px-lg row items-center justify-between ">
              <div class="row">
                <!-- รูปภาพ -->
                <img src="../../assets/document.svg" alt="dental-work" class="q-mr-md" />
                <!-- ข้อความ -->
                <div>
                  <p class="q-mb-none font-14 q-px-md col-12">ระเบียบการเบิก_สวัสดิการทั่วไป.pdf</p>
                </div>
              </div>
              <q-btn  v-if="!isEditing" color="blue-10" text-color="white" label="ดาวน์โหลด" class="font-14 border-button" />
              <img v-else src="../../assets/deletefile.svg" alt="dental-work" class="q-mr-md" />
            </q-card-section>
          </q-card>
        </div>


        <div class="col-4 col-md q-pb-sm">
          <q-card class="bg-grey-11 no-shadow no-border-radius">
            <q-card-section class="q-px-lg row items-center justify-between">
              <div class="row">
                <!-- รูปภาพ -->
                <img src="../../assets/document.svg" alt="dental-work" class="q-mr-md" />
                <!-- ข้อความ -->
                <div>
                  <p class="q-mb-none font-14 q-px-md ">ระเบียบการเบิก_สวัสดิการสงเคราะห์ต่าง_ๆ.pdf</p>
                </div>
              </div>
              <q-btn  v-if="!isEditing" color="blue-10" text-color="white" label="ดาวน์โหลด" class="font-14 border-button" />
              <img v-else src="../../assets/deletefile.svg" alt="dental-work" class="q-mr-md" />
            </q-card-section>
          </q-card>
        </div>

        <div class="col-4 col-md q-pb-sm">
          <q-card class="bg-grey-11 no-shadow no-border-radius">
            <q-card-section class="q-px-lg row items-center justify-between">
              <div class="row">
                <!-- รูปภาพ -->
                <img src="../../assets/document.svg" alt="dental-work" class="q-mr-md" />
                <!-- ข้อความ -->
                <div>
                  <p class="q-mb-none font-14 q-px-md ">ระเบียบการเบิก_สวัสดิการเกี่ยวกับการศึกษาของบุตร.pdf</p>
                </div>
              </div>
              <q-btn  v-if="!isEditing" color="blue-10" text-color="white" label="ดาวน์โหลด" class="font-14 border-button" />
              <img v-else src="../../assets/deletefile.svg" alt="dental-work" class="q-mr-md" />
            </q-card-section>
          </q-card>
        </div>

        <div class="col-4 col-md q-pb-sm">
          <q-card class="bg-grey-11 no-shadow no-border-radius">
            <q-card-section class="q-px-lg row items-center justify-between">
              <div class="row">
                <!-- รูปภาพ -->
                <img src="../../assets/document.svg" alt="dental-work" class="q-mr-md" />
                <!-- ข้อความ -->
                <div>
                  <p class="q-mb-none font-14 q-px-md">ระเบียบการเบิก_สวัสดิการค่าสงเคราะห์การเสียชีวิต.pdf</p>
                </div>
              </div>
              <q-btn  v-if="!isEditing" color="blue-10" text-color="white" label="ดาวน์โหลด" class="font-14 border-button" />
              <img v-else src="../../assets/deletefile.svg" alt="dental-work" class="q-mr-md" />
            </q-card-section>
          </q-card>
        </div>
        <hr class="q-mt-xs bg-grey-2">
      </div>
    </div>
    <div class="row">
          <q-table :rows-per-page-options="[5, 10, 15, 20]" flat bordered :rows="model ?? []" :columns="columns"
            row-key="index" :loading="isLoading" :wrap-cells="$q.screen.gt.lg"
            table-header-class="font-bold bg-blue-10 text-white" v-model:pagination="pagination" ref="tableRef"
            @request="onRequest" @row-click="(evt, row, index) => viewData(row.requestId)" class="col-12 ">
            <template v-slot:body-cell-index="props">
              <q-td :props="props">
                {{ props.rowIndex + 1 }}
              </q-td>
            </template>
            <template v-slot:no-data="{ icon }">
              <div class="full-width row flex-center text-negative q-gutter-sm">
                <q-icon size="2em" :name="icon" />
                <span class="font-14 font-regular ">
                  Sorry, There isn't data from server.
                </span>
              </div>
            </template>
            <template v-slot:body-cell-statusName="props">
              <q-td :props="props" class="text-center">
                <q-badge class="font-regular font-14 weight-5 q-py-xs full-width"
                  :color="statusColor(props.row.status)">
                  <p class="q-py-xs q-ma-none full-width font-14" :class="textStatusColor(props.row.status)">
                    {{ props.row.status.name }}
                  </p>
                </q-badge>
              </q-td>
            </template>
            <template v-slot:body-cell-tools="props">
              <q-td :props="props" class="">
                <a v-show="props.row.status.statusId == 2" @click.stop.prevent="viewData(props.row.requestId)" class="text-dark q-py-sm q-px-xs cursor-pointer">
                  <q-icon :name="outlinedVisibility" size="xs" />
                </a>
                <a v-show="props.row.status.statusId == 3" @click.stop.prevent="goto(props.row.requestId)"
                  class="text-dark q-py-sm q-px-xs cursor-pointer">
                  <q-icon :name="outlinedEdit" size="xs" color="blue" />
                </a>
              </q-td>
            </template>
          </q-table>
        </div>
  </q-page>
</template>

<script setup>
import DynamicBreadcrumb from "components/DynamicBreadcrumb.vue";
import { statusColor, textStatusColor } from "src/components/status";
import { ref, onMounted } from "vue";
import { useListStore } from "src/stores/listStore";
import { formatDateThaiSlash } from "src/components/format";
import { Notify } from "quasar";
import {
  outlinedEdit,
  outlinedVisibility,
} from "@quasar/extras/material-icons-outlined";
const tableRef = ref();
const listStore = useListStore();
const isLoading = ref(false);
const isEditing = ref(false);

function toggleEdit() {
  isEditing.value = !isEditing.value;
}
onMounted(async () => {
  await init();
});

async function init() {
  pagination.value.rowsPerPage = listStore.getState();
  await tableRef.value.requestServerInteraction();
}

async function fetchFromServer() {
  try {
    // const result = await GspcApproveSerivce.list({
    //   pageNo: page,
    //   itemPerPage: count,
    //   keyword: filter.value.keyword,
    //   dateSelected: formatDateServer(filter.value.dateSelected),
    //   endDate: formatDateServer(filter.value.endDate),
    // });
    pagination.value.rowsNumber = 5;
    return;
  } catch (error) {
    Notify.create({
      message:
        error?.response?.data?.message ??
        "Something wrong please try again later.",
      position: "bottom-left",
      type: "negative",
    });
  }
}

function onRequest(props) {
  const { page, rowsPerPage, sortBy, descending } = props.pagination;
  listStore.setState(rowsPerPage);
  isLoading.value = true;
  setTimeout(async () => {
    try {
      const returnedData = await fetchFromServer(
        page,
        rowsPerPage,
        sortBy,
        descending
      );
      if (returnedData) model.value.splice(0, model.value.length, ...returnedData);
      pagination.value.page = page;
      pagination.value.rowsPerPage = rowsPerPage;
      pagination.value.sortBy = sortBy;
      pagination.value.descending = descending;
    } catch (error) {
      Promise.reject(error)
    }
    isLoading.value = false;
  }, 100);
}


const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 20,
});
const model = ref([
  {
    requestId: '670001',
    requestDate: new Date(),
    updateDate: new Date(),
    type: "สวัสดิการทั่วไป",
    status: {
      statusId: 2,
      name: "รอตรวจสอบ"
    },
  },
  {
    requestId: '670002',
    requestDate: new Date(),
    updateDate: new Date(),
    type: "สวัสดิการทั่วไป",
    status: {
      statusId: 2,
      name: "รอตรวจสอบ"
    },
  },
  {
    requestId: '670003',
    requestDate: new Date(),
    updateDate: new Date(),
    type: "สวัสดิการทั่วไป",
    status: {
      statusId: 3,
      name: "อนุมัติ"
    },
  },
  {
    requestId: '670004',
    requestDate: new Date(),
    updateDate: new Date(),
    type: "สวัสดิการทั่วไป",
    status: {
      statusId: 3,
      name: "อนุมัติ"
    },
  },
  {
    requestId: '670005',
    requestDate: new Date(),
    updateDate: new Date(),
    type: "สวัสดิการทั่วไป",
    status: {
      statusId: 3,
      name: "อนุมัติ"
    },
  },
]);
const columns = ref([
  {
    name: "index",
    label: "ลำดับ",
    align: "center",
    field: "index",
    classes: "ellipsis",
  },
  {
    name: "requestId",
    label: "เลขที่ใบเบิก",
    align: "left",
    field: (row) => row.requestId ?? "-",
    format: (val) => `${val}`,
    classes: "ellipsis",
  },
  {
    name: "requestDate",
    label: "วันที่ร้องขอ",
    align: "left",
    field: (row) => row.requestDate ?? "-",
    format: (val) => formatDateThaiSlash(val),
    classes: "ellipsis",
  },
  {
    name: "updateDate",
    label: "วันที่แก้ไขล่าสุด",
    align: "left",
    field: (row) => row.updateDate ?? "-",
    format: (val) => formatDateThaiSlash(val),
    classes: "ellipsis",
  },
  {
    name: "type",
    label: "ประเภท",
    align: "center",
    field: (row) => row.type ?? "-",
    classes: "ellipsis",
  },
  {
    name: "statusName",
    label: "สถานะ",
    align: "center",
    field: (row) => row.status?.name ?? "-",
    classes: "ellipsis",
  },
  {
    name: "tools",
    label: "จัดการ",
    align: "center",
    field: (row) => row.tools ?? "-",
    classes: "ellipsis",
  },
]);
</script>

<style scoped>
.border-card {
  border-radius: 25px;
  overflow: hidden;
}

.border-button {
  border-radius: 15px;
  padding: 8px 8px;

}

.border-button-edit {
  border-radius: 10px;
  padding: 0px 16px;

}

.dental-image {
  width: 100px;
  /* กำหนดขนาดรูปภาพ */
  height: auto;
}
</style>
