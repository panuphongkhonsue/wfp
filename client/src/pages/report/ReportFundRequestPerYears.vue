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
        <div class="col-12 col-md content-center q-pt-lg q-pt-md-xs">
          <q-btn id="button-search" class="font-medium bg-blue-10 text-white font-16 q-px-sm q-pt-sm weight-8 q-mt-xs"
            dense type="submit" label="ค้นหา" icon="search" no-caps :loading="isLoading" />
        </div>
        <p class="col-12 text-center text-bold text-h4 q-pt-xl" style="color: #4D5B6B;">
          ภาพรวมค่าใช้จ่ายของปี {{ filters.year }}
        </p>
      </q-form>
      <div class="col-12 q-my-md q-mx-none row q-col-gutter-x-md">
        <div class="col-12 col-md-8">
          <q-card>
            <q-card-section>
              <VueApexCharts type="donut" :options="chartDonut" :series="donutSeries" :labels="chartDonut.labels"
                height="300" />
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-md-4 row q-gutter-y-md font-16">
          <q-card class="col-12 row text-center d-flex items-center">
            <q-card-section class="col">
              สวัสดิการทั่วไป = {{ formatNumber(dataFundRequestPerYearEachType[0]?.total_fund) ?? 0 }}
            </q-card-section>
          </q-card>
          <q-card class="col-12 row text-center d-flex items-center">
            <q-card-section class="col">
              สวัสดิการค่าสงเคราะห์ต่าง ๆ = {{ formatNumber(dataFundRequestPerYearEachType[1]?.total_fund) ?? 0 }}
            </q-card-section>
          </q-card>
          <q-card class="col-12 row text-center d-flex items-center">
            <q-card-section class="col">
              สวัสดิการการเสียชีวิตของผู้ปฏิบัติงาน = {{ formatNumber(dataFundRequestPerYearEachType[2]?.total_fund) ??
                0 }}
            </q-card-section>
          </q-card>
          <q-card class="col-12 row text-center d-flex items-center">
            <q-card-section class="col">
              สวัสดิการเกี่ยวกับการศึกษาของบุตร = {{ formatNumber(dataFundRequestPerYearEachType[3]?.total_fund) ?? 0 }}
            </q-card-section>
          </q-card>
        </div>
      </div>
      <q-card class="chart-fund-request-per-year">
        <q-card-section>
          <VueApexCharts type="bar" :options="chartOptions" :series="series" height="500" />
        </q-card-section>
      </q-card>
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
    if (result.data.length == 0) {
      series.value[0].data = [];
    }
    else {
      for (let y = 0; y < dataFundRequestPerYear.value.length; y++) {
        dataFundRequestPerYear.value[y].totalFund = 0;
        for (let i = 0; i < result.data.length; i++) {
          if (dataFundRequestPerYear.value[y].monthNumber === result.data[i].month) {
            dataFundRequestPerYear.value[y].totalFund = result.data[i].total_fund;
          }
        }
      }
      series.value[0].data = dataFundRequestPerYear.value.map((item) => item.totalFund);
    }
    console.log("result.data.docs.lenght: ", result.data.length);
    console.log("dataFundRequestPerYear: ", dataFundRequestPerYear.value);
    console.log("result.data.docs: ", result.data);
    return result.data;
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

    // 🔹 เซ็ตข้อมูลหลัก
    dataFundRequestPerYearEachType.value = result.data;

    // 🔹 สร้าง Map เพื่อเก็บค่า total_fund ตาม welfare_type
    const fundMap = new Map();
    result.data.forEach(item => {
      fundMap.set(item.welfare_type, item.total_fund ?? 0);
    });

    // 🔹 อัปเดตค่า donutSeries ตามลำดับที่ถูกต้อง
    donutSeries.value = [
      fundMap.get('สวัสดิการทั่วไป') ?? 0,
      fundMap.get('สวัสดิการค่าสงเคราะห์ต่าง ๆ') ?? 0,
      fundMap.get('สวัสดิการค่าสงเคราะห์การเสียชีวิต') ?? 0,
      fundMap.get('สวัสดิการเกี่ยวกับการศึกษาของบุตร') ?? 0
    ];

    console.log("dataFundRequestPerYearEachType: ", result.data);
    return result.data;
  } catch (error) {
    Notify.create({
      message:
        error?.response?.data?.errors ?? "เกิดข้อผิดพลาดกรุณาลองอีกครั้ง",
      position: "bottom-left",
      type: "negative",
    });
  }
}

const chartDonut = ref({
  colors: ["#4472C4", "#ED7D31", "#A5A5A5", "#FFC000"],
  chart: {
    fontFamily: "BaiJamjureeMedium",
    type: "donut",
    animations: {
      enabled: true,
      easing: "easeinout",
      speed: 400,
      animateGradually: {
        enabled: true,
        delay: 150,
      },
      dynamicAnimation: {
        enabled: true,
        speed: 350,
      },
    },
  },
  dataLabels: {
    enabled: false,
    formatter: function (val, opts) {
      return formatNumber(opts.w.globals.series[opts.seriesIndex]);
    },
    style: {
      colors: ["white"],
      fontSize: "12px",
      fontFamily: "BaiJamjureeMedium",
    },
  },
  legend: {
    position: "right",
    fontSize: "16px",
    offsetY: 50,
    markers: {
      width: 14,
      height: 14,
      shape: "square",
    },
    labels: {
      useSeriesColors: false,
    },
  },
  labels: [
    "สวัสดิการทั่วไป",
    "สวัสดิการสงเคราะห์ต่าง ๆ",
    "สวัสดิการสงเคราะห์การเสียชีวิตของผู้ปฏิบัติงาน",
    "สวัสดิการเกี่ยวกับการศึกษาของบุตร",
  ],
  plotOptions: {
    pie: {
      donut: {
        size: "70%",
        labels: {
          show: true,
          value: {
            show: true,
            fontSize: "1.5rem",
            fontWeight: 600,
            color: undefined,
            offsetY: 16,
            formatter: function (val) {
              return val;
            },
          },
          total: {
            show: true,
            showAlways: true,
            label: "",
            fontWeight: 600,
            color: "#4D5B6B",
            formatter: function (w) {
              let result = w.globals.seriesTotals.reduce((a, b) => a + b, 0)
              return formatNumber(Math.round(result * 100) / 100);
            },
          },
        },
      },
    },
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return formatNumber(val);
      },
    },
  },
});

const donutSeries = ref([]);
const chartOptions = ref({
  chart: {
    type: "bar",
    animations: {
      enabled: true,
      easing: "easeinout",
      speed: 400,
      animateGradually: {
        enabled: true,
        delay: 150,
      },
      dynamicAnimation: {
        enabled: true,
        speed: 350,
      },
    },
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
  title: {
    text: 'จำนวนเงิน',
    style: {
      fontSize: "14px",
      fontWeight: 600,
      cssClass: "font-medium",
      color: "black",
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
