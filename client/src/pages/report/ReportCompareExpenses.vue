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
          <InputGroup more-class="font-16 font-medium text-black" for-id="requesId" is-dense label="ตั้งแต่ปี">
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
          ภาพรวมการเปรียบเทียบค่าใช้จ่ายของปี {{ filters.startYear }} - {{ filters.endYear }}
        </div>
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
import { toThaiYear, toEngYear } from "src/components/format";
import InputGroup from "src/components/InputGroup.vue";

const isLoading = ref(false);
const route = useRoute();
const currentYear = toThaiYear(new Date().getFullYear());
const router = useRouter();
const filters = ref({
  startYear: currentYear-1,
  endYear: currentYear,
});
let dashboardData = null;

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
  () => filters.value.startYear,
  (newStartYear) => {
    optionEndYear.value = generateEndYearOptions(newStartYear);
  }
);

function generateEndYearOptions(startYear) {
  const maxYear = currentYear; // Define the maximum future year you want to allow
  const options = [];
  let id = 1;
  for (let year = startYear + 1; year <= maxYear; year++) {
    options.push({ id: id++, name: year });
  }
  return options;
}

function search() {
  router.push({
    name: router.name,
    query: {
      startYear: toEngYear(filters.value.startYear),
      endYear: toEngYear(filters.value.endYear),
    },
  });
}

async function init() {
  optionEndYear.value = generateEndYearOptions(filters.value.startYear);
  dashboardData = await fetchDataDashboard(filters);
  console.log("init dashboard : ", dashboardData.data)
}

async function fetchDataDashboard(filters) {
  try {
    const result = await dashboardService.getDashboardData({
      startYear: toEngYear(filters.value.startYear) ?? '',
      endYear: toEngYear(filters.value.endYear) ?? '',
      page: 1,
      itemPerPage: 10000,
    });
    return result;
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
</script>