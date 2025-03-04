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
              <div class="col-lg-5 col-12 col-xl-4 row q-gutter-y-md q-pr-sm"
                :class="canCreateFor && !isView ? 'items-center' : ''">
                <p class="col-auto q-mb-none">
                  ชื่อ-นามสกุล : <span v-show="!canCreateFor || isView" class="font-medium font-16 text-grey-7">{{
                    userData?.name ?? "-" }}</span>
                </p>
                <q-select v-if="canCreateFor && !isView" popup-content-class="font-14 font-regular" :loading="isLoading"
                  id="selected-status" class="col-lg q-px-lg-md col-12 font-regular" outlined for="selected-user"
                  v-model="model.createFor" :options="optionsUserName" dense option-value="id" emit-value map-options
                  option-label="name" @filter="filterFn" use-input input-debounce="100" hide-bottom-space
                  :error="!!isError?.createFor" :rules="[(val) => !!val || '']" @filter-abort="abortFilterFn">
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
              <p class="q-mb-none">จำนวนเงินคงเหลือ</p>
            </q-card-section>
            <q-separator />
            <q-card-section class="q-px-md q-py-md font-medium font-16 text-grey-7">
              <p v-for="child in displayedChildren" :key="child.index" class="q-mb-none">
                บุตรคนที่ {{ child.index }}: {{ child.fundRemaining }}
              </p>
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
              <q-card-section v-show="isView || isEdit"
                class="row wrap font-medium q-pb-xs q-pl-none font-16 text-grey-9">
                <p class="col-md-4 col-12 q-mb-none">เลขที่ใบเบิก : {{ model.reimNumber ?? "-" }}</p>
                <p class="col-md-4 col-12 q-mb-none">วันที่ร้องขอ : {{ formatDateThaiSlash(model.requestDate) ?? "-" }}
                </p>
                <p class="col-md-4 col-12 q-mb-none q-pl-sm">สถานะ : {{ model.status ?? "-" }}</p>
              </q-card-section>

              <div class="row q-mt-lg q-mb-none">
                <div v-if="isView" class="col-md-4 col-12 q-mb-none">
                  <InputGroup for-id="spouse" more-class="font-16 font-medium text-grey-9" is-dense v-model="model.spouse" :data="model.spouse ?? '-'" is-require
                    label="คู่สมรส" placeholder="ชื่อ-สกุล" type="text" class="font-14 font-regular text-grey-9" :is-view="isView">
                  </InputGroup>
                </div>

                <div v-if="isView" class="col-md-4 col-12 q-mb-none">
                  <p class="font-16 require font-medium text-grey-9">จดทะเบียนสมรส</p>
                  <div class="font-14 font-regular text-grey-9">
                    {{ selectedMarryLabel || '-' }}
                  </div>
                </div>

                <div v-if="isView" class="col-md-4 col-12 q-mb-none">
                  <p class="font-16 require font-medium text-grey-9 ">ประเภทบุคลากรคู่สมรส</p>
                  <div class="font-14 font-regular text-grey-9">
                    {{ selectedRoleLabel }}
                  </div>
                </div>
              </div>

              <div v-if="!isView" class="row q-mt-lg q-mb-none">

                <div v-if="!isView" class="col-md-3 col-12 q-mr-xl  ">
                  <InputGroup for-id="spouse" is-dense v-model="model.spouse" :data="model.spouse ?? '-'" is-require
                    label="คู่สมรส" placeholder="ชื่อ-สกุล" type="text" class="font-16 font-regular" :is-view="isView"
                    :error="!!isError?.spouse">
                  </InputGroup>
                </div>

                <div v-if="!isView" class="col-md-4 col-12 q-ml-lg-xl q-ml-sm-none">
                  <InputGroup for-id="marriageRegistration" more-class="font-16 font-medium text-grey-9"
                    label="จดทะเบียนสมรส" compclass="col-6" is-require clearable :data="model.marryRegis ?? '-'"
                    :is-view="isView">
                    <q-select hide-bottom-space popup-content-class="font-14 font-regular" v-model="model.marryRegis"
                      class="font-14 font-regular text-grey-9" is-dense :loading="isLoading" id="selected-status"
                      outlined :options="optionsMarry" dense clearable option-value="value" emit-value map-options
                      option-label="name" :error="!!isError?.marryRegis">
                    </q-select>
                  </InputGroup>
                </div>
              </div>
            </q-card-section>


            <q-card-section v-if="!isView"
              class="row wrap q-col-gutter-y-md q-px-md q-py-md font-medium font-16 text-grey-9">
              <div class="col q-mb-none font-14 q-gutter-md">
                <div>
                  <q-radio v-model="model.role" val="ไม่เป็นข้าราชการประจำหรือลูกจ้างประจำ"
                    label="ไม่เป็นข้าราชการประจำหรือลูกจ้างประจำ" />
                </div>

                <div class="row q-col-gutter-y-md ">
                  <q-radio v-model="model.role" val="ข้าราชการ" label="ข้าราชการ" />

                  <div class="col-lg-4 col-12 row items-center ">
                    <p class="q-mb-none q-mx-md col-md-1 col-12">ตำแหน่ง</p>
                    <q-input for="officer-position" v-model="spouseData.officer.position" outlined dense
                      :disable="model.role !== 'ข้าราชการ'" class="col-md-8 col-12 q-mx-md" :is-view="isView" />
                  </div>

                  <div class="col-lg-4 col-12 row items-center q-col-gutter-y-md">
                    <p class="q-mb-none q-mx-md q-mt-xs-md q-mt-lg-none col-md-1 col-12">สังกัด</p>
                    <q-input for="officer-belongTo" v-model="spouseData.officer.department" outlined dense
                      :disable="model.role !== 'ข้าราชการ'" class="col-md-8 col-12 q-mx-md" :is-view="isView" />
                  </div>


                </div>

                <div>
                  <q-radio v-model="model.role" val="ลูกจ้างประจำ" label="ลูกจ้างประจำ" />
                </div>

                <div class="row items-center q-col-gutter-y-md">
                  <q-radio v-model="model.role" val="พนักงานหรือลูกจ้างในรัฐวิสาหกิจ"
                    label="พนักงานหรือลูกจ้างในรัฐวิสาหกิจ / หน่วงานของทางราชการ ราชการส่วนท้องถิ่น กรุงเทพมหานคร องค์กรอิสระ องค์กรมหาชน หรือหน่วยงานอื่นใด" />

                  <div class="col-lg-4 col-12 row items-center ">
                    <p class="q-mb-none q-mx-md col-md-1 col-12">ตำแหน่ง</p>
                    <q-input for="enterprises-position" v-model="spouseData.enterprises.position" outlined dense
                      :disable="model.role !== 'พนักงานหรือลูกจ้างในรัฐวิสาหกิจ'" class="col-md-8 col-12 q-mx-md"
                      :is-view="isView" />
                  </div>

                  <div class="col-lg-4 col-12 row items-center q-col-gutter-y-md">
                    <p class="q-mb-none q-mx-md q-mt-xs-md q-mt-lg-none col-md-1 col-12">สังกัด</p>
                    <q-input for="enterprises-belongTo" v-model="spouseData.enterprises.department" outlined dense
                      :disable="model.role !== 'พนักงานหรือลูกจ้างในรัฐวิสาหกิจ'" class="col-md-8 col-12 q-mx-md"
                      :is-view="isView" />
                  </div>

                </div>
              </div>
            </q-card-section>

            <q-card-section>
              <div v-if="isView" class="row q-mt-sm">
                <div class="col-md-4 col-12 q-mb-none">
                  <div>
                    <p class="font-16 require font-medium text-grey-9">ขอรับเงินสวัสดิการ</p>
                  </div>
                  <div v-if="isView" class="font-14 font-regular text-grey-9 q-gutter-y-md q-my-md">
                    {{ selectedEligible }}
                  </div>
                </div>

                <div class="col-md-8 col-12 q-mb-none">
                  <div>
                    <p class="font-16 require font-medium text-grey-9">ขอใช้สิทธิ</p>
                  </div>
                  <div v-if="isView" class="font-14 font-regular text-grey-9 q-gutter-y-md q-my-md">
                    {{ selectedCategoryLabel }}
                  </div>
                </div>
              </div>



              <div>
                <p v-if="!isView" class="require">ขอรับเงินสวัสดิการ</p>
              </div>
              <q-option-group v-if="!isView" :error="!!isError?.eligible" v-model="model.eligible" type="radio"
                :options="optionsEligible" class="q-mt-md " />
            </q-card-section>


            <q-card-section>
              <div v-if="!isView">
                <p class="require">ขอใช้สิทธิ</p>
              </div>

              <q-option-group v-if="!isView" v-model="model.categoriesId" type="radio" :options="options"
                class="q-gutter-y-md q-my-md" />
              <q-separator />


              <q-card-section class="q-gutter-y-md q-px-md q-pt-md q-pb-sm font-18 font-bold">
                <p class="q-mb-none">ข้อมูลบุตร</p>
              </q-card-section>
              <q-card flat bordered class="full-height ">
                <q-card-section class="q-px-md q-pt-md q-pb-none font-14 q-gutter-y-md">
                  <div v-for="(child, index) in model.child" :key="index">
                    <div class="row items-center justify-between">
                      <p class="q-mb-lg">บุตรคนที่ {{ index + 1 }}</p>
                      <q-btn v-if="(index > 0 && !isView && !isLoading) ||
                        (isEdit && !isView && child?.id && !isLoading && model.child.length > 1)" color="red"
                        @click="removeChildForm(index)" class="q-ml-md">ลบ</q-btn>
                    </div>

                    <div class="row q-mb-md">
                      <div class="col-md-4 col-12 q-mr-xl">
                        <InputGroup for-id="name" more-class="font-16 font-medium text-grey-9" label="ชื่อ-นามสกุล"
                          compclass="col-6" is-require clearable :data="child.childName ?? '-'" :is-view="isView">
                          <q-select hide-bottom-space is-dense v-model="child.childName" is-require :loading="isLoading"
                            id="selected-status" popup-content-class="font-14 font-regular" class="font-14 font-regular"
                            outlined :options="availableChildOptions" dense clearable option-value="name" emit-value
                            map-options option-label="name" :error="!!isError?.childName">
                          </q-select>
                        </InputGroup>
                      </div>

                      <div class="col-md-4 col-12 q-ml-lg-xl q-ml-sm-none">
                        <InputGroup for-id="birthday" is-dense v-model="formattedChildBirthDay[index].formattedBirthDay"
                          more-class="font-16 font-medium text-grey-9"
                          :data="formattedChildBirthDay[index].formattedBirthDay ?? '-'" label="เกิดเมื่อ"
                          placeholder="" type="text" :is-view="isView" disable color="dark">
                        </InputGroup>

                      </div>
                    </div>

                    <div class="row q-mb-md">
                      <div class="col-md-4 col-12 q-mr-xl">
                        <InputGroup for-id="fatherNumberChilden" is-dense v-model="child.childFatherNumber"
                          more-class="font-16 font-medium text-grey-9" :data="child.childFatherNumber ?? '-'" is-require
                          label="บุตรลำดับที่ (ของบิดา)" placeholder="" type="number" class="" :is-view="isView"
                          :error="!!isError?.childFatherNumber">
                        </InputGroup>
                      </div>

                      <div class="col-md-4 col-12 q-ml-lg-xl q-ml-sm-none ">
                        <InputGroup for-id="motherNumberChilden" is-dense v-model="child.childMotherNumber"
                          more-class="font-16 font-medium text-grey-9" :data="child.childMotherNumber ?? '-'" is-require
                          label="บุตรลำดับที่ (ของมารดา)" placeholder="" type="number" class="" :is-view="isView"
                          :error="!!isError?.childMotherNumber">
                        </InputGroup>
                      </div>
                    </div>

                    <div v-if="isView">

                    </div>

                    <div v-else class="row q-pl-none items-center q-mb-md">
                      <q-checkbox v-model="child.childPassedAway" color="green-6 q-pl-none" />
                      <p class="q-mb-none font-16 font-medium text-grey-9">
                        กรณีเป็นบุตรแทนที่บุตรซึ่งถึงแก่กรรมแล้ว
                      </p>
                    </div>

                    <div v-if="child.childPassedAway">
                      <div class="row q-mb-md">
                        <div class="col-md-4 col-12 q-mr-xl">
                          <InputGroup for-id="delegateNumber" is-dense v-model="child.delegateNumber"
                            more-class="font-16 font-medium text-grey-9" :data="child.delegateNumber ?? '-'" is-require
                            label="แทนที่บุตรลำดับที่" type="number" class="font-14" :is-view="isView" placeholder="" />
                        </div>

                        <div class="col-md-4 col-12 q-ml-lg-xl q-ml-sm-none">
                          <InputGroup for-id="delegateName" more-class="font-16 font-medium text-grey-9"
                            label="ชื่อ - นามสกุล" compclass="col-6" is-require clearable :is-view="isView"
                            :data="child.delegateName ?? '-'">
                            <q-select hide-bottom-space is-dense v-model="child.delegateName" :loading="isLoading" id="selected-status"
                              popup-content-class="font-14 font-regular" class="font-14 font-regular" outlined
                              :options="optionsChildName" dense clearable option-value="name" emit-value map-options
                              option-label="name" />
                          </InputGroup>
                        </div>
                      </div>

                      <div class="row q-mb-md">
                        <div class="col-12 col-md-4 q-mr-xl">
                          <InputGroup for-id="delegateBirthDay" more-class="font-16 font-medium text-grey-9"
                            label="เกิดเมื่อ" compclass="col-6 q-pr-none" clearable :is-view="isView"
                            :data="child.delegateBirthDay ?? '-'">
                            <DatePicker is-dense v-model:model="child.delegateBirthDay"
                              v-model:dateShow="child.delegateBirthDay" for-id="date" :no-time="true" range-time />
                          </InputGroup>
                        </div>

                        <div class="col-12 col-md-4 q-ml-lg-xl q-ml-sm-none">
                          <InputGroup for-id="delegateDeathDay" more-class="font-16 font-medium text-grey-9"
                            label="ถึงแก่กรรมเมื่อ" compclass="col-6 q-pr-none" clearable :is-view="isView"
                            :data="child.delegateDeathDay ?? '-'">
                            <DatePicker is-dense v-model:model="child.delegateDeathDay"
                              v-model:dateShow="child.delegateDeathDay" for-id="date" :no-time="true" range-time />
                          </InputGroup>
                        </div>
                      </div>
                    </div>




                    <div class="row q-mb-md">
                      <div class="col-md-4 col-12 q-mr-xl">
                        <InputGroup for-id="fund" is-dense v-model="child.schoolName" :data="child.schoolName ?? '-'"
                          more-class="font-16 font-medium text-grey-9" is-require label="สถานศึกษา" placeholder=""
                          type="text" class="" :is-view="isView" :error="!!isError?.schoolName">
                        </InputGroup>
                      </div>

                      <div class="col-md-4 col-12 q-ml-lg-xl q-ml-sm-none ">
                        <InputGroup more-class="font-16 font-medium text-grey-9" label="ระดับชั้นที่ศึกษา"
                           is-require clearable :data="isView ? child.subCategoriesName : child.subCategoriesId" :is-view="isView">
                          <q-select v-model="child.subCategoriesId" :loading="isLoading" id="selected-status"
                            popup-content-class="font-14 font-regular" class="font-14 font-regular" outlined
                            :options="optionsSubCategory" dense clearable option-value="value" emit-value map-options
                            option-label="label" v-if="!isView" :error="!!isError?.subCategoriesId" />
                        </InputGroup>
                      </div>
                    </div>

                    <div class="row q-mb-md">
                      <div class="col-md-4 col-12 q-mr-xl">
                        <InputGroup for-id="district" is-dense v-model="child.district" :data="child.district ?? '-'"
                          more-class="font-16 font-medium text-grey-9" is-require label="อำเภอ" placeholder=""
                          type="text" class="" :is-view="isView" :error="!!isError?.district">
                        </InputGroup>
                      </div>

                      <div class="col-md-4 col-12 q-ml-lg-xl q-ml-sm-none">
                        <InputGroup for-id="province" is-dense v-model="child.province" :data="child.province ?? '-'"
                          more-class="font-16 font-medium text-grey-9" is-require label="จังหวัด" placeholder=""
                          type="text" class="" :is-view="isView" :error="!!isError?.province">
                        </InputGroup>
                      </div>
                    </div>

                    <div class="row q-mb-md">
                      <div class="col-md-4 col-12 q-mr-xl">
                        <InputGroup for-id="fundReceipt" is-dense v-model="child.fundReceipt"
                          more-class="font-16 font-medium text-grey-9" :data="child.fundReceipt ?? '-'" is-require
                          label="จำนวนเงินตามใบเสร็จ" placeholder="" type="text" class="" :is-view="isView"
                          :error="!!isError?.fundReceipt">
                        </InputGroup>
                      </div>

                      <div class="col-md-4 col-12 q-ml-lg-xl q-ml-sm-none ">
                        <InputGroup for-id="fundOther" is-dense v-model="child.fundOther" :data="child.fundOther ?? '-'"
                          more-class="font-16 font-medium text-grey-9" is-require
                          label="เบิกจากหน่วยงานอื่นแล้ว เป็นจำนวนเงิน" placeholder="" type="text" class=""
                          :is-view="isView">
                        </InputGroup>
                      </div>
                    </div>

                    <div class="row q-mb-md">
                      <div class="col-md-4 col-12 q-mr-xl">
                        <InputGroup for-id="fundUniversity" is-dense v-model="child.fundUniversity"
                          more-class="font-16 font-medium text-grey-9" :data="child.fundUniversity ?? '-'" is-require
                          label="ขอเบิกจากสวัสดิการมหาวิทยาลัย จำนวนเงิน" placeholder="" type="text" class=""
                          :is-view="isView" :error="!!isError?.fundUniversity">
                        </InputGroup>
                      </div>

                      <div class="col-md-4 col-12 q-ml-lg-xl q-ml-sm-none ">
                        <InputGroup for-id="fundSumRequest" is-dense v-model="child.fundSumRequest"
                          more-class="font-16 font-medium text-grey-9" :data="child.fundSumRequest ?? '-'" is-require
                          label="รวมเป็นจำนวนเงิน" placeholder="" type="text" class="" :is-view="isView" disable>
                        </InputGroup>
                      </div>
                    </div>

                    <q-separator/>
                  </div>
                  <div class="row justify-end">
                    <q-btn v-if="!isView" @click="addChildForm" class="q-mb-md bg-blue-10 text-white" icon="add">
                      เพิ่ม</q-btn>
                  </div>
                </q-card-section>
              </q-card>

            </q-card-section>
          </q-card>
        </div>
        <div class="col-md-3 col-12">


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
          type="submit" label="บันทึกฉบับร่าง" no-caps @click="submit(1)" v-if="!isView && !isLoadings" />

        <q-btn id="button-approve" class="font-medium font-16 weight-8 text-white q-px-md" dense type="submit"
          style="background-color: #43a047" label="ส่งคำร้องขอ" no-caps @click="submit(2)"
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
import { formatDateThaiSlash, formatNumber } from "src/components/format";
import DatePicker from "src/components/DatePicker.vue";
import { ref, watch, computed, onMounted, onBeforeUnmount, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import userManagementService from "src/boot/service/userManagementService";
import { useAuthStore } from "src/stores/authStore";
import reimbursementChildrenEducationService from "src/boot/service/reimbursementChildrenEducationService";

defineOptions({
  name: "childrenEduWelfareEdit",
});
const isLoading = ref(false);
const authStore = useAuthStore();
const isError = ref({});
const isView = ref(false);
const isLoadings = ref(false);
const router = useRouter();
const userInitialData = ref([]);
const route = useRoute();
const userData = ref({});
const shcoolData = ref([]);
const canRequest = ref(false);
let optionsUserName = ref([]);
let optionsChildName = ref([]);
let optionsSubCategory = ref([]);
const remaining = ref([]);
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
  fundSumReceipt: 0,
  fundEligible: 0,
  spouse: null,
  marryRegis: null,
  role: null,
  eligible: null,
  categoriesId: null,
  deleteChild: [
    {
      id: null,
    }
  ],
  child: [
    {
      fundReceipt: null,
      fundEligible: 0,
      fundSumRequest: null,
      fundUniversity: null,
      fundOther: null,
      childName: null,
      childBirthDay: null,
      childFatherNumber: null,
      childMotherNumber: null,
      schoolName: null,
      district: null,
      province: null,
      subCategoriesId: null,
      childPassedAway: false,
      delegateName: null,
      delegateNumber: null,
      delegateBirthDay: null,
      delegateDeathDay: null
    }
  ]
});

