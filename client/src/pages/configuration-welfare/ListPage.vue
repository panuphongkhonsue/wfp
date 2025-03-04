<template>
  <ListLayout title="จัดการข้อมูลการเบิกสวัสดิการ">
    <template v-slot:filter>
      <q-form class="col-12 row q-col-gutter-x-md" @submit="search">

        <div class="content-center col-12 col-md-4 col-lg-3">
          <q-select :loading="isLoading" id="selected-welfares" class="q-pt-sm font-14 font-regular"
            popup-content-class="font-14 font-regular" outlined v-model="filter.welfareId" :options="optionWelfareType"
            label="ประเภทสวัสดิการ" dense clearable option-value="welfareId" emit-value map-options option-label="name">
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
            {{formatNumber(props.row.fund)}}
          </q-td>
          <q-td v-else :props="props">
            <q-input class="font-14 font-regular" dense v-model="payload.fund" outlined autocomplete="off" color="dark"
              type="number" :forId="'input-fund' + props.row.id" :placeholder=props.row.fund>
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
            <q-btn @click="updateConfigWelfare(props.row)" id="button-search"
              class="font-medium bg-blue-10 text-white font-16 q-px-md weight-8" dense type="submit" label="บันทึก"
              no-caps :loading="isLoading" />
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
import { formatNumber } from "src/components/format"

import categoryService from "src/boot/service/categoryService";
import subCategoryService from "src/boot/service/subCategoryService";
import logCategoryService from "src/boot/service/logCategoryService";
import logSubCategoryService from "src/boot/service/logSubCategoryService";
import Swal from "sweetalert2";

