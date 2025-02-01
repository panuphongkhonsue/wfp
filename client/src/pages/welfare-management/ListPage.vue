<template>
  <ListLayout title="จัดการข้อมูลการเบิกสวัสดิการ">
    <template v-slot:filter>
      <q-form class="col-12 row q-col-gutter-x-md" @submit="search">

        <div class="col-12 col-md ">
          <InputGroup more-class="font-16 font-medium" for-id="requesId" is-dense v-model="filter.keyword" label="ค้นหา"
            placeholder="ค้นหาจากเลขที่ใบเบิก">
          </InputGroup>
        </div>

        <div class="col-12 col-md ">
          <InputGroup more-class="font-16 font-medium" label="วันที่ร้องขอ" compclass="col-6 q-pr-none" clearable>
            <DatePicker is-dense v-model:model="filter.dateSelected" v-model:dateShow="modelDate" for-id="date"
              :no-time="true" range-time />
          </InputGroup>
        </div>

        <div class="col-12 col-md-4 col-lg-3 q-pt-lg">
          <q-select :loading="isLoading" id="selected-status" class="q-pt-sm" outlined v-model="filter.statusId"
            :options="optionStatus" label="สถานะ" multiple dense clearable option-value="statusId" emit-value map-options
            option-label="name">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> No option </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>

        <div class="col-12 col-md q-pt-lg">
          <q-select :loading="isLoading" id="selected-welfares" class="q-pt-sm" outlined v-model="filter.welfareId"
            :options="optionWelfareType" label="ประเภทสวัสดิการ" multiple dense clearable option-value="welfareId" emit-value
            map-options option-label="name">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">No option</q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>

        <div class="col-12 col-md content-center q-pt-lg q-pt-md-xs ">
          <q-btn id="button-search" class="font-medium bg-blue-10 text-white font-16 q-px-sm q-pt-sm weight-8 q-mt-xs"
            dense type="submit" label="ค้นหา" icon="search" no-caps :loading="isLoading" />
        </div>
      </q-form>
    </template>

    <template v-slot:table>
      <q-table :rows-per-page-options="[5, 10, 15, 20]" flat bordered :rows="model ?? []" :columns="columns"
        row-key="index" :loading="isLoading" :wrap-cells="$q.screen.gt.lg"
        table-header-class="font-bold bg-blue-10 text-white" v-model:pagination="pagination" ref="tableRef"
        @request="onRequest">

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

      </q-table>
    </template>

  </ListLayout>


</template>

<script setup>
import InputGroup from "src/components/InputGroup.vue";
import ListLayout from "src/layouts/ListLayout.vue";
import DatePicker from "src/components/DatePicker.vue";
import { ref ,watch ,onMounted ,onBeforeUnmount} from "vue";
import { useRoute, useRouter } from "vue-router";
import { useListStore } from "src/stores/listStore";
import { statusColor, textStatusColor } from "src/components/status";
import { Notify } from "quasar";
import Swal from "sweetalert2";


import {
  outlinedEdit,
  outlinedVisibility,
  outlinedDelete,
  outlinedDownload,
} from "@quasar/extras/material-icons-outlined";

const router = useRouter();
const route = useRoute();
const listStore = useListStore();
const tableRef = ref();
const modelDate = ref(null);
const pagination = ref({ page: 1, rowsPerPage: 5 });
const isLoading = ref(false);

const filter = ref({
  keyword: null,
  dateSelected: null,
  welfareId: null,
  statusId: null,
});
let optionStatus = [
  { statusId: 1, name: "บันทึกฉบับร่าง" },
  { statusId: 2, name: "รอตรวจสอบ" },
  { statusId: 3, name: "อนุมัติ" },
];
let optionWelfareType = [
  { welfareId: 1, name: "สวัสดิการทั่วไป" },
  { welfareId: 2, name: "สวัสดิการค่าสงเคราะห์ต่างๆ" },
  { welfareId: 3, name: "สวัสดิการค่าเทอมบุตร" },
];

const columns = [
  { name: "index", label: "ลำดับ", align: "left", field: "index" },
  { name: "reimNumber", label: "เลขที่ใบเบิก", align: "left", field: (row) => row.reimNumber ?? "-" },
  { name: "createdBy", label: "ผู้ร้องขอ", align: "left", field: (row) => row.createdBy ?? "-" },
  { name: "sendDate", label: "วันที่ร้องขอ", align: "left", field: (row) => row.sendDate ?? "-" },
  { name: "updatedAt", label: "วันที่แก้ไขล่าสุด", align: "left", field: (row) => row.updatedAt ?? "-" },
  { name: "welfareType", label: "ประเภท", align: "left", field: (row) => row.welfareType ?? "-" },
  { name: "subCategory", label: "ประเภทย่อย", align: "left", field: (row) => row.subCategory ?? "-" },
  { name: "statusName", label: "สถานะ", align: "center", field: (row) => row.status?.name ?? "-" },
  { name: "tools", label: "จัดการ", align: "left", field: "tools" },
];

const model = ref([
  {
    id: 1,
    reimNumber: 6706462,
    createdBy: 'ศรัณต์ เรืองไทย',
    sendDate: '15/ก.พ./2567',
    updatedAt: '15/ก.พ./2567',
    welfareType: 'สวัสดิการทั่วไป',
    subCategory: 'ค่าตรวจสุขภาพ',
    status: {
      statusId: 2,
      name: "รอตรวจสอบ"
    },
  },
  {
    id: 2,
    reimNumber: 6706462,
    createdBy: 'ภานุพงค์ คนซื่อ',
    sendDate: '17/ม.ค./2567',
    updatedAt: '19/ก.พ./2567',
    welfareType: 'สวัสดิการทั่วไป',
    subCategory: 'ค่าทำฟัน',
    status: {
      statusId: 1,
      name: "บันทึกฉบับร่าง"
    },
  },
]);


watch(
  () => filter.value.dateSelected,
  (newValue) => {
    modelDate.value = newValue.from + " - " + newValue.to;
  }
);

onBeforeUnmount(() => {
  isLoading.value = false;
  model.value = null;
});

onMounted(async () => {
  await init();
});

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

function viewData(requestId) {
  router.push({
    name: "health_check_up_welfare_view",
    params: { id: requestId },
  });
}
function goto(requestId) {
  router.push({
    name: "health_check_up_welfare_edit",
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
</script>