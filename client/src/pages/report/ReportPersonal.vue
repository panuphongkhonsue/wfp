<template>
  <ReportLayout>
    <template v-slot:filter>
      <q-form class="col-12 row q-col-gutter-x-md q-ml-md-md items-end" @submit="search">
        <div class="col-12 col-md-4 col-lg-2">
          <InputGroup more-class="font-16 font-medium text-black" for-id="requesId" is-dense label="ปีงบประมาณ">
            <q-select :loading="isLoading" id="selected-welfares" class="q-pt-sm font-14 font-regular"
              popup-content-class="font-14 font-regular" outlined v-model="filters.year" :options="optionStartYear"
              label="ปีงบประมาณ" dense option-value="name" emit-value map-options option-label="name">
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">No option</q-item-section>
                </q-item>
              </template>
            </q-select>
          </InputGroup>
        </div>
        <div class="col-12 col-md-4 col-lg-2">
          <InputGroup more-class="font-16 font-medium text-black" for-id="requesId" is-dense label="ชื่อบุคลากร">
            <q-select clearable :loading="isLoading" id="selected-welfares" class="q-pt-sm font-14 font-regular"
              popup-content-class="font-14 font-regular" outlined v-model="filters.name" :options="optionNameUser"
              label="ชื่อ - นามสกุล" dense option-value="name" emit-value map-options option-label="name">
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">No option</q-item-section>
                </q-item>
              </template>
            </q-select>
          </InputGroup>
        </div>
        <div class="col-12 col-md content-center q-pt-lg q-pt-md-xs">
          <q-btn id="button-search" class="font-medium bg-blue-10 text-white font-16 q-px-sm q-pt-sm weight-8 q-mt-xs"
            dense type="submit" label="ค้นหา" icon="search" no-caps :loading="isLoading" />
        </div>
        <div class="col-12 col-md-12 row items-center justify-center text-bold text-grey-8 text-h4 q-pt-xl">
          <div class="col text-center">
            รายละเอียดการเบิกจ่ายสวัสดิการรายบุคคลของปีงบประมาณ {{ filters.year }}
          </div>
          <div class="col-auto">
            <q-btn id="button-export-excel"
              class="font-medium bg-blue-10 text-white font-16 q-px-sm weight-8 q-mt-xs q-mr-md" dense label="Export"
              no-caps :loading="isLoading" @click="exportToExcel()">
              <q-icon :name="outlinedDownload" size="sm"></q-icon>
            </q-btn>
          </div>
        </div>
      </q-form>



      <div class="col-12 q-ml-md q-mt-lg q-px-md">
        <q-table :rows-per-page-options="[5, 10, 15, 20]" flat bordered :rows="model ?? []" :columns="columns"
          row-key="index" :loading="isLoading" :wrap-cells="$q.screen.gt.lg"
          table-header-class="font-bold bg-blue-10 text-white"
          class="my-sticky-column-table my-sticky-last-column-table" v-model:pagination="pagination" ref="tableRef"
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
                ไม่พบข้อมูล
              </span>
            </div>
          </template>
        </q-table>
      </div>

    </template>



  </ReportLayout>
</template>

<script setup>
import * as XLSX from "xlsx";
import ReportLayout from "src/layouts/ReportLayout.vue";
import InputGroup from "src/components/InputGroup.vue";
import { ref, onMounted, watch } from "vue";
import { toThaiYear, toEngYear } from "src/components/format";
import {
  outlinedDownload,
} from "@quasar/extras/material-icons-outlined";
import { Notify } from "quasar";
import dashboardService from "src/boot/service/dashboardService";
import userManagementService from "src/boot/service/userManagementService";
import configWelfareService from "src/boot/service/configWelfareService";
import { useRoute, useRouter } from "vue-router";
import { useListStore } from "src/stores/listStore";

