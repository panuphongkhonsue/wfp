<template>
  <InputGroup :label="label" :isrequire="isrequire" :isView="isView">
    <q-select
      ref="select_input"
      outlined
      dense
      v-model="model"
      :options="options"
      :clearable="clearable"
      emit-value
      map-options
      :color="color"
      :option-label="optionLabel"
      :option-value="optionValue"
      :loading="loading"
      @filter="beforeFilter"
      :use-input="useInput"
      @focus="onFocus"
      @blur="onBlur"
      @clear="onClear"
    >
      <template v-slot:option="props">
        <q-item v-on:click="onItemClick(props.opt)" clickable v-close-popup>
          <q-item-section>{{
            typeof optionLabel == "function"
              ? optionLabel(props.opt)
              : props.opt[optionLabel ?? "label"]
          }}</q-item-section>
        </q-item>
      </template>
      <template v-if="!model && !isFiltering" v-slot:selected>
        <div class="text-grey-6 ellipsis">{{ placeholder }}</div>
      </template>
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey"> No results </q-item-section>
        </q-item>
      </template>
      <template v-if="model != undefined" v-slot:selected-item="props">
        <template v-if="!isFiltering">
          <div v-if="$slots[`selected-item`] && showPhd">
            <slot name="selected-item" :props="props"></slot>
          </div>
          <div v-else>
            {{
              typeof optionLabel == "function"
                ? optionLabel(props.opt)
                : props.opt[optionLabel ?? "label"]
            }}
          </div>
        </template>
      </template>
    </q-select>
  </InputGroup>
</template>
<script setup>
import InputGroup from "./InputGroup.vue";
import { ref } from "vue";
defineOptions({
  name: 'SelectedGroup',
});
const select_input = ref();

const model = defineModel();
const showPhd = ref(true);
const isFiltering = ref(false);

const onClear = function () {
  select_input.value.blur();
};

const onItemClick = function (option) {
  if (props.optionValue) model.value = option[props.optionValue];
  else model.value = option;
  isFiltering.value = false;
};

const beforeFilter = function (val, update, abort) {
  if (props.filter) {
    isFiltering.value = true;
    props.filter(val, update, abort);
  } else update();
};

const onFocus = async function () {
  if (props.filter) showPhd.value = false;
};

const onBlur = async function () {
  if (props.filter) showPhd.value = true;
  isFiltering.value = false;
};

const props = defineProps({
  label: {
    type: String,
  },
  placeholder: {
    type: String,
  },
  color: {
    type: String,
  },
  isrequire: {
    type: Boolean,
  },
  loading: {
    type: Boolean,
  },
  options: {
    type: Array,
  },
  clearable: {
    type: Boolean,
    default() {
      return false;
    },
  },
  optionLabel: {},
  optionValue: {
    type: String,
  },
  disable: {
    type: Boolean,
  },
  readonly: {
    type: Boolean,
  },
  isView: Boolean,
  useInput: Boolean,
  filter: Function,
});
</script>

<style scoped>
:deep(.q-field__native > span) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
