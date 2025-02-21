<template>
    <ReportLayout>
        <template v-slot:filter>
            <q-form class="col-12 row q-col-gutter-x-md q-ml-md-md items-end" @submit="search">
                <div class="col-12 col-md-4 col-lg-2">
                    <InputGroup more-class="font-16 font-medium text-black" for-id="requesId" is-dense
                        label="ตั้งแต่ปี">
                        <q-select :loading="isLoading" id="selected-welfares" class="q-pt-sm font-14 font-regular"
                            popup-content-class="font-14 font-regular" outlined v-model="filters.year"
                            :options="optionStartYear" label="ปีงบประมาณ" dense option-value="name" emit-value
                            map-options option-label="name">
                            <template v-slot:no-option>
                                <q-item>
                                    <q-item-section class="text-grey">No option</q-item-section>
                                </q-item>
                            </template>
                        </q-select>
                    </InputGroup>
                </div>
                    <div class="col-12 col-md content-center q-pt-lg q-pt-md-xs">
                        <q-btn id="button-search"
                            class="font-medium bg-blue-10 text-white font-16 q-px-sm q-pt-sm weight-8 q-mt-xs" dense
                            type="submit" label="ค้นหา" icon="search" no-caps :loading="isLoading" />
                    </div>

                    <div class="col-12 col-md content-left q-pt-lg q-pt-md-xs row justify-end q-mr-md">
                        <q-btn id="button-export-excel"
                            class="font-medium bg-blue-10 text-white font-16 q-px-sm q-pt-sm weight-8 q-mt-xs" dense
                            label="export" icon="search" no-caps :loading="isLoading" @click="exportToExcel()" />
                    </div>
            </q-form>
        </template>



    </ReportLayout>
</template>

<script setup>
import * as XLSX from "xlsx";
import ReportLayout from "src/layouts/ReportLayout.vue";
import InputGroup from "src/components/InputGroup.vue";
import { ref, onMounted, watch } from "vue";
import { toThaiYear, toEngYear } from "src/components/format";
import { Notify } from "quasar";
import dashboardService from "src/boot/service/dashboardService";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const isLoading = ref(false);
const currentYear = toThaiYear(new Date().getFullYear());
const filters = ref({
    year: currentYear,
});
const optionStartYear = ref([
    { id: 2, name: currentYear},
    { id: 2, name: currentYear - 1 },
    { id: 3, name: currentYear - 2 },
    { id: 4, name: currentYear - 3 }
]);

const dataFundRequestPerYear = ref([

])

const dataFundRequestPerYearEachType = ref([

])

onMounted(async () => {
    isLoading.value = true;
    await init();
    isLoading.value = false;
});

watch(
    () => route.query,
    async () => {
        await init();
    }
);

function search() {
    router.push({
        name: router.name,
        query: {
            year: toEngYear(filters.value.year)
        },
    });
}

async function init() {
    await fetchDataFundRequestPerYear(filters);
    await fetchDataFundRequestPerYearEachType(filters);
}

async function fetchDataFundRequestPerYear(filters) {
    try {
        const result = await dashboardService.getDashboardDataFundRequestPerYear({
            year: toEngYear(filters.value.year),
            page: 1,
            itemPerPage: 10000,
        });
        dataFundRequestPerYear.value = result.data.docs;
        console.log("dataFundRequestPerYear: ", dataFundRequestPerYear.value);
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

async function fetchDataFundRequestPerYearEachType(filters) {
    try {
        const result = await dashboardService.getDashboardDataFundRequestPerYearEachType({
            year: toEngYear(filters.value.year),
            page: 1,
            itemPerPage: 10000,
        });
        dataFundRequestPerYearEachType.value = result.data.docs;
        console.log("dataFundRequestPerYearEachType: ", dataFundRequestPerYearEachType.value);
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
// Ensure 'fundSum' is the last column by repositioning it
model.value.forEach(item => {
  const fundSum = item.fundSum;
  delete item.fundSum; // Remove 'fundSum' from its current position
  item.fundSum = fundSum; // Add 'fundSum' back at the end
});

// Convert the updated model to a sheet
const ws = XLSX.utils.json_to_sheet(model.value);

// Rename 'fundSum' to 'รวม'
Object.keys(ws).forEach(key => {
  if (ws[key] && ws[key].v === 'fundSum') {
    ws[key].v = 'รวม';
  }
});

// Add the worksheet to a workbook and export as Excel
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
XLSX.writeFile(wb, "ExportedData.xlsx");
}
</script>