<template>
  <q-page padding class="q-pt-none">
    <DynamicBreadcrumb />
    <div class="row">
      <p class="q-mb-none col-8">สิทธิ์คงเหลือ</p>
      <p class="q-mb-none col-4">ระเบียบการเบิกสวัสดิการ</p>
    </div>

    <div class="row">
      <div class="col-md-8 col-12">
        <!-- card แถวที่ 1 -->
        <div class="row q-pb-md">
          <div class="col-4 col-md q-mr-md">
            <q-card class="border-card bg-blue-9 q-ms-md">
              <q-card-section class="q-px-lg row items-center justify-between">
                <!-- ข้อความ -->
                <div>
                  <p class="q-mb-none text-white font-20 font-bold q-pb-md">ทำฟัน</p>
                  <p class="q-mb-none text-white font-16 q-pb-sm">เงินคงเหลือ 2000 บาท</p>
                  <p class="q-mb-none text-white font-16">จำนวน 3 ครั้ง</p>
                </div>
                <!-- รูปภาพ -->
                <img src="../../assets/dentalwork.svg" alt="dental-work" class="q-pt-xl" />
              </q-card-section>
            </q-card>
          </div>

          <div class="col-4 col-md q-mr-md">
            <q-card class="border-card bg-blue-9">
              <q-card-section class="q-px-lg row items-center justify-between">
                <!-- ข้อความ -->
                <div>
                  <p class="q-mb-none text-white font-20 font-bold q-pb-md">ตรวจสุขภาพประจำปี</p>
                  <p class="q-mb-none text-white font-16 q-pb-sm">เงินคงเหลือ 2000 บาท</p>
                  <p class="q-mb-none text-white font-16">จำนวน - ครั้ง</p>
                </div>
                <!-- รูปภาพ -->
                <img src="../../assets/health-check.svg" alt="dental-work" class="q-pt-xl" />
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- card แถวที่ 2 -->
        <div class="row">
          <div class="col-4 col-md q-mr-md">
            <q-card class="border-card bg-blue-9">
              <q-card-section class="q-px-lg row items-center justify-between">
                <!-- ข้อความ -->
                <div>
                  <p class="q-mb-none text-white font-20 font-bold q-pb-md">สมรสโดยนิตินัย</p>
                  <p class="q-mb-none text-white font-16 q-pb-sm">เงินคงเหลือ 2000 บาท</p>
                  <p class="q-mb-none text-white font-16">จำนวน 3 ครั้ง</p>
                </div>
                <!-- รูปภาพ -->
                <img src="../../assets/marriage.svg" alt="dental-work" class="q-pt-xl" />
              </q-card-section>
            </q-card>
          </div>

          <div class="col-4 col-md q-mr-md">
            <q-card class="border-card bg-blue-9">
              <q-card-section class="q-px-lg row items-center justify-between">
                <!-- ข้อความ -->
                <div>
                  <p class="q-mb-none text-white font-20 font-bold q-pb-md">การศึกษาบุตร</p>
                  <p class="q-mb-none text-white font-16 q-pb-sm">เงินคงเหลือ 2000 บาท</p>
                  <p class="q-mb-none text-white font-16">จำนวน 3 ครั้ง</p>
                </div>
                <!-- รูปภาพ -->
                <img src="../../assets/child-education.svg" alt="dental-work" class="q-pt-xl" />
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <!-- ส่วนที่ 2: card ที่มีปุ่มดาวน์โหลด -->
      <div class="col-md-4 col-12">
        <div class="col-4 col-md q-pb-sm">
          <q-card class="">
            <q-card-section class="q-px-lg row items-center justify-between">
              <div class="row">
                <!-- รูปภาพ -->
                <img src="../../assets/document.svg" alt="dental-work" class="q-mr-md" />
                <!-- ข้อความ -->
                <div>
                  <p class="q-mb-none font-14 q-px-md">ระเบียบการเบิก_สวัสดิการทั่วไป.pdf</p>
                </div>
              </div>
              <button type="" class="border-button bg-blue-10 text-white font-14 self-end">ดาวน์โหลด</button>
            </q-card-section>
          </q-card>
        </div>

       
        <div class="col-4 col-md q-pb-sm">
          <q-card class="">
            <q-card-section class="q-px-lg row items-center justify-between">
              <div class="row">
                <!-- รูปภาพ -->
                <img src="../../assets/document.svg" alt="dental-work" class="q-mr-md" />
                <!-- ข้อความ -->
                <div>
                  <p class="q-mb-none font-14 q-px-md">ระเบียบการเบิก_สวัสดิการสงเคราะห์ต่าง_ๆ.pdf</p>
                </div>
              </div>
              <button type="" class="border-button bg-blue-10 text-white font-14 self-end">ดาวน์โหลด</button>
            </q-card-section>
          </q-card>
        </div>

         <div class="col-4 col-md q-pb-sm">
          <q-card class="">
            <q-card-section class="q-px-lg row items-center justify-between">
              <div class="row">
                <!-- รูปภาพ -->
                <img src="../../assets/document.svg" alt="dental-work" class="q-mr-md" />
                <!-- ข้อความ -->
                <div>
                  <p class="q-mb-none font-14 q-px-md">ระเบียบการเบิก_สวัสดิการเกี่ยวกับการศึกษาของบุตร.pdf</p>
                </div>
              </div>
              <button type="" class="border-button bg-blue-10 text-white font-14 self-end">ดาวน์โหลด</button>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-4 col-md q-pb-sm">
          <q-card class="">
            <q-card-section class="q-px-lg row items-center justify-between">
              <div class="row">
                <!-- รูปภาพ -->
                <img src="../../assets/document.svg" alt="dental-work" class="q-mr-md" />
                <!-- ข้อความ -->
                <div>
                  <p class="q-mb-none font-14 q-px-md">ระเบียบการเบิก_สวัสดิการค่าสงเคราะห์การเสียชีวิต.pdf</p>
                </div>
              </div>
              <button type="" class="border-button bg-blue-10 text-white font-14 self-end">ดาวน์โหลด</button>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import DynamicBreadcrumb from "components/DynamicBreadcrumb.vue";
</script>

<style scoped>
.border-card {
  border-radius: 25px;
  overflow: hidden;
}

.border-button {
  border-radius: 15px;
  overflow: hidden;
  border: none; /* ลบเส้นขอบ */
  padding: 8px 8px;
}

.dental-image {
  width: 100px; /* กำหนดขนาดรูปภาพ */
  height: auto;
}
</style>