let checkfirstPage = true;
let checkSendYearDup = true;
let checkSearch = false;
const listStore = useListStore();
const tableRef = ref();
const route = useRoute();
const pagination = ref({ page: 1, rowsPerPage: 5 });
const router = useRouter();
const isLoading = ref(false);
const currentYear = toThaiYear(new Date().getFullYear());
const filters = ref({
  year: currentYear,
  name: '',
});
const dataTable = ref([{

}]);

const optionStartYear = ref([
  { id: 2, name: currentYear - 1 },
  { id: 3, name: currentYear - 2 },
  { id: 4, name: currentYear - 3 }
]);

const optionNameUser = ref([
]);

const model = ref([]);

const columns = ref([
  { name: "createdByName", label: "ชื่อ - สกุล", align: "left", field: (row) => row.createdByName ?? "-" },
]);
onMounted(async () => {
  isLoading.value = true;
  await init();
  isLoading.value = false;
});

watch(
  () => filters.value.year,
  (newValue) => {
    optionStartYear.value = [
      { id: 1, name: currentYear },
      { id: 2, name: currentYear - 1 },
      { id: 3, name: currentYear - 2 },
      { id: 4, name: currentYear - 3 }
    ].filter(item => item.name !== newValue);
  }
);

watch(
  () => route.query,
  async () => {
    await init();
  }
);

function search() {
  if (checkSendYearDup == false) {
    checkSearch = true;
    model.value = [];
    dataTable.value = [];
  }
  checkSendYearDup = true;
  router.push({
    name: router.name,
    query: {
      startYear: toEngYear(filters.value.year - 1),
      endYear: toEngYear(filters.value.year),
      keyword: filters.value.name,
    },
  });
}

async function init() {
  pagination.value.rowsPerPage = listStore.getState();
  await tableRef.value.requestServerInteraction();

}