function addChildForm() {
  model.value.child.push({
    fundReceipt: null,
    fundEligible: 0,
    fundSumRequest: null,
    fundUniversity: null,
    fundOther: null,
    childName: null,
    childBirthDay: null,
    childFatherNumber: null,
    childMotherNumber: null,
    schoolName: null,
    district: null,
    province: null,
    subCategoriesId: null,
    childPassedAway: false,
    delegateName: null,
    delegateNumber: null,
    delegateBirthDay: null,
    delegateDeathDay: null
  });
}


const spouseData = ref({
  officer: {
    position: null,
    department: null
  },
  enterprises: {
    position: null,
    department: null
  }
});

let optionsEligible = [
  { label: "ตามสิทธิ", value: "ตามสิทธิ" },
  { label: "เฉพาะส่วนที่ยังขาดจากสิทธิ", value: "เฉพาะส่วนที่ยังขาดจากสิทธิ" },

];
const selectedEligible = computed(() => {
  const selectedOption = optionsEligible.find(opt => opt.value === model.value.eligible);

  if (selectedOption) {
    return selectedOption.label;
  } else {
    return "ไม่พบข้อมูล";
  }
});

const selectedChildNames = computed(() => model.value.child.map(child => child.childName));

const availableChildOptions = computed(() => {
  return optionsChildName.value.filter(option => !selectedChildNames.value.includes(option.name));
});