const clickEditIndex = ref(null);
const modelDate = ref(null);
const route = useRoute();
const router = useRouter();
const isLoading = ref(false);
const listStore = useListStore();
const tableRef = ref();
let validateText = null;
const payload = ref(
  {
    fund: null,
    perTimes: null,
    perYears: null,
  }
);
const payloadLogCategory = ref(
  {
    name: null,
    fundOld: null,
    fundNew: null,
    perTimesOld: null,
    perTimesNew: null,
    perYearsOld: null,
    perYearsNew: null,
    categoryId: null,
  }
);
const payloadLogSubCategory = ref(
  {
    name: null,
    fundOld: null,
    fundNew: null,
    perTimesOld: null,
    perTimesNew: null,
    perYearsOld: null,
    perYearsNew: null,
    subCategoryId: null,
  }
);
const pagination = ref({
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
  { name: "fund", label: "เพดานเงิน", align: "right", field: (row) => row.fund ?? '-'},
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
  isLoading.value = true;
  await init();
  isLoading.value = false;
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
  payload.value = {
    fund: null,
    perTimes: null,
    perYears: null
  };
  payloadLogCategory.value =
  {
    name: null,
    fundOld: null,
    fundNew: null,
    perTimesOld: null,
    perTimesNew: null,
    perYearsOld: null,
    perYearsNew: null,
    categoryId: null
  };
  payloadLogSubCategory.value =
  {
    name: null,
    fundOld: null,
    fundNew: null,
    perTimesOld: null,
    perTimesNew: null,
    perYearsOld: null,
    perYearsNew: null,
    subCategoryId: null,
  }
  clickEditIndex.value = null;  // If the same row is clicked again, toggle it off
  pagination.value.rowsPerPage = listStore.getState();
  await tableRef.value.requestServerInteraction();
}

async function fetchFromServer(page, rowPerPage, filters) {
  try {
    const allConfigWelfare = await configWelfareService.getConfigWelfare({
      welfareId: filters.value.welfareId ?? '',
      page: page,
      itemPerPage: rowPerPage,
    });
    pagination.value.rowsNumber = allConfigWelfare.data.total;
    return allConfigWelfare.data.docs;
  } catch (error) {
    Notify.create({
      message:
        error?.response?.data?.message ??
        "เกิดข้อผิดพลาด กรุณาลองอีกครั้ง",
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
        filter,
      );
      model.value = returnedData.map(item => ({
        welfareId: item.welfare_id,
        welfareType: item.welfare_name,
        subCategory: item.category_name,
        description: item.sub_category_name ?? '-',
        fund: item.category_fund ?? item.sub_category_fund ?? '-',
        perYears: item.category_per_years ?? item.sub_category_per_years ?? '-',
        perTimes: item.category_per_times ?? item.sub_category_per_times ?? '-',
        categoryId: item.category_id,
        categoryFund: item.category_fund,
        categoryName: item.category_name,
        subCategoryId: item.sub_category_id,
        subCategoryFund: item.sub_category_fund,
        subCategoryName: item.sub_category_name
      }));
      pagination.value.page = page;
      pagination.value.rowsPerPage = rowsPerPage;
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

async function updateConfigWelfare(propsRowData) {
  try {
    Swal.fire({
      title: "ยืนยันการแก้ไขข้อมูลหรือไม่ ???",
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

          //Validate
          let validateMessage = "";

          console.log(propsRowData);
          if (payload.value.fund == null && payload.value.perYears == null && payload.value.perTimes == null) {
            validateMessage = "ข้อมูลไม่ได้ถูกแก้ไข";
          }
          else {
            if (payload.value.fund != null) {
              if (payload.value.fund < 0) {
                validateMessage = "ข้อมูลเพดานเงินไม่ถูกต้อง";
              }
              else if (payload.value.fund == 0) {
                payload.value.fund = null;
              }
              else if (payload.value.fund < propsRowData.perTimes){
                validateMessage = "ข้อมูลครั้งละไม่เกินสูงกว่าเพดานเงิน";
              }
            }
            else {
              if (!propsRowData.subCategoryName) {
                payload.value.fund = propsRowData.categoryFund;
              }
              else {
                payload.value.fund = propsRowData.subCategoryFund;
              }
            }
            if (payload.value.perYears != null) {
              if (payload.value.perYears < 0) {
                validateMessage = "ข้อมูลจำนวนครั้ง(ต่อปี)ไม่ถูกต้อง";
              }
              else if (payload.value.perYears == 0) {
                payload.value.perYears = null;
              }
            }
            else {
              if (!propsRowData.subCategoryName) {
                payload.value.perYears = propsRowData.category_per_years;
              }
              else {
                payload.value.perYears = propsRowData.sub_category_per_years;
              }
            }
            if (payload.value.perTimes != null) {
              if (payload.value.perTimes < 0) {
                validateMessage = "ข้อมูลครั้งละไม่เกินไม่ถูกต้อง";
              }
              else if (payload.value.perTimes == 0) {
                payload.value.perTimes = null;
              }
              else if (propsRowData.fund != '-') {
                console.log("payload.value.fund", payload.value.fund)
                if (Number(payload.value.perTimes) > Number(payload.value.fund)) {
                  validateMessage = "ข้อมูลครั้งละไม่เกินสูงกว่าเพดานเงิน";
                }
              }
            }
            else {
              if (!propsRowData.subCategoryName) {
                payload.value.perTimes = propsRowData.category_perTimes;
              }
              else {
                payload.value.perTimes = propsRowData.sub_category_perTimes;
              }
            }
          }
          validateText = validateMessage;
          payloadLogCategory.value = (
            {
              name: propsRowData.categoryName,
              fundOld: propsRowData.categoryFund,
              fundNew: payload.value.fund,
              perTimesOld: propsRowData.perTimes === '-' ? null : propsRowData.perTimes,
              perTimesNew: payload.value.perTimes === '-' ? null : payload.value.perTimes,
              perYearsOld: propsRowData.perYears === '-' ? null : propsRowData.perYears,
              perYearsNew: payload.value.perYears === '-' ? null : payload.value.perYears,
              categoryId: propsRowData.categoryId === '-' ? null : propsRowData.categoryId,
            }
          );

          payloadLogSubCategory.value = (
            {
              name: propsRowData.subCategoryName,
              fundOld: propsRowData.subCategoryFund,
              fundNew: payload.value.fund,
              perTimesOld: propsRowData.perTimes === '-' ? null : propsRowData.perTimes,
              perTimesNew: payload.value.perTimes === '-' ? null : payload.value.perTimes,
              perYearsOld: propsRowData.perYears === '-' ? null : propsRowData.perYears,
              perYearsNew: payload.value.perYears === '-' ? null : payload.value.perYears,
              subCategoryId: propsRowData.subCategoryId === '-' ? null : propsRowData.subCategoryId,
            }
          );
          if (validateMessage) {
            Notify.create({
              message: validateMessage,
              position: "bottom-left",
              type: "negative",
            });
            clickEditIndex.value = null; // Reset the editing state
            return;
          }
          // Code
          //Api
          if (!propsRowData.subCategoryName) {
            await categoryService.updateCategory(propsRowData.categoryId, payload.value);
            await logCategoryService.addLogCategory(payloadLogCategory.value);
          }
          else {
            await subCategoryService.updateSubCategory(propsRowData.subCategoryId, payload.value);
            await logSubCategoryService.addLogSubCategory(payloadLogSubCategory.value);
          }
        } catch (error) {
          Swal.showValidationMessage(error?.response?.data?.message ?? `ข้อมูลไม่ได้ถูกแก้ไข.`);
          Notify.create({
            message:
              error?.response?.data?.message ??
              "แก้ไขไม่สำเร็จกรุณาลองอีกครั้ง",
            position: "bottom-left",
            type: "negative",
          });
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        if (validateText == "") {
          Swal.fire({
            html: `ข้อมูลสวัสดิการถูกแก้ไข`,
            icon: "success",
            confirmButtonText: "ตกลง",
            customClass: {
              confirmButton: "save-button",
            },
          }).then(() => {
            location.reload();
          });
        }
        else {
          Swal.fire({
            html: `<b>${validateText}</b>`,
            icon: "warning",
            confirmButtonText: "ตกลง",
            customClass: {
              confirmButton: "save-button",
            },
          }).then(() => {
            location.reload();
          });
        }

      }
    });
  } catch (error) {
    Promise.reject(error);
  }
}

</script>