function onRequest(props) {
  dataTable.value = [];
  const { page, rowsPerPage, sortBy, descending } = props.pagination;
  listStore.setState(rowsPerPage);
  isLoading.value = true;
  setTimeout(async () => {
    try {
      const viewDashboardData = await fetchFromServer(
        page,
        rowsPerPage,
        filters,
        sortBy,
        descending
      );
      const userData = await fetchUserData(
        page,
        rowsPerPage,
        filters,
        sortBy,
        descending
      );
      const allWelfareData = await fetchAllWelfare(
        page,
        rowsPerPage,
        filters,
        sortBy,
        descending
      );
      columns.value = ([
        { name: "createdByName", label: "ชื่อ - สกุล", align: "left", field: (row) => row.userName ?? "-" },
      ]);

      // Push columns based on the conditions only once
      for (let i = 0; i < allWelfareData.length - 21; i++) {
        if (
          allWelfareData[i].sub_category_name !== "บิดา" &&
          allWelfareData[i].sub_category_name !== "มารดา" &&
          allWelfareData[i].sub_category_name !== "คู่สมรส" &&
          allWelfareData[i].sub_category_name !== "สนับสนุนพวงหรีดในนามส่วนบุคคล" &&
          allWelfareData[i].sub_category_name !== "สนับสนุนพวงหรีดในนามมหาวิทยาลัยบูรพา" &&
          allWelfareData[i].category_name !== "สนับสนุนพวงหรีดในนามมหาวิทยาลัยบูรพา" &&
          allWelfareData[i].category_name !== "สนับสนุนพวงหรีดในนามส่วนบุคคล" &&
          allWelfareData[i].category_name !== "พาหนะเหมาจ่าย" &&
          allWelfareData[i].sub_category_name !== "พาหนะเหมาจ่าย" &&
          allWelfareData[i].sub_category_name !== "ประสบอุบัติเหตุขณะปฏิบัติงาน" &&
          allWelfareData[i].sub_category_name !== "ระดับปฐมวัย" &&
          allWelfareData[i].sub_category_name !== "ระดับประถมศึกษาปีที่ 1 - 6" &&
          allWelfareData[i].sub_category_name !== "ระดับมัธยมศึกษาปีที่ 1 - 3" &&
          allWelfareData[i].sub_category_name !== "ระดับมัธยมศึกษาปีที่ 4 - 6" &&
          allWelfareData[i].sub_category_name !== "ระดับมัธยมศึกษาปีที่ 4 - 6 (หรือเทียบเท่า)" &&
          allWelfareData[i].sub_category_name !== "ระดับปฐมศึกษาปีที่ 1 - 3" &&
          allWelfareData[i].sub_category_name !== "ระดับปฐมศึกษาปีที่ 4 - 6" &&
          allWelfareData[i].sub_category_name !== "ระดับปฐมวัยโปรแกรมทั่วไป" &&
          allWelfareData[i].sub_category_name !== "ระดับปฐมวัยโปรแกรมเน้นความสามารถทางภาษา" &&
          allWelfareData[i].sub_category_name !== "ระดับปฐมศึกษาปีที่ 1 - 6 โปรแกรมทั่วไป" &&
          allWelfareData[i].sub_category_name !== "ระดับปฐมศึกษาปีที่ 1 - 6 โปรแกรมเน้นความสามารถทางภาษา" &&
          allWelfareData[i].sub_category_name !== "ระดับปฐมศึกษาปีที่ 1 - 6 โปรแกรมศึกษาพิเศษแบบบูรณาการ" &&
          allWelfareData[i].sub_category_name !== "ระดับมัธยมศึกษาโปรแกรมทั่วไป" &&
          allWelfareData[i].sub_category_name !== "ระดับมัธยมศึกษาโปรแกรมเน้นความสามารถทางภาษา" &&
          allWelfareData[i].sub_category_name !== "ระดับมัธยมศึกษาโปรแกรมเน้นความสามารถทางคณิต-วิทย์" &&
          allWelfareData[i].sub_category_name !== "ระดับมัธยมศึกษาโปรแกรมศึกษาพิเศษแบบบูรณาการ"
        ) {
          if (allWelfareData[i].sub_category_name === "บุตร") {
            columns.value.push({
              name: "เสียชีวิตคนในครอบครัว",
              label: "เสียชีวิตคนในครอบครัว",
              align: "left",
              field: "เสียชีวิตคนในครอบครัว" + "fund",
              format: (val) => {
                const number = Number(val); // Convert to number
                if (!isNaN(number)) {
                  return number.toLocaleString("en-US", {
                    minimumFractionDigits: number % 1 === 0 ? 0 : 2, // No decimals for whole numbers, 2 decimals otherwise
                    maximumFractionDigits: 2, // Limit to 2 decimal places
                  }); // Format as '3,000'
                }
                return `${val}`; // If conversion fails, return a fallback value
              },
              classes: "ellipsis",
            });
            columns.value.push({
              name: "การศึกษาของบุตร",
              label: "การศึกษาของบุตร",
              align: "left",
              field: "การศึกษาของบุตร" + "fund",
              format: (val) => {
                const number = Number(val); // Convert to number
                if (!isNaN(number)) {
                  return number.toLocaleString("en-US", {
                    minimumFractionDigits: number % 1 === 0 ? 0 : 2, // No decimals for whole numbers, 2 decimals otherwise
                    maximumFractionDigits: 2, // Limit to 2 decimal places
                  }); // Format as '3,000'
                }
                return `${val}`; // If conversion fails, return a fallback value
              },
              classes: "ellipsis",
            });
          }
          else if (allWelfareData[i].sub_category_name === "เยี่ยมไข้") {
            columns.value.push({
              name: "กรณีเจ็บป่วย",
              label: "กรณีเจ็บป่วย",
              align: "left",
              field: "กรณีเจ็บป่วย" + "fund",
              format: (val) => {
                const number = Number(val); // Convert to number
                if (!isNaN(number)) {
                  return number.toLocaleString("en-US", {
                    minimumFractionDigits: number % 1 === 0 ? 0 : 2, // No decimals for whole numbers, 2 decimals otherwise
                    maximumFractionDigits: 2, // Limit to 2 decimal places
                  }); // Format as '3,000'
                }
                return `${val}`; // If conversion fails, return a fallback value
              },
              classes: "ellipsis",
            });
          }
          else if (allWelfareData[i].category_name === "ผู้ปฏิบัติงานเสียชีวิต") {
            columns.value.push({
              name: "ผู้ปฏิบัติงานเสียชีวิต",
              label: "ผู้ปฏิบัติงานเสียชีวิต",
              align: "left",
              field: "ผู้ปฏิบัติงานเสียชีวิต" + "fund",
              format: (val) => {
                const number = Number(val); // Convert to number
                if (!isNaN(number)) {
                  return number.toLocaleString("en-US", {
                    minimumFractionDigits: number % 1 === 0 ? 0 : 2, // No decimals for whole numbers, 2 decimals otherwise
                    maximumFractionDigits: 2, // Limit to 2 decimal places
                  }); // Format as '3,000'
                }
                return `${val}`; // If conversion fails, return a fallback value
              },
              classes: "ellipsis",
            });
          }
          else {
            columns.value.push({
              name: allWelfareData[i].category_name,
              label: allWelfareData[i].category_fund == null
                ? allWelfareData[i].sub_category_name
                : allWelfareData[i].category_name, // Use ternary operator for conditional label
              align: "left",
              field: allWelfareData[i].category_name + "fund",
              format: (val) => {
                const number = Number(val); // Convert to number
                if (!isNaN(number)) {
                  return number.toLocaleString("en-US", {
                    minimumFractionDigits: number % 1 === 0 ? 0 : 2, // No decimals for whole numbers, 2 decimals otherwise
                    maximumFractionDigits: 2, // Limit to 2 decimal places
                  }); // Format as '3,000'
                }
                return `${val}`; // If conversion fails, return a fallback value
              },
              classes: "ellipsis",
            });
          }
        }
      }

      // Create dynamic entries for each user based on the columns
      for (let j = 0; j < userData.length; j++) {
        const newEntry = {
          userId: userData[j].id,  // Access user name correctly
          userName: userData[j].name,
          fundSum: '',
        };

        // Add dynamic fields for each category
        for (let i = 0; i < allWelfareData.length - 21; i++) {
          if (
            allWelfareData[i].sub_category_name !== "บิดา" &&
            allWelfareData[i].sub_category_name !== "มารดา" &&
            allWelfareData[i].sub_category_name !== "คู่สมรส" &&
            allWelfareData[i].sub_category_name !== "สนับสนุนพวงหรีดในนามส่วนบุคคล" &&
            allWelfareData[i].sub_category_name !== "สนับสนุนพวงหรีดในนามมหาวิทยาลัยบูรพา" &&
            allWelfareData[i].category_name !== "สนับสนุนพวงหรีดในนามมหาวิทยาลัยบูรพา" &&
            allWelfareData[i].category_name !== "สนับสนุนพวงหรีดในนามส่วนบุคคล" &&
            allWelfareData[i].category_name !== "พาหนะเหมาจ่าย" &&
            allWelfareData[i].sub_category_name !== "พาหนะเหมาจ่าย"
          ) {
            if (allWelfareData[i].sub_category_name !== "บุตร" && allWelfareData[i].sub_category_name !== "ระดับมัธยมศึกษาปีที่ 1 - 3") {
              if (allWelfareData[i].category_fund == null) {
                newEntry[allWelfareData[i].sub_category_name + "fund"] = '';  // Dynamically add fund field
              }
              else {
                newEntry[allWelfareData[i].category_name + "fund"] = '';  // Dynamically add category fund field
              }
            }
            else {
              if (allWelfareData[i].sub_category_name !== "บุตร") {
                newEntry["เสียชีวิตคนในครอบครัว" + "fund"] = '';  // Dynamically add category fund field
              }
              if (allWelfareData[i].sub_category_name !== "ระดับมัธยมศึกษาปีที่ 1 - 3") {
                newEntry["การศึกษาของบุตร" + "fund"] = '';
              }
              if (allWelfareData[i].sub_category_name !== "เยี่ยมไข้") {
                newEntry["กรณีเจ็บป่วย" + "fund"] = '';
              }
              if (allWelfareData[i].category_name !== "ผู้ปฏิบัติงานเสียชีวิต") {
                newEntry["ผู้ปฏิบัติงานเสียชีวิต" + "fund"] = '';
              }
            }
          }
        }
        // Push the new entry for this user into dataTable
        model.value.push(newEntry);
        dataTable.value.push(newEntry);
      }

      for (let i = 0; i < dataTable.value.length; i++) {
        for (let j = 0; j < viewDashboardData.length; j++) {
          if (dataTable.value[i].userId == viewDashboardData[j].created_by) {
            if (viewDashboardData[j].welfare_type === "สวัสดิการค่าสงเคราะห์การเสียชีวิต") {
              if (viewDashboardData[j].welfare_type == viewDashboardData[j - 1].welfare_type
                && viewDashboardData[j].id == viewDashboardData[j - 1].id
              ) {
                continue;
              }
              else {
                console.log(dataTable.value[i])
                dataTable.value[i].ผู้ปฏิบัติงานเสียชีวิตfund
                  = (Number(dataTable.value[i].ผู้ปฏิบัติงานเสียชีวิตfund) || 0) + viewDashboardData[j].fund_sum_request;
              }
            }

            if (viewDashboardData[j].welfare_type === "สวัสดิการเกี่ยวกับการศึกษาของบุตร") {
              if (viewDashboardData[j].welfare_type == viewDashboardData[j - 1].welfare_type
                && viewDashboardData[j].id == viewDashboardData[j - 1].id
              ) {
                continue;
              }
              else {
                dataTable.value[i].การศึกษาของบุตรfund
                  = (Number(dataTable.value[i].การศึกษาของบุตรfund) || 0) + viewDashboardData[j].fund_sum_request;
              }
            }
            if (j > 0 && viewDashboardData[j].welfare_type == viewDashboardData[j - 1].welfare_type
              && viewDashboardData[j].id == viewDashboardData[j - 1].id
            ) {
              continue;
            }
            else {
              const categoryForDataTable = viewDashboardData[j].category_name + "fund";
              dataTable.value[i][categoryForDataTable]
                = (Number(dataTable.value[i][categoryForDataTable]) || 0) + viewDashboardData[j].fund_sum_request;
            }
          }
        }
      }

      calculateFundSumForDataTable();
      if (checkSearch) {
        dataTable.value.forEach(item => {
          delete item.nullfund; // Delete the 'nullfund' key from each item
        });
        model.value = dataTable.value.map(item => {
          // Iterate over each item and replace empty strings with '-'
          for (let key in item) {
            if (item[key] === '') {
              item[key] = '-';
            }
          }
          return item;
        });
      }
      else {
        dataTable.value.forEach(item => {
          delete item.nullfund; // Delete the 'nullfund' key from each item
        });
        model.value = dataTable.value.map(item => {
          // Iterate over each item and replace empty strings with '-'
          for (let key in item) {
            if (item[key] === '') {
              item[key] = '-';
            }
          }
          return item;
        });
      }
      console.log("modelValue: ", model.value);
      console.log("dataTables:", dataTable.value);
      columns.value.push(
        {
          name: "fundSum", label: "รวม", align: "left", field: (row) => row.fundSum ?? "-", format: (val) => {
            const number = Number(val); // Convert to number
            if (!isNaN(number)) {
              return number.toLocaleString("en-US", {
                minimumFractionDigits: number % 1 === 0 ? 0 : 2, // No decimals for whole numbers, 2 decimals otherwise
                maximumFractionDigits: 2, // Limit to 2 decimal places
              }); // Format as '3,000'
            }
            return `${val}`; // If conversion fails, return a fallback value
          },
          classes: "ellipsis",
        },
      );
      console.log("viewDashboardData: ", viewDashboardData);
      console.log("userData: ", userData);
      console.log("allWelfare: ", allWelfareData);
      console.log("COL.Value: ", columns.value);

      if (checkfirstPage == true) {
        optionNameUser.value = dataTable.value.map(item => ({
          name: item.userName
        }));
        checkfirstPage = false;
      }
      pagination.value.page = page;
      pagination.value.rowsPerPage = rowsPerPage;
    } catch (error) {
      Promise.reject(error)
    }
    isLoading.value = false;
  }, 100);
}