async function fetchRemaining() {
  try {
    const fetchRemaining = await reimbursementChildrenEducationService.getRemaining({
      createFor: model.value.createFor
    });

    if (fetchRemaining.data?.datas && Array.isArray(fetchRemaining.data.datas)) {
      remaining.value = fetchRemaining.data.datas.map(item => ({
        childName: item.childName,
        fundRemaining: formatNumber(item.fundRemaining), // ✅ ใช้ฟิลด์ที่ถูกต้อง
        requestsRemaining: formatNumber(item.requestsRemaining)
      }));

      canRequest.value = fetchRemaining.data.canRequest;

    } else {
      console.warn("⚠️ ไม่มีข้อมูล remaining");
    }
  } catch (error) {
    console.error("❌ Error fetching remaining:", error);
  }
}




const displayedChildren = computed(() => {

  return optionsChildName.value.map((child, index) => {
    const foundChild = remaining.value?.find(r => r.childName?.trim() === child.name?.trim());

    if (!child.childName) {
      console.warn(`⚠️ พบข้อมูลบุตรที่ไม่มีชื่อ:`, child);
    }

    return {
      index: index + 1,
      childName: child.childName || `บุตรคนที่ ${index + 1}`,  // ✅ ป้องกัน undefined
      fundRemaining: foundChild ? foundChild.fundRemaining : '-',
    };
  });
});


