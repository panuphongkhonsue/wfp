import { boot } from 'quasar/wrappers';
import VueApexCharts from 'vue3-apexcharts';

export default boot(({ app }) => {
  app.component('ApexChart', VueApexCharts); // เปลี่ยนชื่อจาก apexchart เป็น ApexChart
});
