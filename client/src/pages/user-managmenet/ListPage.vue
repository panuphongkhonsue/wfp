<template>
  <ListLayout title="จัดการข้อมูลบุคลากร">
    <template v-slot:filter>
      <q-form class="col-12 row q-col-gutter-x-md" @submit="search">
        <div class="col-12 col-md-4 col-lg-3">
          <InputGroup more-class="font-16 font-medium" for-id="requesId" is-dense v-model="filter.keyword" label="ค้นหา"
            placeholder="ชื่อ-นามสกุล" clearable>
          </InputGroup>
        </div>
        <div class="content-center q-pt-xs-lg  q-pt-md-xs q-mt-md-lg col-md-2 col-12">
          <q-btn id="button-search" class="font-medium bg-blue-10 text-white font-16 q-px-sm weight-8 q-mt-xs"
            dense type="submit" label="ค้นหา" icon="search" no-caps :loading="isLoading" />
        </div>
      </q-form>
    </template>

    <template v-slot:table>
      <div class="col-12 q-pb-md q-pr-md flex justify-end">
        <q-btn id="add-req" class="font-medium font-14 bg-blue-10 text-white q-px-sm" label="เพิ่มบุคลากร" icon="add"
          :to="{ name: 'user_management_new' }" />
      </div>
      <q-table :rows-per-page-options="[5, 10, 15, 20]" flat bordered :rows="model ?? []" :columns="columns"
        row-key="index" :loading="isLoading" :wrap-cells="$q.screen.gt.lg"
        table-header-class="font-bold bg-blue-10 text-white" v-model:pagination="pagination" ref="tableRef"
        @request="onRequest" @row-click="(evt, row, index) => viewData(row.id)">
        <template v-slot:body-cell-index="props">
          <q-td :props="props">
            {{ props.rowIndex + 1 }}
          </q-td>
        </template>
        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
        </template>
        <template v-slot:no-data="{ icon }">
          <div class="full-width row flex-center text-negative q-gutter-sm">
            <q-icon size="2em" :name="icon" />
            <span class="font-14 font-regular ">
              ไม่พบข้อมูล
            </span>
          </div>
        </template>
        <template v-slot:body-cell-tools="props">
          <q-td :props="props" class="">
            <a @click.stop.prevent="viewData(props.row.id)" class="text-dark q-py-sm q-px-xs cursor-pointer">
              <q-icon :name="outlinedVisibility" size="xs" />
            </a>
            <a @click.stop.prevent="goto(props.row.id)" class="text-dark q-py-sm q-px-xs cursor-pointer">
              <q-icon :name="outlinedEdit" size="xs" color="blue" />
            </a>
            <a @click.stop.prevent="deleteData(props.row.id, props.row.name)"
              class="text-dark q-py-sm q-px-xs cursor-pointer">
              <q-icon :name="outlinedDelete" size="xs" color="red" />
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

import Swal from "sweetalert2";
import { Notify } from "quasar";

import { useListStore } from "src/stores/listStore";
import { useRoute, useRouter } from "vue-router";

import userManagementService from "src/boot/service/userManagementService";
import { ref, onMounted, watch, onBeforeUnmount } from "vue";

import {
  outlinedEdit,
  outlinedVisibility,
  outlinedDelete,
} from "@quasar/extras/material-icons-outlined";
defineOptions({
  name: "healthCheckUpWelfareList",
});
const listStore = useListStore();
const router = useRouter();
const route = useRoute();
const filter = ref({
  keyword: null,
});
const pagination = ref({
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
  () => route.query,
  async () => {
    await init();
  }
);


async function init() {
  const { keyword } = route.query;
  if (Object.keys(route.query).length) {
    filter.value.keyword = keyword ?? null;
  }
  pagination.value.rowsPerPage = listStore.getState();
  await tableRef.value.requestServerInteraction();
}
async function deleteData(id, name) {
  Swal.fire({
    title: "ยืนยันการลบข้อมูลหรือไม่ ???",
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
        await userManagementService.delete(id);
      } catch (error) {
        Swal.fire({
          html: error?.response?.data?.message ?? `เกิดข้อผิดพลาดกรุณาลองอีกครั้ง`,
          icon: "error",
          confirmButtonText: "ตกลง",
          customClass: {
            confirmButton: "save-button",
          },
        });
      }
    },
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        html: `ผู้ใช้งาน <b>${name}</b> ถูกลบ`,
        icon: "success",
        confirmButtonText: "ตกลง",
        customClass: {
          confirmButton: "save-button",
        },
      }).then(() => {
        location.reload();
      });
    }
  });
}
async function fetchFromServer(page, itemPerPage, filter) {
  try {
    const result = await userManagementService.list({
      page: page,
      itemPerPage: itemPerPage,
      keyword: filter.keyword,
    });
    pagination.value.rowsNumber = result.data?.pagination?.total;
    return result.data.datas;
  } catch (error) {
    Notify.create({
      message:
        error?.response?.data?.message ??
        "เกิดข้อผิดพลาดกรุณาลองอีกครั้ง",
      position: "bottom-left",
      type: "negative",
    });
  }
}

function onRequest(props) {
  const { page, rowsPerPage } = props.pagination;
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
    name: "user_management_view",
    params: { id: requestId },
  });
}
function goto(requestId) {
  router.push({
    name: "user_management_edit",
    params: { id: requestId },
  });
}

function search() {
  router.push({
    name: router.name,
    query: {
      keyword: filter.value.keyword,
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
    name: "name",
    label: "ชื่อ - นามสกุล",
    align: "left",
    field: (row) => row?.name ?? "-",
    format: (val) => `${val}`,
    classes: "ellipsis",
  },
  {
    name: "position",
    label: "ตำแหน่ง",
    align: "left",
    field: (row) => row?.position ?? "-",
    classes: "ellipsis",
  },
  {
    name: "employeeType",
    label: "ประเภทบุคลากร",
    align: "left",
    field: (row) => row?.employeeType ?? "-",
    classes: "ellipsis",
  },
  {
    name: "department",
    label: "ส่วนงาน",
    align: "left",
    field: (row) => row?.department ?? "-",
    classes: "ellipsis",
  },
  {
    name: "sector",
    label: "ภาควิชา",
    align: "left",
    field: (row) => row?.sector ?? "-",
    classes: "ellipsis",
  },
  {
    name: "tools",
    label: "จัดการ",
    align: "center",
    field: (row) => row?.tools ?? "-",
    classes: "ellipsis",
  },
]);
</script>
