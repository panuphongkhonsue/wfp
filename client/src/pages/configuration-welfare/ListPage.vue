<template>
  <ListLayout title="จัดการข้อมูลการเบิกสวัสดิการ">
    <template v-slot:filter>
      <q-form class="col-12 row q-col-gutter-x-md" @submit="search">
        
        <div class="content-center col-12 col-md-4 col-lg-3">
          <q-select :loading="isLoading" id="selected-welfares" class="q-pt-sm" outlined v-model="filter.welfareId"
            :options="optionWelfareType" label="ประเภทสวัสดิการ" dense clearable option-value="welfareId" emit-value
            map-options option-label="name">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">No option</q-item-section>
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

        <template v-slot:body-cell-fund="props">
          <q-td v-if="clickEditIndex !== props.rowIndex" :props="props" class="text-center">
            {{ formatNumber(props.row.fund) }}
          </q-td>
          <q-td v-else :props="props">
            <q-input class="font-14 font-regular" dense v-model="payload.fund" outlined autocomplete="off"
              color="dark" type="number" :forId="'input-fund' + props.row.id" :placeholder=props.row.fund>
            </q-input>
          </q-td>
        </template>

        <template v-slot:body-cell-perYears="props">
          <q-td v-if="clickEditIndex !== props.rowIndex" :props="props" class="text-center">
            {{ props.row.perYears }}
          </q-td>
          <q-td v-else :props="props">
            <q-input class="font-14 font-regular" dense v-model="payload.perYears" outlined autocomplete="off"
              color="dark" type="number" :forId="'input-per-years' + props.row.id" :placeholder=props.row.perYears>
            </q-input>
          </q-td>
        </template>

        <template v-slot:body-cell-perTimes="props">
          <q-td v-if="clickEditIndex !== props.rowIndex" :props="props" class="text-center">
            {{ formatNumber(props.row.perTimes) }}
          </q-td>
          <q-td v-else :props="props">
            <q-input class="font-14 font-regular" dense v-model="payload.perTimes" outlined autocomplete="off"
              color="dark" type="number" :forId="'input-per-times' + props.row.id" :placeholder=props.row.perTimes>
            </q-input>
          </q-td>
        </template>

        <template v-slot:body-cell-tools="props">
          <q-td v-if="clickEditIndex !== props.rowIndex" :props="props">
            <a @click.stop.prevent="onClickEdit(props.rowIndex)" class="text-dark q-py-sm q-px-xs cursor-pointer">
              <q-icon :name="outlinedEdit" size="xs" color="blue" />
            </a>
          </q-td>
          <q-td v-else :props="props">
            <q-btn id="button-search" class="font-medium bg-blue-10 text-white font-16 q-px-md weight-8"
            dense type="submit" label="บันทึก" no-caps :loading="isLoading" />
            {{ props.row }}
          </q-td>
        </template>

      </q-table>
    </template>

  </ListLayout>


</template>

<script setup>
import ListLayout from "src/layouts/ListLayout.vue";
import { ref, onMounted, watch, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useListStore } from "src/stores/listStore";
import { Notify } from "quasar";
import {
  outlinedEdit,
} from "@quasar/extras/material-icons-outlined";
import configWelfareService from "src/boot/service/configWelfareService";
import {formatNumber} from "src/components/format"

import { useAuthStore } from "src/stores/authStore";

const authStore = useAuthStore();
const clickEditIndex = ref(null);
const modelDate = ref(null);
const route = useRoute();
const router = useRouter();
const isLoading = ref(false);
const listStore = useListStore();
const tableRef = ref();
const payload = ref(
  {
    fund: null,
    perTimes: null,
    perYears: null,
  }
);
const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 20,
});

const filter = ref({
  welfareId: null,
});

let optionWelfareType = [
  { welfareId: 1, name: "สวัสดิการทั่วไป" },
  { welfareId: 2, name: "สวัสดิการค่าสงเคราะห์ต่าง ๆ" },
  { welfareId: 3, name: "สวัสดิการค่าสงเคราะห์การเสียชีวิตของผู้ปฏิบัติงาน" },
  { welfareId: 4, name: "สวัสดิการเกี่ยวกับการศึกษาของบุตร" },
];

const columns = [
  { name: "index", label: "ลำดับ", align: "center", field: "index" },
  { name: "welfareType", label: "ประเภทสวัสดิการ", align: "left", field: "welfareType" },
  { name: "subCategory", label: "ประเภทย่อย", align: "left", field: "subCategory" },
  { name: "description", label: "รายละเอียดเพิ่มเติม", align: "left", field: "description" },
  { name: "fund", label: "เพดานเงิน", align: "right", field: (row) => row.fund ?? "-" },
  { name: "perYears", label: "จำนวนครั้ง (ต่อปี)", align: "right", field: "perYears" },
  { name: "perTimes", label: "ครั้งละไม่เกิน", align: "right", field: "perTimes" },
  { name: "tools", label: "จัดการ", align: "center", field: "tools" },
];

const model = ref([
  
]);

function onClickEdit(index) {
  // Toggle edit mode for the clicked row
  if (clickEditIndex.value === index) {
    clickEditIndex.value = null;  // If the same row is clicked again, toggle it off
  } else {
    clickEditIndex.value = index;  // Set the row as being edited
  }
}

onMounted(async () => {
  await init();
  authStore.setToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJuYW1lIjoiIiwiZW1haWwiOiIiLCJwb3NpdGlvbiI6IuC4reC4suC4iOC4suC4o-C4ouC5jCIsImRlcGFydG1lbnQiOiLguKrguJbguLLguJrguLHguJnguIHguLLguKPguKjguLbguIHguKnguLIiLCJzZWN0b3IiOiLguKfguLTguKjguKfguIHguKPguKPguKHguIvguK3guJ_guJXguYzguYHguKfguKPguYwiLCJyb2xlSUQiOjR9LCJyb2xlIjp7ImlkIjo0LCJuYW1lIjoi4Lic4Li54LmJ4LiU4Li54LmB4Lil4Lij4Liw4Lia4LiaIn0sImlhdCI6MTczODMzOTkxOCwiZXhwIjoxNzM4NDI2MzE4fQ.aXVtg5AuLMp2ERYH4b09Uh0FCLAhkTIWpCDeqIAPCSM");
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
  const { welfareId } = route.query;
  if (Object.keys(route.query).length) {
    filter.value.welfareId = welfareId
      ? Array.isArray(welfareId)
        ? welfareId.map(Number)
        : Number(welfareId)
      : null;
  }
  pagination.value.rowsPerPage = listStore.getState();
  await tableRef.value.requestServerInteraction();
}

async function fetchFromServer() {
  try {
    const allConfigWelfare = await configWelfareService.getConfigWelfare({
      welfareId : filter.value.welfareId ?? '', 
      page : pagination.value.page,
      itemPerPage : pagination.value.rowsPerPage,
    });
    console.log(`configWelfare : `, allConfigWelfare)
    model.value = allConfigWelfare.data.docs.map(item => ({
      welfareId: item.welfare_id,
      welfareType: item.welfare_name,
      subCategory: item.category_name,
      description: item.sub_category_name ?? '-',
      fund: item.category_fund ?? item.sub_category_fund ?? '-',
      perYears: item.category_per_years ?? item.sub_category_per_years ?? '-',
      perTimes: item.category_per_times ?? item.sub_category_per_times ?? '-',
    }));
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

function search() {
  router.push({
    name: router.name,
    query: {
      welfareId: filter.value.welfareId,
    },
  });
}


</script>