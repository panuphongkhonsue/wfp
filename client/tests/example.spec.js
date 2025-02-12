// // @ts-check
// const { test, expect } = require('@playwright/test');

// test('has title', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Expect a title "to contain" a substring.
//   await expect(page).toHaveTitle(/Playwright/);
// });

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });

import { test, expect } from '@playwright/test';

test.describe('จัดการข้อมูลบุคลากร', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://prepro.informatics.buu.ac.th/wfp/'); // เปลี่ยน URL ตามระบบของคุณ

    // ล้อกอินใหม่
    await page.fill('input[name="username"]', 'admin'); // เปลี่ยนเป็น user ที่ใช้ทดสอบ
    await page.fill('input[name="password"]', '12345'); // เปลี่ยนเป็น password ของ user
    await page.click('button:has-text("LOGIN")');

    // รอให้เข้าสู่ระบบสำเร็จ
    await expect(page).toHaveURL(/dashboard/); // URL ที่เปลี่ยนไปหลังล้อกอินสำเร็จ

    // กดเมนู "จัดการข้อมูลบุคลากร"
    await page.click('text=จัดการข้อมูลบุคลากร');

    // รอให้เข้าหน้าจัดการข้อมูลบุคลากรสำเร็จ
    await expect(page).toHaveURL(/staff-management/); // เปลี่ยน URL ตามระบบของคุณ
  });

  // ✅ ทดสอบว่า UI มีองค์ประกอบครบถ้วน
  test('ตรวจสอบ UI', async ({ page }) => {
    await expect(page.locator('text=จัดการข้อมูลบุคลากร')).toBeVisible();
    await expect(page.locator('input[placeholder="ชื่อ-นามสกุล"]')).toBeVisible();
    await expect(page.locator('button:has-text("ค้นหา")')).toBeVisible();
    await expect(page.locator('button:has-text("เพิ่มบุคลากร")')).toBeVisible();
  });

  // ✅ ทดสอบการค้นหาบุคลากร
  test('ค้นหาบุคลากรโดยใช้ชื่อ', async ({ page }) => {
    await page.fill('input[placeholder="ชื่อ-นามสกุล"]', 'สมชาย ใจดี');
    await page.click('button:has-text("ค้นหา")');
    await expect(page.locator('table')).toContainText('สมชาย ใจดี');
  });

  // ✅ ทดสอบว่าถ้าค้นหาชื่อที่ไม่มี จะขึ้น "ไม่พบข้อมูล"
  test('ค้นหาชื่อที่ไม่มีในระบบแล้วต้องแจ้งว่าไม่พบข้อมูล', async ({ page }) => {
    await page.fill('input[placeholder="ชื่อ-นามสกุล"]', 'ชื่อไม่อยู่ในระบบ');
    await page.click('button:has-text("ค้นหา")');
    await expect(page.locator('text=ไม่พบข้อมูล')).toBeVisible();
  });

  // ✅ ทดสอบปุ่ม "เพิ่มบุคลากร"
  test('กดปุ่ม "เพิ่มบุคลากร" แล้วต้องไปหน้าฟอร์มเพิ่มข้อมูล', async ({ page }) => {
    await page.click('button:has-text("เพิ่มบุคลากร")');
    await expect(page).toHaveURL(/\/add-staff/); // แก้ URL ตามระบบของคุณ
  });

});

