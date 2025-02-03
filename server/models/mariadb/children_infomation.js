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
      type: DataTypes.DECIMAL(10,0),
      allowNull: false
    },
    fund_eligible: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: false
    },
    fund_sum_request: {
      type: DataTypes.DECIMAL(10,0),
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
    child_father_number: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    child_mother_number: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    child_type: {
      type: DataTypes.ENUM('DELEGATE','COMMON'),
      allowNull: false
    },
    school_type: {
      type: DataTypes.ENUM('SATIT','GENERAL'),
      allowNull: false
    },
    school_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    education_level: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    district: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    province: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
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
    ]
  });
  sequelizePaginate.paginate(model);
  return model;
};