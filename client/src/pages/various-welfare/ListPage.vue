<template>
  <ListLayout title="สวัสดิการค่าสงเคราะห์ต่าง ๆ">
    <template v-slot:filter>
      <q-form class="col-12 row q-col-gutter-x-md" @submit="search">
        <div class="col-12 col-md-4 col-lg-3">
          <InputGroup more-class="font-16 font-medium" for-id="requesId" is-dense clearable v-model="filter.keyword" label="ค้นหา"
            placeholder="ค้นหาจากเลขที่ใบเบิก" >
          </InputGroup>
        </div>
        <div class="col-12 col-md-4 col-lg-3">
          <InputGroup more-class="font-16 font-medium" label="วันที่ร้องขอ" compclass="col-6 q-pr-none" clearable>
            <DatePicker is-dense v-model:model="filter.dateSelected" v-model:dateShow="modelDate" for-id="date"
              :no-time="true" range-time />
          </InputGroup>
        </div>
        <div class="col-12 col-md-4 col-lg-3 q-pt-lg">
          <q-select :loading="isLoading" id="selected-status" class="q-pt-sm" outlined v-model="filter.statusId"
            :options="options" label="สถานะ"  dense clearable option-value="statusId" emit-value map-options
            option-label="name">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> ไม่มีตัวเลือก </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div class="content-center q-pt-lg q-pt-md-xs col-2">
          <q-btn id="button-search" class="font-medium bg-blue-10 text-white font-16 q-px-sm q-pt-sm weight-8 q-mt-xs"
            dense type="submit" label="ค้นหา" icon="search" no-caps :loading="isLoading" />
        </div>
      </q-form>
    </template>
    <template v-slot:toolbar>
      <div class="col-12 col-md-10 row font-bold font-14 q-col-gutter-x-md ">
        <p class="col-12 col-md-3 q-ma-none">การเบิกสมรส : 2,000 บาท (1ครั้ง)</p>
        <p class="col-12 col-md-3 q-ma-none">การเบิกอุปสมบทหรือพิธีฮัจญ์ : 2,000 บาท (1ครั้ง)</p>
        <p class="col-12 col-md-3 q-ma-none">รับขวัญบุตร : 1,000 บาท</p>
        <p class="col-12 col-md-3 q-ma-none">กรณีประสบภัยพิบัติ : 10,000 บาท</p>
      </div>
      <div class="col-12 col-md-2 flex justify-end">
        <q-btn id="add-req" class="font-medium font-14 bg-blue-10 text-white q-px-sm" label="เพิ่มใบเบิกสวัสดิการ"
          icon="add" :to="{ name: 'various_welfare_new' }" />
      </div>
    </template>
    <template v-slot:table>
      <q-table :rows-per-page-options="[5, 10, 15, 20]" flat bordered :rows="model ?? []" :columns="columns"
        row-key="index" :loading="isLoading" :wrap-cells="$q.screen.gt.lg"
        table-header-class="font-bold bg-blue-10 text-white" v-model:pagination="pagination" ref="tableRef"
        @request="onRequest" @row-click="(evt, row, index) => viewData(row.id)">
        <q-inner-loading showing color="primary" />
        <template v-slot:body-cell-index="props">
          <q-td :props="props" >
            {{ props.rowIndex + 1 }}
          </q-td>
        </template>
        <template v-slot:no-data="{ icon }">
          <div class="full-width row flex-center text-negative q-gutter-sm">
            <q-icon size="2em" :name="icon" />
            <span class="font-remark font-regular ">
              ไม่พบข้อมูล
            </span>
          </div>
        </template>
        <template v-slot:body-cell-status="props">
          <q-td :props="props" class="text-center">
            <q-badge class="font-regular font-remark weight-5 q-py-xs full-width"
              :color="statusColor(props.row.status)">
              <p class="q-py-xs q-ma-none full-width font-14" :class="textStatusColor(props.row.status)">
                {{ props.row.status }}
              </p>
            </q-badge>
          </q-td>
        </template>
        <template v-slot:body-cell-tools="props">
          <q-td :props="props" class="">
            <a @click.stop.prevent="viewData(props.row.id)" class="text-dark q-py-sm q-px-xs cursor-pointer">
              <q-icon :name="outlinedVisibility" size="xs" />
            </a>
            <a v-show="props.row.status == 'บันทึกฉบับร่าง'" @click.stop.prevent="goto(props.row.id)"
              class="text-dark q-py-sm q-px-xs cursor-pointer">
              <q-icon :name="outlinedEdit" size="xs" color="blue" />
            </a>
            <a v-show="props.row.status == 'บันทึกฉบับร่าง'" @click.stop.prevent="
              deleteData(props.row.id)
              " class="text-dark q-py-sm q-px-xs cursor-pointer">
              <q-icon :name="outlinedDelete" size="xs" color="red" />
            </a>
            <a v-show="props.row.status == 'รอตรวจสอบ'|| props.row.status == 'อนุมัติ'" @click.stop.prevent="
              downloadData(props.row.id)
              " class="text-dark q-py-sm q-px-xs cursor-pointer">
              <q-icon :name="outlinedDownload" size="xs" color="blue" />
            </a>
          </q-td>
        </template>
      </q-table>
    </template>
  </ListLayout>
