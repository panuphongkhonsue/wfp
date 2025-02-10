<template>
    <ReportLayout>
        <template v-slot:filter>
            <q-form class="col-12 row q-col-gutter-x-md q-ml-md-md" @submit="search">
                <div class="col-12 col-md-4 col-lg-2">
                    <InputGroup label="ตั้งแต่วันที่" :is-view="isView" compclass="col-xs-12 col-lg-4 col-xl-2"
                        clearable is-require>
                        <DatePicker class="col-12" is-dense v-model:dateShow="modelDate"
                            v-model:model="filters.startDate" for-id="start-date" :no-time="true" />
                    </InputGroup>
                </div>
                <div class="col-12 col-md-4 col-lg-2">
                    <InputGroup label="ตั้งแต่วันที่" :is-view="isView" compclass="col-xs-12 col-lg-4 col-xl-2"
                        clearable is-require>
                        <DatePicker class="col-12" is-dense v-model:dateShow="modelDate" v-model:model="filters.endDate"
                            for-id="start-date" :no-time="true" />
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
import DatePicker from "src/components/DatePicker.vue";
import { ref } from "vue";

const modelDate = ref(null);
const filters = ref({
    startDate: '',
    endDate: '',
});
</script>