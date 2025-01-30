<template>
  <ListLayout title="จัดการข้อมูลการเบิกสวัสดิการ">
    <template v-slot:filter>
      <q-form class="col-12 row q-col-gutter-x-md" @submit="search">
        <div class="col-12 col-md-4 col-lg-3">
          <InputGroup more-class="font-16 font-medium" for-id="requesId" is-dense v-model="filter.keyword" label="ค้นหา"
            placeholder="ค้นหาจากเลขที่ใบเบิก">
          </InputGroup>
        </div>
        <div class="col-12 col-md-4 col-lg-3 q-pt-lg">
          <q-select :loading="isLoading" id="selected-welfares" class="q-pt-sm" outlined v-model="filter.welfareId"
            :options="options" label="ประเภทสวัสดิการ" multiple dense clearable option-value="welfareId" emit-value
            map-optionsoption-label="name">
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

        <template v-slot:body-cell-tools="props">
          <q-td :props="props">
            <a @click.stop.prevent="onClickEdit(props.rowIndex)" class="text-dark q-py-sm q-px-xs cursor-pointer">
              <q-icon :name="outlinedEdit" size="xs" color="blue" />
            </a>
          </q-td>
        </template>

        <template v-slot:body-cell-fund="props">
          <q-td v-if="clickEditIndex !== props.rowIndex" :props="props" class="text-center text-grey-9">
            {{ props.row.fund }}
          </q-td>
          <q-td v-else :props="props" class="text-grey-9">
            <q-input class="font-14 font-regular" dense v-model="props.row.fund" outlined autocomplete="off"
              color="dark" type="number" :forId="'input-fund' + props.row.id" :placeholder=props.row.fund>
            </q-input>
          </q-td>
        </template>

        <template v-slot:body-cell-per-years="props">
          <q-td v-if="clickEditIndex !== props.rowIndex" :props="props" class="text-center text-grey-9">
            {{ props.row.perYears }}
          </q-td>
          <q-td v-else :props="props" class="text-grey-9">
            <q-input class="font-14 font-regular" dense v-model="props.row.perYears" outlined autocomplete="off"
              color="dark" type="number" :forId="'input-per-years' + props.row.id" :placeholder=props.row.perYears>
            </q-input>
          </q-td>
        </template>

        <template v-slot:body-cell-per-times="props">
          <q-td v-if="clickEditIndex !== props.rowIndex" :props="props" class="text-center text-grey-9">
            {{ props.row.perTimes }}
          </q-td>
          <q-td v-else :props="props" class="text-grey-9">
            <q-input class="font-14 font-regular" dense v-model="props.row.perTimes" outlined autocomplete="off"
              color="dark" type="number" :forId="'input-per-times' + props.row.id" :placeholder=props.row.perTimes>
            </q-input>
          </q-td>
        </template>

      </q-table>
    </template>

  </ListLayout>


</template>

<script setup>
import InputGroup from "src/components/InputGroup.vue";
import ListLayout from "src/layouts/ListLayout.vue";
import { ref } from "vue";

import {
  outlinedEdit,
} from "@quasar/extras/material-icons-outlined";

const clickEditIndex = ref(null);

const pagination = ref({ page: 1, rowsPerPage: 5 });
const filter = ref({
  keyword: null,
  welfareId: null,
});

const columns = [
  { name: "index", label: "ลำดับ", align: "left", field: "index" },
  { name: "welfare-type", label: "ประเภทสวัสดิการ", align: "left", field: "welfareType" },
  { name: "sub-category", label: "ประเภทย่อย", align: "left", field: "subCategory" },
  { name: "description", label: "รายละเอียดเพิ่มเติม", align: "left", field: "description" },
  { name: "fund", label: "เพดานเงิน", align: "left", field: "fund" },
  { name: "per-years", label: "จำนวนครั้ง (ต่อปี)", align: "left", field: "perYears" },
  { name: "per-times", label: "ครั้งละไม่เกิน", align: "left", field: "perTimes" },
  { name: "tools", label: "จัดการ", align: "left", field: "tools" },
];

const model = ref([
  {
    id: 1,
    welfareType: 'สวัสดิการทั่วไป',
    subCategory: 'ค่าตรวจสุขภาพ',
    description: '-',
    fund: '3,000',
    perYears: '-',
    perTimes: '-',
  },
  {
    id: 2,
    welfareType: 'สวัสดิการทั่วไป',
    subCategory: 'ค่าทำฟัน',
    description: '-',
    fund: '2,000',
    perYears: '3',
    perTimes: '-',
  },
]);

function onClickEdit(index) {
  // Toggle edit mode for the clicked row
  if (clickEditIndex.value === index) {
    clickEditIndex.value = null;  // If the same row is clicked again, toggle it off
  } else {
    clickEditIndex.value = index;  // Set the row as being edited
  }
}
</script>