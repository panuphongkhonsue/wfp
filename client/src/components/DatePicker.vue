<template>
  <q-input outlined :dense="isDense" v-model="dateShow" :placeholder="noTime ? 'DD/MMM/YYYY' : 'DD/MMM/YYYY HH:mm'"
    clearable :disable="disabled" @click="$refs.qDate1.show()" :readonly="isReadonly" :hide-bottom-space="hideBottom"
    input-class="cursor-pointer font-14 font-regular" :error-message="err" :error="!!err" :for="forId">
    <template v-slot:append>
      <q-icon :name="noTime ? 'event' : 'access_time'" class="cursor-pointer">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale" :ref="noTime ? 'qDate1' : ''">
          <q-date v-if="noTime" v-model="model" mask="DD/MMM/YYYY" :range="rangeTime">
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
          </q-date>
          <q-time v-else v-model="model" mask="DD/MMM/YYYY HH:mm" :format24h="format24h">
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
          </q-time>
        </q-popup-proxy>
      </q-icon>
    </template>
    <template v-if="!noTime" v-slot:prepend>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale" ref="qDate1">
          <q-date v-model="model" mask="DD/MMM/YYYY HH:mm">
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>
<script setup>
defineOptions({
  name: 'DatePicker',
});
const model = defineModel('model');
const dateShow = defineModel('dateShow');
defineProps({
  err: {
    default: null,
  },
  forId: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  noTime: {
    type: Boolean,
    default: false,
  },
  format24h: {
    type: Boolean,
    default: true,
  },
  isReadonly: {
    type: Boolean,
  },
  isDense: {
    type: Boolean
  },
  rangeTime: {
    type: Boolean,
    default: false,
  },
  hideBottom : {
    type :Boolean,
    default(){
      return true;
    }
  },
});
</script>
