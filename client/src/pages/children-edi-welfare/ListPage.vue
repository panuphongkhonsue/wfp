<template>
  <ListLayout title="สวัสดิการเกี่ยวกับการรศึกษาของบุตร">
    <template v-slot:filter>
      <q-form class="col-12 row q-col-gutter-x-md" @submit="search">
        <div class="col-12 col-md-4 col-lg-3">
          <InputGroup more-class="font-16 font-medium" for-id="requesId" is-dense v-model="filter.keyword" label="ค้นหา"
            placeholder="ค้นหาจากเลขที่ใบเบิก">
          </InputGroup>
        </div>
        <div class="col-12 col-md-4 col-lg-3">
          <InputGroup more-class="font-16 font-medium" label="วันที่ร้องขอ" compclass="col-6 q-pr-none" clearable>
            <DatePicker is-dense v-model:model="filter.dateSelected" v-model:dateShow="modelDate" for-id="date"
              :no-time="true" range-time />
          </InputGroup>
        </div>
        <div class="col-12 col-md-4 col-lg-3 q-pt-lg">
          <q-select :loading="isLoading" id="selected-status" popup-content-class="font-14 font-regular"
            class="font-14 font-regular q-pt-sm" outlined v-model="filter.statusId" :options="options" label="สถานะ"
            multiple dense clearable option-value="statusId" emit-value map-options option-label="name">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No option </q-item-section>
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
      <div class="col-12 col-md-6 row font-bold font-16  q-col-gutter-x-md">
        <p class="col q-ma-none">สิทธิ์คงเหลือ : -</p>
        <p class="col q-ma-none">จำนวนเงินคงเหลือ : - </p>
      </div>
      <div class="col-12 col-md-6 flex justify-end">
        <q-btn id="add-req" class="font-medium font-14 bg-blue-10 text-white q-px-sm" label="เพิ่มใบเบิกสวัสดิการ"
          icon="add" :to="{ name: 'children_edu_welfare_new' }" />
      </div>
    </template>
    <template v-slot:table>
      <q-table :rows-per-page-options="[5, 10, 15, 20]" flat bordered :rows="model ?? []" :columns="columns"
        row-key="index" :loading="isLoading" :wrap-cells="$q.screen.gt.lg"
        table-header-class="font-bold bg-blue-10 text-white" v-model:pagination="pagination" ref="tableRef"
        @request="onRequest" @row-click="(evt, row, index) => viewData(row.requestId)">
        <template v-slot:body-cell-index="props">
          <q-td :props="props">
            {{ props.rowIndex + 1 }}
          </q-td>
        </template>
        <template v-slot:no-data="{ icon }">
          <div class="full-width row flex-center text-negative q-gutter-sm">
            <q-icon size="2em" :name="icon" />
            <span class="font-remark font-regular ">
              Sorry, There isn't data from server.
            </span>
          </div>
        </template>
        <template v-slot:body-cell-statusName="props">
          <q-td :props="props" class="text-center">
            <q-badge class="font-regular font-remark weight-5 q-py-xs full-width"
              :color="statusColor(props.row.status)">
              <p class="q-py-xs q-ma-none full-width font-14" :class="textStatusColor(props.row.status)">
                {{ props.row.status.name }}
              </p>
            </q-badge>
          </q-td>
        </template>
        <template v-slot:body-cell-tools="props">
          <q-td :props="props" class="">
            <a @click.stop.prevent="viewData(props.row.requestId)" class="text-dark q-py-sm q-px-xs cursor-pointer">
              <q-icon :name="outlinedVisibility" size="xs" />
            </a>
            <a v-show="props.row.status.statusId == 1" @click.stop.prevent="goto(props.row.requestId)"
              class="text-dark q-py-sm q-px-xs cursor-pointer">
              <q-icon :name="outlinedEdit" size="xs" color="blue" />
            </a>
            <a v-show="props.row.status.statusId == 1" @click.stop.prevent="
              deleteData(props.row.requestId)
              " class="text-dark q-py-sm q-px-xs cursor-pointer">
              <q-icon :name="outlinedDelete" size="xs" color="red" />
            </a>
            <a v-show="props.row.status.statusId == 2 || props.row.status.statusId == 3" @click.stop.prevent="
              downloadData(props.row.requestId)
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

import { formatDateThaiSlash } from "src/components/format";
import { statusColor, textStatusColor } from "src/components/status";
import { Notify } from "quasar";
import Swal from "sweetalert2";

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
  name: "healthCheckUpWelfareList",
});
const listStore = useListStore();
const router = useRouter();
const route = useRoute();
let options = [
  { statusId: 1, name: "บันทึกฉบับร่าง" },
  { statusId: 2, name: "รอตรวจสอบ" },
  { statusId: 3, name: "อนุมัติ" },
];;
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
const model = ref([
  {
    requestId: '670001',
    requestDate: new Date(),
    updateDate: new Date(),
    // money: 3000,
    // otherWelfare: 3000,
    // moneyCanGet: 3000,
    status: {
      statusId: 2,
      name: "รอตรวจสอบ"
    },
  },
  {
    requestId: '670002',
    requestDate: new Date(),
    updateDate: new Date(),
    // money: 3000,
    // otherWelfare: 3000,
    // moneyCanGet: 3000,
    status: {
      statusId: 1,
      name: "บันทึกฉบับร่าง"
    },
  },
  {
    requestId: '670003',
    requestDate: new Date(),
    updateDate: new Date(),
    // money: 3000,
    // otherWelfare: 3000,
    // moneyCanGet: 3000,
    status: {
      statusId: 3,
      name: "อนุมัติ"
    },
  },
  {
    requestId: '670004',
    requestDate: new Date(),
    updateDate: new Date(),
    // money: 3000,
    // otherWelfare: 3000,
    // moneyCanGet: 3000,
    status: {
      statusId: 1,
      name: "บันทึกฉบับร่าง"
    },
  },
  {
    requestId: '670005',
    requestDate: new Date(),
    updateDate: new Date(),
    // money: "3000",
    // otherWelfare: 3000,
    // moneyCanGet: 3000,
    status: {
      statusId: 1,
      name: "บันทึกฉบับร่าง"
    },
  },
]);
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
    modelDate.value = newValue.from + " - " + newValue.to;
  }
);

watch(
  () => route.query,
  async () => {
    await init();
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
        filter,
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

function viewData(requestId) {
  router.push({
    name: "children_edu_welfare_view",
    params: { id: requestId },
  });
}
function goto(requestId) {
  router.push({
    name: "children_edu_welfare_edit",
    params: { id: requestId },
  });
}

function downloadData(requestId) {
  console.log(requestId);
  // router.push({
  //   name: "",
  //   params: { id: requestId },
  // });
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
  router.push({
    name: router.name,
    query: {
      keyword: filter.value.keyword,
      dateSelected: JSON.stringify(filter.value.dateSelected),
      statusId: filter.value.statusId,
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
    name: "money",
    label: "จำนวนเงินที่เบิกตามใบเสร็จ / ใบสำคัญรับเงิน",
    align: "right",
    field: (row) => row.money ?? "-",
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
    name: "otherWelfare",
    label: "จำนวนเงินที่เบิกได้ตามสิทธ",
    align: "right",
    field: (row) => row.otherWelfare ?? "-",
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
    name: "moneyCanGet",
    label: "จำนวนเงินที่ขอเบิกทั้งหมด",
    align: "right",
    field: (row) => row.moneyCanGet ?? "-",
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
