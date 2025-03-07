<template>
  <ReportLayout>
    <template v-slot:filter>
      <q-form class="col-12 row q-col-gutter-x-md q-ml-md-md items-end" @submit="search">
        <div class="col-12 col-md-4 col-lg-2">
          <InputGroup more-class="font-16 font-medium text-black" for-id="requesId" is-dense label="ตั้งแต่ปี">
            <q-select :loading="isLoading" id="selected-welfares" class="q-pt-sm font-14 font-regular"
              popup-content-class="font-14 font-regular" outlined v-model="filters.startYear" :options="optionStartYear"
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
          <InputGroup more-class="font-16 font-medium text-black" for-id="requesId" is-dense label="ถึงปี">
            <q-select :loading="isLoading" id="selected-welfares" class="q-pt-sm font-14 font-regular"
              popup-content-class="font-14 font-regular" outlined v-model="filters.endYear" :options="optionEndYear"
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
        <div class="col-12 text-center text-bold text-grey-8 text-h3 q-pt-xl">
          ภาพรวมการเปรียบเทียบค่าใช้จ่ายของปี {{ searchedYears.startYear }} - {{ searchedYears.endYear }}
        </div>
        <q-card class="col-8 q-mx-auto q-mt-xl q-pl-none q-py-md " style="border-radius: 10px; box-shadow:inset">
          <div id="chart" class="q-mx-md ">
            <ApexChart type="bar" height="480" :options="chartOptions" :series="chartOptions.series"></ApexChart>
          </div>
        </q-card>
      </q-form>
    </template>

  </ReportLayout>
</template>

<script setup>
import ReportLayout from "src/layouts/ReportLayout.vue";
import dashboardService from "src/boot/service/dashboardService";
import { Notify } from "quasar";
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toThaiYear, toEngYear, formatNumber } from "src/components/format";
import InputGroup from "src/components/InputGroup.vue";

defineOptions({
  name: "report_compare-expenses",
});

const isLoading = ref(false);
const route = useRoute();
const currentYear = toThaiYear(new Date().getFullYear());
const router = useRouter();
const filters = ref({
  startYear: currentYear - 1,
  endYear: currentYear,
});

let dashboardData = ref([]);
const searchedYears = ref({
  startYear: filters.value.startYear,
  endYear: filters.value.endYear,
});

const chartOptions = ref({
  chart: {
    type: "bar",
    height: 480
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "30%",
    }
  },
  xaxis: {
    categories: [],
    show: true,
    labels: {
      style: {
        fontFamily: 'BaiJamjureeMedium',
        fontSize: '14px',
        color: '#555'
      }
    },
  },
  legend: {
    fontFamily: 'BaiJamjureeMedium',
    fontSize: '14px',
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
        fontFamily: 'BaiJamjureeMedium',
      },
    }, 
    // 
  },
  title: {
    text: "จำนวนเงิน",
    align: 'left',
    style: {
      fontSize: '16px',
      fontWeight: 'bold',
      fontFamily: "BaiJamjureeMedium",
    },
  },
  dataLabels: {
    enabled: false,
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
  fill: {
    opacity: 1,
    colors: ['#FFAE67', '#73BDFF', '#FCC1DB', "#F44773"]
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return formatNumber(val);
      },
    }
  },
  series: [],
  responsive: [
    {
      breakpoint: 768,
      options: {
        chart: {
          height: 400
        },
        xaxis: {
          title: {
            offsetY: 10
          }
        },
        yaxis: {
          title: {
            offsetX: -20,
            offsetY: -10
          }
        }
      }
    }
  ]
});

const optionStartYear = ref([
  { id: 1, name: currentYear - 1 },
  { id: 2, name: currentYear - 2 },
  { id: 3, name: currentYear - 3 },
]);

const optionEndYear = ref([
  { id: 1, name: currentYear },
  { id: 2, name: currentYear - 1 },
  { id: 3, name: currentYear - 2 },
  { id: 4, name: currentYear - 3 },
]);

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
watch(
  () => filters.value,
  (newFilters) => {
    console.log("🛠 Filters Updated:", newFilters);
  },
  { deep: true }
);
watch(
  () => filters.value.startYear,
  (newStartYear) => {
    optionEndYear.value = generateEndYearOptions(newStartYear);
  }
);

function generateEndYearOptions(startYear) {
  const maxYear = currentYear;
  const options = [];
  let id = 1;
  for (let year = startYear + 1; year <= maxYear; year++) {
    options.push({ id: id++, name: year });
  }
  return options;
}

function search() {
  searchedYears.value = {
    startYear: filters.value.startYear,
    endYear: filters.value.endYear,
  };
  router.push({
    name: router.name,
    query: {
      startYear: toEngYear(filters.value.startYear),
      endYear: toEngYear(filters.value.endYear),
    },
  });
}

async function init() {
  if (!filters.value.startYear || !filters.value.endYear) return;
  isLoading.value = true;
  dashboardData.value = await fetchDataDashboard(filters);
  isLoading.value = false;
}

async function fetchDataDashboard(filters) {
  try {
    const results = await dashboardService.getDashboardData({
      startYear: toEngYear(filters.value.startYear),
      endYear: toEngYear(filters.value.endYear),
      page: 1,
      itemPerPage: 10000,
    });
    console.log("API Response Data:", results.data.datas);
    if (results && results.data) {
      dashboardData.value = results.data.datas.filter(item =>
        item.year >= toEngYear(filters.value.startYear) &&
        item.year <= toEngYear(filters.value.endYear)
      );
      if (dashboardData.value.length === 0) {
        console.warn("No data received after filtering.");
        return;
      }
      const welfareOrder = [
        "สวัสดิการทั่วไป",
        "สวัสดิการค่าสงเคราะห์ต่าง ๆ",
        "สวัสดิการค่าสงเคราะห์การเสียชีวิต",
        "สวัสดิการเกี่ยวกับการศึกษาของบุตร"
      ];
      const welfareMapping = {
        "สวัสดิการการเสียชีวิตของผู้ปฏิบัติงาน": "สวัสดิการค่าสงเคราะห์การเสียชีวิต",
      };
      const welfareTypes = [...new Set(
        dashboardData.value.map(item => welfareMapping[item.welfare_type] || item.welfare_type)
      )];
      
      welfareTypes.sort((a, b) => welfareOrder.indexOf(a) - welfareOrder.indexOf(b));

      console.log(" Ordered Welfare Types:", welfareTypes);

      const years = [...new Set(dashboardData.value.map(item => item.year))].sort((a, b) => a - b);

      const series = welfareOrder
        .filter(type => welfareTypes.includes(type))
        .map(type => ({
          name: type,
          data: years.map(year => {
            const found = dashboardData.value.find(item =>
              (welfareMapping[item.welfare_type] || item.welfare_type) === type && item.year === year
            );
            return found ? found.fund_sum_request : 0;
          }),
        }));
      chartOptions.value = {
        ...chartOptions.value,
        xaxis: { categories: years },
        series: series,
      };

    } else {
      console.warn("No valid data received.");
      dashboardData.value = [];
    }

  } catch (error) {
    Notify.create({
      message: error?.response?.data?.errors ?? "เกิดข้อผิดพลาด กรุณาลองอีกครั้ง",
      position: "bottom-left",
      type: "negative",
    });
    console.error("Fetch Error:", error);
  }
}

</script>