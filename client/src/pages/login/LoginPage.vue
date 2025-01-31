<template>
  <div class="row bg-blue-10 justify-center" style="height: 100vh;">
      <div class="col-12 col-md-6 flex justify-center content-center">
          <q-card class="q-pa-md " :style="{
              width: $q.screen.lt.sm ? '90%' : '60%',

              borderRadius: '12px',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.7)'
          }">
              <q-card-section class="flex justify-center">
                  <img src="../../assets/loginlogo.svg" alt="login-logo" />
              </q-card-section>

              <q-card-section class="text-center">
                  <h2 class="text-h4 font-bold text-uppercase">ระบบเบิกสวัสดิการ</h2>
              </q-card-section>

              <q-card-section>
                  <q-form @submit="login" class="q-gutter-md q-px-xl">
                      <!-- Username -->
                      <q-input v-model="username" label="Username" :rules="[val => !!val || 'กรุณากรอก Username']" />
                      <!-- Password -->
                      <q-input v-model="password" label="Password" type="password"
                          :rules="[val => !!val || 'กรุณากรอก Password']" />
                      <!-- Remember Me -->
                      <q-checkbox size="sm" v-model="remember" label="Remember Me" />
                      <!-- Login Button -->
                      <q-btn class="full-width" type="submit" color="primary" label="Login" />
                  </q-form>
              </q-card-section>
          </q-card>
      </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const username = ref('');
const password = ref('');
const remember = ref(false);

// โหลด Username จาก localStorage 
onMounted(() => {
  const savedUsername = localStorage.getItem('rememberedUsername');
  if (savedUsername) {
      username.value = savedUsername;
      remember.value = true;
  }
});

// Login
const login = () => {
  if (!username.value || !password.value) {
      console.log('กรุณากรอก Username และ Password');
      return;
  }

  console.log('เข้าสู่ระบบด้วย', username.value, password.value);

  if (remember.value) {
      localStorage.setItem('rememberedUsername', username.value);
  } else {
      localStorage.removeItem('rememberedUsername');
  }

};
</script>