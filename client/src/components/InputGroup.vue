<template>
  <div :class="compclass ? compclass : 'col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 text-grey-9'">
    <p :class="[isRequire ? 'require' : '', moreClass ? moreClass : 'font-semi-bold font-14']"
      class="q-mb-sm">{{ label }} </p>
    <div v-if="!isView">
      <slot v-if="model === undefined"></slot>
      <q-input v-else  class="font-14 font-regular" :dense="isDense" v-model="model" outlined
        :placeholder="placeholder" autocomplete="off" color="dark" :prefix="prefix" :suffix="suffix" :type="type"
        :mask="mask" :min="min" :rules="rules" :error="error" :disable="disable" :readonly="readonly" bottom-slots
        :for="forId">
        <template v-slot:error>
          <div>
            {{ errorMessage }}
          </div>
        </template>
      </q-input>
    </div>
    <div v-else class="q-my-sm font-regular text-req-info">
      <p style="margin: 0px">{{ model ?? data }}</p>
    </div>
  </div>
</template>
<script setup>
const model = defineModel();
defineOptions({
  name: 'InputGroup',
});
defineProps({
  label: {
    type: String,
    default() {
      return "label";
    },
  },
  placeholder: {
    type: String,
    default() {
      return "placeholder";
    },
  },
  compclass: {
    type: String,
    default() {
      return "";
    },
  },
  moreClass: String,
  type: String,
  disable: Boolean,
  readonly: Boolean,
  prefix: String,
  suffix: String,
  isRequire: {
    type: Boolean,
    default() {
      return false;
    },
  },
  mask: String,
  min: Number,
  isView: Boolean,
  data: String,
  rules: Array,
  error: Boolean,
  refInput: String,
  errorMessage: String,
  isColor: String,
  forId: {
    type: String,
    default() {
      return null;
    },
  },
  isDense: {
    type: Boolean
  }
});

</script>
