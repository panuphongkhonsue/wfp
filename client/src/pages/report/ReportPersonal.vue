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
            </q-form>
        </template>
    </ReportLayout>
</template>

<script setup>
import ReportLayout from "src/layouts/ReportLayout.vue";
import InputGroup from "src/components/InputGroup.vue";
import { ref, onMounted} from "vue";
import { toThaiYear, toEngYear } from "src/components/format";
import { Notify } from "quasar";
import dashboardService from "src/boot/service/dashboardService";

const isLoading = ref(false);
const currentYear = toThaiYear(new Date().getFullYear());
const filters = ref({
  year: '',
});
let dashboardData = null;

const optionStartYear = ref([
  { id: 1, name: currentYear },
  { id: 1, name: currentYear - 1 },
  { id: 2, name: currentYear - 2 },
  { id: 3, name: currentYear - 3 },
]);

onMounted(async () => {
  isLoading.value = true;
  await init();
  isLoading.value = false;
});

async function init() {
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