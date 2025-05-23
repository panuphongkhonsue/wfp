const sequelizePaginate = require('sequelize-paginate');
const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const model = sequelize.define('reimbursementsChildrenEducation', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    reim_number: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    fund_receipt: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    fund_eligible: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    fund_sum_request: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    fund_sum_receipt: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    fund_university: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    fund_other: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('บันทึกฉบับร่าง','รอตรวจสอบ','อนุมัติ'),
      allowNull: false
    },
    spouse: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    marry_regis: {
      type: DataTypes.ENUM('YES','NO'),
      allowNull: false
    },
    role: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    position: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    department: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    request_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    parental_status: {
      type: DataTypes.ENUM('บิดา','มารดา'),
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    },
    eligible: {
      type: DataTypes.ENUM('ตามสิทธิ', 'เฉพาะส่วนที่ยังขาดจากสิทธิ'),
      allowNull: true
    },
    eligible_benefits: {
      type: DataTypes.ENUM('ก', 'ข', 'ค'),
      allowNull: true
    },
    eligible_sub_benefits: {
      type: DataTypes.ENUM('ก', 'ข', 'ค'),
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    },
    updated_by: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    created_by: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    categories_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'categories',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'reimbursements_children_education',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "fk_reimbursements_children_education_users1_idx",
        using: "BTREE",
        fields: [
          { name: "created_by" },
        ]
      },
      {
        name: "fk_reimbursements_children_education_categories1_idx",
        using: "BTREE",
        fields: [
          { name: "categories_id" },
        ]
      },
    ]
  });
  sequelizePaginate.paginate(model);
  return model;
};