const calculateFundSumForDataTable = () => {
  dataTable.value = dataTable.value.map(data => {
    let sum = 0;

    for (let key in data) {
      if (key !== "userId" && key !== "fundSum" && key !== "nullfund") {
        const value = data[key];

        if (!isNaN(value) && value !== '-') {
          sum += Number(value);
        }
      }
    }

    return { ...data, fundSum: sum };
  });
};

async function fetchFromServer(page, rowPerPage, filters) {
  try {
    const result = await dashboardService.getDashboardDataPersonal({
      startYear: toEngYear(filters.value.year - 1) ?? '',
      endYear: toEngYear(filters.value.year) ?? '',
      page: 1,
      itemPerPage: 10000,
    });
    return result.data.docs;
  } catch (error) {
    Notify.create({
      message:
        error?.response?.data?.errors ??
        "เกิดข้อผิดพลาดกรุณาลองอีกครั้ง",
      position: "bottom-left",
      type: "negative",
    });
  }
}

async function fetchUserData() {
  try {
    const result = await userManagementService.listOrderName({
      keyword: filters.value.name,
      page: 1,
      itemPerPage: 10000,
    });
    console.log(optionNameUser.value);
    return result.data.datas;
  } catch (error) {
    Notify.create({
      message:
        error?.response?.data?.errors ??
        "เกิดข้อผิดพลาดกรุณาลองอีกครั้ง",
      position: "bottom-left",
      type: "negative",
    });
  }
}