</template>

<script setup>
import ListLayout from "src/layouts/ListLayout.vue";
import InputGroup from "src/components/InputGroup.vue";
import DatePicker from "src/components/DatePicker.vue";

import { formatDateThaiSlash, formatDateServer } from "src/components/format";
import { statusColor, textStatusColor } from "src/components/status";
import { Notify } from "quasar";
import Swal from "sweetalert2";

import variousWelfareService from "src/boot/service/variousWelfareService";

import { useListStore } from "src/stores/listStore";
import { useRoute, useRouter } from "vue-router";

import { ref, onMounted, watch, onBeforeUnmount } from "vue";

import {
  outlinedEdit,
  outlinedVisibility,
  outlinedDelete,
  outlinedDownload,
} from "@quasar/extras/material-icons-outlined";
defineOptions({
  name: "various_welfare_list",
});
const listStore = useListStore();
const router = useRouter();
const route = useRoute();
let options = [
  { status: "บันทึกฉบับร่าง", name: "บันทึกฉบับร่าง" },
  { status: "รอตรวจสอบ", name: "รอตรวจสอบ" },
  { status: "อนุมัติ", name: "อนุมัติ" },
];
const modelDate = ref(null);
const filter = ref({
  keyword: null,
  dateSelected: null,
  statusId: null,
});
const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 20,
});
const model = ref([]);
const tableRef = ref();

onMounted(async () => {
  await init();
});

onBeforeUnmount(() => {
  isLoading.value = false;
  model.value = null;
});

watch(
  () => filter.value.dateSelected,
  (newValue) => {
    console.log(newValue);
    if (typeof newValue === "object" && newValue !== null) modelDate.value = newValue.from + " - " + newValue.to;
    else modelDate.value = newValue;
  }
);


watch(
  () => route.query,
  async () => {
    await init();
  }
);

watch(
  () => modelDate.value,
  (newValue) => {
    if (!newValue) {
      filter.value.dateSelected = newValue;
    }
  }
);

async function init() {
  const { keyword, dateSelected, statusId } = route.query;
  if (Object.keys(route.query).length) {
    filter.value.keyword = keyword ?? null;
    filter.value.dateSelected = dateSelected ? JSON.parse(dateSelected) : null;
    filter.value.statusId = statusId ?? null;
  }
  pagination.value.rowsPerPage = listStore.getState();
  await tableRef.value.requestServerInteraction();
}

async function fetchFromServer(page, itemPerPage, filter) {
  try {
    const result = await variousWelfareService.list({
      pageNo: page,
      itemPerPage: itemPerPage,
      keyword: filter.keyword,
      from: formatDateServer(filter.dateSelected?.from) ?? formatDateServer(filter.dateSelected),
      to: formatDateServer(filter.dateSelected?.to) ?? null,
      status: filter.status,
    });
    pagination.value.rowsNumber = result.data?.pagination?.total;
    return result.data.datas;
  } catch (error) {
    console.log(error);
    Notify.create({
      message:
        error?.response?.data?.errors ??
        "เกิดข้อผิดพลาดกรุณาลองอีกครั้ง",
      position: "bottom-left",
      type: "negative",
    });
  }
}

