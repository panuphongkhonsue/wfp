<template>
  <PageLayout title="เบิกสวัสดิการเกี่ยวกับการศึกษาของบุตร">
    <template v-slot:page>
      <!--General Information Section -->
      <div class="row q-col-gutter-md q-pl-md q-pt-md">
        <div class="col-md-9 col-12">
          <q-card flat bordered class="full-height">
            <q-card-section class="q-px-md q-py-md font-18 font-bold">
              <p class="q-mb-none">ข้อมูลผู้เบิกสวัสดิการ</p>
            </q-card-section>
            <q-separator />
            <q-card-section class="row wrap q-col-gutter-y-md q-px-md q-pt-md q-pb-sm font-16 font-bold">
              <div class="col-12 row wrap q-col-gutter-y-md">
                <p class="col-lg-3 col-12 q-mb-none">
                  ชื่อ : <span class="font-medium font-16 text-grey-7">สุทธพัฒน์ บุญทัน</span>
                </p>
                <p class="col-lg-3 col-12 q-mb-none">
                  ตำแหน่ง : <span class="font-medium font-16 text-grey-7">รองศาสตราจารย์</span>
                </p>
                <p class="col-lg col-12 q-mb-none">
                  ประเภทบุคลากร : <span class="font-medium font-16 text-grey-7">พนักงานมหาวิทยาลัย</span>
                </p>
              </div>
              <div class="col-12 row wrap q-col-gutter-y-md">
                <p class="col-lg-3 col-12 q-mb-none">ส่วนงาน : <span
                    class="font-medium font-16 text-grey-7">สถาบันการศึกษา</span></p>
                <p class="col-lg col-12 q-mb-none">ภาควิชา : <span
                    class="font-medium font-16 text-grey-7">วิศวกรรมซอฟต์แวร์</span></p>
              </div>
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
                  <InputGroup for-id="marriageRegistration" more-class="font-14 font-medium" label="จดทะเบียนสมรส" compclass="col-6" is-require
                    clearable :is-view="isView">
                    <q-select popup-content-class="font-14 font-regular" class="font-14 font-regular" is-dense
                      v-model="model.marriageRegistration" :loading="isLoading" id="selected-status" outlined
                      :options="options1" multiple dense clearable option-value="statusId" emit-value map-options
                      option-label="name">
                    </q-select>
                  </InputGroup>
                </div>
              </div>
            </q-card-section>
            <q-card-section class="row wrap q-col-gutter-y-md q-px-md q-py-md font-medium font-16 text-grey-9">
              <div class="col q-mb-none font-14 q-gutter-md">
                <div>
                  <q-radio v-model="model.spouseRole" val="redio1" label="ไม่เป็นข้าราชการประจำหรือลูกจ้างประจำ" />
                </div>

                <div class="row q-col-gutter-y-md ">
                  <q-radio v-model="model.spouseRole" val="redio2" label="ข้าราชการ" />

                  <div class="col-lg-4 col-12 row items-center ">
                    <p class="q-mb-none q-mx-md col-md-1 col-12">ตำแหน่ง</p>
                    <q-input for="officer-position" v-model="spouseData.officer.position" outlined dense
                      :disable="model.spouseRole !== 'redio2'" class="col-md-8 col-12 q-mx-md" :is-view="isView" />
                  </div>

                  <div class="col-lg-4 col-12 row items-center q-col-gutter-y-md">
                    <p class="q-mb-none q-mx-md q-mt-xs-md q-mt-lg-none col-md-1 col-12">สังกัด</p>
                    <q-input for="officer-belongTo" v-model="spouseData.officer.belongTo" outlined dense
                      :disable="model.spouseRole !== 'redio2'" class="col-md-8 col-12 q-mx-md" :is-view="isView" />
                  </div>


                </div>

                <div>
                  <q-radio v-model="model.spouseRole" val="redio3" label="ลูกจ้างประจำ" />
                </div>

                <div class="row items-center q-col-gutter-y-md">
                  <q-radio v-model="model.spouseRole" val="redio4"
                    label="พนักงานหรือลูกจ้างในรัฐวิสาหกิจ / หน่วงานของทางราชการ ราชการส่วนท้องถิ่น กรุงเทพมหานคร องค์กรอิสระ องค์กรมหาชน หรือหน่วยงานอื่นใด" />

                  <div class="col-lg-4 col-12 row items-center ">
                    <p class="q-mb-none q-mx-md col-md-1 col-12">ตำแหน่ง</p>
                    <q-input for="enterprises-position" v-model="spouseData.enterprises.position" outlined dense
                      :disable="model.spouseRole !== 'redio4'" class="col-md-8 col-12 q-mx-md" :is-view="isView" />
                  </div>

                  <div class="col-lg-4 col-12 row items-center q-col-gutter-y-md">
                    <p class="q-mb-none q-mx-md q-mt-xs-md q-mt-lg-none col-md-1 col-12">สังกัด</p>
                    <q-input for="enterprises-belongTo" v-model="spouseData.enterprises.belongTo" outlined dense
                      :disable="model.spouseRole !== 'redio4'" class="col-md-8 col-12 q-mx-md" :is-view="isView" />
                  </div>

                </div>
              </div>
            </q-card-section>
            <q-card-section>
              <div>
                <p class="require">ขอใช้สิทธิ</p>
              </div>
              <div>
                <q-option-group v-model="selection" type="radio" :options="options" class="q-gutter-y-md q-my-md" />
              </div>
              <q-separator />
              <q-card-section class="q-px-md q-pt-md q-pb-sm font-18 font-bold">
                <p class="q-mb-none">ข้อมูลบุตร</p>
              </q-card-section>
              <q-card flat bordered class="full-height">
                <q-card-section class="q-px-md q-pt-md q-pb-none font-14">
                  <div v-for="(child, index) in model.childrenForms" :key="index">
                    <div class="row items-center justify-between">
                      <p class="q-mb-lg">บุตรคนที่ {{ index + 1 }}</p>
                      <q-btn v-if="index > 0" color="red" @click="removeChildForm(index)" class="q-ml-md">ลบ</q-btn>
                    </div>

                    <div class="row">
                      <div class="col-md-4 col-12 q-mr-xl ">
                        <InputGroup for-id="name" more-class="font-16 font-medium" label="ชื่อ-นามสกุล" compclass="col-6" is-require
                          clearable>
                          <q-select is-dense v-model="child.name" :loading="isLoading" id="selected-status"
                            popup-content-class="font-14 font-regular" class="font-14 font-regular" outlined
                            :options="options1" multiple dense clearable option-value="statusId" emit-value map-options
                            option-label="name">
                          </q-select>
                        </InputGroup>
                      </div>

                      <div class="col-md-4 col-12 q-ml-lg-xl q-ml-sm-none ">
                        <InputGroup for-id="birthDate" is-dense v-model="child.birthDate" label="เกิดเมื่อ" placeholder=""
                          type="text" :is-view="isView" disable color="dark" >
                        </InputGroup>
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-md-4 col-12 q-mr-xl">
                        <InputGroup for-id="fatherNumberChilden" is-dense v-model="child.fatherNumberChilden" is-require
                          label="บุตรลำดับที่ (ของบิดา)" placeholder="" type="text" class="" :is-view="isView">
                        </InputGroup>
                      </div>

                      <div class="col-md-4 col-12 q-ml-lg-xl q-ml-sm-none ">
                        <InputGroup for-id="motherNumberChilden" is-dense v-model="child.motherNumberChilden" is-require
                          label="บุตรลำดับที่ (ของมารดา)" placeholder="" type="text" class="" :is-view="isView">
                        </InputGroup>
                      </div>
                    </div>

                    <div class="row q-pl-none  items-center">
                      <q-checkbox  v-model="child.childPassedAway" color="green-6 q-pl-none" />
                      <p class="q-mb-none ">กรณีเป็นบุตรแทนที่บุตรซึ่งถึงแก่กรรมแล้ว</p>
                    </div>

                    <div v-if="child.childPassedAway">
                      <div class="row q-mt-lg">
                        <div class="col-md-4 col-12 q-mr-xl ">
                          <InputGroup for-id="educationalInstitutio" is-dense v-model="child.educationalInstitutio"
                            :data="model.fund ?? '-'" is-require label="แทนที่บุตรลำดับที่" placeholder="" type="text"
                            class="font-14" :is-view="isView">
                          </InputGroup>
                        </div>

                        <div class="col-md-4 col-12 q-ml-lg-xl q-ml-sm-none ">
                          <InputGroup for-id="studyLevel" more-class="font-14 font-medium" label="ชื่อ - นามสุกล" compclass="col-6"
                            is-require clearable>
                            <q-select is-dense v-model="child.studyLevel" :loading="isLoading" id="selected-status"
                              popup-content-class="font-14 font-regular" class="font-14 font-regular" outlined
                              :options="options1" multiple dense clearable option-value="statusId" emit-value
                              map-options option-label="name">
                            </q-select>
                          </InputGroup>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-12 col-md-4 q-mr-xl">
                          <InputGroup for-id="dateSelected" more-class="font-16 font-medium" label="เกิดเมื่อ" compclass="col-6 q-pr-none"
                            clearable>
                            <DatePicker is-dense v-model:model="filter.dateSelected" v-model:dateShow="modelDate"
                              for-id="date" :no-time="true" range-time />
                          </InputGroup>
                        </div>

                        <div class="col-12 col-md-4 q-ml-lg-xl q-ml-sm-none">
                          <InputGroup more-class="font-16 font-medium" label="ถึงแก่กรรมเมื่อ"
                            compclass="col-6 q-pr-none" clearable>
                            <DatePicker is-dense v-model:model="filter.dateSelected" v-model:dateShow="modelDate"
                              for-id="date" :no-time="true" range-time />
                          </InputGroup>
                        </div>

                      </div>
                    </div>



                    <div class="row items-center ">
                      <q-radio v-model="model.spouseRole" val="redio5"
                        label="โรงเรียนสาธิต พิบูลบําเพ็ญ มหาวิทยาลัยบูรพา" />
                    </div>


                    <div class="row items-center">

                      <div class=" col-md-4 col-12 items-center q-mr-xl">
                        <q-radio v-model="model.spouseRole" val="redio6" label="โรงเรียนอื่นๆ" />
                        <q-input v-model="spouseData.enterprises.position" outlined dense
                          :disable="model.spouseRole !== 'redio6'" color :is-view="isView" />

                      </div>

                      <div class="col-md-4 col-12 q-ml-lg-xl q-ml-sm-none ">
                        <InputGroup more-class="font-14 font-medium" label="ระดับชั้นที่ศึกษา" compclass="col-6"
                          is-require clearable>
                          <q-select v-model="child.studyLevel" :loading="isLoading" id="selected-status"
                            popup-content-class="font-14 font-regular" class="font-14 font-regular" outlined
                            :options="options1" multiple dense clearable option-value="statusId" emit-value map-options
                            option-label="name">
                          </q-select>
                        </InputGroup>
                      </div>
                    </div>

                    <div class="row q-mt-lg">
                      <div class="col-md-4 col-12 q-mr-xl">
                        <InputGroup for-id="fund" is-dense v-model="child.district" is-require label="อำเภอ"
                          placeholder="" type="text" class="" :is-view="isView">
                        </InputGroup>
                      </div>

                      <div class="col-md-4 col-12 q-ml-lg-xl q-ml-sm-none">
                        <InputGroup for-id="fund" is-dense v-model="child.province" is-require label="จังหวัด"
                          placeholder="" type="text" class="" :is-view="isView">
                        </InputGroup>
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-md-4 col-12 q-mr-xl">
                        <InputGroup for-id="fund" is-dense v-model="child.receipt" is-require
                          label="จำนวนเงินตามใบเสร็จ" placeholder="" type="text" class="" :is-view="isView">
                        </InputGroup>
                      </div>

                      <div class="col-md-4 col-12 q-ml-lg-xl q-ml-sm-none ">
                        <InputGroup for-id="fund" is-dense v-model="child.anotherAgency" is-require
                          label="เบิกจากหน่วยงานอื่นแล้ว เป็นจำนวนเงิน" placeholder="" type="text" class=""
                          :is-view="isView">
                        </InputGroup>
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-md-4 col-12 q-mr-xl">
                        <InputGroup for-id="fund" is-dense v-model="child.universityWelfare" is-require
                          label="ขอเบิกจากสวัสดิการมหาวิทยาลัย จำนวนเงิน" placeholder="" type="text" class=""
                          :is-view="isView">
                        </InputGroup>
                      </div>

                      <div class="col-md-4 col-12 q-ml-lg-xl q-ml-sm-none ">
                        <InputGroup for-id="fund" is-dense v-model="child.total" is-require label="รวมเป็นจำนวนเงิน"
                          placeholder="" type="text" class="" :is-view="isView">
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

