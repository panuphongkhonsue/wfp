<template>
  <div class="fullscreen bg-white text-center q-pa-md flex flex-center">
    <div class="error-container">
      <div class="error-code text-primary text-h1 text-weight-bold q-mb-md">
        404
      </div>

      <div class="error-message text-grey-7 text-h5 q-mb-md">
        ขออภัย! เราไม่พบหน้าที่คุณกำลังค้นหา
      </div>

      <div class="error-description text-grey-6 q-mb-xl">
        กรุณาตรวจสอบ URL หรือนำทางกลับไปยังหน้าแรก
      </div>

      <q-btn
        color="primary"
        unelevated
        to="/"
        label="กลับสู่หน้าแรก"
        icon="arrow_back"
        size="lg"
        class="go-home-btn"
      />
    </div>
  </div>
</template>

<style scoped>
.error-container {
  max-width: 500px;
  animation: fadeIn 1.5s ease-in-out;
}

.error-code {
  font-size: 8rem;
  color: #1e3a8a; /* Navy Blue */
}

.error-message {
  font-weight: bold;
}

.go-home-btn {
  padding: 12px 24px;
  border-radius: 50px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.go-home-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

/* แอนิเมชัน */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.error-container {
  max-width: 500px;
  animation: fadeIn 0.5s ease-out; /* ลดเวลาเหลือ 0.5 วินาที */
}

</style>
