<template>
  <PageLayout title="เบิกสวัสดิการเกี่ยวกับการศึกษาของบุตร">
    <template v-slot:page>
      <!--General Information Section -->
      <div class="row q-col-gutter-md q-pl-md q-pt-md">
        <div class="col-md-9 col-12">
          <q-card flat bordered class="full-height">
            <q-card-section class="font-18 font-bold">
              <p class="q-mb-none">ข้อมูลผู้เบิกสวัสดิการ</p>
            </q-card-section>
            <q-separator />
            <q-card-section class="row wrap q-col-gutter-y-md q-pb-sm font-16 font-bold"
              :class="canCreateFor && !isView ? 'items-center' : ''">
              <div class="col-lg-5 col-12 row q-gutter-y-md q-pr-sm"
                :class="canCreateFor && !isView ? 'items-center' : ''">
                <p class="col-auto q-mb-none">
                  ชื่อ-นามสกุล : <span v-show="!canCreateFor || isView" class="font-medium font-16 text-grey-7">{{
                    userData?.name ?? "-" }}</span>
                </p>
                <q-select v-if="canCreateFor && !isView" popup-content-class="font-14 font-regular" :loading="isLoading"
                  id="selected-status" class="col-lg q-px-lg-md col-12 font-regular" outlined for="selected-user"
                  v-model="model.createFor" :options="optionsUserName" dense option-value="id" emit-value map-options
                  option-label="name" @filter="filterFn" use-input input-debounce="100" hide-bottom-space
                  :error="!!isError?.createFor" :rules="[(val) => !!val || '']">
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey"> ไม่มีตัวเลือก </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
              <p class="col-lg-3 col-xl-4 col-12 q-mb-none q-pr-sm text-no-wrap ellipsis"
                :title="userData?.position ?? '-'">
                ตำแหน่ง : <span class="font-medium font-16 text-grey-7">{{
                  userData?.position ?? "-" }}</span>
              </p>
              <p class="col-lg col-xl-4 col-12 q-mb-none text-no-wrap ellipsis" :title="userData?.employeeType ?? '-'">
                ประเภทบุคลากร : <span class="font-medium font-16 text-grey-7">{{
                  userData?.employeeType ?? "-" }}</span>
              </p>
              <p class="col-lg-5 col-xl-4 col-12 q-mb-none q-pr-sm">ส่วนงาน : <span
                  class="font-medium font-16 text-grey-7">{{
                    userData?.department ?? "-" }}</span></p>
              <p class="col-lg col-xl-4 col-12 q-mb-none q-pr-sm">ภาควิชา : <span
                  class="font-medium font-16 text-grey-7">{{
                    userData?.sector ?? "-" }}</span>
              </p>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-md-3 col-12">
          <q-card flat bordered class="full-height">
            <q-card-section class="q-px-md q-py-md font-18 font-bold">
              <p class="q-mb-none">สิทธิ์คงเหลือ</p>
            </q-card-section>
            <q-separator />
            <q-card-section class="row wrap q-col-gutter-y-md q-px-md q-py-md font-medium font-16 text-grey-7">
              <p class="col-12 q-mb-none">บุตรคนที่ 1 :</p>
              <p class="col-12 q-mb-none">บุตรคนที่ 2 :</p>
              <p class="col-12 q-mb-none">บุตรคนที่ 3 :</p>
            </q-card-section>
          </q-card>
        </div>
      </div>
      <!-- Request Section -->
      <div class="row q-col-gutter-md q-pl-md q-pt-md ">
        <div class="col-md-9 col-12">
          <q-card flat bordered class="full-height">
            <q-card-section class="q-px-md q-pt-md q-pb-none font-18 font-bold">
              <p class="q-mb-none">ข้อมูลการเบิกสวัสดิการ</p>
              <div class="row q-mt-lg q-mb-none">
                <div class="col-md-4 col-12 q-mr-xl  ">
                  <InputGroup for-id="spouse" is-dense v-model="model.spouse" :data="model.spouse ?? '-'" is-require
                    label="คู่สมรส" placeholder="ชื่อ-สกุล" type="text" class="font-14 font-regular" :is-view="isView">
                  </InputGroup>
                </div>
                <div class="col-md-4 col-12 q-ml-lg-xl q-ml-sm-none">
                  <InputGroup for-id="marriageRegistration" more-class="font-14 font-medium" label="จดทะเบียนสมรส"
                    compclass="col-6" is-require clearable :is-view="isView">
                    <q-select popup-content-class="font-14 font-regular" v-model="model.marry_regis"
                      class="font-14 font-regular" is-dense :loading="isLoading" id="selected-status" outlined
                      :options="optionsMarry" dense clearable option-value="value" emit-value map-options
                      option-label="name">
                    </q-select>
                  </InputGroup>
                </div>
              </div>
            </q-card-section>
            <q-card-section class="row wrap q-col-gutter-y-md q-px-md q-py-md font-medium font-16 text-grey-9">
              <div class="col q-mb-none font-14 q-gutter-md">
                <div>
                  <q-radio v-model="model.role" val="redio1" label="ไม่เป็นข้าราชการประจำหรือลูกจ้างประจำ" />
                </div>

                <div class="row q-col-gutter-y-md ">
                  <q-radio v-model="model.role" val="redio2" label="ข้าราชการ" />

                  <div class="col-lg-4 col-12 row items-center ">
                    <p class="q-mb-none q-mx-md col-md-1 col-12">ตำแหน่ง</p>
                    <q-input for="officer-position" v-model="spouseData.officer.position" outlined dense
                      :disable="model.role !== 'redio2'" class="col-md-8 col-12 q-mx-md" :is-view="isView" />
                  </div>

                  <div class="col-lg-4 col-12 row items-center q-col-gutter-y-md">
                    <p class="q-mb-none q-mx-md q-mt-xs-md q-mt-lg-none col-md-1 col-12">สังกัด</p>
                    <q-input for="officer-belongTo" v-model="spouseData.officer.belongTo" outlined dense
                      :disable="model.role !== 'redio2'" class="col-md-8 col-12 q-mx-md" :is-view="isView" />
                  </div>


                </div>

                <div>
                  <q-radio v-model="model.role" val="redio3" label="ลูกจ้างประจำ" />
                </div>

                <div class="row items-center q-col-gutter-y-md">
                  <q-radio v-model="model.role" val="redio4"
                    label="พนักงานหรือลูกจ้างในรัฐวิสาหกิจ / หน่วงานของทางราชการ ราชการส่วนท้องถิ่น กรุงเทพมหานคร องค์กรอิสระ องค์กรมหาชน หรือหน่วยงานอื่นใด" />

                  <div class="col-lg-4 col-12 row items-center ">
                    <p class="q-mb-none q-mx-md col-md-1 col-12">ตำแหน่ง</p>
                    <q-input for="enterprises-position" v-model="spouseData.enterprises.position" outlined dense
                      :disable="model.role !== 'redio4'" class="col-md-8 col-12 q-mx-md" :is-view="isView" />
                  </div>

                  <div class="col-lg-4 col-12 row items-center q-col-gutter-y-md">
                    <p class="q-mb-none q-mx-md q-mt-xs-md q-mt-lg-none col-md-1 col-12">สังกัด</p>
                    <q-input for="enterprises-belongTo" v-model="spouseData.enterprises.belongTo" outlined dense
                      :disable="model.role !== 'redio4'" class="col-md-8 col-12 q-mx-md" :is-view="isView" />
                  </div>

                </div>
              </div>
            </q-card-section>
            <q-card-section>
              <div>
                <p class="require">ขอใช้สิทธิ</p>
              </div>
              <div>
                <q-option-group v-model="model.categories_id" type="radio" :options="options"
                  class="q-gutter-y-md q-my-md" />

              </div>
              <q-separator />
              <q-card-section class="q-px-md q-pt-md q-pb-sm font-18 font-bold">
                <p class="q-mb-none">ข้อมูลบุตร</p>
              </q-card-section>
              <q-card flat bordered class="full-height">
                <q-card-section class="q-px-md q-pt-md q-pb-none font-14">
                  <div v-for="(child, index) in model.child" :key="index">
                    <div class="row items-center justify-between">
                      <p class="q-mb-lg">บุตรคนที่ {{ index + 1 }}</p>
                      <q-btn v-if="index > 0" color="red" @click="removeChildForm(index)" class="q-ml-md">ลบ</q-btn>
                    </div>

                    <div class="row">
                      <div class="col-md-4 col-12 q-mr-xl">
                        <InputGroup for-id="name" more-class="font-16 font-medium" label="ชื่อ-นามสกุล"
                          compclass="col-6" is-require clearable :data="child.child_name ?? '-'" :is-view="isView">
                          <q-select is-dense v-model="child.child_name" is-require :loading="isLoading"
                            id="selected-status" popup-content-class="font-14 font-regular" class="font-14 font-regular"
                            outlined :options="optionsChildName" dense clearable option-value="name" emit-value
                            map-options option-label="name">
                          </q-select>
                        </InputGroup>
                      </div>

                      <div class="col-md-4 col-12 q-ml-lg-xl q-ml-sm-none">
                        <InputGroup for-id="birthday" is-dense v-model="child.child_birth_day" label="เกิดเมื่อ"
                          placeholder="" type="text" :is-view="isView" disable color="dark">
                        </InputGroup>

                      </div>
                    </div>

                    <div class="row">
                      <div class="col-md-4 col-12 q-mr-xl">
                        <InputGroup for-id="fatherNumberChilden" is-dense v-model="child.child_father_number"
                          :data="child.child_father_number ?? '-'" is-require label="บุตรลำดับที่ (ของบิดา)"
                          placeholder="" type="text" class="" :is-view="isView">
                        </InputGroup>
                      </div>

                      <div class="col-md-4 col-12 q-ml-lg-xl q-ml-sm-none ">
                        <InputGroup for-id="motherNumberChilden" is-dense v-model="child.child_mother_number"
                          :data="child.child_mother_number ?? '-'" is-require label="บุตรลำดับที่ (ของมารดา)"
                          placeholder="" type="text" class="" :is-view="isView">
                        </InputGroup>
                      </div>
                    </div>

                    <div class="row q-pl-none  items-center">
                      <q-checkbox v-model="child.childPassedAway" color="green-6 q-pl-none" />
                      <p class="q-mb-none ">กรณีเป็นบุตรแทนที่บุตรซึ่งถึงแก่กรรมแล้ว</p>
                    </div>

                    <div v-if="child.childPassedAway">
                      <div class="row q-mt-lg">
                        <div class="col-md-4 col-12 q-mr-xl ">
                          <InputGroup for-id="educationalInstitutio" is-dense v-model="child.delegate_number"
                            :data="model.delegate_number ?? '-'" is-require label="แทนที่บุตรลำดับที่" placeholder=""
                            type="text" class="font-14" :is-view="isView">
                          </InputGroup>
                        </div>

                        <div class="col-md-4 col-12 q-ml-lg-xl q-ml-sm-none ">
                          <InputGroup for-id="studyLevel" more-class="font-14 font-medium" label="ชื่อ - นามสุกล"
                            compclass="col-6" is-require clearable :is-view="isView" :data="model.delegate_name ?? '-'">
                            <q-select is-dense v-model="child.delegate_name" :loading="isLoading" id="selected-status"
                              popup-content-class="font-14 font-regular" class="font-14 font-regular" outlined
                              :options="optionsChildName" dense clearable option-value="name" emit-value map-options
                              option-label="name">
                            </q-select>
                          </InputGroup>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-12 col-md-4 q-mr-xl">
                          <InputGroup for-id="dateSelected" more-class="font-16 font-medium" label="เกิดเมื่อ"
                            compclass="col-6 q-pr-none" clearable :is-view="isView"
                            :data="model.delegate_birth_day ?? '-'">
                            <DatePicker is-dense v-model:model="child.delegate_birth_day" v-model:dateShow="modelDate"
                              for-id="date" :no-time="true" range-time />
                          </InputGroup>
                        </div>

                        <div class="col-12 col-md-4 q-ml-lg-xl q-ml-sm-none">
                          <InputGroup more-class="font-16 font-medium" label="ถึงแก่กรรมเมื่อ"
                            compclass="col-6 q-pr-none" clearable :is-view="isView"
                            :data="model.delegate_death_day ?? '-'">
                            <DatePicker is-dense v-model:model="child.delegate_death_day" v-model:dateShow="modelDate"
                              for-id="date" :no-time="true" range-time />
                          </InputGroup>
                        </div>

                      </div>
                    </div>


                    <div class="row items-center">

                      <div class="col-md-4 col-12 q-mr-xl q-mt-md">
                        <InputGroup for-id="fund" is-dense v-model="child.school_name" :data="child.school_name ?? '-'"
                          is-require label="สถานศึกษา" placeholder="" type="text" class="" :is-view="isView">
                        </InputGroup>
                      </div>

                      <div class="col-md-4 col-12 q-ml-lg-xl q-ml-sm-none ">
                        <InputGroup more-class="font-14 font-medium" label="ระดับชั้นที่ศึกษา" compclass="col-6"
                          is-require clearable :data="child.sub_categories_id ?? '-'" :is-view="isView">
                          <q-select v-model="child.sub_categories_id" :loading="isLoading" id="selected-status"
                            popup-content-class="font-14 font-regular" class="font-14 font-regular" outlined
                            :options="optionsSubCategory" dense clearable option-value="value" emit-value map-options
                            option-label="label">
                          </q-select>

                        </InputGroup>
                      </div>
                    </div>

                    <div class="row q-mt-lg">
                      <div class="col-md-4 col-12 q-mr-xl">
                        <InputGroup for-id="fund" is-dense v-model="child.district" :data="child.district ?? '-'"
                          is-require label="อำเภอ" placeholder="" type="text" class="" :is-view="isView">
                        </InputGroup>
                      </div>

                      <div class="col-md-4 col-12 q-ml-lg-xl q-ml-sm-none">
                        <InputGroup for-id="fund" is-dense v-model="child.province" :data="child.province ?? '-'"
                          is-require label="จังหวัด" placeholder="" type="text" class="" :is-view="isView">
                        </InputGroup>
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-md-4 col-12 q-mr-xl">
                        <InputGroup for-id="fund" is-dense v-model="child.fund_receipt"
                          :data="child.fund_receipt ?? '-'" is-require label="จำนวนเงินตามใบเสร็จ" placeholder=""
                          type="text" class="" :is-view="isView">
                        </InputGroup>
                      </div>

                      <div class="col-md-4 col-12 q-ml-lg-xl q-ml-sm-none ">
                        <InputGroup for-id="fund" is-dense v-model="child.fund_eligible"
                          :data="child.fund_eligible ?? '-'" is-require label="เบิกจากหน่วยงานอื่นแล้ว เป็นจำนวนเงิน"
                          placeholder="" type="text" class="" :is-view="isView">
                        </InputGroup>
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-md-4 col-12 q-mr-xl">
                        <InputGroup for-id="fund" is-dense v-model="child.fund_university"
                          :data="child.fund_university ?? '-'" is-require
                          label="ขอเบิกจากสวัสดิการมหาวิทยาลัย จำนวนเงิน" placeholder="" type="text" class=""
                          :is-view="isView">
                        </InputGroup>
                      </div>

                      <div class="col-md-4 col-12 q-ml-lg-xl q-ml-sm-none ">
                        <InputGroup for-id="fund" is-dense v-model="child.fund_sum_request"
                          :data="child.fund_sum_request ?? '-'" is-require label="รวมเป็นจำนวนเงิน" placeholder=""
                          type="text" class="" :is-view="isView">
                        </InputGroup>
                      </div>
                    </div>

                    <q-separator class="q-mb-md" />
                  </div>
                  <div class="row justify-end">
                    <q-btn @click="addChildForm" class="q-my-md bg-blue-10 text-white" icon="add"> เพิ่ม</q-btn>
                  </div>
                </q-card-section>
              </q-card>

            </q-card-section>
          </q-card>
        </div>
        <div class="col-md-3 col-12">

          <q-card flat bordered class="q-mb-md ">
            <q-card-section class="q-px-md q-pt-md q-pb-md font-18 font-bold">
              <p class="q-mb-none">จำนวนเงินคงเหลือ</p>
            </q-card-section>
            <q-separator />
            <q-card-section class="row wrap q-col-gutter-y-md q-px-md q-py-md font-medium font-16 text-grey-7">
              <p class="col-12 q-mb-none">บุตรคนที่ 1 :</p>
              <p class="col-12 q-mb-none">บุตรคนที่ 2 :</p>
              <p class="col-12 q-mb-none">บุตรคนที่ 3 :</p>
            </q-card-section>
          </q-card>


          <q-card flat bordered class="">
            <q-card-section class="q-px-md q-pt-md q-pb-md font-18 font-bold">
              <p class="q-mb-none">หลักฐานที่ต้องแนบ</p>
            </q-card-section>
            <q-separator />
            <q-card-section class="row wrap q-col-gutter-y-md q-px-md q-py-md font-medium font-16 text-grey-7">
              <p class="col-12 q-mb-none font-bold text-black">มารดา (จด/ไม่จดทะเบียนสมรส)</p>
              <p class="col-12 q-mb-none">1. ใบเสร็จรับเงินและประกาศค่าธรรมเนียมการศึกษา</p>
              <p class="col-12 q-mb-none">2. สำเนาบัตรประจำตัวประชาชน (ผู้เบิก)</p>
              <p class="col-12 q-mb-none">3. สำเนาสูติบัตร (บุตร)</p>
              <p class="col-12 q-mb-none font-bold text-black">บิดา (จดทะเบียนสมรส)</p>
              <p class="col-12 q-mb-none">1. ใบเสร็จรับเงินและประกาศค่าธรรมเนียมการศึกษา</p>
              <p class="col-12 q-mb-none">2. สำเนาบัตรประจำตัวประชาชน (ผู้เบิก)</p>
              <p class="col-12 q-mb-none">3. สำเนาสูติบัตร (บุตร)</p>
              <p class="col-12 q-mb-none">4. สำเนาทะเบียนสมรส (ผู้เบิก)</p>
              <p class="col-12 q-mb-none font-bold text-black">บิดา (ไม่จดทะเบียนสมรส)</p>
              <p class="col-12 q-mb-none">1. ใบเสร็จรับเงินและประกาศค่าธรรมเนียมการศึกษา</p>
              <p class="col-12 q-mb-none">2. สำเนาบัตรประจำตัวประชาชน (ผู้เบิก)</p>
              <p class="col-12 q-mb-none">3. สำเนาสูติบัตร (บุตร)</p>
              <p class="col-12 q-mb-none">4. สำเนาทะเบียนรับรองบุตร</p>
            </q-card-section>
          </q-card>


        </div>
      </div>
    </template>
    <!--Action Slot -->
    <template v-slot:action>
      <div class="justify-end row q-py-xs font-medium q-gutter-lg">
        <q-btn id="button-back" class="text-white font-medium font-16 weight-8 q-px-lg" dense type="button"
          style="background : #BFBFBF;" label="ย้อนกลับ" no-caps :to="{ name: 'children_edu_welfare_list' }" />

        <q-btn id="button-reject" class="text-white font-medium bg-blue-9 text-white font-16 weight-8 q-px-lg" dense
          type="submit" label="บันทึกฉบับร่าง" no-caps @click="submit(4)" v-if="!isView && !isLoadings" />

        <q-btn id="button-approve" class="font-medium font-16 weight-8 text-white q-px-md" dense type="submit"
          style="background-color: #43a047" label="ส่งคำร้องขอ" no-caps @click="submit(3)"
          v-if="!isView && !isLoadings" />
      </div>
    </template>
  </PageLayout>
