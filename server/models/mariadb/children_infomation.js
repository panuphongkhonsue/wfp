const sequelizePaginate = require('sequelize-paginate');
const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const model = sequelize.define('childrenInfomation', {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
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
    child_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    child_birth_day: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    child_number: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    child_father_number: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    child_mother_number: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    child_type: {
      type: DataTypes.ENUM('DELEGATE', 'COMMON', 'DIED'),
      allowNull: false
    },
    school_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    school_type: {
      type: DataTypes.ENUM('ทั่วไป','สาธิตพิบูลบําเพ็ญ'),
      allowNull: false
    },
    district: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    province: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    delegate_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    delegate_number: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    delegate_birth_day: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    delegate_death_day: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    fund_university: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    fund_sub_university: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    fund_other: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    sub_categories_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'sub_categories',
        key: 'id'
      }
    },
    
  }, {
    sequelize,
    tableName: 'children_infomation',
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
        name: "fk_children_infomation_sub_categories1_idx",
        using: "BTREE",
        fields: [
          { name: "sub_categories_id" },
        ]
      },
    ]
  });
  sequelizePaginate.paginate(model);
  return model;
};