defineOptions({
  name: "children_edu_welfare_edit",
});
const isLoading = ref(false);
const router = useRouter();
const route = useRoute();

const model = ref({
  userId: null,
  spouse: null,
  marriageRegistration: null,
  spouseRole: false,
  childrenForms: [
    {
      name: null,
      birthDate: null,
      fatherNumberChilden: null,
      motherNumberChilden: null,
      educationalInstitutio: null,
      studyLevel: null,
      district: null,
      childPassedAway: false,
      province: null,
      receipt: null,
      anotherAgency: null,
      universityWelfare: null,
      total: null
    }
  ]
});

function removeChildForm(index) {
  model.value.childrenForms.splice(index, 1);
};

function addChildForm() {
  model.value.childrenForms.push({
    name: null,
    birthDate: null,
    fatherNumberChilden: null,
    motherNumberChilden: null,
    educationalInstitutio: null,
    studyLevel: null,
    district: null,
    childPassedAway: false,
    province: null,
    receipt: null,
    anotherAgency: null,
    universityWelfare: null,
    total: null
  });
}
const filter = ref({
  dateSelected: null,

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



const options = [
  {
    label: '(ก) สำหรับผู้ปฏิบัติงานที่เริ่มปฏิบัติงานตั้งแต่วันที่ 26 มีนาคม พ.ศ. 2561 หรือ ผู้ปฏิบัติงานที่ปฏิบัติงานก่อนประกาศนี้มีผลใช้บัคับและมีบุตรที่เริ่มเข้าศึกษาตั้งแต่ ปีการศึกษา 2561',
    value: '(ก) สำหรับผู้ปฏิบัติงานที่เริ่มปฏิบัติงานตั้งแต่วันที่ 26 มีนาคม พ.ศ. 2561 หรือ ผู้ปฏิบัติงานที่ปฏิบัติงานก่อนประกาศนี้มีผลใช้บัคับและมีบุตรที่เริ่มเข้าศึกษาตั้งแต่ ปีการศึกษา 2561'
  },
  {
    label: '(ข) สำหรับผู้ปฏิบัติงานที่เริ่มปฏิบัติงานก่อนวันที่ 26 มีนาคม พ.ศ. 2561 หรือ ผู้ปฏิบัติงานที่ปฏิบัติงานก่อนประกาศนี้มีผลใช้บัคับ ',
    value: '(ข) สำหรับผู้ปฏิบัติงานที่เริ่มปฏิบัติงานก่อนวันที่ 26 มีนาคม พ.ศ. 2561 หรือ ผู้ปฏิบัติงานที่ปฏิบัติงานก่อนประกาศนี้มีผลใช้บัคับ '
  },
  {
    label: '(ค) สำหรับผู้ปฏิบัติงานที่มีบุตร ที่เริ่มเข้าศึกษาในโรงเรียนสาธิต “พิบูลบำเพ็ญ” มหาวิทยาลัยบูรพา โดยเข้าศึกษาตั้งแต่ภาคปลายปีการศึกษา 2560 เป็นต้นไป',
    value: '(ค) สำหรับผู้ปฏิบัติงานที่มีบุตร ที่เริ่มเข้าศึกษาในโรงเรียนสาธิต “พิบูลบำเพ็ญ” มหาวิทยาลัยบูรพา โดยเข้าศึกษาตั้งแต่ภาคปลายปีการศึกษา 2560 เป็นต้นไป'
  },

]

let options1 = [
  { statusId: 1, name: "จดทะเบียน" },
  { statusId: 2, name: "ไม่จดทะเบียน" },

];;
const selection = ref(null)

const isError = ref({});

const isView = ref(false);
const isLoadings = ref(false);

const isEdit = computed(() => {
  return !isNaN(route.params.id);
});

onMounted(async () => {
  await init();
  isLoadings.value = false;
  isEdit.value = false;
});

onBeforeUnmount(() => {
  clearData(model);
});

const resetObject = (obj) => {
  for (const key in obj) {
    if (obj[key] && typeof obj[key] === "object") {
      // Recursively reset nested objects
      resetObject(obj[key]);
    } else {
      // Set primitive values to null
      obj[key] = null;
    }
  }
};
function clearData(model) {
  resetObject(model.value);
}

async function submit() {
  let validate = false;
  // if (!model.value.gspc?.equipment?.equipmentId) {
  //   isError.value.equipmentId.messageError = "IT Asset No. Is Required";
  //   let navigate = document.getElementById("selected-it-asset");
  //   window.location.hash = "selected-it-asset";
  //   navigate.scrollIntoView(false);
  //   validate = true;
  // }
  if (validate === true) {
    Notify.create({
      message: "Please Correct Input",
      position: "bottom-left",
      type: "negative",
    });
    return;
  }
  let isValid = false;
  Swal.fire({
    title: "Do you want to save the changes??",
    html: `You won't be able to revert this!`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "Cancel",
    showLoaderOnConfirm: true,
    reverseButtons: true,
    customClass: {
      confirmButton: "save-button",
      cancelButton: "cancel-button",
    },
    preConfirm: async () => {
      try {
        // code
        isValid = true;
      } catch (error) {
        if (error?.response?.status == 400) {
          if (Object.keys(error?.response?.data?.errors ?? {}).length) {
            isError.value = {
              ...isError.value,
              ...error.response?.data?.errors,
            };
          }
        }
        Swal.showValidationMessage(
          `Save Data Failed. ${error.response?.data?.message ??
          "Something wrong please try again later."
          }`
        );
        Notify.create({
          message:
            error?.response?.data?.message ??
            "Something wrong please try again later.",
          position: "bottom-left",
          type: "negative",
        });
      }
    },
  }).then((result) => {
    if (isValid && result.isConfirmed) {
      Swal.fire({
        html: `Request Save.`,
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "save-button",
        },
      }).then(() => {
        router.replace({ name: "children_edu_welfare_list" });
      });
    }
  });
}

async function init() {
  isView.value = route.meta.isView;
  isLoadings.value = true;
}
</script>