function onRequest(props) {
  const { page, rowsPerPage,} = props.pagination;
  listStore.setState(rowsPerPage);
  isLoading.value = true;
  setTimeout(async () => {
    try {
      const returnedData = await fetchFromServer(
        page,
        rowsPerPage,
        filter.value,
      );
      if (returnedData) model.value.splice(0, model.value.length, ...returnedData);
      pagination.value.page = page;
      pagination.value.rowsPerPage = rowsPerPage;
    } catch (error) {
      Promise.reject(error)
    }
    isLoading.value = false;
  }, 100);
}

function viewData(requestId) {
  router.push({
    name: "various_welfare_view",
    params: { id: requestId },
  });
}
function goto(requestId) {
  router.push({
    name: "various_welfare_edit",
    params: { id: requestId },
  });
}

function downloadData(requestId) {
  router.push({
    name: "",
    params: { id: requestId },
  });
}

async function deleteData(id) {
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
        // await GspcRequestService.delete(id);
      } catch (error) {
        Swal.showValidationMessage(`Delete Request Failed.`);
        Notify.create({
          message:
            error?.response?.data?.message ??
            "Delete Request Failed, Something wrong please try again later.",
          position: "bottom-left",
          type: "negative",
        });
      }
    },
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        html: `Request code <b>${id}</b> deleted.`,
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "save-button",
        },
      }).then(() => {
        location.reload();
      });
    }
  });
}

function search() {
  if (!filter.value.dateSelected) filter.value.dateSelected = '';
  router.push({
    name: router.name,
    query: {
      keyword: filter.value.keyword,
      dateSelected: filter.value.dateSelected ? JSON.stringify(filter.value.dateSelected) : null,
      status: filter.value.statusId,
    },
  });
}

const isLoading = ref(false);
const columns = ref([
  {
    name: "index",
    label: "ลำดับ",
    align: "center",
    field: "index",
    classes: "ellipsis",
  },
  {
    name: "reimNumber",
    label: "เลขที่ใบเบิก",
    align: "left",
    field: (row) => row.reimNumber ?? "-",
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
    name: "updatedAt",
    label: "วันที่แก้ไขล่าสุด",
    align: "left",
    field: (row) => row.updatedAt ?? "-",
    format: (val) => formatDateThaiSlash(val),
    classes: "ellipsis",
  },
  {
    name: "money",
    label: "จำนวนเงินตามใบเสร็จ / ใบสำคัญรับเงิน",
    align: "right",
    field: (row) => row.fundReceipt ?? "-",
    format: (val) => {
      const number = Number(val); // Convert to number
      if (!isNaN(number)) {
        return number.toLocaleString("en-US"); // Format as '3,000'
      }
      return `${val}`; // If conversion fails, return a fallback value
    },
    classes: "ellipsis",
  },
  // {
  //   name: "otherWelfare",
  //   label: "จำนวนเงินที่เบิกได้ตามสิทธิ์",
  //   align: "right",
  //   field: (row) => row.otherWelfare ?? "-",
  //   format: (val) => {
  //     const number = Number(val); // Convert to number
  //     if (!isNaN(number)) {
  //       return number.toLocaleString("en-US"); // Format as '3,000'
  //     }
  //     return `${val}`; // If conversion fails, return a fallback value
  //   },
  //   classes: "ellipsis",
  // },
  {
    name: "moneyCanGet",
    label: "จำนวนเงินที่ขอเบิกทั้งหมด",
       align: "right",
    field: (row) => row.fundSumRequest ?? "-",
    format: (val) => {
      const number = Number(val); // Convert to number
      if (!isNaN(number)) {
        return number.toLocaleString("en-US"); // Format as '3,000'
      }
      return `${val}`; // If conversion fails, return a fallback value
    },
    classes: "ellipsis",
  },
  {
    name: "status",
    label: "สถานะ",
    align: "center",
    field: (row) => row.status ?? "-",
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