async function fetchSchoolName() {
  try {
  const result = await reimbursementChildrenEducationService.getLastShcoolName();
  console.log("📌 API Response:", result.data); // ✅ ดูโครงสร้างข้อมูลที่ได้จริง ๆ

  if (result.data && result.data.ChildInformation) {
    shcoolData.value = result.data.ChildInformation;
    console.log("✅ School Data:", JSON.stringify(shcoolData.value));
  } else {
    console.warn("⚠️ ไม่มีข้อมูล shcoolData หรือ ChildInformation ไม่ถูกต้อง", result.data);
  }
} catch (error) {
  console.error("❌ Error fetching school data:", error);
}

}


const getSubCategory = async () => {
  try {
    const result = await reimbursementChildrenEducationService.getSubCategories({
      categories_id: model.value.categoriesId
    });

    // แปลงข้อมูลให้ตรงกับรูปแบบที่ q-select ต้องการ
    const returnedData = result.data.map(item => ({
      value: item.id, // ใช้ id เป็น value
      label: item.name // ใช้ name เป็น label
    }));

    optionsSubCategory.value = returnedData;  // อัปเดต optionsSubCategory
  } catch (error) {
    const errorMessage = error?.response?.data?.message ?? "กรุณาเลือกสิทธิ";
    alert(errorMessage);
  }
};



