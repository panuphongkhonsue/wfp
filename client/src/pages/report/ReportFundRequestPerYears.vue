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
                <div class="col-12 text-center text-bold text-grey-8 text-h3 q-pt-xl">
                    ภาพรวมการเปรียบเทียบค่าใช้จ่ายของปี {{ filters.year }}
                </div>
            </q-form>
            <div class="q-ml-md q-mt-md chart-fund-request-per-year">
                <q-card>
                    <q-card-section>
                        <div class="row">จำนวนเงิน</div>
                        <VueApexCharts type="bar" :options="chartOptions" :series="series" height="500" />
                    </q-card-section>
                </q-card>
            </div>
        </template>




    </ReportLayout>
</template>

<script setup>
// import * as XLSX from "xlsx";
import ReportLayout from "src/layouts/ReportLayout.vue";
import InputGroup from "src/components/InputGroup.vue";
import { ref, onMounted, watch } from "vue";
import { toThaiYear, toEngYear } from "src/components/format";
import { Notify } from "quasar";
import dashboardService from "src/boot/service/dashboardService";
import { useRoute, useRouter } from "vue-router";
import { formatNumber } from "src/components/format";
import VueApexCharts from "vue3-apexcharts";

const route = useRoute();
const router = useRouter();
const isLoading = ref(false);
const currentYear = toThaiYear(new Date().getFullYear());
const filters = ref({
    year: currentYear,
});
const optionStartYear = ref([
    { id: 2, name: currentYear },
    { id: 2, name: currentYear - 1 },
    { id: 3, name: currentYear - 2 },
    { id: 4, name: currentYear - 3 }
]);

const dataFundRequestPerYear = ref([
    { monthNumber: 10, month: "Oct", totalFund: 0 },
    { monthNumber: 11, month: "Nov", totalFund: 0 },
    { monthNumber: 12, month: "Dec", totalFund: 0 },
    { monthNumber: 1, month: "Jan", totalFund: 0 },
    { monthNumber: 2, month: "Feb", totalFund: 0 },
    { monthNumber: 3, month: "Mar", totalFund: 0 },
    { monthNumber: 4, month: "Apr", totalFund: 0 },
    { monthNumber: 5, month: "May", totalFund: 0 },
    { monthNumber: 6, month: "Jun", totalFund: 0 },
    { monthNumber: 7, month: "July", totalFund: 0 },
    { monthNumber: 8, month: "Aug", totalFund: 0 },
    { monthNumber: 9, month: "Sep", totalFund: 0 },
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
    fetchDataFundRequestPerYear(filters);
    fetchDataFundRequestPerYearEachType(filters);
}

async function fetchDataFundRequestPerYear(filters) {
    try {
        const result = await dashboardService.getDashboardDataFundRequestPerYear({
            year: toEngYear(filters.value.year),
            page: 1,
            itemPerPage: 10000,
        });
        if (result.data.docs.length == 0) {
            series.value[0].data = [];
        }
        else {
            for (let y = 0; y < dataFundRequestPerYear.value.length; y++) {
                for (let i = 0; i < result.data.docs.length; i++) {
                    if (dataFundRequestPerYear.value[y].monthNumber === result.data.docs[i].month) {
                        dataFundRequestPerYear.value[y].totalFund = result.data.docs[i].total_fund;
                    }
                }
            }
            series.value[0].data = dataFundRequestPerYear.value.map((item) => item.totalFund);
        }
        console.log("result.data.docs.lenght: ", result.data.docs.length);
        console.log("dataFundRequestPerYear: ", dataFundRequestPerYear.value);
        console.log("result.data.docs: ", result.data.docs);
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

const chartOptions = ref({
    chart: {
        type: "bar",
    },
    colors: ["#73BDFF"],
    dataLabels: {
        enabled: true,
        position: "top",
        offsetY: -20,
        style: {
            colors: ["black"],
            fontSize: "14px",
            fontWeight: 400,
            cssClass: "font-medium",
        },
        formatter: function (val) {
            return formatNumber(val);
        },
    },
    plotOptions: {
        bar: {
            dataLabels: {
                position: "top",
            },
        },
    },
    xaxis: {
        categories: ["ตุลาคม", "พฤษจิกายน", "ธันวาคม", "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฏาคม", "สิงหาคม", "กันยายน",],
        labels: {
            show: true,
            style: {
                colors: [],
                fontSize: "14px",
                fontWeight: 400,
                cssClass: "font-medium",
            },
        },
    },
    yaxis: {
        showForNullSeries: true,
        labels: {
            formatter: function (value) {
                return formatNumber(value);
            },
            show: true,
            style: {
                colors: [],
                fontSize: "14px",
                fontWeight: 400,
                cssClass: "font-medium",
            },
        },
    }
});

const series = ref([
    {
        name: "ค่าใช้จ่ายทั้งหมด",
        data: [],
    },
]);
</script>

<style scoped>
.chart-fund-request-per-year {
    width: 100%;
    /* Default width for larger screens */
    max-width: 2200px;
    /* Max width for large screens */
}
</style>