</template>
<script setup>
import PageLayout from "src/layouts/PageLayout.vue";
import InputGroup from "src/components/InputGroup.vue";
import Swal from "sweetalert2";
import { Notify } from "quasar";
import DatePicker from "src/components/DatePicker.vue";
import { ref, watch, computed, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import userManagementService from "src/boot/service/userManagementService";
import { useAuthStore } from "src/stores/authStore";
import reimbursementChildrenEducationService from "src/boot/service/reimbursementChildrenEducationService";

defineOptions({
  name: "children_edu_welfare_edit",
});
const isLoading = ref(false);
const authStore = useAuthStore();
const isError = ref({});
const isView = ref(false);
const isLoadings = ref(false);
const router = useRouter();
const route = useRoute();
const userData = ref({});
let optionsUserName = ref([]);
let optionsChildName = ref([]);
let optionsSubCategory = ref([]);
const isEdit = computed(() => {
  return !isNaN(route.params.id);
});
const canCreateFor = computed(() => {
  return authStore.isEditor;
});
onMounted(async () => {
  await init();
  isLoadings.value = false;
});

onBeforeUnmount(() => {
  model.value = null;
});

const model = ref({
  createFor: null,
  fund_sum_receipt: 0,
  fund_other: 0,
  spouse: null,
  marry_regis: null,
  role: null,
  categories_id: null,
  child: [
    {
      fund_receipt: null,
      fund_eligible: null,
      fund_sum_request: null,
      fund_university: null,
      child_name: null,
      child_birth_day: null,
      child_father_number: null,
      child_mother_number: null,
      school_name: null,
      district: null,
      province: null,
      sub_categories_id: null,
      childPassedAway: false,
      delegate_name: null,
      delegate_number: null,
      delegate_birth_day: null,
      delegate_death_day: null
    }
  ]
});



const spouseData = ref({
  officer: {
    position: null,
    belongTo: null
  },
  enterprises: {
    position: null,
    belongTo: null
  }
});

async function fetchUserData(id) {
  try {
    const result = await userManagementService.dataById(id);
    var returnedData = result.data.datas; // ✅ เป็นอ็อบเจ็กต์เดียว

    if (returnedData) {
      userData.value = {
        name: returnedData?.name,
        position: returnedData?.position?.name,
        employeeType: returnedData?.employeeType?.name,
        sector: returnedData?.sector?.name,
        department: returnedData?.department?.name
      };

      // ✅ ใช้ children ซึ่งเป็นอาร์เรย์
      optionsChildName.value = returnedData.children || [];
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

import { nextTick } from "vue";

watch(
  () => model.value.child.map(child => child.child_name),
  async (newNames) => {
    newNames.forEach((newName, index) => {
      if (newName) {
        const selectedChild = optionsChildName.value.find(
          (child) => child.name === newName
        );

        console.log(`🔍 Matched Child Data for index ${index}:`, selectedChild);

        if (selectedChild) {
          console.log(`✅ ก่อนอัปเดต:`, model.value.child[index].child_birth_day);
          model.value.child[index].child_birth_day = selectedChild.birthday || "-";
          console.log(`✅ หลังอัปเดต:`, model.value.child[index].child_birth_day);
        } else {
          model.value.child[index].child_birth_day = "-";
        }
      }
    });

    await nextTick(); // 🔥 บังคับ Vue อัปเดต UI
  },
  { deep: true }
);


async function filterFn(val, update) {
  try {
    setTimeout(async () => {
      const result = await userManagementService.getUserInitialData({ keyword: val });
      var returnedData = result.data.datas;
      update(() => {
        if (returnedData) {
          optionsUserName.value = returnedData;
        }
      });
    }, 650);

  }
  catch (error) {
    Promise.reject(error);
  }
}

const getSubCategory = async () => {
  console.log('getSubCategory called with categoriesId:', model.value.categories_id);
  try {
    const result = await reimbursementChildrenEducationService.getSubCategories({
      categories_id: model.value.categories_id
    });
    console.log('API call result:', result);

    // แปลงข้อมูลให้ตรงกับรูปแบบที่ q-select ต้องการ
    const returnedData = result.data.map(item => ({
      value: item.id, // ใช้ id เป็น value
      label: item.name // ใช้ name เป็น label
    }));

    optionsSubCategory.value = returnedData;  // อัปเดต optionsSubCategory
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    const errorMessage = error?.response?.data?.message ?? "กรุณาเลือกสิทธิ";
    alert(errorMessage);
  }
};


watch(() => model.value.categories_id, (newValue) => {
  if (newValue) {
    console.log('Selected categories_id changed to:', newValue); // ตรวจสอบค่าที่เลือก
    getSubCategory(); // เรียกฟังก์ชัน getSubCategory เมื่อ categories_id เปลี่ยน
  }
});



function removeChildForm(index) {
  model.value.child.splice(index, 1);
};

function addChildForm() {
  model.value.child.push({
    fund_receipt: null,
    fund_eligible: null,
    fund_sum_request: null,
    fund_university: null,
    child_name: null,
    child_birth_day: null,
    child_father_number: null,
    child_mother_number: null,
    school_name: null,
    district: null,
    province: null,
    sub_categories_id: null,
    childPassedAway: false,
    delegate_name: null,
    delegate_number: null,
    delegate_birth_day: null,
    delegate_death_day: null
  });
}

watch(
  () => model.value.spouseRole,
  async () => {
    spouseData.value = {
      officer: {
        position: null,
        belongTo: null
      },
      enterprises: {
        position: null,
        belongTo: null
      }
    };
  }
);

watch(
  () => model.value.createFor,
  (newValue) => {
    try {
      if (canCreateFor.value) {
        if ((newValue !== null && newValue !== undefined) && !isView.value) {
          // fetchRemaining();
          fetchUserData(newValue);
        }
      }
    }
    catch (error) {
      Notify.create({
        message:
          error?.response?.data?.message ??
          "ไม่พบข้อมูลสิทธิ์คงเหลือของผู้ใช้งาน",
        position: "bottom-left",
        type: "negative",
      });
    }
  }
);



const options = [
  {
    label: '(ก) สำหรับผู้ปฏิบัติงานที่เริ่มปฏิบัติงานตั้งแต่วันที่ 26 มีนาคม พ.ศ. 2561 หรือ ผู้ปฏิบัติงานที่ปฏิบัติงานก่อนประกาศนี้มีผลใช้บัคับและมีบุตรที่เริ่มเข้าศึกษาตั้งแต่ ปีการศึกษา 2561',
    value: 13
  },
  {
    label: '(ข) สำหรับผู้ปฏิบัติงานที่เริ่มปฏิบัติงานก่อนวันที่ 26 มีนาคม พ.ศ. 2561 หรือ ผู้ปฏิบัติงานที่ปฏิบัติงานก่อนประกาศนี้มีผลใช้บัคับ ',
    value: 14
  },
  {
    label: '(ค) สำหรับผู้ปฏิบัติงานที่มีบุตร ที่เริ่มเข้าศึกษาในโรงเรียนสาธิต “พิบูลบำเพ็ญ” มหาวิทยาลัยบูรพา โดยเข้าศึกษาตั้งแต่ภาคปลายปีการศึกษา 2560 เป็นต้นไป',
    value: 15
  },
  {
    label: '(ง) สำหรับผู้ปฏิบัติงานที่เริ่มปฏิบัติงานตั้งแต่วันที่ 26 มีนาคม พ.ศ. 2561 ที่มีบุตรเริ่มเข้าศึกษาในโรงเรียนสาธิต “พิบูลบำเพ็ญ” มหาวิทยาลัยบูรพาหลักสูตร การศึกษานานาชาติขั้นพื้นฐาน ตั้งแต่ปีการศึกษา 2561 เป็นต้นไป',
    value: 16
  },
  {
    label: '(จ) สำหรับผู้ปฏิบัติงานที่เริ่มปฏิบัติงานก่อนวันที่ 26 มีนาคม พ.ศ. 2561 ที่มีบุตรเริ่มเข้าศึกษาในโรงเรียนสาธิต “พิบูลบำเพ็ญ” มหาวิทยาลัยบูรพาหลักสูตร การศึกษานานาชาติขั้นพื้นฐาน ตั้งแต่ปีการศึกษา 2561 เป็นต้นไป',
    value: 17
  },

]

let optionsMarry = [
  { name: "จดทะเบียน", value: "YES" },
  { name: "ไม่จดทะเบียน", value: "NO" },

];



async function submit(actionId) {
  let validate = false;
  console.log("ตรวจสอบค่าก่อน validate:", model.value, canCreateFor.value, "actionId:", actionId);

  // ตรวจสอบว่า createFor ต้องมีค่าหรือไม่
  if (!model.value.createFor && canCreateFor.value) {
    console.log("createFor ไม่ถูกต้อง:", model.value.createFor);
    isError.value.createFor = "โปรดเลือกผู้ใช้งาน";
    document.getElementById("selected-user").scrollIntoView(false);
    validate = true;
  }

  if (validate) {
    console.log("validate = true, แสดงแจ้งเตือน");
    Notify.create({
      message: "กรุณากรอกข้อมูลให้ครบถ้วน",
      position: "bottom-left",
      type: "negative",
    });
    return;
  }


  let isValid = false;
  let payload = {
    fund_sum_receipt: model.value.fund_sum_receipt,
    fund_other: model.value.fund_other,
    actionId: actionId ?? null, // ป้องกัน actionId เป็น undefined
    spouse: model.value.spouse,
    marry_regis: model.value.marry_regis,
    role: model.value.role,
    categories_id: model.value.categories_id,
    child: model.value.child.map(c => ({
      fund_receipt: c.fund_receipt,
      fund_eligible: c.fund_eligible,
      fund_sum_request: c.fund_sum_request,
      childName: c.child_name,
      childBirthDay: c.child_birth_day,
      childFatherNumber: c.child_father_number,
      childMotherNumber: c.child_mother_number,
      schoolName: c.school_name,
      district: c.district,
      province: c.province,
      subCategoriesId: c.sub_categories_id
    }))


}


  console.log("ค่า marryRegis:", model.value.marry_regis);
  console.log("ค่า categoriesId:", model.value.categories_id);
  console.log("Payload:", payload);

  let fetch; // เปลี่ยนจาก var เป็น let
  Swal.fire({
    title: "ยืนยันการทำรายการหรือไม่ ???",
    html: `โปรดตรวจสอบข้อมูลให้แน่ใจก่อนยืนยัน`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "ยืนยัน",
    cancelButtonText: "ยกเลิก",
    showLoaderOnConfirm: true,
    reverseButtons: true,
    customClass: {
      confirmButton: "save-button",
      cancelButton: "cancel-button",
    },
    preConfirm: async () => {
      try {
        if (isEdit.value) {
          // fetch = await healthCheckUpWelfareService.update(route.params.id, payload);
        } else {
          console.log("Payload ที่ส่งไป:", JSON.stringify(payload, null, 2));

          fetch = await reimbursementChildrenEducationService.create(payload);
        }
        isValid = true;
      } catch (error) {
        console.error("เกิดข้อผิดพลาด:", error);
        if (error?.response?.status == 400) {
          if (Object.keys(error?.response?.data?.errors ?? {}).length) {
            isError.value = {
              ...isError.value,
              ...error.response?.data?.errors,
            };
          }
        }
        Swal.showValidationMessage(error?.response?.data?.message ?? `เกิดข้อผิดพลาด กรุณาลองอีกครั้ง`);
        Notify.create({
          message:
            error?.response?.data?.message ?? "บันทึกข้อมูลไม่สำเร็จ กรุณาลองอีกครั้ง",
          position: "bottom-left",
          type: "negative",
        });
      }
    },
  }).then((result) => {
    if (isValid && result.isConfirmed) {
      Swal.fire({
        html: fetch?.data?.message ?? `สำเร็จ`,
        icon: "success",
        confirmButtonText: "ตกลง",
        customClass: {
          confirmButton: "save-button",
        },
      }).then(() => {
        router.replace({ name: "health_check_up_welfare_list" });
      });
    }
  });
}


async function init() {
  isView.value = route.meta.isView;
  isLoading.value = true;
  try {
    if (isView.value) {
      // fetchDataEdit();
    }
    else if (isEdit.value) {
      if (!canCreateFor.value) {
        // fetchRemaining();
      }
      // fetchDataEdit();
    }
    else {
      if (!canCreateFor.value) {
        // fetchRemaining();
        fetchUserData(authStore.id);
      }
    }
  }
  catch (error) {
    Promise.reject(error);
  }
  isLoading.value = false;
}
</script>