async function fetchAllWelfare() {
  try {
    const result = await configWelfareService.getConfigWelfare({
      welfareId: filters.value.welfareId ?? '',
      page: 1,
      itemPerPage: 10000,
    });
    return result.data.docs;
  } catch (error) {
    Notify.create({
      message:
        error?.response?.data?.errors ??
        "เกิดข้อผิดพลาดกรุณาลองอีกครั้ง",
      position: "bottom-left",
      type: "negative",
    });
  }
}

function exportToExcel() {
  // Define the columns to be included in the export
  const selectedColumns = [
    'ตรวจสุขภาพ',
    'ทำฟัน',
    'ประสบอุบัติเหตุขณะปฏิบัติงาน',
    'เยี่ยมไข้',
    'สมรส',
    'อุปสมบทหรือประกอบพิธีฮัจน์',
    'รับขวัญบุตร',
    'ประสบภัยพิบัติ',
    'การศึกษาของบุตร',
    'กรณีเจ็บป่วย',
    'ผู้ปฏิบัติงานเสียชีวิต',
    'เสียชีวิตคนในครอบครัว'
  ];

  // Create a new array with only the selected columns + index & userName + total sum
  const filteredData = model.value.map((item, index) => {
    let newItem = {
      'ลำดับ': index + 1, // Index starts from 1
      'ชื่อผู้ใช้': item.userName || '', // Include username
    };

    let totalSum = 0;

    selectedColumns.forEach(column => {
      const columnName = `${column}fund`; // Adjust column names if needed
      const value = parseFloat(item[columnName]) || 0; // Ensure missing values are treated as 0
      newItem[column] = value === 0 ? '-' : value; // Change 0 to '-' except in "รวม"
      totalSum += value; // Add to total sum
    });

    newItem['รวม'] = totalSum; // Keep sum as number

    return newItem;
  });

  // Convert the filtered data to a sheet
  const ws = XLSX.utils.json_to_sheet(filteredData);

  // Add a title row spanning all columns
  const title = `รายละเอียดการเบิกจ่ายสวัสดิการรายบุคคลของปีงบประมาณ ${filters.value.year}`;
  const range = XLSX.utils.decode_range(ws["!ref"]);

  // Merge cells for the title (from A1 to the last column in the first row)
  ws['!merges'] = [
    {
      s: { r: 0, c: 0 }, // Starting cell: A1
      e: { r: 0, c: range.e.c } // Ending cell: Last column in the first row
    }
  ];

  // Add the title to the merged cells
  ws['A1'] = { v: title, t: 's' }; // Place title in the first cell of row 1

  // Apply the "Merge and Center" equivalent alignment for the title
  if (!ws['A1'].s) {
    ws['A1'].s = {};
  }

  // Center alignment for both horizontal and vertical
  ws['A1'].s.alignment = {
    horizontal: 'center', // Center text horizontally
    vertical: 'center',   // Center text vertically
    wrapText: true         // Wrap text in case it's too long
  };

  // Adjust column headers
  const headerRow = ['ลำดับ', 'ชื่อผู้ใช้', ...selectedColumns, 'รวม'];
  headerRow.forEach((header, index) => {
    const cellAddress = XLSX.utils.encode_cell({ r: 1, c: index });
    ws[cellAddress] = { v: header, t: 's' }; // Add header to row 2
  });

  // Remove 'fund' from column names
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const address = XLSX.utils.encode_cell({ r: 0, c: C });
    if (ws[address]) {
      ws[address].v = ws[address].v.replace('fund', ''); // Rename headers
    }
  }

  // Create a new workbook and append the worksheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "FilteredData");

  // Export as Excel file
  XLSX.writeFile(wb, "ExportData.xlsx");
}