async function fetchUserData(id) {
  try {
    const result = await userManagementService.dataById(id);
    var returnedData = result.data.datas; 

    if (returnedData) {
      userData.value = {
        name: returnedData?.name,
        position: returnedData?.position?.name,
        employeeType: returnedData?.employeeType?.name,
        sector: returnedData?.sector?.name,
        department: returnedData?.department?.name
      };

      optionsChildName.value = returnedData.children || [];
    } else {
      console.warn("⚠️ ไม่มีข้อมูล userData");
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}
const formattedChildBirthDay = computed(() => {
  return model.value.child.map(child => ({
    ...child,
    formattedBirthDay: child.childBirthDay
      ? formatDateThaiSlash(child.childBirthDay)  // แปลงเป็นรูปแบบไทย
      : "",
  }));
});



watch(
  () => model.value.child.map(child => child.childName),
  async (newNames) => {
    newNames.forEach((newName, index) => {
      if (newName) {
        const selectedChild = optionsChildName.value.find(
          (child) => child.name === newName
        );

        if (selectedChild) {
          model.value.child[index].childBirthDay = selectedChild.birthday;
        }
      } else {
        // เคลียร์ค่าถ้าชื่อถูกลบ
        model.value.child[index].childBirthDay = "";
      }
    });

    await nextTick(); // 🔥 บังคับ Vue อัปเดต UI
  },
  { deep: true }
);



watch(
  () => model.value.child.map(child => child.childName),
  async (newNames) => {
    newNames.forEach((newName, index) => {
      if (newName) {
        // ตรวจสอบว่า shcoolData.value เป็นอาร์เรย์
        if (Array.isArray(shcoolData.value)) {
          const selectedChild = shcoolData.value.find(
            (child) => child.childName === newName
          );

          if (selectedChild) {
            model.value.child[index].schoolName = selectedChild.schoolName || " ";
          }
        } else {
          console.warn("⚠️ shcoolData.value ไม่เป็นอาร์เรย์:", shcoolData.value);
        }
      }else {
        // เคลียร์ค่าถ้าชื่อถูกลบ
        model.value.child[index].schoolName = "";
      }
    });

    await nextTick(); // 🔥 บังคับ Vue อัปเดต UI
  },
  { deep: true }
);




watch(
  () => model.value.child.map(child => child.fundUniversity - child.fundOther),
  async (newValues) => {
    newValues.forEach((newValue, index) => {
      model.value.child[index].fundSumRequest = newValue || 0;
    });

    await nextTick(); // อัปเดต UI หลังจากการคำนวณ
  },
  { deep: true }
);


async function filterFn(val, update) {
  try {
    setTimeout(async () => {
      update(() => {
        if (val === '') {
          optionsUserName.value = userInitialData.value;
        } else {
          optionsUserName.value = userInitialData.value.filter(v => v.name && v.name.includes(val));
        }
      });
    }, 650);
  } catch (error) {
    console.error("Error in filterFn:", error);
  }
}

function abortFilterFn() {
  // console.log('delayed filter aborted')
}



watch(() => model.value.categoriesId, (newValue) => {
  if (newValue) {
    getSubCategory(); // เรียกฟังก์ชัน getSubCategory เมื่อ categories_id เปลี่ยน
  }
});

async function fetchDataEdit() {
  setTimeout(async () => {
    try {
      const result = await reimbursementChildrenEducationService.dataById(route.params.id);
      var returnedData = result.data.datas;

      if (returnedData) {
        model.value = {
          ...model.value,
          createFor: returnedData?.user.userId,
          reimNumber: returnedData?.reimNumber,
          requestDate: returnedData?.requestDate,
          status: returnedData?.status,
          eligible: returnedData?.eligible,
          spouse: returnedData?.spouse,
          marryRegis: returnedData?.marryRegis,
          role: returnedData?.role,
          position: returnedData?.position,
          department: returnedData?.department,
          categoriesId: returnedData?.category?.id,
          child: returnedData.children.map(child => ({
            ...child,
            childBirthDay: child.childBirthDay ?? "-",
            subCategoriesId: child.sub_category?.id ?? null,
            subCategoriesName: child.sub_category?.name ?? "-",
            childPassedAway: child.childType === "DELEGATE" ? true : false,
          }))
        };

      }

    } catch (error) {
      console.error("Error in fetchDataEdit:", error);
      // router.replace({ name: "children_edu_welfare_list" });
      Notify.create({
        message: error?.response?.data?.message ?? "เกิดข้อผิดพลาดกรุณาลองอีกครั้ง",
        position: "bottom-left",
        type: "negative",
      });
    }
    isLoading.value = false;
  }, 100);
}

function removeChildForm(index) {
  if (isEdit.value && model.value.child[index]?.id) {
    if (!Array.isArray(model.value.deleteChild)) {
      model.value.deleteChild = [];
    }
    if (model.value && Array.isArray(model.value.deleteChild)) {
      model.value.deleteChild.push({ id: model.value.child[index].id });
    }
  }
  model.value.child.splice(index, 1);
};


watch(
  () => model.value.role,
  async () => {
    spouseData.value = {
      officer: {
        position: null,
        department: null
      },
      enterprises: {
        position: null,
        department: null
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
          fetchRemaining();
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


const selectedCategoryLabel = computed(() => {
  const selectedOption = options.find(opt => opt.value === model.value.categoriesId);

  if (selectedOption) {
    return selectedOption.label;
  } else {
    return "ไม่พบข้อมูล";
  }
});


let optionsMarry = [
  { name: "จดทะเบียน", value: "YES" },
  { name: "ไม่จดทะเบียน", value: "NO" },

];

const selectedMarryLabel = computed(() => {
  if (!model.value.marryRegis) return "ไม่พบข้อมูล"; // ✅ ตรวจสอบค่าก่อน

  const selectedOption = optionsMarry.find(opt => opt.value === model.value.marryRegis);
  return selectedOption ? selectedOption.name : "ไม่พบข้อมูล";
});

const selectedRoleLabel = computed(() => {
  if (!model.value.role) return "ไม่พบข้อมูล"; // กรณีไม่มีค่า role

  switch (model.value.role) {
    case "ข้าราชการ":
      return `ข้าราชการ (ตำแหน่ง: ${model.value.position || "-"}, สังกัด: ${model.value.department || "-"})`;

    case "พนักงานหรือลูกจ้างในรัฐวิสาหกิจ":
      return `พนักงานรัฐวิสาหกิจ (ตำแหน่ง: ${model.value.position || "-"}, สังกัด: ${model.value.department || "-"})`;

    default:
      return model.value.role; // ใช้ค่า role ตรงๆ ถ้าไม่ใช่เคสพิเศษ
  }
});




async function submit(actionId) {
  let validate = false;
  // ตรวจสอบว่า createFor ต้องมีค่าหรือไม่
  if (!model.value.createFor && canCreateFor.value) {
    isError.value.createFor = "โปรดเลือกผู้ใช้งาน";
    document.getElementById("selected-user").scrollIntoView(false);
    validate = true;
  }

  if (!model.value.spouse) {
    isError.value.spouse = "กรุณากรอกชื่อคู่สมรส";
    validate = true;
  }
  if (!model.value.marryRegis) {
    isError.value.marryRegis = "โปรดเลือกการจดทะเบียนสมรส";
    validate = true;
  }

  if (!model.value.role) {
    isError.value.role = "โปรดเลือกประเภทคู่สมรส";
    validate = true;
  }

  if (!model.value.eligible) {
    isError.value.eligible = "โปรดเลือกสิทธิขอรับเงินสวัสดิการ";
    validate = true;
  }
  if (!model.value.categoriesId) {
    isError.value.categoriesId = "โปรดเลือกสิทธิสวัสดิการ";
    validate = true;
  }

  if (model.value.child && model.value.child.length > 0) {
    model.value.child.forEach((c) => {
      if (!c.fundReceipt) {
        isError.value.fundReceipt = "กรุณากรอกจำนวนเงินตามใบเสร็จ";
        validate = true;
      }
      if (!c.fundUniversity) {
        isError.value.fundUniversity = "กรุณากรอกจำนวนเงินเบิกจากสวัสดิการมหาวิทยาลัย";
        validate = true;
      }
      if (!c.childName) {
        isError.value.childName = "โปรดเลือกชื่อ-นามสกุลของบุตร";
        validate = true;
      }
      if (!c.childFatherNumber) {
        isError.value.childFatherNumber = "กรุณากรอกลำดับบุตรของบิดา";
        validate = true;
      }
      if (!c.childFatherNumber) {
        isError.value.childMotherNumber = "กรุณากรอกลำดับบุตรของมารดา";
        validate = true;
      }
      if (!c.schoolName) {
        isError.value.schoolName = "กรุณากรอกชื่อสถาบันศึกษา";
        validate = true;
      }
      if (!c.district) {
        isError.value.district = "กรุณากรอกอำเภอ";
        validate = true;
      }
      if (!c.province) {
        isError.value.province = "กรุณากรอกจังหวัด";
        validate = true;
      }
      if (!c.subCategoriesId) {
        isError.value.subCategoriesId = "โปรดเลือกระดับชั้นที่ศึกษา";
        validate = true;
      }
    });
  }

  if (validate) {
    Notify.create({
      message: "กรุณากรอกข้อมูลให้ครบถ้วน",
      position: "bottom-left",
      type: "negative",
    });
    return;
  }


  let isValid = false;

  let payload = {
    createFor: canCreateFor.value ? model.value.createFor : null,
    fundSumReceipt: model.value.fundSumReceipt,
    fundEligible: model.value.fundEligible,
    actionId: actionId ?? null, // ป้องกัน actionId เป็น undefined
    spouse: model.value.spouse,
    eligible: model.value.eligible,
    marryRegis: model.value.marryRegis,
    role: model.value.role,
    position: spouseData.value.officer.position || spouseData.value.enterprises.position,
    department: spouseData.value.officer.department || spouseData.value.enterprises.department,
    categoriesId: model.value.categoriesId,
    deleteChild: model.value.deleteChild,
    child: model.value.child.map(c => {
      let childData = {
        id: c.id,
        fundReceipt: c.fundReceipt,
        fundEligible: c.fundEligible,
        fundOther: c.fundOther,
        childName: c.childName,
        fundUniversity: c.fundUniversity,
        childBirthDay: c.childBirthDay,
        childFatherNumber: c.childFatherNumber,
        childMotherNumber: c.childMotherNumber,
        schoolName: c.schoolName,
        district: c.district,
        province: c.province,
        subCategoriesId: c.subCategoriesId,
        childPassedAway: c.childPassedAway
      };

      // ✅ ถ้า childPassedAway เป็น true ให้เพิ่ม delegate เข้าไป
      if (c.childPassedAway) {
        childData.delegateName = c.delegateName;
        childData.delegateNumber = c.delegateNumber;
        childData.delegateBirthDay = c.delegateBirthDay;
        childData.delegateDeathDay = c.delegateDeathDay;
      }

      return childData;
    })
  };


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
          fetch = await reimbursementChildrenEducationService.update(route.params.id, payload);
        } else {


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
        router.replace({ name: "children_edu_welfare_list" });
      });
    }
  });
}


async function init() {
  isView.value = route.meta.isView;
  isLoading.value = true;
  try {
    if (isView.value) {
      fetchDataEdit();
      fetchRemaining();
      fetchUserData(authStore.id);
      fetchSchoolName()
    }
    else if (isEdit.value) {
      if (!canCreateFor.value) {
        fetchRemaining();
        fetchUserData(authStore.id);
        fetchSchoolName()

      }
        const result = await userManagementService.getUserInitialData({ keyword: null });
        userInitialData.value = result.data.datas;
        optionsUserName.value = result.data.datas;
        fetchDataEdit();
    }
    else {
      if (!canCreateFor.value) {
        fetchRemaining();
        fetchUserData(authStore.id);
        fetchSchoolName()
      }
      else {
        const result = await userManagementService.getUserInitialData({ keyword: null });
        userInitialData.value = result.data.datas;
      }
    }
  }
  catch (error) {
    Promise.reject(error);
  }
  isLoading.value = false;
}
</script>
