const getpathMenu = (e) => {
    switch (e.permissions_id) {
        case 1:
            return {
                title: "สวัสดิการทั่วไป",
                icon: "outlinedDescription",
                childs: [
                    {
                        title: "ค่าตรวจสุขภาพ",
                        to: { name: "health_check_up_welfare_list" },
                    },
                    {
                        title: "กรณีเจ็บป่วย",
                        to: { name: "medical_welfare_list" },
                    },
                    {
                        title: "ค่าทำฟัน",
                        to: { name: "dental_care_welfare_list" },
                    },
                ],
            };
        case 2:
            return {
                title: "สวัสดิการค่าสงเคราะห์ต่าง ๆ",
                icon: "diversity_1",
                childs: [
                    {
                        title: "ค่าสงเคราะห์ต่าง ๆ",
                        to: { name: "various_welfare_list" },
                    },
                    {
                        title: "ค่าสงเคราะห์การเสียชีวิตครอบครัว",
                        to: { name: "various_welfare_funeral_family_list" },
                    },
                ],
            };
        case 3:
            return {
                title: "สวัสดิการเกี่ยวกับการศึกษาของบุตร",
                icon: "outlinedBusiness",
                to: 'children_edu_welfare_list',
            };
        case 4:
            return {
                title: "สวัสดิการค่าสงเคราะห์การเสียชีวิต",
                icon: "outlinedDescription",
                to: 'funeral_welfare_list',
            };
    }
}
const getpathMenuEditor = (e) => {
    switch (e.permissions_id) {
        case 5:
            return {
                title: "จัดการข้อมูลการเบิกสวัสดิการ",
                icon: "outlinedAssignment",
                to: "welfare_management_list",
            };
        case 6:
            return {
                title: "จัดการข้อมูลสวัสดิการ",
                icon: "outlinedSummarize",
                to: "configuration_welfare",
            };
        case 7:
            return {
                title: "จัดการข้อมูลบุคลากร",
                icon: "outlinedManageAccounts",
                to: "user_management_list"
            };
        case 8:
            return {
                title: "รายงาน",
                icon: "outlinedAssessment",
                childs: [
                    {
                        title: "รายงานเปรียบเทียบการเบิกจ่ายสวัสดิการรายปีงบประมาณ",
                        to: { name: "report_compare-expenses" },
                    },
                    {
                        title: "รายละเอียดการเบิกจ่ายสวัสดิการรายบุคคลของปีงบประมาณ",
                        to: { name: "pages/report/ReportPersonal.vue" },
                    },
                    {
                        title: "รายงานภาพรวมค่าใช้จ่ายประจำปีงบประมาณ",
                        to: { name: "pages/report/ReportFundRequestPerYears.vue" },
                    },
                ],
            };
    }
}
module.exports = { getpathMenu, getpathMenuEditor };