</script>

<style lang="css">
.my-sticky-column-table {
  /* specifying max-width so the example can highlight the sticky column on any browser window */
  overflow-x: auto;
  display: block;
  /* Ensures table respects max-width */
}

/* Sticky first column */
.my-sticky-column-table th:first-child,
.my-sticky-column-table td:first-child {
  position: sticky;
  left: 0;
  z-index: 1;
  background-color: #ffffff;
  /* Set background color */
}

/* Sticky header row */
.my-sticky-column-table thead tr:first-child th:first-child {
  background-color: #0D47A1;
  /* Set background color for the header */
}

/* Optional: You may want to set a minimum width for the first column */
.my-sticky-column-table th,
.my-sticky-column-table td {
  min-width: 120px;
  /* Adjust as necessary */
}


.my-sticky-last-column-table {
  /* specifying max-width so the example can highlight the sticky column on any browser window */
  overflow-x: auto;
  display: block;
  /* Ensures table respects max-width */
}

.my-sticky-last-column-table {
  /* specifying max-width so the example can highlight the sticky column on any browser window */
  overflow-x: auto;
  display: block;
  /* Ensures table respects max-width */
}

/* Sticky last column */
.my-sticky-last-column-table th:last-child,
.my-sticky-last-column-table td:last-child {
  position: sticky;
  right: 0;
  z-index: 1;
  background-color: #ffffff;
  /* Set background color */
}

/* Optional: Sticky header for last column (if you need it for the header cell as well) */
.my-sticky-last-column-table thead tr:last-child th:last-child {
  background-color: #0D47A1;
  /* Set background color for the header */
}

/* Optional: Set min-width for last column */
.my-sticky-last-column-table th,
.my-sticky-last-column-table td {
  min-width: 120px;
  /* Adjust as needed */
}
</style>
